import Select from "../Select.jsx";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bookmark,
  CalendarDays,
  ExternalLink,
  GraduationCap,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
  Info,
} from "lucide-react";
import { universities, processes } from "../admissions.js";
import TargetPlan from "./TargetPlan.jsx";
import "./opportunities.css";

export default function Opportunities({
  favorites = [],
  setFavorites,
  profile,
  notify,
  setProfile,
  navigate,
}) {
  const [query, setQuery] = useState("");
  const [uf, setUf] = useState("");
  const [entry, setEntry] = useState("");
  const normalize = text => text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  const [course, setCourse] = useState("");
  const [type, setType] = useState("");
  const [region, setRegion] = useState("");
  const [saved, setSaved] = useState(false);
  const [detail, setDetail] = useState(null);
  useEffect(() => {
    if (!detail) return;
    const onKey = (event) => {
      if (event.key === "Escape") setDetail(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [detail]);
  const filtered = universities.filter(
    (u) =>
      normalize(u.acronym + " " + u.name + " " + u.course).includes(normalize(query.trim())) && (!uf || u.uf === uf) && (!entry || u.entry === entry) &&
      (!course || u.course === course) &&
      (!type || u.type === type) &&
      (!region || u.region === region) &&
      (!saved || favorites.includes(u.id)),
  );
  function toggle(id) {
    const exists = favorites.includes(id);
    setFavorites((items) =>
      exists ? items.filter((item) => item !== id) : [...items, id],
    );
    notify?.(
      exists
        ? "Universidade removida dos favoritos."
        : "Universidade favorita salva. Consulte a edição no portal oficial.",
    );
  }
  return (
    <div className="opportunities-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">SEU PRÓXIMO CAPÍTULO</span>
          <h1>Vestibulares</h1>
          <p className="muted">
            Encontre a universidade que combina com o seu sonho.
          </p>
        </div>
        <span className="op-heading-icon">
          <GraduationCap size={30} />
        </span>
      </div>
      <div className="op-discover-banner">
        <div className="op-banner-symbol">
          <Sparkles size={25} />
        </div>
        <div>
          <h3>Seu futuro começa com uma descoberta</h3>
          <p>
            Explore com calma. Salve suas opções e escolha um objetivo para o cronograma.
          </p>
        </div>
      </div>
      <section
        className="card op-filters"
        aria-label="Filtros de universidades"
      >
        <div className="op-filter-label">
          <SlidersHorizontal size={17} />
          <strong>O que você está procurando?</strong>
        </div>
        <div className="notebook-grid notebook-panel">
          <label>Pesquisar instituição ou curso<input value={query} onChange={e => setQuery(e.target.value)} /></label>
          <label>UF<select value={uf} onChange={e => setUf(e.target.value)}><option value="">Todos os estados</option>{[...new Set(universities.map(item => item.uf))].sort().map(item => <option key={item}>{item}</option>)}</select></label>
          <label>Ingresso<select value={entry} onChange={e => setEntry(e.target.value)}><option value="">Todos os processos</option>{[...new Set(universities.map(item => item.entry))].sort().map(item => <option key={item}>{item}</option>)}</select></label>
        </div>
        <div className="op-filter-grid">
          <label className="field">
            Curso
            <Select value={course} onChange={(e) => setCourse(e.target.value)}>
              <option value="">Todos os cursos</option>
              {[...new Set(universities.map((u) => u.course))].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>
          </label>
          <label className="field">
            Instituição
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Públicas e particulares</option>
              <option>Pública</option>
              <option>Particular</option>
            </Select>
          </label>
          <label className="field">
            Região
            <Select value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="">Todo o Brasil</option>
              {["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"].map(
                (r) => (
                  <option key={r}>{r}</option>
                ),
              )}
            </Select>
          </label>
        </div>
      </section>
      <div className="section-heading op-result-heading">
        <h2>
          {saved ? "Suas favoritas" : "Universidades para conhecer"}{" "}
          <span className="op-count">{filtered.length}</span>
        </h2>
        <button
          className={`button secondary ${saved ? "is-active" : ""}`}
          onClick={() => setSaved(!saved)}
        >
          <Bookmark size={16} fill={saved ? "currentColor" : "none"} />{" "}
          Favoritas ({favorites.length})
        </button>
      </div>
      <div className="op-university-grid">
        {filtered.map((u) => (
          <article className="card university-card" key={u.id}>
            <div className="university-top">
              <span className={`university-logo tone-${u.tone}`}>
                {u.acronym}
              </span>
              <button
                className={`icon-button save-university ${favorites.includes(u.id) ? "saved" : ""}`}
                aria-label={`${favorites.includes(u.id) ? "Desfavoritar" : "Favoritar"} ${u.acronym}`}
                aria-pressed={favorites.includes(u.id)}
                onClick={() => toggle(u.id)}
              >
                <Bookmark
                  size={20}
                  fill={favorites.includes(u.id) ? "currentColor" : "none"}
                />
              </button>
            </div>
            <span className="university-type">
              {u.type} <span>·</span> {u.course}
            </span>
            <h3>{u.name}</h3>
            <p className="university-location">
              <MapPin size={14} /> {u.city}
            </p>
            <div className="university-facts">
              <div>
                <span>Formas de ingresso</span>
                <strong>{u.entry}</strong>
              </div>
            </div>
            <p className="university-date">Campus {u.campus}</p>
            <button className="university-details" onClick={() => setDetail(u)}>
              Conhecer universidade <ArrowRight size={17} />
            </button>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <div className="card empty-state op-empty">
          <Search size={34} />
          <h3>Ainda não encontramos essa combinação.</h3>
          <p>
            Tente outra região ou explore outros cursos. Há muitos caminhos
            possíveis.
          </p>
          <button
            className="button secondary"
            onClick={() => {
              setCourse(""); setQuery(""); setUf(""); setEntry("");
              setType("");
              setRegion("");
              setSaved(false);
            }}
          >
            Limpar filtros
          </button>
        </div>
      )}
      {detail && (
        <div className="modal-backdrop" onClick={() => setDetail(null)}>
          <section
            className="modal op-detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="university-detail-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              autoFocus
              className="icon-button op-modal-close"
              aria-label="Fechar detalhes"
              onClick={() => setDetail(null)}
            >
              <X size={21} />
            </button>
            <span className={`university-logo tone-${detail.tone}`}>
              {detail.acronym}
            </span>
            <span className="eyebrow">
              {detail.type} · {detail.region}
            </span>
            <h2 id="university-detail-title">{detail.name}</h2>
            <p className="muted">
              {detail.city} · {detail.course}
            </p>
            <p>Campus {detail.campus}{profile.target?.id === detail.id && ' · Meu objetivo'}</p>
            <h3>Como entro?</h3><p>{detail.entry} · Consulte as modalidades no edital.</p>
            <h3>O que cai?</h3><p>{processes[detail.processId].format || 'Consulte as disciplinas e etapas no edital da edição.'}</p>
            <p>Datas, pesos, notas de corte e editais por edição: consulte o portal oficial.</p>
            <h3>Qual meu próximo passo?</h3>
            <TargetPlan offer={detail} profile={profile} onApply={target => {
              setProfile(value => ({ ...value, target, course: detail.course }));
              setDetail(null);
              navigate('Cronograma');
            }} />
            <a
              className="button primary"
              href={detail.link}
              target="_blank"
              rel="noreferrer"
            >
              Consultar portal oficial <ExternalLink size={16} />
            </a>
            <button
              className="button secondary"
              onClick={() => toggle(detail.id)}
            >
              <Bookmark
                size={16}
                fill={favorites.includes(detail.id) ? "currentColor" : "none"}
              />
              {favorites.includes(detail.id)
                ? "Remover dos favoritos"
                : "Favoritar"}
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
