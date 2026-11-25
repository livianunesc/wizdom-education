import { navigateUnit } from "./ui-helpers.mjs";
import assert from "node:assert/strict";
import { chromium, expect } from "@playwright/test";

// Start the app with npm run dev before running this standalone browser check.
// Playwright's clock advances the real application timer without waiting 30 minutes.
const baseURL = process.env.BASE_URL || "http://127.0.0.1:5173";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
});

async function withStudent(check) {
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("dialog", (dialog) => dialog.accept());
  try {
    await page.clock.install({ time: new Date("2026-11-13T18:00:00Z") });
    await page.clock.pauseAt(new Date("2026-11-13T18:01:00Z"));
    await page.goto(baseURL);
    await navigateUnit(page, "Área de foco");
    await check(page);
    assert.deepEqual(errors, [], "The page must not emit JavaScript errors");
  } finally {
    await context.close();
  }
}

const statsOf = (page) =>
  page.evaluate(() => JSON.parse(localStorage.getItem("wizdom.v1")).demo.stats);
const start = (page) =>
  page.getByRole("button", { name: "Começar meu momento" }).click();
const finish = (page) =>
  page.getByRole("button", { name: "Concluir por hoje", exact: true }).click();
const dismissReward = (page) =>
  page.getByRole("button", { name: "Guardar essa conquista" }).click();

try {
  await withStudent(async (page) => {
    await page.getByText("Cronômetro", { exact: true }).click();
    await start(page);
    assert.equal(
      await page.locator("#root").evaluate((root) => root.inert),
      true,
    );
    await page.clock.fastForward(65_000);
    await page.getByRole("button", { name: "Pausar", exact: true }).click();
    const pausedTime = await page.locator(".focus-clock span").textContent();
    await page.clock.fastForward(30_000);
    await expect(page.locator(".focus-clock span")).toHaveText(pausedTime);
    await page.getByRole("button", { name: "Continuar", exact: true }).click();
    await page.clock.fastForward(61_000);
    await finish(page);
    await expect(
      page.getByRole("heading", { name: "Você fez acontecer!" }),
    ).toBeVisible();
    await expect.poll(() => statsOf(page)).toMatchObject({ xp: 8, coins: 4 });
    let stats = await statsOf(page);
    assert.equal(stats.sessions.length, 1);
    assert.equal(
      stats.sessions[0].seconds,
      126,
      "Paused time must be excluded",
    );
    assert.equal(
      await page.locator("#root").evaluate((root) => root.inert),
      false,
    );
    await dismissReward(page);

    await start(page);
    await page.clock.fastForward(40_000);
    await page.reload();
    await navigateUnit(page, "Área de foco");
    await expect(
      page.getByRole("button", { name: "Continuar", exact: true }),
    ).toBeVisible();
    const recoveredTime = await page.locator(".focus-clock span").textContent();
    await page.clock.fastForward(60_000);
    await expect(page.locator(".focus-clock span")).toHaveText(recoveredTime);
    await page.getByRole("button", { name: "Continuar", exact: true }).click();
    await page.clock.fastForward(25_000);
    await finish(page);
    await expect(
      page.getByRole("heading", { name: "Você fez acontecer!" }),
    ).toBeVisible();
    await expect.poll(() => statsOf(page)).toMatchObject({ xp: 12, coins: 6 });
    stats = await statsOf(page);
    assert.equal(stats.sessions.length, 2);
    assert.equal(stats.sessions[1].seconds, 65);
    await dismissReward(page);

    await navigateUnit(page, "Meu perfil");
    await page.getByRole("button", { name: "Editar perfil" }).click();
    await page
      .getByLabel("Quando quero ingressar")
      .fill("Ainda estou descobrindo");
    await page.getByRole("button", { name: "Salvar meu perfil" }).click();
    await expect.poll(() =>
      page.evaluate(() => JSON.parse(localStorage.getItem("wizdom.v1")).demo.profile.year),
    ).toBe("Ainda estou descobrindo");
  });
  console.log(
    "PASS focus: pause/resume, actual rewards, paused refresh recovery, flexible profile year",
  );

  await withStudent(async (page) => {
    await start(page);
    await page.keyboard.press("Shift+Tab");
    assert.equal(
      await page.evaluate(() => document.activeElement.textContent.trim()),
      "Concluir por hoje",
    );
    await page.keyboard.press("Tab");
    assert.equal(
      await page.evaluate(() => document.activeElement.textContent.trim()),
      "Sair do foco",
    );
    await page.clock.fastForward(1_800_000);
    await expect(
      page.getByRole("heading", { name: "Respire. Você está indo bem." }),
    ).toBeVisible();
    await expect.poll(() => statsOf(page)).toMatchObject({ xp: 120, coins: 60 });
    let stats = await statsOf(page);
    assert.equal(stats.sessions[0].seconds, 1_800);
    await page.clock.fastForward(300_000);
    await expect(
      page.getByRole("heading", { name: "Você fez acontecer!" }),
    ).toBeVisible();
    stats = await statsOf(page);
    assert.equal(stats.xp, 120, "Break time must not earn extra rewards");
    assert.equal(stats.coins, 60);
    assert.equal(
      stats.sessions.length,
      1,
      "Completing a break must not duplicate the session",
    );
    await dismissReward(page);

    await navigateUnit(page, "Meu perfil");
    await expect(page.locator(".profile-person .badge")).toHaveText("Nível 2");
    await page
      .locator(".shop-item")
      .filter({ hasText: "Brisa de menta" })
      .getByRole("button", { name: "Resgatar" })
      .click();
    await expect.poll(() => statsOf(page)).toMatchObject({
      coins: 10, outfit: "menta", owned: ["lavanda", "menta"],
    });
    await page
      .locator(".shop-item")
      .filter({ hasText: "Lavanda" })
      .getByRole("button", { name: "Usar", exact: true })
      .click();
    await expect.poll(() => statsOf(page)).toMatchObject({ coins: 10, outfit: "lavanda" });
    await page
      .locator(".shop-item")
      .filter({ hasText: "Brisa de menta" })
      .getByRole("button", { name: "Usar", exact: true })
      .click();
    await expect.poll(() => statsOf(page)).toMatchObject({ coins: 10, outfit: "menta" });

    await navigateUnit(page, "Área de foco");
    await page.getByText("Temporizador", { exact: true }).click();
    await page.getByLabel("Duração em minutos").fill("1");
    await start(page);
    await page.clock.fastForward(60_000);
    await expect(
      page.getByRole("heading", { name: "Você fez acontecer!" }),
    ).toBeVisible();
    await expect.poll(() => statsOf(page)).toMatchObject({ xp: 124, coins: 12 });
    stats = await statsOf(page);
    assert.equal(stats.sessions.length, 2);
  });
  console.log(
    "PASS focus: keyboard containment, Pomodoro 30/5, level, single-charge shop, timed alarm",
  );
} finally {
  await browser.close();
}
