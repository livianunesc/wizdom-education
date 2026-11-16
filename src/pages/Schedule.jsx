import { useState } from 'react';
import { CalendarDays, Clock3, ArrowLeft, ArrowRight, Play, Check, Leaf, Sparkles, Target, Coffee } from 'lucide-react';
import { makePlan, planDetails, dayKey, weekdays } from '../lib.js';
import './schedule.css';

export default function Schedule({ profile, mood, navigate, onEdit, onStudy, completed = {} }) {
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState((new Date().getDay() + 6) % 7);
  const now = new Date();
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7) + offset * 7);
  const dates = Array.from({ length: 7 }, (_, i) => new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i));
  const date = dates[selected];
  const info = planDetails(profile, date);
  const planFor = (d) => makePlan(profile, dayKey(d) === dayKey(now) ? mood : 'okay', d);
  const tasks = planFor(date);
  const weekPlans = dates.map(planFor);
  const weekMinutes = weekPlans.flat().reduce((sum, task) => sum + task.minutes + task.breakAfter, 0);
  const studied = completed[dayKey(date)] || [];
  const future = dayKey(date) > dayKey(now);
  return <div className="schedule-page">
    <div className="page-heading">
      <div><span className="eyebrow">UM CAMINHO QUE É SEU</span><h1>Menos dúvida. Mais direção.</h1><p className="muted">Seu cronograma para {profile.course}, com assuntos, prática e tempo para respirar.</p></div>
      <button className="button secondary" onClick={onEdit}>Ajustar minha rotina <Target size={16}/></button>
    </div>
    <section className="plan-personalized">
      <div className="plan-personalized-icon"><Sparkles size={26}/></div>
      <div><span className="eyebrow">FEITO A PARTIR DAS SUAS RESPOSTAS</span><h2>{info.phase}</h2><p>{profile.days?.length || 0} dias por semana · {info.minutes} min por dia com pausas · {profile.routine || 'Horários flexíveis'}</p></div>
      <div className="plan-week-total"><strong>{Math.floor(weekMinutes / 60)}h {weekMinutes % 60}min</strong><span>planejados nesta semana</span></div>
    </section>
    <details className="plan-rationale"><summary>Como seu formulário virou este plano?</summary><ul>{info.explanation.map((line) => <li key={line}>{line}</li>)}</ul><p>Horários são sugestões editáveis pela sua rotina. O plano é uma trilha inicial de fundamentos: não promete aprovação nem substitui um curso completo.</p></details>
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
    <div className="section-heading plan-date-title"><div><span className="eyebrow">{dayKey(date) === dayKey(now) ? 'HOJE É UM BOM DIA PARA COMEÇAR' : 'UM PASSO DE CADA VEZ'}</span><h2>{date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</h2></div><span className="badge"><CalendarDays size={14}/>{tasks.length} blocos</span></div>
    {tasks.length ? <div className="plan-task-list">{tasks.map((task, i) => <div key={task.id}>
      <article className={`card plan-task ${studied.includes(task.id) ? 'is-complete' : ''}`}>
        <div className="plan-task-time"><span>{task.start}</span><i/><span>{task.end}</span></div>
        <div className="plan-task-body"><div className="plan-task-meta"><span className={`badge ${task.tone}`}>{task.subject}</span><span><Clock3 size={13}/>{task.minutes} min · {task.kind}</span>{studied.includes(task.id) && <span className="plan-completed-label"><Check size={14}/>Estudado</span>}</div><h3>{task.title}</h3><p>{task.description}</p><div className="plan-activity"><strong>Na prática</strong><p>{task.activity}</p></div></div>
        <div className="plan-task-actions"><button className="button primary" onClick={() => navigate('Área de foco', task)}><Play size={15}/>Começar foco</button>{onStudy && <button className="button secondary" disabled={future || studied.includes(task.id)} title={future ? 'Registre o estudo no dia em que ele acontecer.' : undefined} onClick={() => onStudy(task)}><Check size={15}/>{studied.includes(task.id) ? 'Revisão liberada' : 'Já estudei'}</button>}</div>
      </article>
      {task.breakAfter > 0 && <div className="plan-break"><Coffee size={14}/>{task.breakAfter} min de pausa · água, alongamento e um respiro</div>}
    </div>)}</div> : <section className="card plan-rest"><Leaf size={40}/><h2>Hoje também cabe descansar.</h2><p>Você não escolheu este dia no formulário. Sua próxima sessão está nos dias marcados acima.</p><button className="button secondary" onClick={onEdit}>Mudar dias de estudo</button></section>}
    <div className="soft-info"><Sparkles size={20}/><p>Ao marcar um assunto como estudado, você libera flashcards dele em Revisões. Acertos e erros ajudam a organizar a próxima revisão.</p></div>
  </div>;
}
