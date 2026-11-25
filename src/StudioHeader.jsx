import { useEffect, useState } from "react";
import {
  ArrowLeft, BookOpen, CalendarDays, Coins, Compass, FileText, Files,
  GraduationCap, LayoutDashboard, Layers3, LogOut, Menu, Search, Sprout,
  Timer, Trophy, UserRound, Wrench, X,
} from "lucide-react";

const home = ["Meu espaço", LayoutDashboard, "Início"];
const sections = [
  ["Ciclos", Compass],
  ["Disciplinas", BookOpen],
  ["Revisões", Layers3, "Questões"],
  ["Vestibulares", GraduationCap],
  ["Materiais", Files],
  ["Provas anteriores", FileText],
  ["Ferramentas", Wrench],
];
const utilities = [
  ["Cronograma", CalendarDays],
  ["Calendário", CalendarDays],
  ["Área de foco", Timer],
  ["Olimpíadas", Sprout],
  ["Ranking", Trophy],
  ["Loja", Coins],
  ["Meu perfil", UserRound],
];

const normalize = text => text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export default function StudioHeader({ page, navigate, canGoBack, goBack, profile, demo, coins, onLogin, onSignup, onLogout }) {
  const [overlay, setOverlay] = useState(null);
  const [query, setQuery] = useState("");
  const searchResults = [home, ...sections, ...utilities].filter(([key, , label]) =>
    normalize((label || "") + " " + key).includes(normalize(query.trim()))
  );
  function openSearch() {
    setQuery("");
    setOverlay("search");
  }
  useEffect(() => {
    const handleKeys = event => {
      if (event.key === "Escape") setOverlay(null);
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k" && !document.querySelector('[role="dialog"]:not(.studio-overlay)')) {
        event.preventDefault();
        openSearch();
      }
    };
    document.addEventListener("keydown", handleKeys);
    return () => document.removeEventListener("keydown", handleKeys);
  }, []);
  function openPage(key) {
    setOverlay(null);
    navigate(key);
  }
  function links(items) {
    return items.map(([key, Icon, label]) => <button
      type="button"
      className="studio-nav-link"
      aria-current={page === key ? "page" : undefined}
      key={key}
      onClick={() => openPage(key)}
    ><Icon size={18} aria-hidden="true" />{label || key}</button>);
  }
  return <>
    <header className="studio-header">
      <div className="studio-header-inner">
        <button className="studio-brand" type="button" onClick={() => openPage(home[0])} aria-label="Meu espaço" aria-current={page === home[0] ? "page" : undefined}>
          <span className="studio-mark" aria-hidden="true"><Compass size={22} strokeWidth={2.5} /></span>
          <span>wizdom<span className="studio-brand-dot">.</span></span>
        </button>
        <nav className="studio-desktop-nav" aria-label="Navegação principal">{links(sections)}</nav>
        <div className="studio-header-actions">
          <button type="button" className="studio-icon studio-search-toggle" aria-label="Buscar na Wizdom" aria-haspopup="dialog" onClick={openSearch}><Search size={19} /></button>
          <button type="button" className="studio-balance" aria-label={coins + " moedas, abrir loja"} onClick={() => openPage("Loja")}><Coins size={16} /> <b>{coins}</b></button>
          {demo ?
            <button type="button" className="studio-signin" onClick={onLogin} aria-label="Entrar na conta">Entrar</button> :
            <button type="button" className="studio-avatar" onClick={() => openPage("Meu perfil")} aria-label="Meu perfil" aria-current={page === "Meu perfil" ? "page" : undefined}>
              {profile.photo ? <img src={profile.photo} alt="" /> : profile.name?.charAt(0).toUpperCase()}
            </button>}
          <button type="button" className="studio-icon studio-menu-toggle" aria-label="Abrir menu" aria-expanded={overlay === "menu"} aria-haspopup="dialog" onClick={() => setOverlay("menu")}><Menu size={21} /></button>
        </div>
      </div>
    </header>
    {canGoBack && <div className="studio-path">
      <button type="button" onClick={goBack} aria-label="Voltar"><ArrowLeft size={15} /> Voltar</button><span aria-hidden="true">/</span><span>{sections.find(([key]) => key === page)?.[2] || page}</span>
    </div>}
    {overlay && <div className="studio-overlay-backdrop" onClick={() => setOverlay(null)}>
      {overlay === "menu" ? <section id="studio-menu" className="studio-overlay studio-drawer" role="dialog" aria-modal="true" aria-labelledby="studio-menu-title" onClick={event => event.stopPropagation()}>
        <div className="studio-overlay-heading">
          <h2 id="studio-menu-title">Navegar na Wizdom</h2>
          <button type="button" className="studio-icon" aria-label="Fechar menu" onClick={() => setOverlay(null)}><X size={21} /></button>
        </div>
        <button type="button" className="studio-nav-link studio-drawer-search" onClick={openSearch}><Search size={18} /> Buscar páginas</button>
        <nav aria-label="Todas as páginas">
          <h3>Estudar</h3>
          {links([home, ...sections])}
          <h3>Organizar</h3>
          {links(utilities)}
        </nav>
        {demo ? <button type="button" className="studio-nav-link" onClick={() => { setOverlay(null); onSignup(); }}><UserRound size={18} /> Criar conta de teste</button> :
          <button type="button" className="studio-nav-link" onClick={() => { setOverlay(null); onLogout(); }}><LogOut size={18} /> Sair da conta</button>}
      </section> : <section className="studio-overlay studio-search" role="dialog" aria-modal="true" aria-labelledby="studio-search-title" onClick={event => event.stopPropagation()}>
        <h2 id="studio-search-title">Buscar na Wizdom</h2>
        <div className="studio-search-field">
          <Search size={19} aria-hidden="true" />
          <input aria-label="Pesquisar páginas" placeholder="Digite o nome de uma página" value={query} onChange={event => setQuery(event.target.value)} />
          <button type="button" className="studio-icon" aria-label="Fechar busca" onClick={() => setOverlay(null)}><X size={20} /></button>
        </div>
        <div className="studio-search-results">{searchResults.length ? links(searchResults) : <p>Nenhuma página encontrada.</p>}</div>
      </section>}
    </div>}
  </>;
}
