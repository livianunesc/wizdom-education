import { useState } from 'react';
import { CalendarDays, Clock3, ArrowLeft, ArrowRight, Play, Check, Leaf, Sparkles, Target, Coffee } from 'lucide-react';
import { makePlan, planDetails, dayKey, weekdays } from '../lib.js';
import './schedule.css';

export default function Schedule({ profile, mood, navigate, onEdit, onStudy, completed = {}, scheduled = [], setScheduled }) {
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState((new Date().getDay() + 6) % 7);
  const now = new Date();
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7) + offset * 7);
  const dates = Array.from({ length: 7 }, (_, i) => new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i));
  const date = dates[selected];
  const info = planDetails(profile, date);
  const planFor = d => {
    const key = dayKey(d);
    const base = makePlan(profile, key === dayKey(now) ? mood : 'okay', d);
    return [...base.filter(task => !scheduled.some(item => item.id === task.id)), ...scheduled.filter(item => item.date === key)];
  };
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');
  function saveEdit(event) {
    event.preventDefault();
    const destination = new Date(editing.date + 'T12:00:00');
    const used = planFor(destination).filter(task => task.id !== editing.id).reduce((sum, task) => sum + task.minutes + task.breakAfter, 0);
    if (used + editing.minutes > planDetails(profile, destination).minutes) {
      setMessage('O tempo diário seria ultrapassado. Reduza o bloco ou escolha um dia mais livre.');
      return;
    }
    setScheduled(items => [...items.filter(item => item.id !== editing.id), { ...editing, start: 'Flexível', end: '', breakAfter: 0 }]);
    setEditing(null);
    setMessage('Bloco atualizado.');
  }
  const tasks = planFor(date);
  const weekPlans = dates.map(planFor);
  const weekMinutes = weekPlans.flat().reduce((sum, task) => sum + task.minutes + task.breakAfter, 0);
  const studied = completed[dayKey(date)] || [];
  const future = dayKey(date) > dayKey(now);
  return <div className="schedule-page">
    <header className="page-heading schedule-heading">
      <span className="schedule-heading-icon"><CalendarDays size={29} aria-hidden="true"/></span>
      <div className="schedule-heading-copy"><h1>Meu cronograma</h1><p className="muted">Organize seus blocos de estudo para {profile.course}.</p></div>
      <button className="button secondary" onClick={onEdit}>Ajustar minha rotina <Target size={16} aria-hidden="true"/></button>
    </header>
    <section className="plan-personalized">
      <div className="plan-personalized-icon"><Target size={24} aria-hidden="true"/></div>
      <div className="plan-personalized-copy">
        <h2>{info.phase}</h2>
        {profile.target && <p>Edição pretendida {profile.target.edition}{profile.target.date && ` · Data pessoal: ${profile.target.date}`}</p>}
        <p>{profile.days?.length || 0} dias por semana · {info.minutes} min por dia com pausas · {profile.routine || 'Horários flexíveis'}</p>
      </div>
      <div className="plan-week-total"><strong>{Math.floor(weekMinutes / 60)}h {weekMinutes % 60}min</strong><span>Planejados nesta semana</span></div>
    </section>
    <details className="plan-rationale"><summary>Como seu formulário virou este plano?</summary><ul>{info.explanation.map((line) => <li key={line}>{line}</li>)}</ul><p>Horários são sugestões editáveis pela sua rotina. O plano é uma trilha inicial de fundamentos: não promete aprovação nem substitui um curso completo.</p></details>
    {message && <p role="status">{message}</p>}
    {editing && <form className="card notebook-panel" onSubmit={saveEdit}><h2>Editar bloco</h2><div className="notebook-grid">
      <label>Atividade<input required value={editing.title} onChange={event => setEditing({ ...editing, title: event.target.value })}/></label>
      <label>Data do bloco<input type="date" required min={dayKey(now)} value={editing.date} onChange={event => setEditing({ ...editing, date: event.target.value })}/></label>
      <label>Minutos do bloco<input type="number" required min="1" max="480" value={editing.minutes} onChange={event => setEditing({ ...editing, minutes: event.target.valueAsNumber })}/></label>
      </div><div className="notebook-actions"><button className="button primary">Salvar bloco</button><button type="button" className="button secondary" onClick={() => setEditing(null)}>Cancelar edição</button></div></form>}
    <section className="card plan-week">
      <div className="section-heading"><div><span className="eyebrow">SUA SEMANA</span><h2>{dates[0].toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} — {dates[6].toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}</h2></div><div className="inline-actions">
        <button className="icon-button" aria-label="Semana anterior" onClick={() => setOffset((x) => x - 1)}><ArrowLeft size={18}/></button>
        <button className="button secondary" onClick={() => { setOffset(0); setSelected((now.getDay() + 6) % 7); }}>Hoje</button>
        <button className="icon-button" aria-label="Próxima semana" onClick={() => setOffset((x) => x + 1)}><ArrowRight size={18}/></button>
      </div></div>
      <div className="plan-day-grid">{dates.map((d, i) => <button key={dayKey(d)} className={`plan-day ${selected === i ? 'selected' : ''} ${dayKey(d) === dayKey(now) ? 'is-today' : ''}`} aria-pressed={selected === i} onClick={() => setSelected(i)}>
        <span>{weekdays[d.getDay()]}</span><strong>{d.getDate()}</strong>
        {weekPlans[i].length ? <><small>{weekPlans[i].reduce((s, t) => s + t.minutes + t.breakAfter, 0)} min</small><span className="plan-day-dots">{[...new Set(weekPlans[i].map((t) => t.subject))].slice(0, 4).map((subject, j) => <i key={subject} className={['lavender', 'mint', 'peach', 'blue'][j]} title={subject}/>)}</span></> : <><small>Descanso</small><Leaf size={15}/></>}
      </button>)}</div>
    </section>
    <div className="section-heading plan-date-title"><div><h2>{date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</h2></div><span className="badge"><CalendarDays size={14}/>{tasks.length} blocos</span></div>
    {tasks.length ? <div className="plan-task-list">{tasks.map(task => <div key={task.id}>
      <article className={`card plan-task ${studied.includes(task.id) ? 'is-complete' : ''}`}>
        <div className="plan-task-time"><span>{task.start}</span><i/><span>{task.end}</span></div>
        <div className="plan-task-body"><div className="plan-task-meta"><span className={`badge ${task.tone}`}>{task.subject}</span><span><Clock3 size={13}/>{task.minutes} min · {task.kind}</span>{studied.includes(task.id) && <span className="plan-completed-label"><Check size={14}/>Estudado</span>}</div><h3>{task.title}</h3><p>{task.description}</p><div className="plan-activity"><strong>Na prática</strong><p>{task.activity}</p></div></div>
        <div className="plan-task-actions">{task.source && <a className="button secondary" href={task.source} target="_blank" rel="noreferrer">Consultar prova oficial</a>}{task.library && <button className="button secondary" onClick={() => navigate('Provas anteriores')}>Abrir acervo do INEP</button>}{!studied.includes(task.id) && <button className="button secondary" onClick={() => { setEditing(task); setMessage(''); window.scrollTo(0, 0); }}>Editar ou mover</button>}<button className="button primary" onClick={() => navigate('Área de foco', task)}><Play size={15}/>Começar foco</button>{onStudy && <button className="button secondary" disabled={future || studied.includes(task.id)} title={future ? 'Registre o estudo no dia em que ele acontecer.' : undefined} onClick={() => onStudy(task)}><Check size={15}/>{studied.includes(task.id) ? 'Revisão liberada' : 'Já estudei'}</button>}</div>
      </article>
      {task.breakAfter > 0 && <div className="plan-break"><Coffee size={14}/>{task.breakAfter} min de pausa · água, alongamento e um respiro</div>}
    </div>)}</div> : <section className="card plan-rest"><Leaf size={33} aria-hidden="true"/><h2>Dia sem blocos de estudo</h2><p>Selecione outro dia da semana para ver os blocos programados.</p><button className="button secondary" onClick={onEdit}>Mudar dias de estudo</button></section>}
    <div className="soft-info"><Sparkles size={20}/><p>Ao marcar um assunto como estudado, você libera flashcards dele em Revisões. Acertos e erros ajudam a organizar a próxima revisão.</p></div>
  </div>;
}
