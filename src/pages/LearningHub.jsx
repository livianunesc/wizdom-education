import { useEffect, useId, useRef, useState } from 'react';
import {
  ArrowLeft, ArrowRight, Atom, BookOpen, Check, ChevronDown, Compass, Dna, Earth,
  FlaskConical, Languages, Network, PenLine, ScrollText, Search, Sigma, Target, Waypoints,
} from 'lucide-react';
import { curriculum, topicById, topics } from '../curriculum.js';
import { flashcards, cardsForTopic } from '../flashcards-data.js';
import { learningState } from '../learning.js';
import './learning-hub.css';

const subjects = Object.keys(curriculum).sort((a, b) => a.localeCompare(b, 'pt-BR'));
const allAreas = 'Todas';
const arts = {
  Biologia: [Dna, 'Natureza', 'mint'],
  Física: [Atom, 'Natureza', 'sky'],
  Química: [FlaskConical, 'Natureza', 'lilac'],
  Matemática: [Sigma, 'Matemática', 'indigo'],
  Português: [BookOpen, 'Linguagens', 'rose'],
  Inglês: [Languages, 'Linguagens', 'sky'],
  História: [ScrollText, 'Humanas', 'amber'],
  Geografia: [Earth, 'Humanas', 'mint'],
  Filosofia: [Network, 'Humanas', 'lilac'],
  Redação: [PenLine, 'Redação', 'rose'],
};
const areas = [allAreas, 'Matemática', 'Natureza', 'Linguagens', 'Humanas', 'Redação'];
const stages = [
  { level: 'fundamental', name: 'Fundamentos', description: 'Reconheça os conceitos de cada disciplina.', icon: Compass, tone: 'mint' },
  { level: 'intermediário', name: 'Aplicação', description: 'Use o que estudou em problemas contextualizados.', icon: Waypoints, tone: 'indigo' },
  { level: 'desafiador', name: 'Desafio', description: 'Relacione conceitos e interprete problemas mais complexos.', icon: Target, tone: 'rose' },
];

const normalize = text => text.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
const answeredCount = (cards, records) => cards.filter(card => records[card.id]).length;

function TopicProgress({ cards, records, label }) {
  const count = answeredCount(cards, records);
  return <div className="hub-progress">
    <span>{count} de {cards.length} questões feitas</span>
    <progress aria-label={label} value={count} max={cards.length || 1} />
  </div>;
}

function SubjectArt({ icon: Icon, tone }) {
  return <div className={`hub-art hub-tone-${tone}`} aria-hidden="true">
    <span className="hub-art-orbit" />
    <span className="hub-art-shape" />
    <span className="hub-art-tile"><Icon size={38} strokeWidth={1.6} /></span>
  </div>;
}

function TopicRow({ topic, level, records, onPractice }) {
  const available = cardsForTopic(topic.id).filter(card => !level || card.level === level);
  const answered = answeredCount(available, records);
  const complete = answered === available.length;
  const status = available.length === 1
    ? complete ? 'Questão respondida' : 'Questão pendente'
    : `${answered} de ${available.length} questões feitas`;
  return <li className="hub-topic">
    <span className={`hub-topic-icon${complete ? ' hub-topic-complete' : ''}`} aria-hidden="true">
      {complete ? <Check size={19} /> : <BookOpen size={19} />}
    </span>
    <div>
      <h3>{topic.title}</h3>
      <p>{topic.description}</p>
      <span className="hub-topic-count">{status}</span>
    </div>
    <button className="button secondary hub-practice" aria-label={`Praticar ${topic.title}`} onClick={() => onPractice(topic, level)}>
      Praticar <ArrowRight size={16} aria-hidden="true" />
    </button>
  </li>;
}

function Subjects({ initialSubject, records, onPractice }) {
  const [search, setSearch] = useState('');
  const [area, setArea] = useState(allAreas);
  const [selection, setSelection] = useState(() => Object.hasOwn(curriculum, initialSubject) ? initialSubject : null);
  const subjectTitle = useRef(null);
  const lastSubject = useRef(null);
  const listSearch = useRef(null);
  const fromCatalog = useRef(false);
  useEffect(() => {
    if (!fromCatalog.current) return;
    if (selection) subjectTitle.current?.focus();
    else if (lastSubject.current) lastSubject.current.focus();
    else listSearch.current?.focus();
  }, [selection]);
  const query = normalize(search.trim());
  const matches = subjects.filter(subject => (area === allAreas || arts[subject][1] === area)
    && (!query || normalize(subject).includes(query) || curriculum[subject].some(topic => normalize(topic.title).includes(query))));

  if (selection) {
    const [icon, group, tone] = arts[selection];
    const selectedTopics = curriculum[selection];
    const cards = selectedTopics.flatMap(topic => cardsForTopic(topic.id));
    return <section className="learning-hub" aria-labelledby="hub-subject-title">
      <button className="hub-back" type="button" onClick={() => { fromCatalog.current = true; setSelection(null); }}>
        <ArrowLeft size={17} aria-hidden="true" /> Todas as disciplinas
      </button>
      <header className="hub-discipline-heading">
        <SubjectArt icon={icon} tone={tone} />
        <div>
          <span className="hub-meta">{group} · {selectedTopics.length} assuntos</span>
          <h1 id="hub-subject-title" ref={subjectTitle} tabIndex={-1}>{selection}</h1>
          <TopicProgress cards={cards} records={records} label={`Progresso de ${selection}`} />
        </div>
      </header>
      <ul className="hub-topics">
        {selectedTopics.map(topic => <TopicRow key={topic.id} topic={topic} records={records} onPractice={onPractice} />)}
      </ul>
    </section>;
  }

  return <section className="learning-hub" aria-labelledby="hub-subjects-title">
    <header className="hub-heading">
      <div><h1 id="hub-subjects-title">Disciplinas</h1><p>Escolha uma matéria e pratique por assunto.</p></div>
      <div className="hub-heading-count"><BookOpen size={20} aria-hidden="true" /><span><strong>{topics.length}</strong> assuntos · <strong>{flashcards.length}</strong> questões</span></div>
    </header>
    <div className="hub-filters">
      <label className="hub-search">
        <Search size={18} aria-hidden="true" />
        <input type="search" aria-label="Buscar disciplina ou assunto" placeholder="Buscar disciplina ou assunto" value={search} ref={listSearch} onChange={event => setSearch(event.target.value)} />
      </label>
      <div className="hub-areas" role="group" aria-label="Áreas">
        {areas.map(name => <button key={name} type="button" aria-pressed={name === area} onClick={() => setArea(name)}>{name}</button>)}
      </div>
    </div>
    {matches.length ? <div className="hub-subject-grid">
      {matches.map(subject => {
        const [icon, group, tone] = arts[subject];
        const available = curriculum[subject].flatMap(topic => cardsForTopic(topic.id));
        return <article className="hub-subject-card" key={subject}>
          <SubjectArt icon={icon} tone={tone} />
          <div className="hub-subject-copy">
            <p className="hub-meta">{group} · {curriculum[subject].length} assuntos</p>
            <h2>{subject}</h2>
            <TopicProgress cards={available} records={records} label={`Progresso de ${subject}`} />
            <button
              type="button"
              className="hub-subject-link"
              ref={button => { if (button && lastSubject.current?.dataset.subject === subject) lastSubject.current = button; }}
              data-subject={subject}
              aria-label={`Ver assuntos de ${subject}`}
              onClick={event => { fromCatalog.current = true; lastSubject.current = event.currentTarget; setSelection(subject); }}
            >Ver assuntos <ArrowRight size={17} aria-hidden="true" /></button>
          </div>
        </article>;
      })}
    </div> : <p className="hub-empty">Nenhuma disciplina encontrada. Tente outro termo ou escolha uma área diferente.</p>}
  </section>;
}

function Cycles({ records, onPractice }) {
  const [stage, setStage] = useState(null);
  const [subject, setSubject] = useState('Matemática');
  const panelId = useId();
  const total = answeredCount(flashcards, records);
  return <section className="learning-hub" aria-labelledby="hub-cycles-title">
    <header className="hub-cycles-hero">
      <div>
        <h1 id="hub-cycles-title">Ciclos de estudo</h1>
        <p>Pratique cada assunto em três níveis que avançam do conceito à resolução de problemas.</p>
      </div>
      <div className="hub-cycles-summary">
        <span className="hub-cycles-mark"><Waypoints size={29} aria-hidden="true" /></span>
        <TopicProgress cards={flashcards} records={records} label="Progresso em todos os ciclos" />
        {total === flashcards.length && <span className="hub-cycles-done"><Check size={16} aria-hidden="true" /> Trilha concluída</span>}
      </div>
    </header>
    <ol className="hub-cycle-list">
      {stages.map(({ level, name, description, icon: Icon, tone }, index) => {
        const cards = flashcards.filter(card => card.level === level);
        const open = stage === level;
        return <li key={level} className="hub-cycle">
          <div className={`hub-cycle-index hub-tone-${tone}`} aria-hidden="true"><Icon size={25} strokeWidth={1.7} /></div>
          <section className="hub-cycle-card" aria-labelledby={`${panelId}-${index}-title`}>
            <div className="hub-cycle-heading">
              <div>
                <span className="hub-meta">Ciclo {index + 1}</span>
                <h2 id={`${panelId}-${index}-title`}>{name}</h2>
                <p>{description}</p>
              </div>
              <TopicProgress cards={cards} records={records} label={`Progresso em ${name}`} />
              <button type="button" className="button secondary hub-cycle-toggle" aria-expanded={open} aria-controls={open ? `${panelId}-${index}-topics` : undefined} onClick={() => setStage(open ? null : level)}>
                {open ? 'Recolher' : 'Ver atividades'} <ChevronDown size={17} aria-hidden="true" />
              </button>
            </div>
            {open && <div className="hub-cycle-topics" id={`${panelId}-${index}-topics`}>
              <label className="hub-cycle-filter">Disciplina
                <select value={subject} onChange={event => setSubject(event.target.value)}>
                  {subjects.map(item => <option key={item}>{item}</option>)}
                </select>
              </label>
              <ul className="hub-topics">
                {cards.filter(card => topicById(card.topicId)?.subject === subject).map(card => (
                  <TopicRow key={card.id} topic={topicById(card.topicId)} level={level} records={records} onPractice={onPractice} />
                ))}
              </ul>
            </div>}
          </section>
        </li>;
      })}
    </ol>
  </section>;
}

export default function LearningHub({ mode, learning, initialSubject, onPractice }) {
  const { records } = learningState(learning);
  return mode === 'cycles'
    ? <Cycles records={records} onPractice={onPractice} />
    : <Subjects key={initialSubject} initialSubject={initialSubject} records={records} onPractice={onPractice} />;
}
