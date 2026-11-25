import { useEffect, useRef, useState } from 'react';
import { Clock3, Layers } from 'lucide-react';
import { flashDeck, scoreFlash } from '../flash-round.js';
import { topicById } from '../curriculum.js';
import { dayKey } from '../lib.js';
import { credit } from '../rewards.js';

export default function FlashRound({ stats, setStats }) {
  const [round, setRound] = useState(null);
  const [value, setValue] = useState('');
  const [clock, setClock] = useState(Date.now);
  const lock = useRef(false);
  const card = round?.cards[round.answers.length];
  const last = round?.last;
  const remaining = round ? Math.max(0, Math.ceil((round.start + 20_000 - clock) / 1000)) : 20;

  function start(timed, cards = flashDeck) {
    const time = Date.now();
    lock.current = false;
    setValue('');
    setClock(time);
    setRound({ cards, timed, answers: [], start: time, last: null });
  }

  function reveal(input) {
    if (lock.current || !card) return;
    lock.current = true;
    const result = scoreFlash(card, input, round.start, Date.now(), round.timed);
    const day = dayKey();
    const id = `flash:${day}:${card.id}`;
    if (round.timed) {
      setStats(current => credit(current, { id, xp: result.base + result.bonus, label: 'Flashcard · ' + card.subject, day }));
    }
    setRound({ ...round, last: { ...result, credited: round.timed && !stats.ledger?.[id] ? result.base + result.bonus : 0 } });
  }

  useEffect(() => {
    if (!card || !round.timed || last) return;
    const timer = setInterval(() => {
      const time = Date.now();
      setClock(time);
      if (time >= round.start + 20_000) reveal(null);
    }, 100);
    return () => clearInterval(timer);
  }, [card, round, last, stats]);

  function next() {
    const time = Date.now();
    setValue('');
    setClock(time);
    setRound({ ...round, last: null, answers: [...round.answers, last], start: time });
    lock.current = false;
  }

  const errors = round?.answers.filter(result => !result.correct).map(result => flashDeck.find(item => item.id === result.card));
  return (
    <section className="card notebook-panel flash-round">
      <div className="section-heading">
        <div>
          <h2>Flashcards com tempo</h2>
          {!round && <p className="muted">{flashDeck.length} cartões · até 20 segundos por resposta na rodada pontuada</p>}
        </div>
        <span className="small-icon" aria-hidden="true"><Layers size={19} /></span>
      </div>

      {!round && (
        <>
          <p>Um acerto vale 10 XP e até 5 XP pelo tempo restante. Cada cartão tem uma tentativa pontuada por dia.</p>
          <div className="notebook-actions">
            <button className="button primary" onClick={() => start(true)}>Começar rodada pontuada</button>
            <button className="button secondary" onClick={() => start(false)}>Treinar sem tempo</button>
          </div>
        </>
      )}

      {card && (
        <>
          <div className="knowledge-card">
            <div className="flash-card-status">
              <span>{round.answers.length + 1} de {round.cards.length} · {topicById(card.topicId)?.title || card.subject}</span>
              {round.timed && <span className="flash-time"><Clock3 size={15} aria-hidden="true" /> {remaining} s</span>}
            </div>
            <h3>{card.question}</h3>
          </div>
          {last ? (
            <div className={`answer-feedback ${last.correct ? 'success' : 'retry'}`} role="status">
              <strong>{last.correct ? 'Acertou' : 'Resposta'} · {card.answers[0]}</strong>
              <p>{card.explanation}</p>
              <p>{last.credited} XP creditados</p>
              <button className="button primary" onClick={next}>{round.answers.length + 1 === round.cards.length ? 'Ver resultado' : 'Próximo flashcard'}</button>
            </div>
          ) : (
            <form onSubmit={event => { event.preventDefault(); reveal(value); }}>
              <label>Sua resposta <input required value={value} onChange={event => setValue(event.target.value)} /></label>
              <div className="notebook-actions">
                <button className="button primary">Conferir</button>
                <button type="button" className="button secondary" onClick={() => reveal(null)}>Revelar resposta</button>
              </div>
            </form>
          )}
        </>
      )}

      {round && !card && (
        <>
          <p>{round.answers.filter(item => item.correct).length}/{round.cards.length} acertos · {(round.answers.reduce((sum, item) => sum + Math.min(round.timed ? 20_000 : Infinity, item.elapsed), 0) / round.answers.length / 1000).toFixed(1)} s por cartão</p>
          <p>{round.answers.reduce((sum, item) => sum + (item.credited ? item.base : 0), 0)} XP por acertos + {round.answers.reduce((sum, item) => sum + (item.credited ? item.bonus : 0), 0)} XP por velocidade</p>
          <div className="notebook-actions">
            {errors.length > 0 && <button className="button primary" onClick={() => start(false, errors)}>Retomar erros sem tempo</button>}
            <button className="button secondary" onClick={() => setRound(null)}>Voltar ao baralho</button>
          </div>
        </>
      )}
    </section>
  );
}
