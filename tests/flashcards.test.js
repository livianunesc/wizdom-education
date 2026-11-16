import test from 'node:test';
import assert from 'node:assert/strict';
import { flashcards, cardsForTopic } from '../src/flashcards-data.js';
import { topics } from '../src/curriculum.js';

test('every planned topic has an authored question at each of the three difficulties', () => {
  assert.equal(flashcards.length, topics.length * 3);
  assert.equal(new Set(flashcards.map((card) => card.id)).size, flashcards.length);
  for (const topic of topics) {
    const cards = cardsForTopic(topic.id);
    assert.equal(cards.length, 3, topic.id);
    assert.deepEqual(cards.map((card) => card.level), ['fundamental', 'intermediário', 'desafiador']);
  }
});

test('all questions have one valid answer and four distinct usable alternatives', () => {
  for (const card of flashcards) {
    assert.equal(card.options.length, 4, card.id);
    assert.equal(new Set(card.options).size, 4, card.id);
    assert.ok(Number.isInteger(card.answer) && card.answer >= 0 && card.answer < 4, card.id);
    assert.ok(card.question.length > 20, card.id);
    assert.ok(card.options.every((option) => typeof option === 'string' && option.length > 0), card.id);
    assert.ok(card.explanation.length > 30, card.id);
    assert.ok(topics.some((topic) => topic.id === card.topicId), card.id);
  }
});

test('representative mathematical and scientific answers are numerically correct', () => {
  const expected = {
    'mat-proporcao-1': 'R$ 170',
    'mat-proporcao-2': '1,5 km',
    'mat-proporcao-3': '4% menor',
    'mat-funcoes-3': '20 m',
    'mat-estatistica-3': '7,5',
    'bio-genetica-3': '2/3',
    'qui-estequiometria-2': '6 mol',
    'fis-eletricidade-3': '4 A',
    'fis-ondas-2': '2 m',
  };
  for (const [id, answer] of Object.entries(expected)) {
    const card = flashcards.find((item) => item.id === id);
    assert.equal(card.options[card.answer], answer, id);
  }
});
