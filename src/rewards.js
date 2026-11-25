export const themes = [
  { id: 'caderno', name: 'Caderno', price: 0 },
  { id: 'jardim', name: 'Jardim', price: 30 },
  { id: 'aurora', name: 'Aurora', price: 45 },
  { id: 'oceano', name: 'Oceano', price: 60 },
];

export function credit(stats, { id, xp = 0, coins = 0, label, day }) {
  const ledger = stats.ledger || {};
  if (Object.hasOwn(ledger, id)) return stats;
  return { ...stats, xp: (stats.xp || 0) + xp, coins: (stats.coins || 0) + coins,
    ledger: { ...ledger, [id]: { xp, coins, label, day } } };
}

export function purchase(stats, id, day) {
  const theme = themes.find(item => item.id === id);
  if (!theme) return stats;
  const owned = stats.themes || [];
  if (!theme.price || owned.includes(id)) return { ...stats, theme: id };
  if (stats.coins < theme.price) return stats;
  return { ...credit(stats, { id: 'theme:' + id, coins: -theme.price, label: theme.name, day }),
    themes: [...owned, id], theme: id };
}

export function weekKey(date, dayKey) {
  const monday = new Date(date);
  monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7);
  return dayKey(monday);
}
