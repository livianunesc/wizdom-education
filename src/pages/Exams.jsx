import { useState } from "react";
import {
  ArrowUpRight,
  CheckCheck,
  ChevronDown,
  Clock3,
  Download,
  FileText,
  LibraryBig,
  Search,
  ShieldCheck,
} from "lucide-react";
import { processes } from "../admissions.js";
import { exams, examYears, ENEM_SOURCE } from "../exams-data.js";
import "./exams.css";

const dayOptions = [[0, "Todos"], [1, "1º dia"], [2, "2º dia"]];
const localCadernos = exams.filter(exam => exam.proof && exam.answer).length;

const searchable = (value) => value
  .normalize("NFD")
  .replace(/\p{Diacritic}/gu, "")
  .toLocaleLowerCase("pt-BR");

function ExamCard({ exam }) {
  const title = `ENEM ${exam.year}`;
  const dayLabel = `${exam.day}º dia`;

  return (
    <article className={`exam-card exam-day-${exam.day}`}>
      <div className="exam-card-cover" aria-hidden="true"><FileText size={27} strokeWidth={1.7} /></div>
      <div className="exam-card-body">
        <div className="exam-card-title">
          <h3>{title}</h3>
          <span className="exam-day-badge">{dayLabel}</span>
        </div>
        <p>{exam.areas}</p>
        <div className="exam-meta">
          <span><Clock3 size={15} aria-hidden="true" /> {exam.duration}</span>
          <span>{exam.questions} questões</span>
          <span>{exam.oldFormat ? "Formato anterior a 2017" : `Caderno ${exam.booklet} · Azul`}</span>
        </div>
      </div>
      <div className="exam-downloads">
        {exam.oldFormat ? (
          <a className="exam-action exam-action-primary" href={exam.source} target="_blank" rel="noreferrer">
            Prova e gabarito no INEP <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        ) : (
          <>
            <a className="exam-action exam-action-primary" aria-label={`Abrir prova ${title}, ${dayLabel}`} href={exam.proof} target="_blank" rel="noreferrer">
              <Download size={16} aria-hidden="true" /> Prova PDF
            </a>
            <a className="exam-action" aria-label={`Abrir gabarito ${title}, ${dayLabel}`} href={exam.answer} target="_blank" rel="noreferrer">
              <CheckCheck size={16} aria-hidden="true" /> Gabarito
            </a>
            <a className="exam-source" aria-label={`Ver edição ${exam.year} no INEP`} href={exam.source} target="_blank" rel="noreferrer">
              Fonte oficial <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </>
        )}
      </div>
    </article>
  );
}

export default function Exams() {
  const [bank, setBank] = useState("enem");
  const [year, setYear] = useState("");
  const [day, setDay] = useState(0);
  const [search, setSearch] = useState("");
  const terms = searchable(search.trim()).split(/\s+/).filter(Boolean);
  const visible = exams.filter(exam =>
    (!year || String(exam.year) === year)
    && (!day || exam.day === day)
    && terms.every(term => searchable(`ENEM ${exam.year} ${exam.areas}`).includes(term))
  );
  const process = processes[bank];
  const isEnem = bank === "enem";

  function clearFilters() {
    setSearch("");
    setYear("");
    setDay(0);
  }

  return (
    <div className="exams-page">
      <header className="exam-heading">
        <span className="exam-heading-icon"><LibraryBig size={30} strokeWidth={1.7} aria-hidden="true" /></span>
        <div>
          <h1>Provas anteriores</h1>
          <p>Cadernos e gabaritos oficiais para praticar por ano e área de estudo.</p>
        </div>
      </header>

      <div className="exam-layout">
        <aside className="exam-catalog" aria-label="Acervo">
          <div className="exam-catalog-cover">
            <ShieldCheck size={25} strokeWidth={1.7} aria-hidden="true" />
            <div>
              <strong>{localCadernos * 2} PDFs locais</strong>
              <span>Provas e gabaritos do ENEM</span>
            </div>
          </div>
          <label className="exam-field">
            Banca ou processo
            <span className="exam-control exam-select">
              <select value={bank} onChange={event => setBank(event.target.value)}>
                {Object.entries(processes).map(([id, item]) => (
                  <option key={id} value={id}>{item.name}</option>
                ))}
              </select>
              <ChevronDown size={16} aria-hidden="true" />
            </span>
          </label>
          <a className="exam-source exam-catalog-source" href={ENEM_SOURCE} target="_blank" rel="noreferrer">
            Acervo completo do INEP <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </aside>

        {isEnem ? (
          <section className="exam-library" aria-labelledby="library-heading">
            <div className="exam-library-heading">
              <div>
                <h2 id="library-heading">Cadernos do ENEM</h2>
                <p>Aplicação regular · Cadernos azuis</p>
              </div>
              <span className="exam-count" role="status">{visible.length} {visible.length === 1 ? "caderno" : "cadernos"}</span>
            </div>
            <div className="exam-filters">
              <label className="exam-field">
                Buscar
                <span className="exam-control exam-search">
                  <Search size={17} aria-hidden="true" />
                  <input type="search" aria-label="Buscar provas do ENEM" placeholder="Ano ou área de estudo" value={search} onChange={event => setSearch(event.target.value)} />
                </span>
              </label>
              <label className="exam-field">
                Edição
                <span className="exam-control exam-select">
                  <select aria-label="Edição" value={year} onChange={event => setYear(event.target.value)}>
                    <option value="">Todas as edições</option>
                    {examYears.map(item => <option key={item}>{item}</option>)}
                  </select>
                  <ChevronDown size={16} aria-hidden="true" />
                </span>
              </label>
              <fieldset className="exam-day-field">
                <legend>Dia de aplicação</legend>
                <div className="exam-day-filters">
                  {dayOptions.map(([value, label]) => (
                    <button type="button" key={value} aria-pressed={day === value} onClick={() => setDay(value)}>{label}</button>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="exam-grid">{visible.map(exam => <ExamCard key={exam.id} exam={exam} />)}</div>
            {!visible.length && (
              <div className="exam-empty">
                <Search size={28} aria-hidden="true" />
                <h3>Nenhum caderno encontrado</h3>
                <p>Altere o ano, o dia ou o termo de busca.</p>
                <button className="exam-action" onClick={clearFilters}>Limpar filtros</button>
              </div>
            )}
            <details className="exam-notes">
              <summary>Como acessar os arquivos</summary>
              <p>Os PDFs de 2017 a 2025 abrem offline na versão baixada. Mantenha a pasta “provas” junto de “index.html”. Os arquivos de 2016 e as páginas oficiais exigem internet.</p>
            </details>
          </section>
        ) : (
          <section className="exam-process" aria-labelledby="exam-process-heading">
            <span className="exam-heading-icon"><FileText size={26} aria-hidden="true" /></span>
            <h2 id="exam-process-heading">{process.name}</h2>
            <p>Consulte provas e gabaritos no portal da organização. Confira a edição e a fase antes de escolher o caderno.</p>
            <a className="exam-action exam-action-primary" href={process.archive || process.portal} target="_blank" rel="noreferrer">
              Abrir consulta oficial <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </section>
        )}
      </div>
    </div>
  );
}
