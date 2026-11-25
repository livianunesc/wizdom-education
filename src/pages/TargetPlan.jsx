import { useState } from 'react';
import { makePlan, weekdays } from '../lib.js';
import { prioritiesFor, processes } from '../admissions.js';

export default function TargetPlan({ offer, profile, onApply }) {
  const [open, setOpen] = useState(false);
  const [edition, setEdition] = useState(String(new Date().getFullYear() + 1));
  const [date, setDate] = useState('');
  const [horizon, setHorizon] = useState('8');
  const target = { id: offer.id, processId: offer.processId, edition, date, horizon };
  const monday = new Date();
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return { date, tasks: makePlan({ ...profile, target, course: offer.course }, 'okay', date) };
  }).filter(item => item.tasks.length);
  if (!open) return <button className="button primary" onClick={() => setOpen(true)}>Usar como meu objetivo</button>;
  return <form className="notebook-panel" onSubmit={event => { event.preventDefault(); onApply(target); }}>
    <h3>Prévia do cronograma</h3>
    <div className="notebook-grid">
      <label>Edição pretendida <input required type="number" min="2000" max="2100" value={edition} onChange={event => setEdition(event.target.value)} /></label>
      <label>Horizonte <select value={horizon} onChange={event => setHorizon(event.target.value)}><option value="24">Semestre</option><option value="8">Oito semanas</option><option value="3">Reta final</option></select></label>
      <label>Data pessoal de planejamento <input type="date" value={date} onChange={event => setDate(event.target.value)} /></label>
    </div>
    <p>Recomendação de estudo para {offer.entry}, edição pretendida {edition}. Confira o formato da edição com a organização.</p>
    <ol>{prioritiesFor(offer.processId).map(item => <li key={item}>{item}</li>)}</ol>
    <ul>{days.map(({ date, tasks }) => <li key={date.toISOString()}>{weekdays[date.getDay()]} · {tasks.reduce((total, task) => total + task.minutes + task.breakAfter, 0)} min com pausas · {tasks[0].title}</li>)}</ul>
    {processes[offer.processId].archive && <p><a href={processes[offer.processId].archive} target="_blank" rel="noreferrer">Consultar provas oficiais</a></p>}
    <button className="button primary">Aplicar plano</button>
  </form>;
}
