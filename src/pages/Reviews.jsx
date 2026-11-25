import { useState } from 'react';
import {
  ArrowRight, BookOpen, Check, Clock3, Flame, Layers, ListChecks, RotateCcw, Sparkles, Target,
} from 'lucide-react';
import Celebration, { StreakWeek } from '../Celebration.jsx';
import Select from '../Select.jsx';
import { curriculum, topics, topicById } from '../curriculum.js';
import { flashDeck } from '../flash-round.js';
import { flashcards } from '../flashcards-data.js';
import { learningState, noteActivity, recordAnswer, streakFor } from '../learning.js';
import { dayKey } from '../lib.js';
import { credit } from '../rewards.js';
import FlashRound from './FlashRound.jsx';
import './reviews.css';

export default function Reviews({
  learning: value, setLearning, stats, setStats, onStudy, authenticated, initialMode, initialTopic, initialLevel,
}) {
  const learning = learningState(value);
  const entryTopic = topicById(initialTopic);
  const unlocked = new Set(learning.topics.map(item => item.topicId));
  const available = flashcards.filter(card => unlocked.has(card.topicId) || learning.records[card.id]);
  const reviewTopics = [...new Set(available.map(card => card.topicId))];
  const [mode, setMode] = useState(initialMode === 'flash' ? 'flash' : 'questions');
  const [topic, setTopic] = useState(entryTopic?.id || topics[0].id);
  const [subject, setSubject] = useState(entryTopic?.subject || Object.keys(curriculum)[0]);
  const [filter, setFilter] = useState(reviewTopics.includes(initialTopic) ? initialTopic : 'all');
  const [session, setSession] = useState(null);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [result, setResult] = useState(null);
  const filtered = available.filter(card => filter === 'all' || card.topicId === filter);
  const due = filtered.filter(card => !learning.records[card.id]?.due || learning.records[card.id].due <= dayKey());
  const correct = learning.answers.filter(answer => answer.correct).length;
  const errors = learning.answers.length - correct;
  const rate = learning.answers.length ? Math.round(100 * correct / learning.answers.length) : null;
  const card = session?.cards[session.index];
  const cardTopic = card && topicById(card.topicId);
  const streak = streakFor(stats);
  const entryCards = entryTopic
    ? flashcards.filter(card => card.topicId === entryTopic.id && (!initialLevel || card.level === initialLevel))
    : [];

  function start(cards) {
    if (!cards.length) return;
    setSession({ cards: cards.slice(0, 9), index: 0, correct: 0, xp: 0 });
    setSelected(null);
    setFeedback(null);
    window.scrollTo(0, 0);
  }

  function answer() {
    if (selected === null || feedback) return;
    const isCorrect = selected === card.answer;
    const { state, xp } = recordAnswer(learning, card, isCorrect);
    setLearning(state);
    const day = dayKey();
    setStats(current => {
      const earned = credit(noteActivity(current), { id: `question:${day}:${card.id}`, xp, label: 'Questão · ' + cardTopic?.subject, day });
      return authenticated
        ? credit(earned, { id: 'review:' + day, xp: 5, coins: 2, label: 'Missão diária · revisar um assunto', day })
        : earned;
    });
    setFeedback({ correct: isCorrect, xp });
  }

  function next() {
    const summary = { correct: session.correct + Number(feedback.correct), xp: session.xp + feedback.xp };
    if (session.index + 1 >= session.cards.length) {
      setResult({ ...summary, total: session.cards.length, title: 'Sua revisão está concluída.' });
      setSession(null);
    } else {
      setSession({ ...session, ...summary, index: session.index + 1 });
    }
    setSelected(null);
    setFeedback(null);
  }

  return (
    <div className="reviews-page">
      <div className="page-heading">
        <div>
          <h1>Questões e revisões</h1>
          <p className="muted">Pratique por assunto ou teste sua memória em uma rodada rápida.</p>
        </div>
        <span className="review-streak"><Flame size={17} /> {streak} {streak === 1 ? 'dia' : 'dias'} de ofensiva</span>
      </div>

      {mode === 'questions' && !session && entryCards.length > 0 && (
        <section className="card review-start-banner review-entry">
          <div>
            <h2>{entryTopic.title}</h2>
            <p className="muted">{entryTopic.subject}{initialLevel && ` · ${initialLevel}`}</p>
          </div>
          <button className="button primary" onClick={() => start(entryCards)}>Começar prática <ArrowRight size={17} /></button>
        </section>
      )}

      {!session && (
        <div className="review-mode-grid" role="group" aria-label="Modo de prática">
          <button className="review-mode question-mode" aria-pressed={mode === 'questions'} aria-label="Questões" aria-controls="question-practice" onClick={() => setMode('questions')}>
            <span className="review-mode-copy">
              <strong>Questões</strong>
              <span>{flashcards.length} exercícios autorais</span>
              <small>Pratique por assunto e confira as explicações.</small>
            </span>
            <span className="review-mode-art" aria-hidden="true"><ListChecks size={44} strokeWidth={1.6} /></span>
            <ArrowRight className="review-mode-arrow" size={18} aria-hidden="true" />
          </button>
          <button className="review-mode flash-mode" aria-pressed={mode === 'flash'} aria-label="Flashcards com tempo" aria-controls="flash-practice" onClick={() => setMode('flash')}>
            <span className="review-mode-copy">
              <strong>Flashcards com tempo</strong>
              <span>{flashDeck.length} cartões de memória</span>
              <small>Responda contra o relógio ou pratique no seu ritmo.</small>
            </span>
            <span className="review-mode-art" aria-hidden="true"><Clock3 size={43} strokeWidth={1.6} /></span>
            <ArrowRight className="review-mode-arrow" size={18} aria-hidden="true" />
          </button>
        </div>
      )}

      <div id="flash-practice" hidden={mode !== 'flash'}>
        {mode === 'flash' && <FlashRound stats={stats} setStats={setStats} />}
      </div>

      <div id="question-practice" hidden={mode !== 'questions'}>
        {mode === 'questions' && (session ? (
          <section className="card review-session">
            <div className="section-heading">
              <button className="text-button" onClick={() => setSession(null)}>← Sair da revisão</button>
              <span className="muted">{session.index + 1} de {session.cards.length}</span>
            </div>
            <div className="review-progress" aria-hidden="true">
              <i style={{ width: `${(session.index + 1) / session.cards.length * 100}%` }} />
            </div>
            <div className="knowledge-card" key={card.id}>
              <span className="badge white-badge">{cardTopic?.subject} · {card.level}</span>
              <div className="knowledge-decor" aria-hidden="true"><BookOpen size={70} /></div>
              <small>{cardTopic?.title}</small>
              <h2>{card.question}</h2>
            </div>
            <div className="answer-options">
              {card.options.map((option, index) => (
                <button key={option} aria-pressed={selected === index} disabled={!!feedback}
                  className={`${selected === index ? 'chosen' : ''} ${feedback && index === card.answer ? 'correct' : ''} ${feedback && selected === index && !feedback.correct ? 'incorrect' : ''}`}
                  onClick={() => setSelected(index)}>
                  <span>{'ABCD'[index]}</span>{option}{feedback && index === card.answer && <Check size={20} />}
                </button>
              ))}
            </div>
            {feedback && (
              <div className={`answer-feedback ${feedback.correct ? 'success' : 'retry'}`} role="status">
                <strong>{feedback.correct ? 'Acertou! Muito bem.' : 'Tudo bem errar. Vamos entender?'}</strong>
                <p>{card.explanation}</p>
                <small>Próxima revisão: {learning.records[card.id]?.due?.split('-').reverse().join('/')} · +{feedback.xp} XP</small>
              </div>
            )}
            <div className="review-session-footer">
              <span className="muted"><Sparkles size={16} /> {session.xp + (feedback?.xp || 0)} XP nesta sessão</span>
              {feedback
                ? <button className="button primary" onClick={next}>{session.index + 1 === session.cards.length ? 'Concluir revisão' : 'Próximo cartão'} <ArrowRight size={17} /></button>
                : <button className="button primary" onClick={answer} disabled={selected === null}>Conferir resposta <Check size={17} /></button>}
            </div>
          </section>
        ) : (
          <>
            <div className="review-metrics" aria-label="Seu desempenho em questões">
              <div><span className="small-icon"><Target size={20} /></span><strong>{rate === null ? '—' : rate + '%'}</strong><span>taxa de acerto</span></div>
              <div><span className="small-icon"><Check size={20} /></span><strong>{correct}</strong><span>acertos</span></div>
              <div><span className="small-icon"><RotateCcw size={20} /></span><strong>{errors}</strong><span>respostas incorretas</span></div>
              <div><span className="small-icon"><Layers size={20} /></span><strong>{due.length}</strong><span>{due.length === 1 ? 'cartão para hoje' : 'cartões para hoje'}</span></div>
            </div>
            <div className="review-home-grid">
              <div>
                <section className="card review-start-banner">
                  <div>
                    <h2>Minha fila de revisão</h2>
                    <p>{available.length ? `${due.length} ${due.length === 1 ? 'questão disponível' : 'questões disponíveis'} para revisão agora.` : <>Pratique por disciplina ou <a href="#register-study">registre um estudo</a> para preencher sua fila.</>}</p>
                    <div className="review-start-controls">
                      <Select aria-label="Filtrar assunto da revisão" value={filter} onChange={event => setFilter(event.target.value)}>
                        <option value="all">Todos os assuntos</option>
                        {reviewTopics.map(id => <option key={id} value={id}>{topicById(id)?.title || id}</option>)}
                      </Select>
                      <button className="button primary" disabled={!due.length} onClick={() => start(due)}>Revisar agora <ArrowRight size={17} /></button>
                      {!!filtered.length && !due.length && <button className="button secondary" onClick={() => start(filtered)}>Praticar novamente</button>}
                    </div>
                  </div>
                </section>
                <section className="card review-catalog">
                  <div className="section-heading">
                    <div><h2>Pratique por disciplina</h2><p className="muted">Questões organizadas por assunto, com correção comentada.</p></div>
                    <Select aria-label="Disciplina das questões" value={subject} onChange={event => setSubject(event.target.value)}>
                      {Object.keys(curriculum).map(name => <option key={name}>{name}</option>)}
                    </Select>
                  </div>
                  <ul>
                    {curriculum[subject].map(item => {
                      const cards = flashcards.filter(card => card.topicId === item.id);
                      return (
                        <li key={item.id}>
                          <div><strong>{item.title}</strong><small>{cards.length} questões · {cards.filter(card => learning.records[card.id]).length} praticadas</small></div>
                          <button className="button secondary" aria-label={`Praticar ${item.title}`} onClick={() => start(cards)}>
                            Praticar <ArrowRight size={15} />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
                <section className="card learned-topics">
                  <h2>Assuntos estudados</h2>
                  {learning.topics.length ? (
                    <div className="learned-topic-grid">
                      {learning.topics.map(item => {
                        const topic = topicById(item.topicId);
                        const cards = available.filter(card => card.topicId === item.topicId);
                        const count = cards.filter(card => learning.records[card.id]).length;
                        return (
                          <button key={item.topicId} onClick={() => setFilter(item.topicId)} className={filter === item.topicId ? 'active' : ''} aria-pressed={filter === item.topicId}>
                            <span className="small-icon"><BookOpen size={18} /></span>
                            <strong>{topic?.title || item.topicId}</strong>
                            <small>{topic?.subject} · {count}/{cards.length} cartões praticados</small>
                            <div className="progress-track" aria-hidden="true"><i style={{ width: `${cards.length ? count / cards.length * 100 : 0}%` }} /></div>
                          </button>
                        );
                      })}
                    </div>
                  ) : <p className="muted">Registre um estudo para começar a acompanhar seus assuntos aqui.</p>}
                </section>
              </div>
              <aside>
                <section className="card register-study" id="register-study" tabIndex={-1}>
                  <div><h2>Registrar estudo</h2><p className="muted">Adicione um assunto à sua fila após estudar, mesmo fora da Wizdom.</p></div>
                  <Select aria-label="Assunto estudado" value={topic} onChange={event => setTopic(event.target.value)}>
                    {topics.map(item => <option key={item.id} value={item.id}>{item.subject} · {item.title}</option>)}
                  </Select>
                  <button className="button secondary" onClick={() => { onStudy({ topicId: topic, ...topicById(topic) }, false); setFilter(topic); }}>
                    Estudei este assunto <Check size={17} />
                  </button>
                </section>
                <section className="card streak-card">
                  <h2>Atividade na semana</h2>
                  <StreakWeek stats={stats} />
                  <p className="muted">Estude, pratique ou complete um minuto de foco para registrar o dia.</p>
                </section>
                <section className="card spaced-note">
                  <Clock3 size={22} />
                  <h3>Como a revisão é agendada</h3>
                  <p className="muted">Erros voltam no dia seguinte. Acertos voltam em intervalos crescentes, de 3 a 30 dias.</p>
                </section>
              </aside>
            </div>
          </>
        ))}
      </div>
      {result && <Celebration result={result} stats={stats} onClose={() => setResult(null)} />}
    </div>
  );
}
