export const flashDeck = [
  { id: 'cell', topicId: 'bio-celulas', subject: 'Biologia', question: 'Qual organela realiza a maior parte da produção de ATP na respiração aeróbica?', answers: ['mitocôndria', 'mitocôndrias'], explanation: 'Na membrana interna da mitocôndria, a cadeia respiratória cria o gradiente que alimenta a ATP sintase.' },
  { id: 'linear', topicId: 'mat-funcoes', subject: 'Matemática', question: 'Se 3x + 5 = 20, qual é o valor de x?', answers: ['5'], explanation: 'Subtraia 5 dos dois lados e divida 15 por 3.' },
  { id: 'chem', topicId: 'qui-estequiometria', subject: 'Química', question: 'Uma solução de pH 3 é ácida, neutra ou básica?', answers: ['ácida', 'ácido'], explanation: 'A 25 °C, valores abaixo de 7 indicam uma solução ácida.' },
  { id: 'motion', topicId: 'fis-mecanica', subject: 'Física', question: 'Qual é a unidade de força no SI?', answers: ['newton', 'n'], explanation: 'Um newton equivale a 1 kg·m/s².' },
  { id: 'language', topicId: 'por-linguagem', subject: 'Português', question: 'Como se chama a comparação implícita em “aquela notícia foi uma bomba”?', answers: ['metáfora'], explanation: 'Metáfora transfere um sentido por semelhança sem usar um conector explícito de comparação.' },
  { id: 'history', topicId: 'his-brasil', subject: 'História', question: 'Em que ano a Lei Áurea aboliu formalmente a escravidão no Brasil?', answers: ['1888'], explanation: 'A lei foi assinada em 13 de maio de 1888. A abolição formal ocorreu sem políticas amplas de reparação.' },
];

const normalized = value => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim().replace(/\s+/g, ' ');

export function scoreFlash(card, input, start, end, timed) {
  const elapsed = Math.max(0, end - start);
  const correct = input !== null && (!timed || elapsed < 20_000) &&
    card.answers.some(answer => normalized(answer) === normalized(input));
  const base = correct && timed ? 10 : 0;
  return { card: card.id, correct, elapsed, base, bonus: base ? Math.floor((20_000 - elapsed) * 5 / 20_000) : 0 };
}
