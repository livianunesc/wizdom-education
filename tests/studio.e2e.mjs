import { chromium, expect } from "@playwright/test";
import { flashcards } from "../src/flashcards-data.js";
import { navigateUnit } from "./ui-helpers.mjs";

const origin = process.env.BASE_URL || "http://127.0.0.1:5173";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
});

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(origin);
  await page.getByRole("button", { name: "Buscar na Wizdom", exact: true }).focus();

  await page.keyboard.press("Control+k");
  const search = page.getByRole("dialog", { name: "Buscar na Wizdom" });
  await expect(search).toBeVisible();
  await search.getByRole("textbox", { name: "Pesquisar páginas" }).fill("questoes");
  await expect(search.getByRole("button", { name: "Questões", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(search).toBeHidden();

  await navigateUnit(page, "Ciclos");
  await expect(page.getByRole("heading", { name: "Ciclos de estudo" })).toBeVisible();
  const fundamentals = page.getByRole("region", { name: "Fundamentos" });
  await fundamentals.getByRole("button", { name: "Ver atividades" }).click();
  await fundamentals.getByLabel("Disciplina").selectOption("História");
  await fundamentals.getByRole("button", { name: "Praticar Brasil colonial e escravidão" }).click();
  await expect(page.getByRole("heading", { name: "Questões e revisões" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Brasil colonial e escravidão", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Começar prática" }).click();
  await expect(page.locator(".knowledge-card .badge")).toHaveText("História · fundamental");
  const question = await page.locator(".knowledge-card h2").innerText();
  const card = flashcards.find(item => item.question === question);
  expect(card).toBeDefined();
  await page.locator(".answer-options > button").nth(card.answer).click();
  await page.getByRole("button", { name: "Conferir resposta" }).click();
  await page.getByRole("button", { name: "Concluir revisão" }).click();
  await page.getByRole("button", { name: "Guardar essa conquista" }).click();
  await page.getByRole("button", { name: "Voltar", exact: true }).click();
  await expect(page.getByRole("progressbar", { name: "Progresso em Fundamentos" })).toHaveAttribute("value", "1");

  await navigateUnit(page, "Disciplinas");
  await page.getByRole("searchbox", { name: "Buscar disciplina ou assunto" }).fill("funcoes e leitura");
  await expect(page.locator(".hub-subject-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Ver assuntos de Matemática" }).click();
  await expect(page.getByRole("heading", { name: "Funções e leitura de gráficos" })).toBeVisible();
  await page.getByRole("button", { name: "Todas as disciplinas" }).click();
  await expect(page.getByRole("searchbox", { name: "Buscar disciplina ou assunto" })).toHaveValue("funcoes e leitura");

  await navigateUnit(page, "Materiais");
  await page.getByRole("button", { name: "Provas e gabaritos", exact: true }).click();
  await page.getByRole("searchbox", { name: "Buscar materiais" }).fill("2025");
  await expect(page.locator(".material-exam")).toHaveCount(2);
  const pdf = page.getByRole("link", { name: "Abrir prova em PDF do ENEM 2025, 1º dia" });
  const href = await pdf.getAttribute("href");
  const response = await page.request.get(new URL(href, origin).href);
  expect(response.ok()).toBe(true);
  expect((await response.body()).subarray(0, 4).toString()).toBe("%PDF");
  await page.getByRole("button", { name: "Questões por disciplina", exact: true }).click();
  await page.getByRole("searchbox", { name: "Buscar materiais" }).fill("quimica");
  await page.getByRole("button", { name: /Química.*questões de revisão/ }).click();
  await expect(page.getByRole("heading", { name: "Química", exact: true })).toBeVisible();

  await navigateUnit(page, "Ferramentas");
  await page.getByRole("button", { name: /^Flashcards/ }).click();
  await expect(page.getByRole("button", { name: "Flashcards com tempo", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "Começar rodada pontuada" })).toBeVisible();

  for (const width of [360, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const destination of ["Ciclos", "Disciplinas", "Materiais", "Ferramentas"]) {
      await navigateUnit(page, destination);
      await expect(page.locator("main h1")).toBeVisible();
      await expect(page.locator("#studio-menu")).toBeHidden();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
  }
  expect(errors).toEqual([]);
  console.log("PASS studio: keyboard search, cycle through assessed practice, subject search, PDF and discipline materials, flashcards shortcut, 360/768/1440 px");
} finally {
  await browser.close();
}
