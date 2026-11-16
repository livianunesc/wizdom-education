import { useState } from 'react';
import { BookOpen, ArrowRight, Check, X, Flame, Target, Layers, RotateCcw, Sparkles, Plus, Clock3 } from 'lucide-react';
import Select from '../Select.jsx';
import { topics, topicById } from '../curriculum.js';
import { flashcards } from '../flashcards-data.js';
import { dayKey } from '../lib.js';
import { learningState, streakFor, recordAnswer, noteActivity } from '../learning.js';
import Celebration, { StreakWeek } from '../Celebration.jsx';
import './reviews.css';

export default function Reviews({ learning: value, setLearning, stats, setStats, onStudy }) {
  const learning = learningState(value);
  const [topic, setTopic] = useState(topics[0]?.id || '');
  const [filter, setFilter] = useState('all');
  const [session, setSession] = useState(null);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [result, setResult] = useState(null);
  const unlocked = new Set(learning.topics.map(t=>t.topicId));
  const available = flashcards.filter(c=>unlocked.has(c.topicId));
  const filtered = available.filter(c=>filter==='all'||c.topicId===filter);
  const due = filtered.filter(c=>!learning.records[c.id]?.due || learning.records[c.id].due <= dayKey());
  const correct = learning.answers.filter(a=>a.correct).length;
  const errors = learning.answers.length - correct;
  const rate = learning.answers.length ? Math.round(100*correct/learning.answers.length) : null;
  const card = session && session.cards[session.index];
  function start(practice=false) {
    const cards = (practice ? filtered : due).slice(0,9);
    if (!cards.length) return;
    setSession({cards,index:0,correct:0,xp:0}); setSelected(null); setFeedback(null);
  }
  function answer() {
    if (selected === null || feedback) return;
    const isCorrect = selected === card.answer;
    const {state,xp} = recordAnswer(learning,card,isCorrect);
    setLearning(state);
    setStats(s=>({...noteActivity(s),xp:(s.xp||0)+xp}));
    setFeedback({correct:isCorrect,xp});
  }
  function next() {
    const summary={correct:session.correct+Number(feedback.correct),xp:session.xp+feedback.xp};
    if(session.index+1>=session.cards.length) {
      setResult({...summary,total:session.cards.length,title:'Sua sessão de flashcards está concluída.'}); setSession(null);
    } else setSession({...session,...summary,index:session.index+1});
    setSelected(null); setFeedback(null);
  }
  return <div className="reviews-page">
    <div className="page-heading"><div><span className="eyebrow">CONHECIMENTO QUE FICA</span><h1>Relembrar é evoluir<span className="accent-dot">.</span></h1><p className="muted">Do seu estudo para a memória. Uma pequena conquista por vez.</p></div><span className="badge peach"><Flame size={16}/>{streakFor(stats)} {streakFor(stats)===1?"dia":"dias"} de ofensiva</span></div>
    <div className="review-metrics"><div><span className="small-icon mint"><Target size={20}/></span><strong>{rate===null?'—':rate+'%'}</strong><span>taxa de acerto</span></div><div><span className="small-icon lavender"><Check size={20}/></span><strong>{correct}</strong><span>acertos</span></div><div><span className="small-icon pink"><RotateCcw size={20}/></span><strong>{errors}</strong><span>erros para aprender</span></div><div><span className="small-icon peach"><Layers size={20}/></span><strong>{due.length}</strong><span>cartões para hoje</span></div></div>
    {session ? <section className="review-session card">
      <div className="section-heading"><button className="text-button" onClick={()=>{setSession(null);setFeedback(null);}}>← Sair da revisão</button><span className="muted">{session.index+1} de {session.cards.length}</span></div>
      <div className="review-progress"><i style={{width:`${(session.index+1)/session.cards.length*100}%`}}/></div>
      <div className={`knowledge-card level-${card.level}`} key={card.id}><span className="badge white-badge">{topicById(card.topicId)?.subject} · {card.level}</span><div className="knowledge-decor" aria-hidden="true"><BookOpen size={70}/></div><small>{topicById(card.topicId)?.title}</small><h2>{card.question}</h2><span className="knowledge-hint">Pense com calma. Aprender também é tentar.</span></div>
      <div className="answer-options">{card.options.map((option,i)=><button key={i} aria-pressed={selected===i} disabled={!!feedback} className={`${selected===i?'chosen':''} ${feedback&&i===card.answer?'correct':''} ${feedback&&selected===i&&!feedback.correct?'incorrect':''}`} onClick={()=>setSelected(i)}><span>{'ABCD'[i]}</span>{option}{feedback&&i===card.answer&&<Check size={20}/>}</button>)}</div>
      {feedback && <div className={`answer-feedback ${feedback.correct?'success':'retry'}`} role="status"><strong>{feedback.correct?'Acertou! Muito bem.':'Tudo bem errar. Vamos entender?'}</strong><p>{card.explanation}</p><small>Próxima revisão: {learning.records[card.id]?.due?.split('-').reverse().join('/')} · +{feedback.xp} XP</small></div>}
      <div className="review-session-footer"><span className="muted"><Sparkles size={16}/> {session.xp+(feedback?.xp||0)} XP nesta sessão</span>{feedback?<button className="button primary" onClick={next}>{session.index+1===session.cards.length?'Concluir revisão':'Próximo cartão'} <ArrowRight size={17}/></button>:<button className="button primary" onClick={answer} disabled={selected===null}>Conferir resposta <Check size={17}/></button>}</div>
    </section> : <div className="review-home-grid"><div>
      <section className="review-start-banner"><div><span className="eyebrow">SUA PRÓXIMA CONQUISTA</span><h2>Um pouco hoje.<br/>Muito mais na memória.</h2><p>{available.length?`${due.length} cartões esperam por você. Revise em sessões de até 9 perguntas.`:'Marque um assunto como estudado para desbloquear seus primeiros cartões.'}</p><div className="review-start-controls"><Select aria-label="Filtrar assunto da revisão" value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">Todos os assuntos estudados</option>{learning.topics.map(t=><option key={t.topicId} value={t.topicId}>{topicById(t.topicId)?.title || t.topicId}</option>)}</Select><button className="button primary" disabled={!due.length} onClick={()=>start()}>Revisar agora <ArrowRight size={17}/></button>{!!filtered.length&&!due.length&&<button className="button secondary" onClick={()=>start(true)}>Praticar novamente</button>}</div></div><div className="stacked-cards" aria-hidden="true"><div/><div/><div><BookOpen size={38}/><span>Uma ideia.<br/>Uma descoberta.</span><b>✦</b></div></div></section>
      <section className="card register-study"><div className="section-heading"><div><h2>O que você estudou?</h2><p className="muted">Traga também os assuntos que estudou fora da plataforma.</p></div><Plus size={22}/></div><Select aria-label="Assunto estudado" value={topic} onChange={e=>setTopic(e.target.value)}>{topics.map(t=><option key={t.id} value={t.id}>{t.subject} · {t.title}</option>)}</Select><button className="button secondary" onClick={()=>{onStudy({topicId:topic,...topicById(topic)},false);setFilter(topic);}}>Estudei este assunto <Check size={17}/></button><p className="muted review-note">Cada assunto libera 3 cartões autorais: fundamental, intermediário e desafiador.</p></section>
      <section className="card learned-topics"><h2>Sua trilha de conhecimento</h2>{learning.topics.length?<div className="learned-topic-grid">{learning.topics.map(t=>{const item=topicById(t.topicId);const cards=available.filter(c=>c.topicId===t.topicId);const count=cards.filter(c=>learning.records[c.id]).length;return <button key={t.topicId} onClick={()=>setFilter(t.topicId)} className={filter===t.topicId?'active':''}><span className="small-icon lavender"><BookOpen size={18}/></span><strong>{item?.title}</strong><small>{item?.subject} · {count}/3 cartões praticados</small><div className="progress-track"><i style={{width:`${count/3*100}%`}}/></div></button>})}</div>:<div className="review-empty"><Layers size={34}/><p>Sua trilha começa no primeiro assunto estudado.</p></div>}</section>
    </div><aside><section className="card streak-card"><span className="streak-flame"><Flame size={40} fill="currentColor"/></span><h2>{streakFor(stats)} {streakFor(stats)===1?"dia":"dias"} de ofensiva</h2><p className="muted">Estude, pratique ou conclua um minuto de foco para acender o dia.</p><StreakWeek stats={stats}/><div className="streak-goal"><strong>Próximo marco: {streakFor(stats)<7?7:streakFor(stats)<14?14:30} dias</strong><p>Seu ritmo tem valor, mesmo quando você recomeça.</p></div></section><section className="card spaced-note"><Clock3 size={24}/><h3>Revisar na hora certa</h3><p className="muted">Errou? O cartão volta amanhã. Acertou? Ele volta em 3 dias, depois 6, 12 e até 30 dias.</p><p className="muted">Você pode praticar antes. Cada cartão concede XP uma vez por dia.</p></section></aside></div>}
    {result&&<Celebration result={result} stats={stats} onClose={()=>setResult(null)}/>}
  </div>;
}
