import { dayKey } from './lib.js';

export const emptyLearning = () => ({ topics: [], records: {}, answers: [] });
export function learningState(value) {
  return { ...emptyLearning(), ...value, topics: value?.topics || [], records: value?.records || {}, answers: value?.answers || [] };
}
export function registerTopic(value, topicId, date = new Date()) {
  const state = learningState(value);
  if (state.topics.some(t => t.topicId === topicId)) return state;
  return { ...state, topics: [...state.topics, { topicId, studiedAt: dayKey(date) }] };
}
export function recordAnswer(value, card, correct, date = new Date()) {
  const state = learningState(value), today = dayKey(date);
  const before = state.records[card.id] || { correct: 0, wrong: 0, interval: 0 };
  const interval = correct ? Math.min(30, before.interval >= 3 ? before.interval * 2 : 3) : 1;
  const due = new Date(date); due.setDate(due.getDate() + interval);
  // Practice is unlimited; points are granted at most once per card per local day.
  const xp = before.rewardDay === today ? 0 : correct ? 10 : 3;
  return {
    xp,
    state: {
      ...state,
      records: { ...state.records, [card.id]: {
        ...before, correct: before.correct + Number(correct), wrong: before.wrong + Number(!correct),
        interval, due: dayKey(due), rewardDay: today,
      } },
      answers: [...state.answers, { id: `${card.id}-${date.getTime()}-${state.answers.length}`, cardId: card.id, topicId: card.topicId, correct, date: date.toISOString() }],
    },
  };
}
export function activeDates(stats = {}) {
  return new Set([...(stats.activityDays || []), ...(stats.sessions || []).filter(s => s.seconds >= 60).map(s => dayKey(new Date(s.date)))]);
}
export function streakFor(stats, date = new Date()) {
  const dates = activeDates(stats), cursor = new Date(date);
  let count = 0;
  if (!dates.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (dates.has(dayKey(cursor))) { count++; cursor.setDate(cursor.getDate() - 1); }
  return count;
}
export function noteActivity(stats, date = new Date()) {
  return { ...stats, activityDays: [...new Set([...(stats.activityDays || []), dayKey(date)])] };
}
