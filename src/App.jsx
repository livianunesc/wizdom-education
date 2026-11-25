import Character, { CharacterEditor } from "./Character.jsx";
import Shop from "./pages/Shop.jsx";
import Duo from "./pages/Duo.jsx";
import { credit, weekKey } from "./rewards.js";
import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  FileText,
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  Timer,
  GraduationCap,
  Trophy,
  UserRound,
  LogOut,
  ArrowUpRight,
  ArrowRight,
  Bell,
  Search,
  Menu,
  X,
  Sprout,
  Coins,
  ChevronDown,
  Settings,
  Check,
  RotateCcw,
  Plus,
  Heart,
  Mail,
  ShieldCheck,
} from "lucide-react";
import Dashboard from "./Dashboard.jsx";
import Schedule from "./pages/Schedule.jsx";
import Reviews from "./pages/Reviews.jsx";
import Exams from "./pages/Exams.jsx";
import { registerTopic, noteActivity } from "./learning.js";
import { topicById, topicsFor } from "./curriculum.js";
import useDialogFocus from "./useDialogFocus.js";
import Auth from "./Auth.jsx";
import Onboarding from "./Onboarding.jsx";
import Opportunities from "./pages/Opportunities.jsx";
import Calendar from "./pages/Calendar.jsx";
import Olympics from "./pages/Olympics.jsx";
import Focus from "./pages/Focus.jsx";
import Profile from "./pages/Profile.jsx";
import Ranking from "./pages/Ranking.jsx";
import {
  initialProfile,
  safeLoad,
  newStudent,
  passwordHash,
  makePlan,
  dayKey,
  weekdays,
} from "./lib.js";
const subjectsForOlympics = { Física: "Física", Ciências: "Física", História: "História", Geografia: "Geografia", Química: "Química" };
const navigation = [
  ["Meu espaço", LayoutDashboard],
  ["Cronograma", CalendarDays],
  ["Área de foco", Timer],
  ["Revisões", BookOpen],
  ["Provas anteriores", FileText],
  ["Vestibulares", GraduationCap],
  ["Calendário", CalendarDays],
  ["Olimpíadas", Sprout],
  ["Ranking", Trophy],
  ["Meu perfil", UserRound],
  ["Loja", Coins],
];
export default function App() {
  useDialogFocus();
  const [store, renderStore] = useState(safeLoad);
  const [page, setPage] = useState(() => new URLSearchParams(location.search).has("duo") ? "Área de foco" : "Meu espaço");
  const [history, setHistory] = useState([]);
  const [focusTask, setFocusTask] = useState(null);
  const [auth, setAuth] = useState(null);
  const [toast, setToast] = useState("");
  const [mobile, setMobile] = useState(false);
  const menuButton = useRef(null);
  const closeMenuButton = useRef(null);
  function closeMenu() {
    setMobile(false);
    menuButton.current?.focus();
  }
  useEffect(() => {
    if (!mobile) return;
    closeMenuButton.current?.focus();
    const escape = event => { if (event.key === "Escape") closeMenu(); };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [mobile]);
  const [search, setSearch] = useState("");
  const [settings, setSettings] = useState(false);
  const [large, setLarge] = useState(false);
  const [contrast, setContrast] = useState(false);
  const account = store.accounts.find((a) => a.id === store.current);
  const student = account?.data || store.demo;
  const profile = student.profile;
  const demo = !account;
  function setStore(change) {
    const apply = () => {
      const previous = safeLoad();
      const next = change(previous);
      if (next === previous) return;
      try {
        localStorage.setItem("wizdom.v1", JSON.stringify(next));
        renderStore(next);
      } catch {
        setToast("Não foi possível salvar os dados do navegador.");
      }
    };
    if (navigator.locks) return navigator.locks.request("wizdom.store", apply);
    apply();
  }
  useEffect(() => {
    if (!localStorage.getItem("wizdom.v1")) setStore(value => ({ ...value }));
    const refresh = event => { if (event.key === "wizdom.v1") renderStore(safeLoad()); };
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);
  useEffect(() => {
    if (toast) {
      const id = setTimeout(() => setToast(""), 5000);
      return () => clearTimeout(id);
    }
  }, [toast]);
  useEffect(() => {
    document.title = `${page} · WIZDOM`;
  }, [page]);
  useEffect(() => {
    const shortcut = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.querySelector(".search-wrap input")?.focus();
      }
    };
    document.addEventListener("keydown", shortcut);
    return () => document.removeEventListener("keydown", shortcut);
  }, []);
  function notify(s) {
    setToast(s);
  }
  function update(key, value) {
    return setStore((s) => {
      const apply = (d) => ({
        ...d,
        [key]: typeof value === "function" ? value(d[key]) : value,
      });
      return account
        ? {
            ...s,
            accounts: s.accounts.map((a) =>
              a.id === account.id ? { ...a, data: apply(a.data) } : a,
            ),
          }
        : { ...s, demo: apply(s.demo) };
    });
  }
  useEffect(() => {
    if (!account) return;
    const grant = () => {
      const day = dayKey();
      update("stats", stats => credit(stats, { id: 'login:' + day, xp: 20, coins: 5, label: 'Acesso diário', day }));
    };
    grant();
    const timer = setInterval(grant, 60_000);
    window.addEventListener('focus', grant);
    return () => { clearInterval(timer); window.removeEventListener('focus', grant); };
  }, [account?.id]);
  function navigate(p, task = null) {
    setFocusTask(task);
    if (p !== page) setHistory(h => [...h, page]);
    setPage(p);
    setMobile(false);
    setSearch("");
    window.scrollTo(0, 0);
  }
  function goBack() {
    setHistory(h => h.slice(0,-1));
    setPage(history.at(-1) || "Meu espaço");
    setMobile(false); setSearch(""); window.scrollTo(0,0);
  }
  function logout() {
    setStore(s=>({...s,current:null}));
    navigate("Meu espaço");
    notify("Você saiu da conta. Voltou ao modo demonstração.");
  }
  function enterDemo(preset = "medicina") {
    setStore(s=>{
      const demos = {...s.demoProfiles};
      if (!demos[preset]) demos[preset] = preset === 'medicina' ? s.demo : newStudent({...initialProfile,name:'Leo',course:'Engenharia',favorite:'Física',difficulty:'Português',hours:1.5,days:[1,3,5,6],routine:'Trabalho e estudo'});
      if(s.demoPreset) demos[s.demoPreset]=s.demo;
      else demos.medicina=s.demo;
      return {...s,current:null,demoPreset:preset,demoProfiles:demos,demo:demos[preset]};
    });
    setAuth(null); navigate("Meu espaço");
    notify("Demonstração aberta. Explore e personalize à vontade.");
  }
  function study(task, openReviews = true) {
    const id=task.topicId || topicsFor(task.subject)[0]?.id;
    if(!topicById(id)) return;
    update("learning",v=>registerTopic(v,id));
    update("stats",s=>noteActivity(s));
    if (task.id && task.date && task.date <= dayKey()) {
      update("completed", v => ({ ...v, [task.date]: [...new Set([...(v[task.date] || []), task.id])] }));
      const day = dayKey();
      if (account) update("stats", stats => credit(stats, { id: 'block:' + day, label: 'Missão diária · concluir um bloco', day, xp: 10, coins: 2 }));
    }
    notify("Assunto estudado! Três flashcards estão disponíveis nas revisões.");
    if(openReviews) navigate("Revisões");
  }
  async function submitAuth({ name, email, password }) {
    email = email.trim().toLowerCase();
    if (auth === "signup") {
      if (store.accounts.some((a) => a.email === email))
        return "Este e-mail já tem cadastro neste navegador. Entre na sua conta.";
      const salt = crypto.randomUUID(),
        hash = await passwordHash(password, salt),
        id = crypto.randomUUID();
      await setStore((s) => ({
        ...s,
        current: id,
        accounts: [
          ...s.accounts,
          { id, email, name, salt, hash, data: newStudent() },
        ],
      }));
      setAuth(null);
      navigate(new URLSearchParams(location.search).has("duo") ? "Área de foco" : "Meu espaço");
      return;
    }
    const a = store.accounts.find((a) => a.email === email);
    if (!a || (await passwordHash(password, a.salt)) !== a.hash)
      return "E-mail ou senha não encontrados neste navegador.";
    await setStore((s) => ({ ...s, current: a.id }));
    setAuth(null);
    navigate(new URLSearchParams(location.search).has("duo") ? "Área de foco" : "Meu espaço");
    notify("Que bom ter você de volta!");
  }
  const shared = {
    profile,
    stats: student.stats,
    setStats: (v) => update("stats", v),
    notify,
  };
  const searchResults = navigation.filter(([name]) =>
    name.toLowerCase().includes(search.toLowerCase()),
  );
  if (auth)
    return (
      <>
        <Auth
          mode={auth}
          setMode={setAuth}
          onSubmit={submitAuth}
          onClose={() => setAuth(null)}
          onDemo={enterDemo}
        />
      </>
    );
  if (account && !profile?.onboarded)
    return (
      <Onboarding
        name={account.name}
        initial={profile}
        onExit={() => profile ? update("profile", p=>({...p,onboarded:true})) : logout()}
        onComplete={(p) => {
          update("profile", p);
          notify("Seu espaço está pronto. Vamos no seu ritmo!");
        }}
      />
    );
  return (
    <div
      data-theme={student.stats.theme || "caderno"}
      className={`app ${large ? "large-type" : ""} ${contrast ? "high-contrast" : ""}`}
    >
      <a className="skip-link" href="#main-content">
        Ir para o conteúdo
      </a>
      {mobile && (
        <div className="mobile-shade" onClick={closeMenu} />
      )}
      <aside className={`sidebar ${mobile ? "open" : ""}`}>
        <a
          href="#"
          className="brand"
          onClick={(e) => {
            e.preventDefault();
            navigate("Meu espaço");
          }}
        >
          <span className="brand-symbol">w</span>wizdom
          <span className="brand-period">.</span>
        </a>
        <span className="sidebar-caption">SEU FUTURO, NO SEU RITMO</span>
        <button
          className="mobile-close icon-button"
          aria-label="Fechar menu"
          ref={closeMenuButton}
          onClick={closeMenu}
        >
          <X />
        </button>
        <div className="nav-group-label">SEU DIA A DIA</div>
        <nav aria-label="Navegação principal">
          {navigation.map(([name, Icon], i) => (
            <div key={name}>
              {i === 4 && <div className="nav-group-label">NOVOS CAMINHOS</div>}
              <button
                className={`nav-item ${page === name ? "active" : ""}`}
                aria-current={page === name ? "page" : undefined}
                onClick={() => navigate(name)}
              >
                <Icon size={19} strokeWidth={1.65} />
                {name}
                {name === "Área de foco" && <span className="nav-dot" />}
              </button>
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-encouragement">
            <span>✧</span>
            <p>
              O importante é continuar.
              <br />
              <strong>Mesmo que devagar.</strong>
            </p>
          </div>
          {demo ? (
            <button className="demo-account" onClick={() => setAuth("signup")}>
              <span className="user-avatar">{profile.name[0]}</span>
              <div>
                <strong>Explorando a WIZDOM</strong>
                <small>
                  Criar minha conta <ArrowUpRight size={12} />
                </small>
              </div>
            </button>
          ) : (
            <button
              className="demo-account"
              onClick={logout}
            >
              <span className="user-avatar">{profile.name[0]}</span>
              <div>
                <strong>{profile.name}</strong>
                <small>
                  Sair da conta <LogOut size={12} />
                </small>
              </div>
            </button>
          )}
        </div>
      </aside>
      <div className="app-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button hamburger"
              aria-label="Abrir menu"
              ref={menuButton}
              aria-expanded={mobile}
              onClick={() => setMobile(true)}
            >
              <Menu />
            </button>
            <button className="icon-button back-button" aria-label="Voltar" disabled={!history.length} onClick={goBack}><ArrowLeft size={18}/></button>
            <span className="breadcrumb">
              Seu cantinho <span>/</span> <strong>{page}</strong>
            </span>
          </div>
          <div className="topbar-actions">
            {demo ? <button className="button secondary top-login" onClick={()=>setAuth("login")}>Entrar</button> : <button className="icon-button" aria-label="Sair da conta" onClick={logout}><LogOut size={18}/></button>}
            <div className="search-wrap">
              <Search size={16} />
              <input
                aria-label="Buscar na WIZDOM"
                placeholder="O que vamos explorar?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <kbd>⌘ K</kbd>
              {search && (
                <div className="search-results">
                  {searchResults.length ? (
                    searchResults.map(([name, Icon]) => (
                      <button key={name} onClick={() => navigate(name)}>
                        <Icon size={17} />
                        {name}
                        <ArrowUpRight size={14} />
                      </button>
                    ))
                  ) : (
                    <p>Nenhuma página encontrada.</p>
                  )}
                </div>
              )}
            </div>
            <button
              className="coin-pill"
              onClick={() => navigate("Loja")}
              title="Suas moedas"
              aria-label={student.stats.coins + " moedas, abrir loja"}
            >
              <Coins size={16} />
              {student.stats.coins}
            </button>
            <button
              className="icon-button notification-button"
              aria-label="Ver lembretes"
              onClick={() => {
                navigate("Calendário");
                notify(
                  "Suas inscrições favoritas e seus dias de estudo ficam no calendário.",
                );
              }}
            >
              <Bell size={19} />
              <i />
            </button>
            <button
              className="top-avatar"
              onClick={() => (demo ? setAuth("login") : navigate("Meu perfil"))}
              aria-label={demo ? "Entrar na conta" : "Abrir perfil"}
            >
              {profile.photo ? (
                <img src={profile.photo} alt="" />
              ) : (
                profile.name[0]
              )}
            </button>
          </div>
        </header>
        <main id="main-content" className="main-content">
          <div className="demo-notice" hidden={!demo}>
            <span>
              <span className="tiny-dot" /> Você está no modo demonstração.
            </span>
            <button onClick={() => setAuth("signup")}>
              Criar minha conta <ArrowRight size={13} />
            </button>
          </div>
          {page !== "Meu espaço" && <Character value={profile.character} className="notebook-vignette" scene={{ "Provas anteriores": "exams", "Área de foco": "focus", "Cronograma": "agenda", "Calendário": "agenda", "Revisões": "review" }[page]} />}
          {page === "Loja" && <Shop {...shared} />}
          {page === "Meu espaço" && (
            <Dashboard
              {...shared}
              onStudy={study}
              learning={student.learning}
              checkins={student.checkins}
              setCheckins={(v) => update("checkins", v)}
              completed={student.completed}
              setCompleted={(v) => update("completed", v)}
              favorites={student.favorites}
              navigate={navigate}
            />
          )}
          {page === "Cronograma" && (
            <Schedule
              profile={profile}
              mood={student.checkins[dayKey()]}
              scheduled={student.scheduled}
              setScheduled={value => update("scheduled", items => value(items || []))}
              completed={student.completed}
              navigate={navigate}
              onStudy={study}
              onEdit={() => {
                if (demo) {
                  notify("Crie uma conta para montar um cronograma só seu.");
                  setAuth("signup");
                } else update("profile", (p) => ({ ...p, onboarded: false }));
              }}
            />
          )}
          {page === "Área de foco" && (
            <div key={account?.id || "demo"}>
              <Focus {...shared} initialTask={focusTask} onStudy={(t)=>study(t,false)} onReview={()=>navigate("Revisões")} />
              <Duo accountId={account?.id} name={profile.name} onLogin={() => setAuth("login")} reward={receipt => update("stats", stats => {
                const day = dayKey();
                const earned = credit(stats, { id: receipt.id, label: "Foco em dupla", xp: receipt.base + receipt.bonus, coins: receipt.coins, day });
                if (earned === stats) return stats;
                return credit(earned, { id: "duo-week:" + weekKey(new Date(), dayKey), label: "Missão semanal · foco em dupla", xp: 15, coins: 3, day });
              })} />
            </div>
          )}
          {page === "Provas anteriores" && <Exams />}
          {page === "Vestibulares" && (
            <Opportunities
              {...shared}
              favorites={student.favorites}
              navigate={navigate}
              setProfile={value => update("profile", value)}
              setFavorites={(v) => update("favorites", v)}
            />
          )}
          {page === "Calendário" && (
            <Calendar {...shared} favorites={student.favorites} scheduled={student.scheduled} />
          )}
          {page === "Olimpíadas" && <Olympics {...shared} favorites={student.olympicFavorites} toggleFavorite={id => update("olympicFavorites", items => (items || []).includes(id) ? items.filter(item => item !== id) : [...(items || []), id])} onPrepare={(item, level) => {
            const date = new Date();
            const key = dayKey(date);
            const base = makePlan(profile, null, date);
            const booked = (student.scheduled || []).filter(task => task.date === key);
            const occupied = [...base.filter(task => !booked.some(item => item.id === task.id)), ...booked].reduce((sum, task) => sum + task.minutes + task.breakAfter, 0);
            if (occupied + 25 > Math.max(25, Number(profile.hours || 1) * 60)) {
              do { date.setDate(date.getDate() + 1); } while (profile.days?.length && profile.days.length < 7 && (profile.days.includes(date.getDay()) || (student.scheduled || []).some(task => task.date === dayKey(date))));
              if (profile.days?.includes(date.getDay())) {
                notify("Sua agenda está cheia. Libere um bloco antes de adicionar a preparação.");
                return;
              }
            }
            const task = { id: "olympic:" + item.name + ":" + dayKey(date), date: dayKey(date), subject: subjectsForOlympics[item.category] || "Matemática", title: "Preparação " + item.name, minutes: 25, breakAfter: 0, kind: level || "Treino", tone: "mint", start: "Flexível", activity: "Escolha um problema da sua modalidade. Tente resolver e anote uma dúvida.", source: item.archive || item.link };
            update("scheduled", items => (items || []).some(entry => entry.id === task.id) ? items : [...(items || []), task]);
            notify("Preparação agendada para " + date.toLocaleDateString("pt-BR") + ".");
            navigate("Cronograma");
          }} />}
          {page === "Ranking" && <Ranking {...shared} />}
          {page === "Meu perfil" && (
            <>
              <Profile {...shared} setProfile={(v) => update("profile", v)} />
              <section className="card notebook-panel"><h2>Meu objetivo</h2><p>{profile.target ? `${profile.course} · edição ${profile.target.edition}` : "Escolha uma instituição, curso e processo."}</p><button className="button secondary" onClick={() => navigate("Vestibulares")}>Escolher objetivo</button></section>
              <CharacterEditor profile={profile} setProfile={value => update("profile", value)} />
            </>
          )}
          {page === "Revisões" && (
            <Reviews
              profile={profile}
              learning={student.learning}
              setLearning={(v) => update("learning", v)}
              stats={student.stats}
              setStats={(v) => update("stats", v)}
              onStudy={study}
              authenticated={Boolean(account)}
              notify={notify}
            />
          )}
          <footer className="app-footer">
            <span>
              wizdom. <span>Feito para respeitar seu ritmo.</span>
            </span>
            <button onClick={() => setSettings(true)}>
              <Settings size={13} /> Conforto e privacidade
            </button>
          </footer>
        </main>
      </div>
      {toast && (
        <div className="toast" role="status">
          <span>
            <Check size={16} />
          </span>
          {toast}
          <button
            className="icon-button"
            aria-label="Fechar aviso"
            onClick={() => setToast("")}
          >
            <X size={15} />
          </button>
        </div>
      )}
      {settings && (
        <div className="modal-backdrop" onClick={() => setSettings(false)}>
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="section-heading">
              <h2 id="settings-title">Seu conforto importa</h2>
              <button
                className="icon-button"
                aria-label="Fechar configurações"
                onClick={() => setSettings(false)}
              >
                <X />
              </button>
            </div>
            <label className="setting-row">
              <span>Texto maior</span>
              <input
                type="checkbox"
                checked={large}
                onChange={(e) => setLarge(e.target.checked)}
              />
            </label>
            <label className="setting-row">
              <span>Contraste reforçado</span>
              <input
                type="checkbox"
                checked={contrast}
                onChange={(e) => setContrast(e.target.checked)}
              />
            </label>
            <div className="privacy-note">
              <ShieldCheck size={22} />
              <div>
                <h3>Um protótipo, no seu navegador</h3>
                <p>
                  Cadastro e dados são locais. Não há autenticação em servidor,
                  envio de e-mails nem sincronização de perfis. O foco em dupla compartilha a sala e o nome exibido. Não use
                  sua senha real. As senhas de teste são armazenadas como hash,
                  mas isto não substitui um sistema de autenticação de produção.
                </p>
                <p>
                  O ranking usa participantes fictícios. Nenhum
                  dado pessoal é publicado.
                </p>
              </div>
            </div>
            <button
              className="button secondary"
              onClick={() => {
                setSettings(false);
                notify(
                  "Para apagar os dados locais, limpe os dados deste site nas configurações do navegador.",
                );
              }}
            >
              Como apagar meus dados
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
