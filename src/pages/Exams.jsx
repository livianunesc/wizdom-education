import { processes } from "../admissions.js";
import { useState } from "react";
import { ArrowUpRight, BookOpen, CheckCheck, Clock3, Download, FileText, GraduationCap, Search, ShieldCheck, Sparkles } from "lucide-react";
import { exams, examYears, ENEM_SOURCE } from "../exams-data.js";
import "./exams.css";

export default function Exams() {
  const [bank, setBank] = useState("enem");
  const [year, setYear] = useState("Todos");
  const [day, setDay] = useState(0);
  const [search, setSearch] = useState("");
  const visible = exams.filter((exam) => (year === "Todos" || exam.year === year) && (!day || exam.day === day) && `${exam.year} ${exam.areas}`.toLocaleLowerCase("pt-BR").includes(search.toLocaleLowerCase("pt-BR")));
  return <div className="exams-page">
    <div className="page-heading"><div><span className="eyebrow">TREINAR TAMBÉM É CONSTRUIR CONFIANÇA</span><h1>Provas anteriores</h1><p className="muted">Provas de verdade. Um passo a mais na sua preparação.</p></div><span className="badge"><ShieldCheck size={15}/> Cadernos do INEP</span></div>
    <section className="card notebook-panel">
      <label>Banca ou processo<select value={bank} onChange={event => setBank(event.target.value)}>{Object.entries(processes).map(([id, item]) => <option key={id} value={id}>{item.name}</option>)}</select></label>
    </section>
    {bank !== 'enem' ? <section className="card notebook-panel">
      <h2>{processes[bank].name}</h2>
      <p>Página oficial de consulta. Confira a edição, a fase e o tipo de correção junto da prova.</p>
      <a className="button primary" href={processes[bank].archive || processes[bank].portal} target="_blank" rel="noreferrer">Abrir consulta oficial <ArrowUpRight size={16}/></a>
    </section> : <>
    <section className="exam-hero">
      <div><span className="exam-hero-kicker"><Sparkles size={16}/> SUA BIBLIOTECA DE PROVAS</span><h2>O grande dia começa<br/>com um pequeno treino.</h2><p>Escolha uma edição, reserve seu tempo e pratique. Depois, confira o gabarito da mesma cor e transforme cada erro em aprendizado.</p><a className="button primary" href={ENEM_SOURCE} target="_blank" rel="noopener noreferrer">Explorar acervo do INEP <ArrowUpRight size={17}/></a></div>
      <div className="exam-stack" aria-hidden="true"><div className="exam-paper back"><GraduationCap size={26}/><span>SEU FUTURO</span><strong>começa<br/>aqui.</strong></div><div className="exam-paper front"><div><FileText size={23}/><span>ENEM</span></div><strong>Uma questão<br/>de cada vez.</strong><i/><i/><i/><span className="paper-stamp"><CheckCheck size={15}/> Você consegue.</span></div></div>
      <div className="exam-hero-stats"><div><strong>9</strong><span>edições com PDFs locais</span></div><div><strong>36</strong><span>provas e gabaritos</span></div><div><strong>2016</strong><span>no acervo online</span></div></div>
    </section>
    <section className="exam-library" aria-labelledby="library-heading">
      <div className="section-heading"><div><h2 id="library-heading">Encontre seu próximo desafio</h2><p className="muted">Aplicação regular · versão impressa · cadernos azuis</p></div><label className="exam-search"><Search size={17}/><input aria-label="Buscar provas do ENEM" value={search} placeholder="Buscar ano ou área…" onChange={(e)=>setSearch(e.target.value)}/></label></div>
      <div className="exam-year-filters" role="group" aria-label="Filtrar por edição">{["Todos",...examYears].map((item)=><button key={item} aria-pressed={year===item} className={year===item?"selected":""} onClick={()=>setYear(item)}>{item}</button>)}</div>
      <div className="exam-results-bar"><div className="exam-day-filters" role="group" aria-label="Filtrar por dia">{[[0,"Os dois dias"],[1,"1º dia"],[2,"2º dia"]].map(([value,label])=><button key={value} aria-pressed={day===value} className={day===value?"selected":""} onClick={()=>setDay(value)}>{label}</button>)}</div><span aria-live="polite">{visible.length} {visible.length===1?"caderno encontrado":"cadernos encontrados"}</span></div>
      <div className="exam-grid">{visible.map((exam)=><article className={`exam-card exam-day-${exam.day}`} key={exam.id}>
        <div className="exam-card-top"><span className="exam-file-icon"><FileText size={24}/></span><span className="exam-day-badge">{exam.day}º DIA</span></div>
        <h3>ENEM <span>{exam.year}</span></h3><p>{exam.areas}</p>
        <div className="exam-meta"><span><Clock3 size={14}/>{exam.duration}</span><span><BookOpen size={14}/>{exam.questions} questões</span></div>
        <span className="exam-color">{exam.oldFormat ? "Formato anterior a 2017" : `Caderno ${exam.booklet} · Azul`}</span>
        {exam.oldFormat ? <a className="button secondary exam-archive-link" href={exam.source} target="_blank" rel="noopener noreferrer">Prova e gabarito no INEP <ArrowUpRight size={16}/></a> : <div className="exam-downloads"><a className="button primary" aria-label={`Abrir prova ENEM ${exam.year}, ${exam.day}º dia`} href={exam.proof} target="_blank" rel="noopener noreferrer"><Download size={16}/>Prova PDF</a><a className="button secondary" aria-label={`Abrir gabarito ENEM ${exam.year}, ${exam.day}º dia`} href={exam.answer} target="_blank" rel="noopener noreferrer"><CheckCheck size={16}/>Gabarito</a></div>}
        <a className="exam-source" href={exam.source} target="_blank" rel="noopener noreferrer">Ver edição na fonte oficial <ArrowUpRight size={12}/></a>
      </article>)}</div>
      {!visible.length && <div className="card exam-empty"><Search size={30}/><h3>Nenhuma prova por aqui.</h3><p className="muted">Experimente outro ano ou busque por uma área, como Matemática.</p><button className="button secondary" onClick={()=>{setSearch("");setYear("Todos");setDay(0);}}>Limpar filtros</button></div>}
    </section>
    <div className="exam-notes"><ShieldCheck size={21}/><p><strong>Provas oficiais, cópias locais.</strong> Os PDFs de 2017–2025 estão incluídos nesta pasta e abrem mesmo sem internet. Mantenha a pasta “provas” junto de “index.html”. Os links para o acervo do INEP precisam de internet. Em 2016, as áreas eram distribuídas de outra forma; o acesso é pelo acervo anual. Confira sempre o ano, o dia e a cor antes de corrigir.</p></div>
    <section className="exam-tips"><span>SEU RITUAL DE SIMULADO</span><div><p><b>01</b><strong>Prepare seu espaço</strong>Água, papel, caneta e celular longe.</p><p><b>02</b><strong>Respeite seu tempo</strong>Use a área de foco e pratique sem consulta.</p><p><b>03</b><strong>Aprenda com os erros</strong>Revise o assunto e volte às questões.</p></div></section>
    </>}
  </div>;
}
