import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Flame,
  Layers3,
  Leaf,
  Play,
  Target,
  Zap,
} from "lucide-react";
import { useState } from "react";
import Character from "./Character.jsx";
import { flashcards } from "./flashcards-data.js";
import { activeDates, learningState, streakFor } from "./learning.js";
import { dayKey, makePlan, weekdays } from "./lib.js";
import { universities } from "./opportunities-data.js";
import { weekKey } from "./rewards.js";
import "./dashboard-studio.css";

const moods = [
  { id: "energized", face: "✧", name: "Com energia" },
  { id: "okay", face: "◡", name: "Estou bem" },
  { id: "tired", face: "–", name: "Cansada(o)" },
  { id: "overwhelmed", face: "≈", name: "Sobrecarregada(o)" },
];

function MiniCalendar({ events, onOpen }) {
  const [offset, setOffset] = useState(0);
  const now = new Date();
  const month = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const count = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0).getDate();
  const start = (month.getDay() + 6) % 7;

  return (
    <>
      <div className="studio-calendar-heading">
        <h3 aria-live="polite">
          {month.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
        </h3>
        <div className="studio-calendar-controls">
          <button type="button" aria-label="Mês anterior" onClick={() => setOffset(value => value - 1)}>
            <ChevronLeft size={16} />
          </button>
          <button type="button" aria-label="Próximo mês" onClick={() => setOffset(value => value + 1)}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div className="studio-calendar-grid">
        {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map(day => <span key={day}>{day}</span>)}
        {Array.from({ length: start }, (_, index) => <span key={index} />)}
        {Array.from({ length: count }, (_, index) => {
          const day = index + 1;
          const key = dayKey(new Date(month.getFullYear(), month.getMonth(), day));
          const event = events.some(item => item.opens === key);
          return (
            <span key={key} data-today={key === dayKey(now)} data-event={event} aria-current={key === dayKey(now) ? "date" : undefined}>
              {day}{event && <span className="sr-only"> · abertura de inscrições</span>}
            </span>
          );
        })}
      </div>
      <button type="button" className="studio-link" onClick={onOpen}>
        Abrir calendário <ArrowUpRight size={15} />
      </button>
    </>
  );
}

function Progress({ stats, now, navigate }) {
  const xp = stats.xp || 0;
  const progress = xp % 100;
  const level = Math.floor(xp / 100) + 1;
  const dates = activeDates(stats);
  const monday = now.getDate() - (now.getDay() + 6) % 7;
  const week = Array.from({ length: 7 }, (_, day) => new Date(now.getFullYear(), now.getMonth(), monday + day));
  const streak = streakFor(stats, now);

  return (
    <section className="card studio-panel studio-progress" aria-labelledby="studio-progress-title">
      <div className="studio-section-heading">
        <h2 id="studio-progress-title"><Target size={19} /> Meu progresso</h2>
        <button type="button" className="studio-arrow" aria-label="Abrir meu progresso no perfil" onClick={() => navigate("Meu perfil")}>
          <ArrowUpRight size={17} />
        </button>
      </div>
      <div className="studio-level">
        <span className="studio-level-mark"><Zap size={21} fill="currentColor" /></span>
        <div><strong>Nível {level}</strong><span>{xp.toLocaleString("pt-BR")} XP acumulados</span></div>
      </div>
      <label className="studio-level-progress">
        <span>Próximo nível <strong>{progress}/100 XP</strong></span>
        <progress value={progress} max="100" />
      </label>
      <div className="studio-streak">
        <p><Flame size={17} /> <strong>{streak} {streak === 1 ? "dia seguido" : "dias seguidos"}</strong></p>
        <div className="studio-streak-days" aria-label="Atividade nesta semana">
          {week.map(date => {
            const key = dayKey(date);
            const active = dates.has(key);
            return <span key={key} data-active={active} aria-label={`${weekdays[date.getDay()]} · ${active ? "com estudo" : "sem estudo"}`}>{weekdays[date.getDay()].slice(0, 1)}</span>;
          })}
        </div>
      </div>
    </section>
  );
}

function Missions({ stats, today, now, navigate, demo }) {
  const [period, setPeriod] = useState("today");
  const missions = period === "today"
    ? [
        [`login:${today}`, "Entrar na conta", "20 XP"],
        [`block:${today}`, "Concluir um bloco", "10 XP"],
        [`review:${today}`, "Responder uma questão", "5 XP"],
      ]
    : [[`duo-week:${weekKey(now, dayKey)}`, "Concluir foco em dupla", "15 XP"]];

  return (
    <section className="card studio-panel studio-missions" aria-labelledby="studio-missions-title">
      <div className="studio-section-heading">
        <h2 id="studio-missions-title"><Zap size={19} /> Missões</h2>
        <div className="studio-period" role="group" aria-label="Período das missões">
          <button type="button" aria-pressed={period === "today"} onClick={() => setPeriod("today")}>Hoje</button>
          <button type="button" aria-pressed={period === "week"} onClick={() => setPeriod("week")}>Semana</button>
        </div>
      </div>
      <ul className="studio-mission-list">
        {missions.map(([id, label, xp]) => (
          <li key={id} data-done={Boolean(stats.ledger?.[id])}>
            <span className="studio-mission-check" aria-label={stats.ledger?.[id] ? "Concluída" : "Pendente"}>{stats.ledger?.[id] && <Check size={13} />}</span>
            <span>{label}</span>
            <strong>+{xp}</strong>
          </li>
        ))}
      </ul>
      {demo && <p className="studio-mission-note">Entre na sua conta para ganhar as recompensas.</p>}
      <button type="button" className="studio-link" onClick={() => navigate("Loja")}>Ver recompensas <ArrowUpRight size={15} /></button>
    </section>
  );
}

export default function Dashboard({
  profile,
  stats,
  checkins,
  setCheckins,
  completed,
  setCompleted,
  favorites,
  navigate,
  notify,
  onStudy,
  learning,
  scheduled = [],
  demo = false,
}) {
  const now = new Date();
  const today = dayKey(now);
  const mood = checkins[today];
  const [selected, setSelected] = useState(mood || null);
  const adjustments = new Set(scheduled.map(task => task.id));
  const plan = [
    ...makePlan(profile, mood, now).filter(task => !adjustments.has(task.id)),
    ...scheduled.filter(task => task.date === today),
  ];
  const done = completed[today] || [];
  const countDone = plan.filter(task => done.includes(task.id)).length;
  const next = plan.find(task => !done.includes(task.id));
  const total = plan.reduce((sum, task) => sum + task.minutes + task.breakAfter, 0);
  const minutes = Math.floor((stats.sessions || []).reduce((sum, session) => sum + session.seconds, 0) / 60);
  const { answers, records, topics } = learningState(learning);
  const studied = new Set(topics.map(topic => topic.topicId));
  const pending = flashcards.filter(card => studied.has(card.topicId) && (!records[card.id]?.due || records[card.id].due <= today)).length;
  const favs = universities.filter(item => favorites.includes(item.id));
  const lightPlan = mood === "tired" || mood === "overwhelmed";

  function saveMood() {
    setCheckins(previous => ({ ...previous, [today]: selected }));
    notify(selected === "tired" || selected === "overwhelmed" ? "Plano de hoje ajustado." : "Check-in salvo.");
  }

  return (
    <div className="studio-dashboard">
      <div className="studio-intro">
        <div>
          <p className="studio-date"><CalendarDays size={16} /> <time dateTime={today}>{now.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}</time></p>
          <h1>Oi, {profile.name.trim().split(/\s+/)[0]}</h1>
        </div>
        <button type="button" className="studio-target" onClick={() => navigate("Vestibulares")}>
          <span className="studio-target-icon"><Target size={20} /></span>
          <span><small>Meu objetivo</small><strong>{profile.course || "Escolher objetivo"}{profile.year ? ` · ${profile.year}` : ""}</strong></span>
          <ArrowUpRight size={17} />
        </button>
      </div>

      <div className="studio-overview">
        <section className="studio-hero" aria-labelledby="studio-hero-title">
          <div className="studio-hero-copy">
            <span className="studio-hero-label"><span />{plan.length ? next ? "Próxima atividade" : "Plano de hoje" : "Seu cronograma"}</span>
            <h2 id="studio-hero-title">{next?.title || (plan.length ? "Atividades de hoje concluídas" : "Dia livre para descansar")}</h2>
            <p>{next ? <><Clock3 size={17} /> {next.subject} · {next.minutes} min</> : pending ? `${pending} ${pending === 1 ? "questão pendente" : "questões pendentes"}` : "Veja os próximos blocos no seu cronograma."}</p>
            <button type="button" className="studio-start" onClick={() => next ? navigate("Área de foco", next) : navigate(pending ? "Revisões" : "Cronograma")}>
              {next ? <Play size={17} fill="currentColor" /> : <ArrowRight size={17} />}
              {next ? "Começar a estudar" : pending ? "Abrir revisões" : "Ver meu cronograma"}
            </button>
          </div>
          <div className="studio-hero-art" aria-hidden="true">
            <div className="studio-orbit studio-orbit-outer" />
            <div className="studio-orbit studio-orbit-inner" />
            <div className="studio-avatar-stage"><Character value={profile.character} /></div>
            <span className="studio-orbit-icon studio-orbit-book"><BookOpen size={24} strokeWidth={1.7} /></span>
            <span className="studio-orbit-icon studio-orbit-zap"><Zap size={19} fill="currentColor" /></span>
            <span className="studio-orbit-light" />
          </div>
        </section>
        <Progress stats={stats} now={now} navigate={navigate} />
      </div>

      <div className="studio-metrics" aria-label="Resumo dos estudos">
        <div className="card studio-metric">
          <span className="studio-metric-icon"><Clock3 size={19} /></span>
          <div><strong>{minutes >= 60 ? `${Math.floor(minutes / 60)} h ${minutes % 60} min` : `${minutes} min`}</strong><span>Tempo de foco</span></div>
        </div>
        <div className="card studio-metric">
          <span className="studio-metric-icon"><Layers3 size={19} /></span>
          <div><strong>{countDone}/{plan.length}</strong><span>Blocos de hoje</span></div>
        </div>
        <button type="button" className="card studio-metric" onClick={() => navigate("Revisões")}>
          <span className="studio-metric-icon"><BookOpen size={19} /></span>
          <div><strong>{pending}</strong><span>{pending === 1 ? "Questão pendente" : "Questões pendentes"}</span></div>
          <ArrowUpRight className="studio-metric-arrow" size={16} />
        </button>
      </div>

      <div className="studio-below">
        <div className="studio-stack">
          <section className="card studio-panel studio-plan" aria-labelledby="studio-plan-title">
            <div className="studio-section-heading">
              <div>
                <h2 id="studio-plan-title"><CalendarDays size={19} /> Plano de hoje</h2>
                <p>{lightPlan ? "Plano adaptado ao seu check-in" : total ? `${total} min planejados, com pausas` : "Sem blocos agendados"}</p>
              </div>
              <button type="button" className="studio-link" onClick={() => navigate("Cronograma")}>Ver cronograma <ArrowUpRight size={15} /></button>
            </div>
            {!!plan.length && (
              <>
                <div className="studio-task-list">
                  {plan.map(task => {
                    const checked = done.includes(task.id);
                    return (
                      <article className="task-row studio-task" key={task.id}>
                        <button
                          type="button"
                          className={`task-check ${checked ? "checked" : ""}`}
                          aria-label={`${checked ? "Desmarcar" : "Concluir"} ${task.subject}`}
                          aria-pressed={checked}
                          onClick={() => {
                            if (checked) setCompleted(previous => ({ ...previous, [today]: (previous[today] || []).filter(id => id !== task.id) }));
                            else onStudy(task);
                          }}
                        >
                          {checked && <Check size={17} />}
                        </button>
                        <div className="task-copy">
                          <strong>{task.subject}</strong>
                          <p>{task.title}</p>
                        </div>
                        <span className="task-time">{task.minutes} min</span>
                        <button type="button" className="studio-task-play" aria-label={`Estudar ${task.subject}`} onClick={() => navigate("Área de foco", task)}>
                          <Play size={16} />
                        </button>
                      </article>
                    );
                  })}
                </div>
                <p className="plan-footnote">{countDone} de {plan.length} {plan.length === 1 ? "atividade concluída" : "atividades concluídas"}</p>
              </>
            )}
            {!plan.length && (
              <button type="button" className="studio-link" onClick={() => navigate("Revisões")}>Registrar assunto estudado <ArrowRight size={16} /></button>
            )}
          </section>

          <section className="card studio-panel studio-checkin" aria-labelledby="studio-checkin-title">
            <div className="studio-section-heading">
              <div>
                <h2 id="studio-checkin-title"><Leaf size={19} /> Como você está hoje?</h2>
                <p>Use o check-in para ajustar a carga de estudo.</p>
              </div>
              {mood && <span className="studio-checkin-done"><Check size={14} /> Check-in feito</span>}
            </div>
            <div className="studio-moods">
              {moods.map(option => (
                <button type="button" key={option.id} aria-pressed={selected === option.id} onClick={() => setSelected(option.id)}>
                  <span aria-hidden="true">{option.face}</span>{option.name}
                </button>
              ))}
            </div>
            <button type="button" className="studio-link" disabled={!selected} onClick={saveMood}>
              {mood ? "Atualizar check-in" : "Adaptar meu dia"} <ArrowRight size={15} />
            </button>
          </section>

          <section className="card studio-panel studio-question-history" aria-labelledby="studio-answers-title">
            <div className="studio-section-heading">
              <h2 id="studio-answers-title"><BookOpen size={19} /> Questões respondidas</h2>
              <button type="button" className="studio-link" onClick={() => navigate("Revisões")}>Praticar <ArrowUpRight size={15} /></button>
            </div>
            <p>{answers.length ? `${answers.length} no histórico · ${Math.round(100 * answers.filter(answer => answer.correct).length / answers.length)}% de acerto` : "Suas respostas aparecem aqui depois da primeira prática."}</p>
          </section>
        </div>

        <aside className="studio-stack" aria-label="Missões e calendário">
          <Missions stats={stats} today={today} now={now} navigate={navigate} demo={demo} />
          <section className="card studio-panel studio-calendar" aria-labelledby="studio-calendar-title">
            <div className="studio-section-heading">
              <h2 id="studio-calendar-title"><CalendarDays size={19} /> Calendário</h2>
            </div>
            <MiniCalendar events={favs} onOpen={() => navigate("Calendário")} />
            {!!favs.length && (
              <div className="studio-calendar-favorites">
                <h3>Vestibulares favoritos</h3>
                <p>{favs.slice(0, 3).map(item => item.acronym).join(" · ")}</p>
                <button type="button" className="studio-link" onClick={() => navigate("Vestibulares")}>Ver vestibulares <ArrowUpRight size={15} /></button>
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
