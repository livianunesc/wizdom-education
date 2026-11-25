import { prioritiesFor, processes } from "./admissions.js";
import { topicsFor } from "./curriculum.js";
export const subjects = [
  "Biologia",
  "Matemática",
  "Português",
  "Redação",
  "Química",
  "Física",
  "História",
  "Geografia",
  "Filosofia",
  "Inglês",
];
export const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
export function dayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export const initialProfile = {
  name: "Júlia",
  course: "Medicina",
  favorite: "Biologia",
  difficulty: "Matemática",
  frequency: "3 a 4 dias por semana",
  hours: 2,
  days: [1, 2, 3, 4, 5],
  goal: "Construir uma rotina mais leve",
  year: "2027",
  school: "Ensino médio",
  routine: "Estudo na escola pela manhã",
  bio: "Um passo de cada vez em direção ao meu sonho.",
  onboarded: true,
};
export const emptyStats = {
  xp: 0,
  coins: 0,
  sessions: [],
  owned: ["lavanda"],
  outfit: "lavanda",
};
export function studentType(profile) {
  return Number(profile.hours) <= 1
    ? "Pequenos passos"
    : profile.frequency === "Estou começando"
      ? "Explorando meu ritmo"
      : "Construindo constância";
}
const courseSubjects = {
  Medicina: ["Biologia", "Química", "Física"],
  Direito: ["História", "Português", "Geografia"],
  Psicologia: ["Biologia", "Português", "História"],
  Engenharia: ["Matemática", "Física", "Química"],
  "Ciência da Computação": ["Matemática", "Física", "Inglês"],
  Administração: ["Matemática", "Português", "Geografia"],
  Arquitetura: ["Matemática", "História", "Geografia"],
};
function routineWindow(profile) {
  const routine = profile.routine || "";
  if (routine.includes("integral")) return { start: 19 * 60, capacity: 180 };
  if (routine.includes("Trabalho")) return { start: 19 * 60, capacity: 240 };
  if (routine.includes("à tarde")) return { start: 8 * 60, capacity: 240 };
  if (routine.includes("manhã")) return { start: 14 * 60, capacity: 360 };
  return { start: 9 * 60, capacity: 480 };
}
export function planDetails(profile, now = new Date()) {
  const requested = Math.max(15, Math.min(480, Math.round((Number(profile.hours) || 1) * 60)));
  const window = routineWindow(profile);
  const minutes = Math.min(requested, window.capacity);
  const year = Number(profile.target?.edition || profile.year);
  const horizon = Number.isFinite(year) ? year - now.getFullYear() : null;
  const personalDays = profile.target?.date ? (new Date(profile.target.date + "T12:00:00") - now) / 86_400_000 : Infinity;
  const weeks = Math.min(Number(profile.target?.horizon || Infinity), personalDays / 7);
  const phase = weeks <= 3 ? "Reta final e revisão de erros" : weeks <= 8 ? "Oito semanas de prática" : profile.target ? "Preparação do semestre" : horizon === null ? "Construção de base" : horizon <= 1 ? "Consolidação para a prova" : "Construção de base";
  return {
    requested, minutes, start: window.start, phase,
    priorities: courseSubjects[profile.course?.startsWith("Engenharia") ? "Engenharia" : profile.course] || ["Matemática", "Português", "Biologia"],
    explanation: [
      `${profile.difficulty || "Matemática"} recebe reforço; ${profile.favorite || "Biologia"} ajuda a manter o ritmo.`,
      `As áreas de ${profile.course || "seu curso"} entram na rotação junto de todas as matérias do ENEM.`,
      `${profile.frequency === "Estou começando" ? "Blocos curtos de adaptação" : "Blocos de estudo com prática"}; pausas de 5 minutos incluídas no tempo.`,
      `${phase}${profile.year ? ` · ingresso: ${profile.year}` : ""}. ${profile.school === "Ensino médio" ? "Reforce os fundamentos junto ao conteúdo da escola." : "Retome os fundamentos antes das questões mistas."}`,
      ...(requested > minutes ? [`A rotina informada comporta uma janela sugerida de ${minutes} min. Ajuste a disponibilidade se seu horário real for diferente.`] : []),
    ],
  };
}
const timeLabel = (minutes) => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
export function makePlan(profile, mood = "okay", date = new Date()) {
  // Explicit rest days are respected; old profiles without days retain a usable plan.
  const selected = Array.isArray(profile.days) ? profile.days : [0, 1, 2, 3, 4, 5, 6];
  if (!selected.includes(date.getDay())) return [];
  const info = planDetails(profile, date);
  const light = mood === "tired" || mood === "overwhelmed";
  const minutes = light ? Math.min(25, Math.max(10, Math.round(info.minutes * 0.4))) : info.minutes;
  const short = profile.frequency === "Estou começando" || profile.frequency === "1 a 2 dias por semana";
  const target = short ? 25 : 40;
  const count = light || minutes <= 40 ? 1 : Math.max(1, Math.ceil((minutes + 5) / (target + 5)));
  const active = minutes - (count - 1) * 5;
  const anchor = Date.UTC(2026, 0, 5);
  const ordinal = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - anchor) / 86400000);
  const dayIndex = ((ordinal % 10000) + 10000) % 10000;
  const weekIndex = Math.floor(dayIndex / 7);
  const difficulty = subjects.includes(profile.difficulty) ? profile.difficulty : "Matemática";
  const favorite = subjects.includes(profile.favorite) ? profile.favorite : "Biologia";
  // Course areas appear twice in the cycle; every ENEM subject still has a slot.
  const rotation = [...info.priorities, ...subjects];
  const preferred = rotation[dayIndex % rotation.length];
  const courseOptions = info.priorities.filter((subject) => subject !== difficulty);
  const courseBlock = courseOptions[dayIndex % courseOptions.length] || info.priorities[0];
  const sequence = light ? [favorite] : [...new Set([
    dayIndex % 3 === 0 ? difficulty : preferred,
    dayIndex % 3 === 0 ? courseBlock : difficulty,
    dayIndex % 2 === 0 ? "Redação" : favorite,
    ...Array.from({ length: 20 }, (_, i) => rotation[(dayIndex + i + 1) % rotation.length]),
  ])];
  let cursor = info.start;
  return Array.from({ length: count }, (_, i) => {
    const subject = sequence[i % sequence.length];
    const catalog = topicsFor(subject);
    const topic = catalog[(weekIndex + Math.floor(dayIndex / rotation.length) + i) % catalog.length];
    const studyMinutes = Math.floor(active / count) + (i < active % count ? 1 : 0);
    const reviewGoal = profile.goal === "Revisar sem esquecer";
    const practiceGoal = profile.goal === "Ter mais confiança nas provas" || profile.goal === "Melhorar nas matérias difíceis";
    const kind = light || reviewGoal ? "Revisão" : subject === "Redação" ? "Escrita" : practiceGoal || info.phase.startsWith("Consolidação") || subject === difficulty ? "Exercícios" : "Conteúdo";
    const questions = Math.max(2, Math.floor(studyMinutes / (short ? 6 : 5)));
    const activity = subject === "Redação"
      ? topic.id === "red-intervencao" ? "Escreva uma intervenção com agente, ação, meio, finalidade e detalhamento. Revise os cinco elementos."
        : topic.id === "red-argumentacao" ? "Escreva um parágrafo com tópico frasal, evidência e análise. Revise os conectivos."
        : "Escolha um tema do ENEM, delimite o problema e escreva uma tese com dois argumentos."
      : kind === "Revisão" ? `Recupere as ideias sem consultar o material; revise suas anotações e resolva ${questions} questões. Registre um erro para revisar.`
      : kind === "Conteúdo" ? `Leia o resumo de ${topic.title.toLowerCase()}, faça um exemplo resolvido e tente ${questions} questões com correção.`
      : `Retome as fórmulas e conceitos por 5 minutos. Resolva ${questions} questões de ${topic.title.toLowerCase()} e corrija cada erro.`;
    const task = {
      id: `${dayKey(date)}-${topic.id}-${i}${profile.target?.id ? "-" + profile.target.id + "-" + profile.target.edition : ""}`, date: dayKey(date), topicId: topic.id,
      subject, title: topic.title, description: topic.description, activity,
      minutes: studyMinutes, breakAfter: i < count - 1 ? 5 : 0,
      start: timeLabel(cursor), end: timeLabel(cursor + studyMinutes), kind,
      tone: ["blue", "mint", "pink", "lavender", "peach"][i % 5],
    };
    if (profile.target && !light) {
      const id = profile.target.processId;
      const priorities = prioritiesFor(id);
      const index = (dayIndex + i) % priorities.length;
      if (i === 0 && (processes[id]?.archive || id === 'enem')) {
        task.activity = priorities[0] + '. Separe os últimos minutos para registrar seus erros.';
        task.source = processes[id]?.archive;
        task.library = id === 'enem';
        task.kind = 'Prova anterior';
      } else {
        task.activity = priorities[index] + '. Use os minutos finais para registrar um ponto de melhoria.';
        task.kind = index === 1 && id !== 'enem' ? 'Prática escrita' : 'Revisão de erros';
      }
    }
    cursor += studyMinutes + task.breakAfter;
    return task;
  });
}
export function newStudent(profile = null) {
  return {
    profile,
    stats: structuredClone(emptyStats),
    favorites: [],
    checkins: {},
    completed: {},
    reviews: [],
  };
}
export function safeLoad() {
  try {
    const d = JSON.parse(localStorage.getItem("wizdom.v1"));
    if (d?.version === 1 && d.demo && Array.isArray(d.accounts)) return d;
  } catch {}
  return {
    version: 1,
    accounts: [],
    current: null,
    demo: newStudent(initialProfile),
  };
}
export async function passwordHash(password, salt) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: new TextEncoder().encode(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    key,
    256,
  );
  return Array.from(new Uint8Array(bits), (x) =>
    x.toString(16).padStart(2, "0"),
  ).join("");
}
