export { universities } from './admissions.js';

export function formatDate(value, options = { day: '2-digit', month: 'short' }) {
  return value ? new Date(`${value}T12:00:00`).toLocaleDateString('pt-BR', options) : 'Aguardando publicação';
}
