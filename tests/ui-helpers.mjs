// Use the same visible, accessible controls a student uses; no native select popup.
export async function selectChoice(page, label, value) {
  const visibleLabels = {
    "0.5": "30 minutos por dia",
    "1": "1 hora por dia",
    "1.5": "1 hora e 30 minutos por dia",
  };
  const combobox = page.getByRole("combobox", { name: label, exact: true });
  await combobox.click();
  await page.getByRole("option", { name: visibleLabels[value] || value, exact: true }).click();
}

// Desktop exposes common destinations directly, while the menu contains every destination.
export async function navigateUnit(page, destination) {
  const header = page.locator(".studio-header");
  const toggle = header.getByRole("button", { name: "Abrir menu", exact: true });
  await toggle.waitFor();
  const name = destination === "Revisões" ? "Questões" : destination;
  const direct = header.getByRole("button", { name, exact: true });
  if (await direct.isVisible()) {
    await direct.click();
    return;
  }
  const menu = page.locator("#studio-menu");
  if (!(await menu.isVisible())) await toggle.click();
  await menu.getByRole("button", { name, exact: true }).click();
}
