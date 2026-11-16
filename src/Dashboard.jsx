import {
  ArrowUpRight,
  ArrowRight,
  Play,
  Check,
  Flame,
  Clock3,
  Target,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Leaf,
  CheckCircle2,
  CalendarDays,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { streakFor } from "./learning.js";
import Illustration from "./Illustration.jsx";
import { makePlan, dayKey, weekdays, studentType } from "./lib.js";
import { universities } from "./opportunities-data.js";
export const moods = [
  { id: "energized", face: "✧", name: "Com energia", color: "mint" },
  { id: "okay", face: "•ᴗ•", name: "Estou bem", color: "pistachio" },
  { id: "tired", face: "−.−", name: "Cansada(o)", color: "lavender" },
  {
    id: "overwhelmed",
    face: "︶.︶",
    name: "Sobrecarregada(o)",
    color: "peach",
  },
];
export function MiniCalendar({ events = [], onOpen }) {
  const [offset, setOffset] = useState(0);
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const year = date.getFullYear(),
    month = date.getMonth();
  const count = new Date(year, month + 1, 0).getDate(),
    start = date.getDay();
  return (
    <div className="mini-calendar">
      <div className="calendar-top">
        <h3>
          {date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
        </h3>
        <div>
          <button
            className="icon-button"
            aria-label="Mês anterior"
            onClick={() => setOffset(offset - 1)}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            className="icon-button"
            aria-label="Próximo mês"
            onClick={() => setOffset(offset + 1)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div className="calendar-grid">
        {["D", "S", "T", "Q", "Q", "S", "S"].map((x, i) => (
          <span className="weekday" key={"h" + i}>
            {x}
          </span>
        ))}
        {Array.from({ length: start }, (_, i) => (
          <span key={"e" + i} />
        ))}
        {Array.from({ length: count }, (_, i) => {
          const d = i + 1,
            key = dayKey(new Date(year, month, d)),
            ev = events.some((e) => e.opens === key);
          return (
            <button
              key={d}
              onClick={onOpen}
              title={
                ev ? "Inscrição de universidade favorita" : `Ver agenda de ${d}`
              }
              className={`${key === dayKey() ? "today" : ""} ${ev ? "has-event" : ""}`}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
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
}) {
  const today = dayKey(),
    mood = checkins[today];
  const [selected, setSelected] = useState(mood || null);
  const plan = makePlan(profile, mood);
  const isStudyDay = profile.days.includes(new Date().getDay());
  const done = completed[today] || [];
  const total = plan.reduce((s, t) => s + t.minutes + t.breakAfter, 0);
  const minutes = Math.floor(
    stats.sessions.reduce((s, x) => s + x.seconds, 0) / 60,
  );
  const streak = streakFor(stats);
  const favs = universities.filter((u) => favorites.includes(u.id));
  function saveMood() {
    setCheckins((v) => ({ ...v, [today]: selected }));
    notify(
      selected === "tired" || selected === "overwhelmed"
        ? "Plano ajustado. Hoje, um passo pequeno já vale muito."
        : "Check-in salvo. Seu plano está pronto!",
    );
  }
  return (
    <>
      <div className="welcome-row">
        <div>
          <div className="eyebrow">SEU ESPAÇO PARA CRESCER</div>
          <h1>
            Oi, {profile.name.split(" ")[0]} <span className="wave">✺</span>
          </h1>
          <p className="muted">
            Seu futuro se constrói um pouquinho a cada dia.
          </p>
        </div>
        <span className="date-pill">
          <CalendarDays size={15} />
          {new Date().toLocaleDateString("pt-BR", {
            day: "numeric",
            month: "long",
          })}
        </span>
      </div>
      <div className="dashboard-columns">
        <div className="dashboard-main">
          <section className="welcome-banner">
            <div>
              <span className="badge white-badge">
                <Sparkles size={13} /> NO SEU TEMPO, DO SEU JEITO
              </span>
              <h2>
                Grandes sonhos.
                <br />
                Pequenos passos.
              </h2>
              <p>
                Você não precisa dar conta de tudo hoje.
                <br />
                Só precisa começar por você.
              </p>
              <button
                className="button primary"
                onClick={() => navigate("Cronograma")}
              >
                Ver meu plano de estudos <ArrowRight size={16} />
              </button>
            </div>
            <Illustration />
          </section>
          <div className="stat-grid">
            <div className="stat-card">
              <span className="stat-icon lavender">
                <Clock3 size={19} />
              </span>
              <div>
                <span className="stat-label">Tempo de estudo</span>
                <strong>
                  {Math.floor(minutes / 60)}
                  <small>h</small> {minutes % 60}
                  <small>min</small>
                </strong>
                <span className="stat-caption">Cada minuto conta</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon peach">
                <Flame size={19} />
              </span>
              <div>
                <span className="stat-label">Sua constância</span>
                <strong>
                  {streak} <small>{streak === 1 ? "dia" : "dias"}</small>
                </strong>
                <span className="stat-caption">Um dia de cada vez</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon mint">
                <Target size={19} />
              </span>
              <div>
                <span className="stat-label">Seu próximo capítulo</span>
                <strong className="course-stat">{profile.course}</strong>
                <span className="stat-caption">Ingresso em {profile.year}</span>
              </div>
            </div>
          </div>
          <section className="card checkin-card">
            <div className="section-heading">
              <div className="heading-icon">
                <span className="small-icon lavender">
                  <Leaf size={19} />
                </span>
                <div>
                  <h2>Como você está hoje?</h2>
                  <p className="muted">Seu plano também cuida do seu ritmo.</p>
                </div>
              </div>
              {mood && (
                <span className="badge mint">
                  <Check size={12} /> Check-in feito
                </span>
              )}
            </div>
            <div className="mood-grid">
              {moods.map((m) => (
                <button
                  key={m.id}
                  aria-pressed={selected === m.id}
                  className={`mood-choice ${selected === m.id ? "selected" : ""}`}
                  onClick={() => setSelected(m.id)}
                >
                  <span className={`mood-face ${m.color}`}>{m.face}</span>
                  <span>{m.name}</span>
                </button>
              ))}
            </div>
            <div className="checkin-footer">
              <span className="muted">
                <span className="tiny-dot" /> Aqui, sentir também faz parte.
              </span>
              <button
                className="text-button"
                disabled={!selected}
                onClick={saveMood}
              >
                {mood ? "Atualizar check-in" : "Adaptar meu dia"}{" "}
                <ArrowRight size={15} />
              </button>
            </div>
          </section>
          <section className="study-section">
            <div className="section-heading">
              <div>
                <h2>Um passo de cada vez</h2>
                <p className="muted">
                  {mood === "tired" || mood === "overwhelmed"
                    ? "Hoje o plano é leve. Você merece esse cuidado."
                    : !isStudyDay
                      ? "Hoje é seu dia livre. Estas atividades são opcionais."
                      : "Seu plano de hoje, pensado para você."}
                </p>
              </div>
              <button
                className="text-button"
                onClick={() => navigate("Cronograma")}
              >
                Ver cronograma <ArrowUpRight size={15} />
              </button>
            </div>
            {!plan.length && <div className="card rest-message"><Leaf size={25}/><h3>Hoje tem espaço para descansar.</h3><p className="muted">Seu próximo assunto está no cronograma. Quer estudar algo por conta própria?</p><button className="text-button" onClick={()=>navigate("Revisões")}>Registrar assunto estudado <ArrowRight size={16}/></button></div>}
            <div className="task-list">
              {plan.map((t, i) => (
                <article className="task-row" key={t.id}>
                  <button
                    className={`task-check ${done.includes(t.id) ? "checked" : ""}`}
                    aria-label={`${done.includes(t.id) ? "Desmarcar" : "Concluir"} ${t.subject}`}
                    onClick={() => {
                      if(done.includes(t.id)) setCompleted(v=>({...v,[today]:done.filter(d=>d!==t.id)}));
                      else onStudy(t);
                    }}
                  >
                    {done.includes(t.id) ? <Check size={14} /> : null}
                  </button>
                  <span className={`subject-symbol ${t.tone}`}>
                    <BookOpen size={19} />
                  </span>
                  <div className="task-copy">
                    <strong>{t.subject}</strong>
                    <p>{t.title}</p><small className="task-detail">{t.start}–{t.end} · {t.description}</small>
                  </div>
                  <span className={`badge ${t.tone}`}>{t.kind}</span>
                  <span className="task-time">
                    <Clock3 size={13} />
                    {t.minutes} min
                  </span>
                  <button
                    className="icon-button start-task"
                    aria-label={`Estudar ${t.subject}`}
                    onClick={() => navigate("Área de foco", t)}
                  >
                    <Play size={15} />
                  </button>
                </article>
              ))}
            </div>
            <p className="plan-footnote">
              {done.filter((id) => plan.some((t) => t.id === id)).length} de{" "}
              {plan.length} atividades concluídas <span>·</span> {total} min
              sugeridos{" "}
              {mood && (mood === "tired" || mood === "overwhelmed")
                ? "· plano leve"
                : ""}
            </p>
          </section>
          <section className="gentle-note">
            <span>✧</span>
            <p>
              Você é muito mais do que uma nota.
              <br />
              <strong>Estamos aqui pelo caminho inteiro.</strong>
            </p>
            <Leaf size={32} strokeWidth={1} />
          </section>
        </div>
        <aside className="dashboard-aside">
          <section className="card calendar-card">
            <div className="section-heading">
              <h2>Seu calendário</h2>
              <button
                className="icon-button"
                aria-label="Abrir calendário"
                onClick={() => navigate("Calendário")}
              >
                <ArrowUpRight size={17} />
              </button>
            </div>
            <MiniCalendar events={favs} onOpen={() => navigate("Calendário")} />
            <div className="calendar-legend">
              <i /> Hoje <i className="event-dot" /> Inscrições favoritas
            </div>
            <div className="aside-events">
              <span className="eyebrow">NO SEU RADAR</span>
              {favs.length ? (
                favs.slice(0, 2).map((u) => (
                  <div className="aside-event" key={u.id}>
                    <span className="event-date">
                      {Number(u.opens.slice(8, 10))}
                      <small>
                        {new Date(u.opens + "T12:00:00").toLocaleDateString(
                          "pt-BR",
                          { month: "short" },
                        )}
                      </small>
                    </span>
                    <div>
                      <strong>{u.acronym}</strong>
                      <p>Abertura de inscrições*</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="muted">
                  Favorite uma universidade e veja as inscrições por aqui.
                </p>
              )}
              <button
                className="text-button"
                onClick={() => navigate("Vestibulares")}
              >
                {favs.length
                  ? "Explorar vestibulares"
                  : "Encontrar meu próximo passo"}{" "}
                <ArrowRight size={14} />
              </button>
            </div>
          </section>
          <section className="journey-card">
            <div className="section-heading">
              <span className="eyebrow">SUA JORNADA</span>
              <span className="level-badge">
                NÍVEL {Math.floor(stats.xp / 100) + 1}
              </span>
            </div>
            <div className="journey-title">
              <div className="mini-owl">•ᴗ•</div>
              <div>
                <h3>Todo esforço floresce.</h3>
                <p>{studentType(profile)}</p>
              </div>
            </div>
            <div className="xp-label">
              <span>{stats.xp % 100} / 100 XP</span>
              <span>Próximo nível</span>
            </div>
            <div className="progress-track">
              <i style={{ width: `${stats.xp % 100}%` }} />
            </div>
            <button
              className="text-button"
              onClick={() => navigate("Meu perfil")}
            >
              Cuidar do meu Wizi <ArrowRight size={14} />
            </button>
          </section>
          <section className="focus-teaser">
            <span className="small-icon white">
              <BookOpen size={20} />
            </span>
            <h3>Um momento só seu.</h3>
            <p>
              Menos distrações.
              <br />
              Mais espaço para aprender.
            </p>
            <button
              className="button secondary"
              onClick={() => navigate("Área de foco")}
            >
              <Play size={15} /> Entrar em foco
            </button>
            <div className="teaser-orbit" />
          </section>
        </aside>
      </div>
    </>
  );
}
