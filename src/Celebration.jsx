import { Flame, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { dayKey, weekdays } from './lib.js';
import { activeDates, streakFor } from './learning.js';
export function Confetti() {
  return <div className="confetti" aria-hidden="true">{Array.from({length: 26}, (_,i) => <i key={i} style={{'--i':i, '--color':['#7961cb','#f3ac57','#86b9ab','#db80ac','#91bfe5'][i%5]}} />)}</div>;
}
export function StreakWeek({stats}) {
  const dates = activeDates(stats);
  return <div className="streak-week">{Array.from({length:7},(_,i)=>{ const d=new Date(); d.setDate(d.getDate()-6+i); const active=dates.has(dayKey(d)); return <div key={i} className={active?'lit':''}><span>{weekdays[d.getDay()]}</span><b><Flame size={20} fill={active?'currentColor':'none'}/></b></div>; })}</div>;
}
export default function Celebration({result, stats, onClose}) {
  return <div className="modal-backdrop"><section className="modal celebration" role="dialog" aria-modal="true" aria-labelledby="celebration-title"><Confetti/><span className="celebration-trophy"><Trophy size={55}/></span><span className="eyebrow">UM PASSO QUE MERECE FESTA</span><h2 id="celebration-title">Você fez acontecer!</h2><p>{result.title || 'Mais conhecimento para levar com você.'}</p><div className="celebration-numbers"><div><strong>+{result.xp || 0}</strong><span>XP conquistados</span></div>{result.total !== undefined && <div><strong>{result.correct}/{result.total}</strong><span>respostas certas</span></div>}<div><strong><Flame size={24}/>{streakFor(stats)}</strong><span>dias de ofensiva</span></div></div><StreakWeek stats={stats}/><p className="muted">Um dia de cada vez. Seu progresso fica com você.</p><button className="button primary" onClick={onClose}>Guardar essa conquista <ArrowRight size={17}/></button></section></div>;
}
