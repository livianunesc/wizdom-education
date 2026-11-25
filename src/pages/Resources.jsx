import { useState } from "react";
import {
  ArrowDownToLine, ArrowRight, ArrowUpRight, Atom, BookOpen, Calculator,
  CalendarDays, ChartNoAxesColumnIncreasing, CheckCheck, Compass, Dna,
  FileText, FlaskConical, Globe2, Landmark, Layers, ListChecks, PencilLine,
  Search, Timer, Trophy, X,
} from "lucide-react";
import { curriculum } from "../curriculum.js";
import { exams } from "../exams-data.js";
import { flashcards } from "../flashcards-data.js";
import "./resources.css";

const subjects = {
  Matemática: [Calculator, "iris"],
  Biologia: [Dna, "mint"],
  Física: [Atom, "blue"],
  Química: [FlaskConical, "plum"],
  História: [Landmark, "amber"],
  Geografia: [Globe2, "mint"],
  Português: [BookOpen, "blue"],
  Inglês: [BookOpen, "plum"],
  Redação: [PencilLine, "amber"],
  Filosofia: [Compass, "iris"],
};

const practice = Object.entries(subjects).map(([name, [Icon, color]]) => {
  const topics = curriculum[name];
  const topicIds = new Set(topics.map(topic => topic.id));
  return {
    name, Icon, color, questionCount: flashcards.filter(card => topicIds.has(card.topicId)).length,
    terms: topics.map(topic => topic.title).join(" "),
  };
});

const filters = [
  ["all", "Tudo"],
  ["exam", "Provas e gabaritos"],
  ["practice", "Questões por disciplina"],
];

const tools = [
  { title: "Flashcards", description: "Escolha uma rodada com tempo ou revise no seu ritmo.", route: "Revisões", context: { mode: "flash" }, Icon: Layers, color: "iris" },
  { title: "Cronograma", description: "Veja os blocos de estudo e ajuste o plano da semana.", route: "Cronograma", Icon: ListChecks, color: "mint" },
  { title: "Calendário", description: "Consulte suas datas de estudo e os eventos salvos.", route: "Calendário", Icon: CalendarDays, color: "blue" },
  { title: "Olimpíadas", description: "Encontre modalidades, provas e roteiros de preparação.", route: "Olimpíadas", Icon: Trophy, color: "amber" },
  { title: "Ranking", description: "Confira seu nível e sua posição no ranking de demonstração.", route: "Ranking", Icon: ChartNoAxesColumnIncreasing, color: "plum" },
];

const plain = text => text.toLocaleLowerCase("pt-BR").normalize("NFD").replace(/\p{Diacritic}/gu, "");

function ResourceMark({ Icon, color }) {
  return <span className="resource-mark" data-color={color} aria-hidden="true"><Icon size={23} strokeWidth={1.85} /></span>;
}

function ExamResource({ exam }) {
  return (
    <li className="material-exam">
      <ResourceMark Icon={FileText} color={exam.day === 1 ? "iris" : "mint"} />
      <div className="material-exam-copy">
        <h3>ENEM {exam.year} <span>· {exam.day}º dia</span></h3>
        <p>{exam.areas}</p>
        <small>{exam.oldFormat ? "Acervo on-line do INEP" : `Caderno ${exam.booklet} azul · PDF local`}</small>
      </div>
      <div className="material-exam-actions">
        {exam.proof ? <>
          <a className="resource-action" href={exam.proof} target="_blank" rel="noreferrer"
             aria-label={`Abrir prova em PDF do ENEM ${exam.year}, ${exam.day}º dia`}>
            <ArrowDownToLine size={16} aria-hidden="true" /> Prova
          </a>
          <a className="resource-action" href={exam.answer} target="_blank" rel="noreferrer"
             aria-label={`Abrir gabarito em PDF do ENEM ${exam.year}, ${exam.day}º dia`}>
            <CheckCheck size={16} aria-hidden="true" /> Gabarito
          </a>
        </> : (
          <a className="resource-action" href={exam.source} target="_blank" rel="noreferrer">
            Consultar no INEP <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        )}
      </div>
    </li>
  );
}

function Materials({ navigate }) {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const words = plain(query.trim()).split(/\s+/).filter(Boolean);
  const matches = label => words.every(word => plain(label).includes(word));
  const matchedExams = category === "practice" ? [] : exams.filter(exam =>
    matches(`enem ${exam.year} ${exam.day}º dia ${exam.areas} prova gabarito ${exam.proof ? "pdf" : "inep"}`));
  const matchedPractice = category === "exam" ? [] : practice.filter(item => matches(`${item.name} ${item.terms}`));
  const overview = category === "all" && !words.length;
  const visibleExams = overview ? matchedExams.slice(0, 2) : matchedExams;
  const resultCount = matchedExams.length + matchedPractice.length;
  const localFiles = exams.filter(exam => exam.proof).length + exams.filter(exam => exam.answer).length;

  return (
    <div className="resources-page">
      <header className="resource-banner">
        <div className="resource-banner-copy">
          <h1>Materiais</h1>
          <p>Abra os cadernos de prova e gabaritos do ENEM ou encontre questões para praticar por disciplina.</p>
        </div>
        <div className="resource-banner-art" aria-hidden="true">
          <div className="resource-banner-fold"><CheckCheck size={48} /></div>
          <div className="resource-banner-sheet"><FileText size={66} strokeWidth={1.3} /></div>
        </div>
        <div className="resource-banner-stat"><strong>{localFiles}</strong><span>PDFs disponíveis off-line</span></div>
      </header>

      <section className="material-filters" aria-label="Filtros de materiais">
        <div className="material-filter-tabs" role="group" aria-label="Tipo de material">
          {filters.map(([id, label]) => (
            <button key={id} type="button" aria-pressed={category === id} onClick={() => setCategory(id)}>{label}</button>
          ))}
        </div>
        <div className="material-filter-search">
          <Search size={17} aria-hidden="true" />
          <input aria-label="Buscar materiais" type="search" placeholder="Busque por ano ou assunto" value={query}
                 onChange={event => setQuery(event.target.value)} />
          {query && <button type="button" aria-label="Limpar busca" onClick={() => setQuery("")}><X size={16} /></button>}
        </div>
      </section>

      {words.length > 0 && <p className="material-results" role="status">{resultCount === 1 ? "1 resultado" : `${resultCount} resultados`}</p>}
      {!resultCount && (
        <section className="material-empty">
          <ResourceMark Icon={Search} color="iris" />
          <h2>Nenhum material encontrado</h2>
          <p>Tente buscar por um ano, como 2025, ou um assunto, como funções.</p>
          <button className="resource-action" type="button" onClick={() => { setQuery(""); setCategory("all"); }}>Limpar filtros</button>
        </section>
      )}

      {matchedPractice.length > 0 && (
        <section className="material-section" aria-labelledby="materials-practice">
          <div className="material-section-heading">
            <h2 id="materials-practice">Questões por disciplina</h2>
            <span>{matchedPractice.length} {matchedPractice.length === 1 ? "disciplina" : "disciplinas"}</span>
          </div>
          <div className="material-practice-grid">
            {matchedPractice.map(({ name, Icon, color, questionCount }) => (
              <button className="material-practice" type="button" key={name} onClick={() => navigate("Disciplinas", { subject: name })}>
                <ResourceMark Icon={Icon} color={color} />
                <span><strong>{name}</strong><small>{questionCount} questões de revisão</small></span>
                <ArrowRight className="material-practice-arrow" size={17} aria-hidden="true" />
              </button>
            ))}
          </div>
        </section>
      )}

      {visibleExams.length > 0 && (
        <section className="material-section" aria-labelledby="materials-exams">
          <div className="material-section-heading">
            <div><h2 id="materials-exams">Provas e gabaritos do ENEM</h2>{overview && <p>Edição mais recente no acervo</p>}</div>
            <button type="button" className="resource-action" onClick={() => navigate("Provas anteriores")}>
              Ver acervo de provas <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
          <ul className="material-exam-list">{visibleExams.map(exam => <ExamResource key={exam.id} exam={exam} />)}</ul>
        </section>
      )}
    </div>
  );
}

function Tools({ navigate }) {
  return (
    <div className="resources-page resources-tools">
      <header className="resources-tools-heading">
        <h1>Ferramentas</h1>
        <p>Organize a rotina, revise e reserve tempo para estudar.</p>
      </header>
      <div className="resource-tools-grid">
        <button type="button" className="resource-featured-tool" onClick={() => navigate("Área de foco")}>
          <span className="resource-featured-content">
            <strong>Área de foco</strong>
            <span>Use o timer para estudar a sós ou convide alguém para uma sessão em dupla.</span>
            <span className="resource-featured-action">Abrir área de foco <ArrowRight size={17} aria-hidden="true" /></span>
          </span>
          <span className="resource-timer-art" aria-hidden="true"><Timer size={70} strokeWidth={1.5} /></span>
        </button>
        {tools.map(({ title, description, route, context, Icon, color }) => (
          <button type="button" className="resource-tool" key={title} onClick={() => navigate(route, context)}>
            <span className="resource-tool-top"><ResourceMark Icon={Icon} color={color} /><ArrowRight size={19} aria-hidden="true" /></span>
            <span className="resource-tool-title">{title}</span>
            <span className="resource-tool-copy">{description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Resources({ mode, navigate }) {
  return mode === "tools" ? <Tools navigate={navigate} /> : <Materials navigate={navigate} />;
}
