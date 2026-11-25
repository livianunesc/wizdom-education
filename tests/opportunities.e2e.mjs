import { navigateUnit, selectChoice } from "./ui-helpers.mjs";
import { chromium, expect } from "@playwright/test";

const origin = process.env.BASE_URL || "http://127.0.0.1:5173";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const checks = [];
function check(name, run) {
  checks.push({ name, run });
}

check(
  "vestibulares: combine filters, inspect official details, favorite without showing fictional registration",
  async ({ page }) => {
    await page.clock.setFixedTime(new Date("2026-11-13T12:00:00-03:00"));
    await page.goto(origin);
    await navigateUnit(page, "Vestibulares");
    await expect(page.locator(".university-card")).toHaveCount(11);
    await selectChoice(page, "Curso", "Medicina");
    await selectChoice(page, "Instituição", "Pública");
    await selectChoice(page, "Região", "Sudeste");
    await expect(page.locator(".university-card")).toHaveCount(3);
    const usp = page
      .locator(".university-card")
      .filter({
        has: page.getByRole("heading", {
          name: "Universidade de São Paulo",
          exact: true,
        }),
      });
    await usp.getByRole("button", { name: "Conhecer universidade" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Consultar portal oficial" }),
    ).toHaveAttribute("href", "https://www.fuvest.br/");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await usp
      .getByRole("button", { name: "Favoritar USP", exact: true })
      .click();
    await expect(page.getByRole("status")).toContainText("favorita salva");
    await expect(usp.getByRole("button", { name: "Desfavoritar USP", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Favoritas (1)" }).click();
    await expect(page.locator(".university-card")).toHaveCount(1);
    await page.reload();
    await navigateUnit(page, "Calendário");
    await expect(page.locator(".calendar-month-title h2")).toHaveText("novembro de 2026");
    await page.getByRole("button", { name: /^20 de novembro/ }).click();
    await expect(page.locator(".calendar-side-event")).toHaveCount(0);
    await page.getByRole("button", { name: "Agenda", exact: true }).click();
    await expect(page.locator(".calendar-list-event")).toHaveCount(0);
  },
);

check(
  "olympics: school eligibility and category filter work",
  async ({ page }) => {
    await page.goto(origin);
    await navigateUnit(page, "Olimpíadas");
    await expect(page.locator(".olympic-card")).toHaveCount(8);
    await page.getByRole("button", { name: "Matemática", exact: true }).click();
    await expect(page.locator(".olympic-card")).toHaveCount(1);
    await expect(page.locator(".olympic-card")).toContainText("OBMEP");
    await page.evaluate(() => {
      const store = JSON.parse(localStorage.getItem("wizdom.v1"));
      store.demo.profile.school = "Ensino médio concluído";
      localStorage.setItem("wizdom.v1", JSON.stringify(store));
    });
    await page.reload();
    await navigateUnit(page, "Olimpíadas");
    await expect(
      page.getByRole("heading", { name: "Novas descobertas, no seu momento." }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Explorar oportunidades" }).click();
    await expect(page.locator(".olympic-card")).toHaveCount(8);
  },
);

check(
  "ranking: podium, participation persistence and mobile layout",
  async ({ page }) => {
    await page.goto(origin);
    await navigateUnit(page, "Ranking");
    await expect(page.locator(".rank-podium-person")).toHaveCount(3);
    await expect(page.locator(".ranking-self")).toHaveCount(1);
    await page.getByRole("checkbox", { name: "Mostrar meu perfil no ranking" }).press("Space");
    await expect(page.locator(".ranking-self")).toHaveCount(0);
    await page.reload();
    await navigateUnit(page, "Ranking");
    await expect(page.getByRole("checkbox", { name: "Mostrar meu perfil no ranking" })).not.toBeChecked();
    await page.getByRole("checkbox", { name: "Mostrar meu perfil no ranking" }).press("Space");
    await expect(page.locator(".ranking-self")).toHaveCount(1);
    await page.setViewportSize({ width: 390, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  },
);

check(
  "opportunities, calendar and olympics fit a 390px mobile viewport",
  async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(origin);
    for (const name of ["Vestibulares", "Calendário", "Olimpíadas"]) {
      await navigateUnit(page, name);
      await expect(page.locator("h1")).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(390);
    }
  },
);

try {
  for (const { name, run } of checks) {
    const context = await browser.newContext();
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    try {
      await run({ page });
      expect(errors).toEqual([]);
      console.log(`PASS ${name}`);
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
}
