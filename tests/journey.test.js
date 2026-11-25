import test from 'node:test';
import assert from 'node:assert/strict';
import { duoService } from '../server/duo.mjs';
import { flashDeck, scoreFlash } from '../src/flash-round.js';
import { credit, purchase } from '../src/rewards.js';
import { makePlan, initialProfile } from '../src/lib.js';
import { universities } from '../src/admissions.js';

test('Comvest and ENEM produce different resources and respect a 60-minute day', () => {
  const date = new Date(2026, 10, 23, 12);
  const profile = { ...initialProfile, days: [1, 3, 5], hours: 1, course: 'Engenharia Mecânica' };
  const comvest = makePlan({ ...profile, target: { processId: 'comvest', edition: '2027' } }, 'okay', date);
  const enem = makePlan({ ...profile, target: { processId: 'enem', edition: '2027' } }, 'okay', date);
  assert.match(comvest[0].source, /comvest/);
  assert.ok(enem[0].library);
  assert.notEqual(comvest[0].activity, enem[0].activity);
  assert.equal(comvest.reduce((sum, task) => sum + task.minutes + task.breakAfter, 0), 60);
  assert.equal(new Set(universities.map(offer => offer.region)).size, 5);
  assert.ok(universities.every(offer => !Object.hasOwn(offer, 'cutoff') && !Object.hasOwn(offer, 'opens')));
});

test('flash scoring honors the exact deadline and daily reward receipts', () => {
  const card = flashDeck[0];
  assert.deepEqual(scoreFlash(card, '   MITOCONDRIA ', 0, 0, true), { card: card.id, correct: true, elapsed: 0, base: 10, bonus: 5 });
  assert.equal(scoreFlash(card, 'mitocôndria', 0, 20_000, true).base, 0);
  assert.equal(scoreFlash(card, null, 0, 1, true).base, 0);
  assert.equal(scoreFlash(card, 'mitocôndria', 0, 1, false).base, 0);
  const receipt = { id: 'flash:1', xp: 15 };
  const first = credit({ xp: 7, coins: 0 }, receipt);
  assert.equal(credit(first, receipt).xp, 22);
});

test('old balances and outfit ownership remain intact, and a theme can be equipped twice without charging twice', () => {
  const old = { xp: 50, coins: 30, outfit: 'lavanda', owned: ['lavanda', 'rosa'] };
  const poor = { ...old, coins: 29 };
  assert.equal(purchase(poor, 'jardim'), poor);
  const bought = purchase(old, 'jardim');
  assert.deepEqual(bought.owned, old.owned);
  assert.equal(bought.coins, 0);
  assert.equal(bought.xp, 50);
  assert.equal(purchase(purchase(bought, 'caderno'), 'jardim').coins, 0);
  assert.equal(old.coins, 30);
});

test('duo pauses for lost heartbeats, resumes by mutual confirmation, and returns a stable receipt', () => {
  let clock = 0;
  const act = duoService(() => clock);
  const a = act({ action: 'create', name: 'Lia', minutes: 1 });
  const b = act({ action: 'join', code: a.code, name: 'Sol' });
  const send = (player, action) => act({ action, code: player.code, token: player.token });
  assert.throws(() => act({ action: 'join', code: a.code, name: 'Extra' }), /cheia/);
  assert.equal(send(a, 'ready').state, 'waiting');
  assert.equal(send(b, 'ready').endAt, 60_000);
  clock = 2_000;
  send(a, 'status');
  send(b, 'status');
  clock = 11_000;
  assert.equal(send(a, 'status').remaining, 58_000);
  assert.equal(send(b, 'status').state, 'paused');
  assert.equal(send(a, 'ready').state, 'paused');
  assert.equal(send(b, 'ready').endAt, 69_000);
  for (clock = 16_000; clock < 69_000; clock += 5_000) {
    send(a, 'status');
    send(b, 'status');
  }
  clock = 69_000;
  assert.equal(send(a, 'status').state, 'running');
  assert.equal(send(b, 'status').state, 'completed');
  const receipt = send(a, 'claim').receipt;
  assert.equal(receipt.base + receipt.bonus, 5);
  assert.deepEqual(send(a, 'claim').receipt, receipt);
  assert.throws(() => send({ ...a, token: 'fake' }, 'claim'), /expirou/);
});

test('expired invitations and cancelled rooms cannot award a session', () => {
  let time = 0;
  const act = duoService(() => time);
  const a = act({ action: 'create', name: 'Lia', minutes: 1 });
  time = 900_000;
  assert.throws(() => act({ action: 'join', code: a.code, name: 'Sol' }), /expirado/);
  assert.equal(act({ ...a, action: 'leave' }).state, 'cancelled');
  assert.throws(() => act({ ...a, action: 'claim' }), /Concluam/);
});

test('a pause near the deadline preserves the time that only one participant confirmed', () => {
  let clock = 0;
  const act = duoService(() => clock);
  const a = act({ action: 'create', name: 'Lia', minutes: 1 });
  const b = act({ action: 'join', code: a.code, name: 'Sol' });
  const send = (player, action) => act({ action, code: player.code, token: player.token });
  send(a, 'ready');
  send(b, 'ready');
  for (clock = 5000; clock < 60_000; clock += 5000) {
    send(a, 'status');
    send(b, 'status');
  }
  clock = 61_000;
  assert.equal(send(a, 'pause').remaining, 5000);
  assert.equal(send(a, 'ready').state, 'paused');
  assert.equal(send(b, 'ready').endAt, 66_000);
  assert.throws(() => send(a, 'claim'), /Concluam/);
});
