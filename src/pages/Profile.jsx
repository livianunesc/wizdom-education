import Select from "../Select.jsx";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Coins,
  Edit3,
  Flame,
  GraduationCap,
  LockKeyhole,
  ShoppingBag,
  Sparkles,
  Target,
  Timer,
  Zap,
  X,
} from "lucide-react";
import Character from "../Character.jsx";
import { dayKey } from "../lib.js";
import { streakFor } from "../learning.js";
import "./focus-profile.css";
import "./profile-studio.css";

const outfits = [
  { id: "lavanda", name: "Lavanda", color: "#b8aedb", price: 0, level: 1 },
  {
    id: "menta",
    name: "Brisa de menta",
    color: "#99c8b0",
    price: 50,
    level: 1,
  },
  {
    id: "pessego",
    name: "Sol de pêssego",
    color: "#edb28f",
    price: 80,
    level: 2,
  },
  {
    id: "azul",
    name: "Céu de possibilidades",
    color: "#92b6d4",
    price: 120,
    level: 3,
  },
];
export function WizAvatar({ outfit = "lavanda", size = 128 }) {
  const color = outfits.find((item) => item.id === outfit)?.color || "#b8aedb";
  return (
    <svg
      className="wiz-avatar"
      width={size}
      height={size}
      viewBox="0 0 160 160"
      role="img"
      aria-label="Seu personagem WIZDOM"
    >
      <ellipse cx="80" cy="146" rx="44" ry="6" fill="#373743" opacity=".08" />
      <path
        d="M39 68 33 27 65 44Q81 38 96 44L126 27 121 68Q140 138 80 142 21 139 39 68"
        fill={color}
      />
      <path d="M36 82Q17 89 24 116L45 111" fill={color} />
      <path d="M124 82Q144 89 136 116L114 111" fill={color} />
      <ellipse cx="61" cy="80" rx="24" ry="28" fill="#fffaf6" />
      <ellipse cx="100" cy="80" rx="24" ry="28" fill="#fffaf6" />
      <circle cx="64" cy="80" r="6" fill="#373743" />
      <circle cx="97" cy="80" r="6" fill="#373743" />
      <circle cx="66" cy="78" r="2" fill="white" />
      <circle cx="99" cy="78" r="2" fill="white" />
      <path d="m74 94 6 8 6-8" fill="#e9b870" />
      <ellipse cx="49" cy="96" rx="7" ry="4" fill="#f3c3c6" />
      <ellipse cx="111" cy="96" rx="7" ry="4" fill="#f3c3c6" />
      <path
        d="m59 144 5-6 6 6m20 0 5-6 6 6"
        fill="none"
        stroke="#b4875e"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="m67 116 4 4m9-4 4 4m9-4 4 4"
        stroke="#fffaf6"
        strokeWidth="3"
        strokeLinecap="round"
        opacity=".8"
      />
    </svg>
  );
}
export default function Profile({
  profile = {},
  setProfile,
  stats = {},
  setStats,
  notify,
  learning,
  completed = {},
  navigate,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [uploadError, setUploadError] = useState("");
  const editButton = useRef(null);
  const xp = stats.xp || 0;
  const level = Math.floor(xp / 100) + 1;
  const levelProgress = xp % 100;
  const sessions = stats.sessions || [];
  const totalSeconds = sessions.reduce((sum, item) => sum + item.seconds, 0);
  const completedBlocks = Object.values(completed).reduce((sum, tasks) => sum + tasks.length, 0);
  const answers = learning?.answers || [];
  const correctAnswers = answers.filter((answer) => answer.correct).length;
  const accuracy = Math.round((100 * correctAnswers) / (answers.length || 1));
  const streak = streakFor(stats);
  const targetYear = profile.target?.edition
    ? `Edição ${profile.target.edition}`
    : /^\d{4}$/.test(profile.year) ? `Ingresso em ${profile.year}` : profile.year;
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - 6 + index);
    const seconds = sessions
      .filter((item) => dayKey(new Date(item.date)) === dayKey(date))
      .reduce((sum, item) => sum + item.seconds, 0);
    return {
      label: date
        .toLocaleDateString("pt-BR", { weekday: "short" })
        .replace(".", ""),
      seconds,
      date: date.toLocaleDateString("pt-BR"),
    };
  });
  const maxSeconds = Math.max(60, ...days.map((item) => item.seconds));
  function closeEditor() {
    setEditing(false);
    editButton.current?.focus();
  }
  useEffect(() => {
    if (!editing) return;
    function handleEscape(event) {
      if (event.key === "Escape" && !event.defaultPrevented) closeEditor();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [editing]);
  function readImage(event, key) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setUploadError("Escolha uma imagem JPG, PNG ou WebP.");
      return;
    }
    if (file.size > 350 * 1024) {
      setUploadError(
        "Escolha uma imagem de até 350 KB para salvar neste protótipo.",
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setDraft((previous) => ({ ...previous, [key]: reader.result }));
      setUploadError("");
    };
    reader.readAsDataURL(file);
  }
  function save(event) {
    event.preventDefault();
    setProfile((previous) => ({
      ...previous,
      ...draft,
      name: draft.name.trim(),
      course: draft.course?.trim() || "Meu próximo passo",
    }));
    closeEditor();
    notify?.("Perfil atualizado.");
  }
  function choose(item) {
    if (level < item.level) return;
    if ((stats.owned || ["lavanda"]).includes(item.id)) {
      setStats((previous) => ({ ...previous, outfit: item.id }));
      return;
    }
    if ((stats.coins || 0) < item.price) {
      notify?.("Você ainda precisa de mais moedinhas para esse visual.");
      return;
    }
    setStats((previous) => {
      if ((previous.owned || ["lavanda"]).includes(item.id))
        return { ...previous, outfit: item.id };
      if (previous.coins < item.price) return previous;
      return {
        ...previous,
        coins: previous.coins - item.price,
        owned: [...(previous.owned || ["lavanda"]), item.id],
        outfit: item.id,
      };
    });
    notify?.("Um novo visual para acompanhar sua jornada!");
  }
  return (
    <div className="fp-page profile-studio">
      <div className="page-heading">
        <div>
          <h1>Meu perfil</h1>
          <p className="muted">Acompanhe seu estudo, sua experiência e sua coleção.</p>
        </div>
        <button
          className="button secondary"
          ref={editButton}
          onClick={() => {
            setDraft(profile);
            setUploadError("");
            setEditing(true);
          }}
        >
          <Edit3 size={16} /> Editar perfil
        </button>
      </div>

      <section className="profile-summary" aria-label="Resumo do estudante">
        <div className="profile-cover">
          {profile.banner && <img className="profile-cover-image" src={profile.banner} alt="" />}
          <div className="profile-person">
            <span className="badge"><Zap size={14} aria-hidden="true" /> Nível {level}</span>
            <h2>{profile.name || "Estudante Wizdom"}</h2>
            {profile.course && <p className="profile-course"><GraduationCap size={17} aria-hidden="true" /> {profile.course}</p>}
            {profile.bio && <p className="profile-about">{profile.bio}</p>}
            <a className="profile-collection-link" href="#profile-collection">
              Ver minha coleção <ArrowDown size={15} aria-hidden="true" />
            </a>
          </div>
          <div className="profile-portrait">
            <div className="profile-portrait-orbit" aria-hidden="true" />
            <div className="profile-portrait-art">
              {profile.photo ? (
                <img src={profile.photo} alt={`Foto de ${profile.name || "perfil"}`} />
              ) : (
                <Character value={profile.character} />
              )}
            </div>
            <Sparkles className="profile-portrait-spark" size={31} aria-hidden="true" />
            <Zap className="profile-portrait-bolt" size={23} aria-hidden="true" />
          </div>
        </div>
        <div className="profile-metrics">
          <div className="profile-metric profile-metric-xp">
            <span className="profile-metric-icon"><Zap size={18} aria-hidden="true" /></span>
            <div><span>Experiência</span><strong>{xp} <small>XP</small></strong></div>
            <progress aria-label="XP no nível atual" value={levelProgress} max={100} />
            <small>Faltam {100 - levelProgress} XP para o nível {level + 1}</small>
          </div>
          <div className="profile-metric profile-metric-streak">
            <span className="profile-metric-icon"><Flame size={18} aria-hidden="true" /></span>
            <div><span>Sequência atual</span><strong>{streak} <small>{streak === 1 ? "dia" : "dias"}</small></strong></div>
          </div>
          <div className="profile-metric profile-metric-coins">
            <span className="profile-metric-icon"><Coins size={18} aria-hidden="true" /></span>
            <div><span>Saldo</span><strong>{stats.coins || 0} <small>moedas</small></strong></div>
          </div>
        </div>
      </section>

      <section className="profile-progress" aria-labelledby="profile-progress-title">
        <div className="profile-section-heading">
          <h2 id="profile-progress-title">Meu progresso</h2>
          {navigate && <button className="button secondary" onClick={() => navigate("Cronograma")}>Ver cronograma <ArrowRight size={16} aria-hidden="true" /></button>}
        </div>
        <div className="profile-progress-grid">
          <section className="profile-panel">
            <h3><Timer size={19} aria-hidden="true" /> Tempo de foco</h3>
            <p className="profile-panel-caption">Últimos 7 dias</p>
            <div className="profile-chart">
              {days.map((day) => (
                <div className="profile-chart-day" key={day.date}>
                  <span>{Math.floor(day.seconds / 60)} min</span>
                  <div className="profile-chart-track" title={`${day.date} · ${Math.floor(day.seconds / 60)} min`}>
                    <i style={{ height: day.seconds ? `${Math.max(4, (day.seconds / maxSeconds) * 100)}%` : "3px" }} />
                  </div>
                  <small>{day.label}</small>
                </div>
              ))}
            </div>
            <div className="profile-panel-footer">
              <span><strong>{Math.floor(totalSeconds / 3600)}h {Math.floor((totalSeconds % 3600) / 60)}min</strong> registrados</span>
              <span><strong>{sessions.length}</strong> sessões</span>
            </div>
          </section>
          <section className="profile-panel">
            <h3><BookOpen size={19} aria-hidden="true" /> Questões de revisão</h3>
            {answers.length ? (
              <div className="profile-accuracy">
                <div className="profile-accuracy-ring" aria-label={`${accuracy}% de acertos`} style={{ "--profile-accuracy": `${accuracy}%` }}>
                  <strong>{accuracy}%</strong><small>de acertos</small>
                </div>
                <dl>
                  <div><dt>Acertos</dt><dd>{correctAnswers}</dd></div>
                  <div><dt>Erros</dt><dd>{answers.length - correctAnswers}</dd></div>
                </dl>
              </div>
            ) : (
              <div className="profile-questions-empty">
                <span><BookOpen size={22} aria-hidden="true" /></span>
                <p>Seu histórico aparece após a primeira questão respondida.</p>
              </div>
            )}
            <div className="profile-panel-footer">
              <span><strong>{answers.length}</strong> respostas</span>
              {navigate && <button className="button secondary" onClick={() => navigate("Revisões")}>Abrir revisões</button>}
            </div>
          </section>
          <section className="profile-panel profile-target-panel">
            <h3><Target size={19} aria-hidden="true" /> Objetivo de estudo</h3>
            <div className="profile-target-detail">
              <strong>{profile.course || "Escolha um curso"}</strong>
              {targetYear && <p>{targetYear}</p>}
              {profile.goal && <p>{profile.goal}</p>}
              <span>{completedBlocks} {completedBlocks === 1 ? "bloco concluído" : "blocos concluídos"}</span>
            </div>
            {navigate && <button className="button secondary" onClick={() => navigate("Vestibulares")}>Ver vestibulares <ArrowRight size={16} aria-hidden="true" /></button>}
          </section>
        </div>
      </section>

      <section className="profile-panel avatar-shop" id="profile-collection" aria-labelledby="profile-collection-title">
        <div className="section-heading">
          <div>
            <h2 id="profile-collection-title">Minha coleção</h2>
            <p className="muted">Use as moedas para resgatar visuais para a sua coruja.</p>
          </div>
          <span className="badge">
            <Coins size={16} aria-hidden="true" />
            {stats.coins || 0} moedas
          </span>
        </div>
        <div className="shop-layout">
          <div className="shop-preview">
            <WizAvatar outfit={stats.outfit} size={124} />
            <strong>Sua coruja</strong>
            <span className="muted">{outfits.find((item) => item.id === stats.outfit)?.name || "Lavanda"}</span>
          </div>
          <div className="shop-items">
            {outfits.map((item) => {
              const owned = (stats.owned || ["lavanda"]).includes(item.id);
              const equipped = (stats.outfit || "lavanda") === item.id;
              const locked = level < item.level;
              return (
                <div className={`shop-item ${equipped ? "equipped" : ""}`} key={item.id}>
                  <span className="outfit-swatch" style={{ background: item.color }} aria-hidden="true" />
                  <strong>{item.name}</strong>
                  <small>
                    {locked ? `Desbloqueia no nível ${item.level}` : owned ? "Já é seu" : `${item.price} moedas`}
                  </small>
                  <button
                    className={`button ${equipped || owned ? "secondary" : "primary"}`}
                    disabled={locked || equipped || (!owned && (stats.coins || 0) < item.price)}
                    onClick={() => choose(item)}
                  >
                    {locked && <LockKeyhole size={14} aria-hidden="true" />}
                    {equipped && <Check size={14} aria-hidden="true" />}
                    {!locked && !owned && <ShoppingBag size={14} aria-hidden="true" />}
                    {locked ? "Bloqueado" : equipped ? "Em uso" : owned ? "Usar" : "Resgatar"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {editing && (
        <div className="modal-backdrop" onClick={closeEditor}>
          <form
            className="modal profile-edit-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
            onSubmit={save}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="section-heading">
              <h2 id="edit-profile-title">Editar perfil</h2>
              <button
                className="button secondary icon-button"
                type="button"
                aria-label="Fechar edição"
                onClick={closeEditor}
              >
                <X size={18} />
              </button>
            </div>
            <label className="field">
              Como você quer ser chamado(a)?
              <input
                required
                value={draft.name || ""}
                maxLength={45}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </label>
            <label className="field">
              Bio
              <textarea
                rows="3"
                value={draft.bio || ""}
                maxLength={180}
                onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                placeholder="Um pouquinho sobre você…"
              />
            </label>
            <div className="form-grid">
              <label className="field">
                Meu curso dos sonhos
                <input
                  value={draft.course || ""}
                  maxLength={60}
                  onChange={(e) =>
                    setDraft({ ...draft, course: e.target.value })
                  }
                />
              </label>
              <label className="field">
                Quando quero ingressar
                <input
                  value={draft.year || ""}
                  maxLength={35}
                  placeholder="2027 ou ainda estou descobrindo"
                  onChange={(e) => setDraft({ ...draft, year: e.target.value })}
                />
              </label>
            </div>
            <label className="field">
              Minha meta
              <input
                value={draft.goal || ""}
                maxLength={140}
                onChange={(e) => setDraft({ ...draft, goal: e.target.value })}
              />
            </label>
            <label className="field">
              Escolaridade
              <Select
                value={draft.school || "Ensino médio"}
                onChange={(e) => setDraft({ ...draft, school: e.target.value })}
              >
                <option>Ensino médio</option>
                <option>Ensino médio concluído</option>
              </Select>
            </label>
            <div className="form-grid">
              <label className="field">
                Foto de perfil
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => readImage(e, "photo")}
                />
              </label>
              <label className="field">
                Imagem do banner
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => readImage(e, "banner")}
                />
              </label>
            </div>
            <small className="muted">
              JPG, PNG ou WebP de até 350 KB. As imagens ficam neste navegador.
            </small>
            {uploadError && (
              <p role="alert" className="upload-error">
                {uploadError}
              </p>
            )}
            <div className="modal-actions">
              <button
                className="button secondary"
                type="button"
                onClick={closeEditor}
              >
                Cancelar
              </button>
              <button className="button primary" type="submit">
                <Check size={16} /> Salvar meu perfil
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
