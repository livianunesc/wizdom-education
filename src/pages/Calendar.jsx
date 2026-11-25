import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Heart,
  Bookmark,
} from "lucide-react";
import { universities, formatDate } from "../opportunities-data";
import "./opportunities.css";

export default function Calendar({ favorites = [], profile = {}, scheduled = [] }) {
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selected, setSelected] = useState(new Date().getDate());
  const [view, setView] = useState("month");
  const today = new Date();
  const dateKey = (day) =>
    `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const events = universities.filter((u) => favorites.includes(u.id) && u.opens);
  const monthEvents = events
    .filter((u) => u.opens.startsWith(dateKey(1).slice(0, 7)))
    .sort((a, b) => a.opens.localeCompare(b.opens));
  const offset = (month.getDay() + 6) % 7;
  const length = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate();
  const cells = Array.from(
    { length: Math.ceil((offset + length) / 7) * 7 },
    (_, i) => i - offset + 1,
  );
  const custom = scheduled.filter(task => task.date === dateKey(selected));
  const personalTarget = profile.target?.date === dateKey(selected);
  const selectedEvents = events.filter((u) => u.opens === dateKey(selected));
  function move(n) {
    setMonth((d) => new Date(d.getFullYear(), d.getMonth() + n, 1));
    setSelected(1);
  }
  const studyDays = profile.days || [];
  const weekdayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const planned = (day) => {
    const weekday = new Date(
      month.getFullYear(),
      month.getMonth(),
      day,
    ).getDay();
    return studyDays.some((s) =>
      typeof s === "number"
        ? s === weekday
        : String(s).toLowerCase().slice(0, 3) ===
          weekdayNames[weekday].toLowerCase(),
    );
  };
  return (
    <div className="calendar-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">UM DIA DE CADA VEZ</span>
          <h1>Seu calendário</h1>
          <p className="muted">
            Espaço para seus estudos, seus sonhos e suas pausas.
          </p>
        </div>
        <button
          className="button secondary"
          onClick={() => {
            setMonth(new Date(today.getFullYear(), today.getMonth(), 1));
            setSelected(today.getDate());
          }}
        >
          Hoje
        </button>
      </div>
      <div className="calendar-layout">
        <section className="card calendar-main">
          <div className="calendar-toolbar">
            <div className="calendar-month-title">
              <button
                className="icon-button"
                aria-label="Mês anterior"
                onClick={() => move(-1)}
              >
                <ChevronLeft size={19} />
              </button>
              <h2>
                {month.toLocaleDateString("pt-BR", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <button
                className="icon-button"
                aria-label="Próximo mês"
                onClick={() => move(1)}
              >
                <ChevronRight size={19} />
              </button>
            </div>
            <div className="calendar-view-toggle">
              <button
                className={view === "month" ? "active" : ""}
                onClick={() => setView("month")}
              >
                Mês
              </button>
              <button
                className={view === "list" ? "active" : ""}
                onClick={() => setView("list")}
              >
                Agenda
              </button>
            </div>
          </div>
          {view === "month" ? (
            <>
              <div className="calendar-weekdays">
                {["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
              <div className="calendar-day-grid">
                {cells.map((day, index) => {
                  if (day < 1 || day > length)
                    return (
                      <div className="calendar-blank" key={`blank-${index}`} />
                    );
                  const dayEvents = events.filter(
                    (e) => e.opens === dateKey(day),
                  );
                  const hasCustom = profile.target?.date === dateKey(day) || scheduled.some(task => task.date === dateKey(day));
                  const isToday =
                    day === today.getDate() &&
                    month.getMonth() === today.getMonth() &&
                    month.getFullYear() === today.getFullYear();
                  return (
                    <button
                      key={day}
                      className={`calendar-day ${selected === day ? "selected" : ""} ${isToday ? "today" : ""}`}
                      aria-label={`${day} de ${month.toLocaleDateString("pt-BR", { month: "long" })}${dayEvents.length ? `, ${dayEvents.length} inscrição` : ""}`}
                      aria-pressed={selected === day}
                      onClick={() => setSelected(day)}
                    >
                      <span className="calendar-date-number">{day}</span>
                      {dayEvents.map((e) => (
                        <span className="calendar-event-chip" key={e.id}>
                          {e.acronym}
                          <span> · inscrições</span>
                        </span>
                      ))}
                      {(planned(day) || hasCustom) && (
                        <span className="calendar-study-dot">
                          <i /> <span>Dia de estudar</span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="calendar-legend">
                <span>
                  <i className="legend-lavender" /> Abertura de inscrições
                </span>
                <span>
                  <i className="legend-mint" /> Sua rotina de estudos
                </span>
              </div>
            </>
          ) : (
            <div className="calendar-list-view">
              {monthEvents.length ? (
                monthEvents.map((e) => (
                  <div className="calendar-list-event" key={e.id}>
                    <div className="calendar-event-day">
                      <strong>
                        {new Date(`${e.opens}T12:00:00`).getDate()}
                      </strong>
                      <span>{formatDate(e.opens, { month: "short" })}</span>
                    </div>
                    <div>
                      <h3>{e.acronym} · inscrições</h3>
                      <p className="muted">
                        {e.course} · {e.entry}
                      </p>
                    </div>
                    <a
                      href={e.link}
                      target="_blank"
                      rel="noreferrer"
                      className="button secondary"
                    >
                      Portal oficial <ArrowRight size={15} />
                    </a>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <CalendarDays size={30} />
                  <h3>Um mês com espaço para planejar.</h3>
                  <p>
                    As inscrições das universidades favoritas aparecem aqui.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
        <aside className="calendar-side">
          <section className="card calendar-selected">
            <span className="eyebrow">
              {selected} DE{" "}
              {month
                .toLocaleDateString("pt-BR", { month: "long" })
                .toUpperCase()}
            </span>
            <h2>Seu dia, com calma</h2>
            {selectedEvents.length ? (
              selectedEvents.map((e) => (
                <div className="calendar-side-event" key={e.id}>
                  <Bookmark size={18} />
                  <div>
                    <strong>Inscrições {e.acronym}</strong>
                    <p>{e.course}</p>
                    <a href={e.link} target="_blank" rel="noreferrer">
                      Ver portal oficial <ArrowRight size={13} />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="calendar-no-events">
                <CalendarDays size={27} />
                <p>Nenhuma inscrição salva para este dia.</p>
                <small>
                  Favorite universidades na aba Vestibulares para acompanhar as
                  datas.
                </small>
              </div>
            )}
            {personalTarget && <p><strong>Data pessoal de planejamento</strong> · {profile.course}</p>}
            {custom.length > 0 && <ul>{custom.map(task => <li key={task.id}>{task.title} · {task.minutes} min</li>)}</ul>}
            {planned(selected) && (
              <div className="calendar-study-notice">
                <BookOpen size={19} />
                <div>
                  <strong>Seu encontro com os estudos</strong>
                  <p>
                    Um dos dias que você escolheu no seu plano. Respeite seu
                    ritmo.
                  </p>
                </div>
              </div>
            )}
          </section>
          <section className="calendar-kind-note">
            <Heart size={21} />
            <h3>O descanso também faz parte.</h3>
            <p>
              Você não precisa preencher todos os espaços para estar no caminho
              certo.
            </p>
          </section>
          <p className="op-data-note">
            Confira no edital oficial as datas que ainda não aparecem aqui.
          </p>
        </aside>
      </div>
    </div>
  );
}
