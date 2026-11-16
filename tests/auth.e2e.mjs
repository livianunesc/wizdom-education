import { selectChoice } from "./ui-helpers.mjs";
import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
try {
  await page.goto(
    process.env.BASE_URL ||
      process.env.WIZDOM_TEST_URL ||
      "http://127.0.0.1:5173",
  );
  await page
    .getByRole("button", { name: "Criar minha conta", exact: true })
    .click();
  await page.getByLabel("Como podemos chamar você?").fill("Marina Teste");
  await page.getByLabel("E-mail", { exact: true }).fill("marina@example.test");
  await page
    .getByLabel("Senha de demonstração", { exact: true })
    .fill("teste1234");
  await page.getByRole("button", { name: "Criar meu espaço" }).click();
  await page
    .getByRole("heading", { name: "O sonho é seu. A gente vai junto." })
    .waitFor();
  await selectChoice(page, "Qual curso faz seus olhos brilharem?", "Psicologia");
  await selectChoice(page, "Quando você quer entrar na faculdade?", "2028");
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await selectChoice(page, "Qual matéria você mais gosta ou tem facilidade?", "História");
  await selectChoice(page, "Qual matéria pede um pouco mais de atenção?", "Física");
  await selectChoice(page, "Como está sua frequência de estudos hoje?", "1 a 2 dias por semana");
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await selectChoice(page, "Quanto tempo cabe no seu dia?", "0.5");
  for (const day of ["Seg", "Ter", "Qua", "Qui", "Sex"])
    await page.getByRole("button", { name: day, exact: true }).click();
  await page.getByRole("button", { name: "Criar meu plano" }).click();
  assert.match(
    await page.getByRole("alert").innerText(),
    /Escolha pelo menos um dia/,
  );
  await page.getByRole("button", { name: "Sáb", exact: true }).click();
  await page.getByRole("button", { name: "Criar meu plano" }).click();
  await page.getByRole("navigation", { name: "Navegação principal" }).waitFor();
  let store = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("wizdom.v1")),
  );
  let account = store.accounts.find((a) => a.id === store.current);
  assert.equal(account.data.profile.course, "Psicologia");
  assert.equal(account.data.profile.favorite, "História");
  assert.equal(account.data.profile.difficulty, "Física");
  assert.equal(account.data.profile.year, "2028");
  assert.equal(account.data.profile.hours, 0.5);
  assert.deepEqual(account.data.profile.days, [6]);
  assert.ok(account.hash);
  assert.equal(account.password, undefined);
  await page.reload();
  await page.getByRole("navigation", { name: "Navegação principal" }).waitFor();
  await page
    .getByRole("button", { name: /Marina Teste Sair da conta/ })
    .click();
  await page
    .getByRole("button", { name: "Entrar na conta", exact: true })
    .click();
  await page.getByLabel("E-mail", { exact: true }).fill("marina@example.test");
  await page
    .getByLabel("Senha de demonstração", { exact: true })
    .fill("errada1234");
  await page.getByRole("button", { name: "Entrar no meu espaço" }).click();
  await page.getByRole("alert").waitFor();
  assert.match(
    await page.getByRole("alert").innerText(),
    /E-mail ou senha não encontrados/,
  );
  await page
    .getByLabel("Senha de demonstração", { exact: true })
    .fill("teste1234");
  await page.getByRole("button", { name: "Entrar no meu espaço" }).click();
  await page.getByRole("navigation", { name: "Navegação principal" }).waitFor();
  store = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("wizdom.v1")),
  );
  assert.equal(
    store.accounts.find((a) => a.id === store.current).data.profile.name,
    "Marina Teste",
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS desktop signup, 3 onboarding steps, empty-day validation, account persistence, logout, incorrect password, login, saved profile, no browser errors",
  );
  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
  });
  await mobile.goto(
    process.env.BASE_URL ||
      process.env.WIZDOM_TEST_URL ||
      "http://127.0.0.1:5173",
  );
  await mobile
    .getByRole("button", { name: "Criar minha conta", exact: true })
    .click();
  assert.equal(
    await mobile.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
    true,
  );
  await mobile.getByLabel("Como podemos chamar você?").fill("Ana");
  await mobile.getByLabel("E-mail", { exact: true }).fill("ana@example.test");
  await mobile
    .getByLabel("Senha de demonstração", { exact: true })
    .fill("teste1234");
  await mobile.getByRole("button", { name: "Criar meu espaço" }).click();
  await mobile
    .getByRole("heading", { name: "O sonho é seu. A gente vai junto." })
    .waitFor();
  assert.equal(
    await mobile.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
    true,
  );
  await mobile.getByRole("button", { name: "Continuar", exact: true }).click();
  await mobile.getByRole("button", { name: "Continuar", exact: true }).click();
  assert.equal(
    await mobile.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
    true,
  );
  await mobile.screenshot({
    path: "/tmp/wizdom-onboarding-mobile.png",
    fullPage: true,
  });
  await mobile.getByRole("button", { name: "Criar meu plano" }).click();
  await mobile.getByRole("button", { name: "Abrir menu" }).waitFor();
  console.log(
    "PASS mobile 390px signup and onboarding, no horizontal overflow",
  );
} finally {
  await browser.close();
}
