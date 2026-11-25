import { chromium, expect } from '@playwright/test';
import { initialProfile, newStudent } from '../src/lib.js';

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
const origin = process.env.BASE_URL || 'http://127.0.0.1:5173';
const navigate = async (page, name) => {
  const menu = page.getByRole('button', { name: 'Abrir menu', exact: true });
  if (await menu.isVisible()) await menu.click();
  await page.getByRole('button', { name, exact: true }).click();
};

async function account(name, width, fixedTime) {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await context.newPage();
  if (fixedTime) await page.clock.setFixedTime(fixedTime);
  await page.goto(origin);
  await page.waitForFunction(() => localStorage.getItem("wizdom.v1"));
  await page.evaluate(({ name, profile, student }) => {
    const store = JSON.parse(localStorage.getItem('wizdom.v1'));
    store.accounts.push({ id: name, name, data: { ...student, profile, stats: { ...student.stats, coins: 25 } } });
    store.current = name;
    localStorage.setItem('wizdom.v1', JSON.stringify(store));
  }, { name, profile: { ...initialProfile, name, days: [1, 3, 5], hours: 1 }, student: newStudent() });
  await page.reload();
  return { context, page };
}

try {
  const { page, context } = await account('Lia', 1440, new Date('2026-11-23T12:00:00-03:00'));
  await navigate(page, 'Vestibulares');
  await page.getByLabel('Pesquisar instituição ou curso').fill('engenharia mecanica');
  await page.getByRole('button', { name: 'Conhecer universidade' }).click();
  await page.getByRole('button', { name: 'Usar como meu objetivo' }).click();
  await expect(page.getByRole('dialog')).toContainText('60 min com pausas');
  await page.getByRole('button', { name: 'Aplicar plano' }).click();
  await expect(page.getByRole('heading', { name: 'Meu cronograma' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Consultar prova oficial' })).toHaveAttribute('href', /comvest/);
  await page.getByRole('button', { name: 'Já estudei' }).first().click();
  await page.getByRole('button', { name: 'Revisar agora' }).click();
  await page.locator('.answer-options button').first().click();
  await page.getByRole('button', { name: 'Conferir resposta' }).click();
  await navigate(page, 'Loja');
  await page.getByRole('button', { name: 'Comprar Jardim' }).click();
  await expect(page.locator('.app')).toHaveAttribute('data-theme', 'jardim');
  await page.getByRole('button', { name: 'Equipar Caderno' }).click();
  await page.getByRole('button', { name: 'Equipar Jardim' }).click();
  await expect(page.locator('.app')).toHaveAttribute('data-theme', 'jardim');
  await page.reload();
  await expect(page.locator('.app')).toHaveAttribute('data-theme', 'jardim');
  await navigate(page, 'Revisões');
  const flash = async () => {
    await page.getByRole('button', { name: 'Flashcards com tempo' }).click();
    await page.getByRole('button', { name: 'Começar rodada pontuada' }).click();
    await page.getByLabel('Sua resposta').fill('MITOCONDRIA');
    const form = page.getByLabel('Sua resposta').locator('..').locator('..');
    await form.evaluate(element => { element.requestSubmit(); element.requestSubmit(); });
    await expect(page.getByText('Acertou · mitocôndria')).toBeVisible();
  };
  const xp = () => page.evaluate(() => JSON.parse(localStorage.getItem('wizdom.v1')).accounts[0].data.stats.xp);
  const beforeFlash = await xp();
  await flash();
  await expect.poll(xp).toBe(beforeFlash + 15);
  await page.reload();
  await navigate(page, 'Revisões');
  await flash();
  await expect(page.getByText('0 XP creditados')).toBeVisible();
  expect(await xp()).toBe(beforeFlash + 15);
  await navigate(page, 'Provas anteriores');
  const proof = await page.getByRole('link', { name: 'Abrir prova ENEM 2025, 1º dia' }).getAttribute('href');
  const pdf = await page.request.get(new URL(proof, origin).href);
  expect(pdf.ok()).toBe(true);
  expect((await pdf.body()).subarray(0, 4).toString()).toBe('%PDF');
  await navigate(page, 'Olimpíadas');
  await page.getByText('Preparar para OBI', { exact: true }).click();
  await page.getByLabel('Modalidade').selectOption('Programação');
  await page.getByRole('button', { name: 'Adicionar preparação ao cronograma' }).click();
  await expect(page.getByRole('heading', { name: 'Meu cronograma' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('wizdom.v1')).accounts[0].data.scheduled[0].title)).toBe('Preparação OBI');

  for (const width of [360, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const name of ['Meu espaço', 'Vestibulares', 'Provas anteriores', 'Cronograma', 'Calendário', 'Olimpíadas', 'Revisões', 'Área de foco', 'Ranking', 'Meu perfil', 'Loja']) {
      await navigate(page, name);
      if (width <= 800) {
        await expect(page.locator('.sidebar')).toBeHidden();
        await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeVisible();
      }
      await expect(page.locator('h1')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await expect(page.locator('.main-content .notebook-character').first()).toBeVisible();
    }
  }
  await context.close();
  console.log('PASS jornada: objetivo Comvest, revisão, moedas, tema, OBI e 11 telas em 360/768/1440px');

  const a = await account('Lia Dupla', 1440);
  const b = await account('Sol Dupla', 360);
  await navigate(a.page, 'Área de foco');
  await a.page.getByLabel('Duração em minutos').fill('1');
  await a.page.getByRole('button', { name: 'Criar sala privada' }).click();
  const invite = await a.page.getByRole('link', { name: 'Link de convite' }).getAttribute('href');
  await b.page.goto(invite);
  await b.page.getByRole('button', { name: 'Entrar na sala' }).click();
  await expect(a.page.getByText('Sol Dupla · Presente')).toBeVisible();
  const ready = p => p.getByRole('button', { name: 'Confirmar prontidão' });
  await ready(a.page).click();
  await expect(a.page.getByText('Lia Dupla (você) · Pronto')).toBeVisible();
  await ready(b.page).click();
  await expect(a.page.getByText('Em foco', { exact: true })).toBeVisible();
  await b.context.setOffline(true);
  await expect(a.page.getByText('Pausado', { exact: true })).toBeVisible({ timeout: 15_000 });
  await b.context.setOffline(false);
  await b.page.reload();
  await expect(b.page.getByText('Pausado', { exact: true })).toBeVisible();
  await ready(a.page).click();
  await expect(a.page.getByText('Lia Dupla (você) · Pronto')).toBeVisible();
  await ready(b.page).click();
  await expect(a.page.getByText('Sessão concluída', { exact: true })).toBeVisible({ timeout: 70_000 });
  for (const { page } of [a, b]) {
    const claim = page.getByRole('button', { name: /Resgatar 4 \+ 1 XP/ });
    await claim.click();
    await expect(page.getByRole('button', { name: 'Recompensa registrada' })).toBeDisabled();
    await page.reload();
    await claim.click();
    await expect(page.getByRole('button', { name: 'Recompensa registrada' })).toBeDisabled();
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('wizdom.v1')).accounts[0].data.stats.xp)).toBe(40);
  }
  console.log('PASS dupla: desktop/celular isolados, queda, recarga, retomada e resgate sem duplicação');
} finally {
  await browser.close();
}
