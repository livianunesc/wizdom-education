import { navigateUnit } from "./ui-helpers.mjs";
import { chromium, expect } from "@playwright/test";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
try {
  await page.clock.setFixedTime(new Date("2026-11-16T15:00:00Z"));
  await page.goto(process.env.BASE_URL || "http://127.0.0.1:5173");
  await expect(page.getByRole("heading", { name: /Oi, Júlia/ })).toBeVisible();
  await expect(page.locator(".task-row")).toHaveCount(3);
  await page.getByRole("button", { name: /Cansada/ }).click();
  await page.getByRole("button", { name: "Adaptar meu dia" }).click();
  await expect(page.locator(".task-row")).toHaveCount(1);
  await expect(page.locator(".task-copy strong")).toHaveText("Biologia");
  await expect(page.locator(".task-time")).toHaveText("25 min");
  await page
    .getByRole("button", { name: "Concluir Biologia", exact: true })
    .click();
  await expect(page.getByRole("heading", { name: "Questões e revisões" })).toBeVisible();
  await expect(page.locator(".learned-topic-grid > button")).toHaveCount(1);
  await expect(page.locator(".review-metrics")).toContainText("3cartões para hoje");
  await page.getByRole("button", { name: "Voltar", exact: true }).click();
  await expect(page.getByRole("heading", { name: /Oi, Júlia/ })).toBeVisible();
  await expect(page.locator(".plan-footnote")).toContainText("1 de 1");
  await page.reload();
  await expect(page.locator(".task-row")).toHaveCount(1);
  await expect(page.locator(".task-check")).toHaveClass(/checked/);
  await page
    .getByRole("button", { name: "Estudar Biologia", exact: true })
    .click();
  await expect(
    page.getByRole("combobox", { name: "Matéria", exact: true }),
  ).toContainText("Biologia");
  await expect(
    page.getByRole("spinbutton", { name: "Duração em minutos" }),
  ).toHaveValue("25");
  await navigateUnit(page, "Revisões");
  await expect(page.getByRole("button", { name: "Revisar agora" })).toBeEnabled();
  await expect(page.locator(".learned-topic-grid > button")).toHaveCount(1);
  await navigateUnit(page, "Meu espaço");
  await page.getByRole("button", { name: "Conforto e privacidade" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByLabel("Texto maior").check();
  await page.getByLabel("Contraste reforçado").check();
  await expect(page.locator(".app")).toHaveClass(/high-contrast/);
  await page.getByRole("button", { name: "Fechar configurações" }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(
    page.getByRole("button", { name: "Abrir menu", exact: true }),
  ).toBeVisible();
  await navigateUnit(page, "Cronograma");
  await expect(page.locator("#studio-menu")).toBeHidden();
  await expect(
    page.getByRole("heading", { name: "Meu cronograma" }),
  ).toBeVisible();
  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
  }
  expect(errors).toEqual([]);
  console.log(
    "PASS dashboard: fatigue adapts plan, completion persists, task prefill, flashcards, accessibility controls, mobile navigation",
  );
} finally {
  await browser.close();
}
