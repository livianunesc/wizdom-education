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
