import test from 'node:test';
import assert from 'node:assert/strict';
import { makePlan, planDetails, initialProfile, dayKey, studentType, newStudent, subjects } from '../src/lib.js';
import { topicById, topics } from '../src/curriculum.js';
const monday = new Date(2026, 10, 16);
const total = (plan) => plan.reduce((sum, task) => sum + task.minutes + task.breakAfter, 0);
const minutesOf = (time) => Number(time.slice(0,2)) * 60 + Number(time.slice(3));

test('availability includes real breaks, distinct tasks and concrete topics', () => {
  for (const hours of [0.5, 1, 1.5, 2, 3, 8]) {
    const profile = { ...initialProfile, hours, routine: 'Tenho horários flexíveis' };
    const plan = makePlan(profile, 'okay', monday);
    assert.equal(total(plan), hours * 60);
    assert(plan.every((task) => task.minutes > 0 && topicById(task.topicId)));
    assert.equal(new Set(plan.map((task) => task.id)).size, plan.length);
    assert.equal(plan.at(-1).breakAfter, 0);
    for (let i = 0; i < plan.length; i++) {
      assert.equal(minutesOf(plan[i].end) - minutesOf(plan[i].start), plan[i].minutes);
      assert(plan[i].activity.length > 35);
      if (i > 0) assert.equal(minutesOf(plan[i].start), minutesOf(plan[i - 1].end) + 5);
    }
  }
});
test('chosen days are respected, while legacy profiles without days remain usable', () => {
  assert.deepEqual(makePlan({ ...initialProfile, days: [2, 4] }, 'okay', monday), []);
  assert.deepEqual(makePlan({ ...initialProfile, days: [] }, 'okay', monday), []);
  const { days, ...legacy } = initialProfile;
  assert(makePlan(legacy, 'okay', monday).length > 0);
});
test('routine moves the suggested hours and caps an impossible daily window', () => {
  const cases = [
    ['Estudo na escola pela manhã', '14:00', 360],
    ['Estudo na escola à tarde', '08:00', 240],
    ['Estudo em período integral', '19:00', 180],
    ['Trabalho e estudo', '19:00', 240],
    ['Tenho horários flexíveis', '09:00', 480],
  ];
  for (const [routine, start, available] of cases) {
    const profile = { ...initialProfile, routine, hours: 8 };
    const plan = makePlan(profile, 'okay', monday);
    assert.equal(plan[0].start, start);
    assert.equal(total(plan), available);
    assert(total(plan) <= profile.hours * 60);
    if (available < 480) assert(planDetails(profile, monday).explanation.some((line) => line.includes('janela sugerida')));
  }
});
test('fatigue and overwhelm create one short review of a favorite topic', () => {
  for (const mood of ['tired', 'overwhelmed']) {
    const gentle = makePlan(initialProfile, mood, monday);
    assert.equal(gentle.length, 1);
    assert.equal(gentle[0].subject, initialProfile.favorite);
    assert.equal(gentle[0].kind, 'Revisão');
    assert(gentle[0].minutes <= 25);
    assert(total(gentle) < total(makePlan(initialProfile, 'okay', monday)));
  }
});
test('course, goal, frequency, admission horizon and preferences affect a stable plan', () => {
  const profile = { ...initialProfile, days: [0,1,2,3,4,5,6] };
  assert.deepEqual(makePlan(profile, 'okay', monday), makePlan(profile, 'okay', new Date(2026,10,16)));
  assert.notDeepEqual(makePlan(profile, 'okay', monday), makePlan({ ...profile, course: 'Direito' }, 'okay', monday));
  assert(makePlan({ ...profile, goal: 'Revisar sem esquecer' }, 'okay', monday).every((task) => task.kind === 'Revisão'));
  assert(makePlan({ ...profile, frequency: 'Estou começando' }, 'okay', monday).length > makePlan({ ...profile, frequency: '5 ou mais dias por semana' }, 'okay', monday).length);
  assert.notEqual(planDetails({ ...profile, year: '2027' }, monday).phase, planDetails({ ...profile, year: '2029' }, monday).phase);
  assert(makePlan({ ...profile, difficulty: 'Física' }, 'okay', monday).some((task) => task.subject === 'Física'));
});
test('date rotation covers every ENEM subject and advances the topic sequence', () => {
  const profile = { ...initialProfile, hours: 0.5, days: [0,1,2,3,4,5,6] };
  const plans = Array.from({ length: 90 }, (_, i) => makePlan(profile, 'okay', new Date(2026,10,16 + i)));
  const covered = new Set(plans.flat().map((task) => task.subject));
  for (const subject of subjects) assert(covered.has(subject), `missing ${subject}`);
  assert(new Set(plans.flat().map((task) => task.topicId)).size > subjects.length);
  assert(topics.every((topic) => typeof topic.id === 'string' && topic.subject && topic.description));
});
test('classification stays supportive and accounts have isolated empty state', () => {
  assert.equal(studentType({ ...initialProfile, hours: 0.5 }), 'Pequenos passos');
  assert.equal(studentType({ ...initialProfile, frequency: 'Estou começando' }), 'Explorando meu ritmo');
  const a = newStudent(), b = newStudent();
  a.stats.sessions.push({});
  assert.equal(b.stats.sessions.length, 0);
  assert.equal(b.stats.xp, 0);
  assert.equal(b.profile, null);
});
test('calendar keys preserve the local calendar day', () => {
  assert.equal(dayKey(new Date(2027,0,2,23,59)), '2027-01-02');
});
