import { flashcards } from "../src/flashcards-data.js";
import { selectChoice } from "./ui-helpers.mjs";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { pathToFileURL } from "node:url";
import { chromium, expect } from "@playwright/test";

// Test the exact standalone artifact, without Vite or browser security overrides.
// Some managed browsers deny file://. Report that scope as untested and validate
// the same HTML bytes via an isolated loopback server instead.
const entry = pathToFileURL(resolve("index.html")).href;
let localServer;
let allowedDocumentURL = null;
let mode = "file:// offline";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
  offline: true,
});
const page = await context.newPage();
page.setDefaultTimeout(10_000);
const errors = [];
const webRequests = [];
const failedRequests = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("request", (request) => {
  if (
    /^https?:/.test(request.url()) &&
    !(
      request.url() === allowedDocumentURL &&
      request.resourceType() === "document"
    )
  ) {
    webRequests.push(request.url());
  }
});
page.on("requestfailed", (request) => {
  failedRequests.push({
    url: request.url(),
    error: request.failure()?.errorText,
  });
});
page.on("dialog", (dialog) => dialog.accept());
const readStudent = () =>
  page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem("wizdom.v1"));
    return state.accounts.find((account) => account.id === state.current);
  });

try {
  await page.clock.install({ time: new Date("2026-11-13T18:00:00Z") });
  try {
    await page.goto(entry);
  } catch (error) {
    if (!error.message.includes("ERR_BLOCKED_BY_ADMINISTRATOR")) throw error;
    console.log(
      "UNTESTED file:// opening: this managed browser blocks local file navigation by administrative policy. No policy is changed.",
    );
    const html = await readFile(resolve("index.html"));
    localServer = createServer((request, response) => {
      if (request.url !== "/") {
        response.writeHead(404);
        response.end(
          "Only the standalone index.html is available in this test.",
        );
        return;
      }
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(html);
    });
    await new Promise((ready, reject) => {
      localServer.once("error", reject);
      localServer.listen(0, "127.0.0.1", ready);
    });
    allowedDocumentURL = `http://127.0.0.1:${localServer.address().port}/`;
    mode = "standalone HTML on isolated loopback (file:// opening untested)";
    failedRequests.length = 0; // The expected administrative denial is recorded above.
    await context.setOffline(false);
    await context.route("**/*", (route) => {
      const request = route.request();
      if (
        request.url() === allowedDocumentURL &&
        request.resourceType() === "document"
      )
        return route.continue();
      return route.abort();
    });
    await page.goto(allowedDocumentURL);
  }
  await expect(page.getByRole("heading", { name: /Oi, Júlia/ })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  assert.equal(
    await page.evaluate(() => document.fonts.check('12px "DM Sans"')),
    true,
    "The embedded UI font must load offline",
  );
  assert.deepEqual(
    webRequests,
    [],
    "Opening index.html must not contact an external server",
  );
  assert.deepEqual(
    failedRequests,
    [],
    "Opening index.html must not require missing files",
  );

  await page
    .getByRole("button", { name: "Criar minha conta", exact: true })
    .click();
  await page.getByLabel("Como podemos chamar você?").fill("Helena Offline");
  await page.getByLabel("E-mail", { exact: true }).fill("helena@example.test");
  await page
    .getByLabel("Senha de demonstração", { exact: true })
    .fill("teste1234");
  await page.getByRole("button", { name: "Criar meu espaço" }).click();
  await expect(
    page.getByRole("heading", { name: "O sonho é seu. A gente vai junto." }),
  ).toBeVisible();
  await selectChoice(page, "Qual curso faz seus olhos brilharem?", "Psicologia");
  await selectChoice(page, "Quando você quer entrar na faculdade?", "2028");
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await selectChoice(page, "Qual matéria você mais gosta ou tem facilidade?", "História");
  await selectChoice(page, "Qual matéria pede um pouco mais de atenção?", "Física");
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await selectChoice(page, "Quanto tempo cabe no seu dia?", "1");
  await page.getByRole("button", { name: "Criar meu plano" }).click();
  await expect(page.getByRole("heading", { name: /Oi, Helena/ })).toBeVisible();
  let student = await readStudent();
  assert.equal(student.data.profile.favorite, "História");
  assert.equal(student.data.profile.course, "Psicologia");
  assert.ok(student.hash);
  assert.equal(student.password, undefined);

  await page.getByRole("button", { name: /Cansada/ }).click();
  await page.getByRole("button", { name: "Adaptar meu dia" }).click();
  await expect(page.locator(".task-row")).toHaveCount(1);
  await expect(page.locator(".task-copy strong")).toHaveText("História");
  await page.reload();
  await expect(page.getByRole("heading", { name: /Oi, Helena/ })).toBeVisible();
  await expect(page.locator(".task-row")).toHaveCount(1);

  await page.getByRole("button", { name: "Vestibulares", exact: true }).click();
  await page
    .getByRole("button", { name: "Favoritar USP", exact: true })
    .click();
  await page.reload();
  await page.getByRole("button", { name: "Vestibulares", exact: true }).click();
  await page
    .getByRole("button", { name: "Favoritas (1)", exact: true })
    .click();
  await expect(page.locator(".university-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Calendário", exact: true }).click();
  await page.getByRole("button", { name: /^20 de novembro/ }).click();
  await expect(page.locator(".calendar-side-event")).toContainText(
    "Inscrições USP",
  );

  await page.getByRole("button", { name: "Área de foco", exact: true }).click();
  await page.getByText("Cronômetro", { exact: true }).click();
  await page.getByRole("button", { name: "Começar meu momento" }).click();
  await page.clock.fastForward(65_000);
  await page
    .getByRole("button", { name: "Concluir por hoje", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Você fez acontecer!" }),
  ).toBeVisible();
  student = await readStudent();
  assert.equal(student.data.stats.xp, 4);
  assert.equal(student.data.stats.coins, 2);
  assert.equal(student.data.stats.sessions.length, 1);
  assert.equal(student.data.stats.sessions[0].seconds, 65);
  await page.getByRole("button", { name: "Guardar essa conquista" }).click();

  // These exact built bytes must unlock and grade reviews offline as well.
  await page.getByRole("button", { name: "Revisões", exact: true }).click();
  await page.getByRole("button", { name: "Revisar agora", exact: true }).click();
  for (let i=0;i<3;i++) {
    const question=await page.locator('.knowledge-card h2').innerText();
    const card=flashcards.find(c=>c.question===question);
    assert.ok(card);
    await page.locator('.answer-options>button').nth(card.answer).click();
    await page.getByRole('button',{name:'Conferir resposta'}).click();
    await expect(page.locator('.answer-feedback')).toContainText(card.explanation);
    await page.getByRole('button',{name:i===2?'Concluir revisão':'Próximo cartão',exact:true}).click();
  }
  await expect(page.getByRole('dialog')).toContainText('3/3');
  await page.getByRole('button',{name:'Guardar essa conquista'}).click();
  student=await readStudent();
  assert.equal(student.data.stats.xp,34);
  assert.equal(student.data.learning.answers.length,3);
  await expect(page.locator('.review-metrics')).toContainText('100%');

  await page
    .getByRole("button", { name: /Helena Offline Sair da conta/ })
    .click();
  await page
    .getByRole("button", { name: "Entrar na conta", exact: true })
    .click();
  await page.getByLabel("E-mail", { exact: true }).fill("helena@example.test");
  await page
    .getByLabel("Senha de demonstração", { exact: true })
    .fill("errada1234");
  await page.getByRole("button", { name: "Entrar no meu espaço" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "E-mail ou senha não encontrados",
  );
  await page
    .getByLabel("Senha de demonstração", { exact: true })
    .fill("teste1234");
  await page.getByRole("button", { name: "Entrar no meu espaço" }).click();
  await expect(page.getByRole("heading", { name: /Oi, Helena/ })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: /Oi, Helena/ })).toBeVisible();
  student = await readStudent();
  assert.equal(student.data.stats.xp, 34);
  assert.equal(student.data.profile.course, "Psicologia");
  assert.equal(student.data.favorites.length, 1);
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  assert.deepEqual(
    errors,
    [],
    "The standalone app must not emit JavaScript errors",
  );
  assert.deepEqual(
    webRequests,
    [],
    "All tested local flows must work without network requests",
  );
  assert.deepEqual(
    failedRequests,
    [],
    "All local resources must be embedded and available offline",
  );
  console.log(
    `PASS ${mode}: embedded fonts, signup/onboarding/login, persistence, fatigue, favorites/calendar, focus rewards, graded reviews, mobile, no external asset requests or JS errors`,
  );
} finally {
  await context.close();
  await browser.close();
  if (localServer) await new Promise((done) => localServer.close(done));
}
