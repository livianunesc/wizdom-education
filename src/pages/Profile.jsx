import Select from "../Select.jsx";
import { useState } from "react";
import {
  BookOpen,
  Camera,
  Check,
  ChevronRight,
  Coins,
  Edit3,
  GraduationCap,
  LockKeyhole,
  ShoppingBag,
  Sparkles,
  Target,
  Timer,
  Trophy,
  X,
} from "lucide-react";
import "./focus-profile.css";

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
const localDateKey = (date) => new Date(date).toLocaleDateString("en-CA");
export default function Profile({
  profile = {},
  setProfile,
  stats = {},
  setStats,
  notify,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [uploadError, setUploadError] = useState("");
  const level = Math.floor((stats.xp || 0) / 100) + 1;
  const sessions = stats.sessions || [];
  const rankingPosition =
    [860, 740, 620, 480, 320].filter((xp) => xp > (stats.xp || 0)).length + 1;
  const totalSeconds = sessions.reduce((sum, item) => sum + item.seconds, 0);
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - 6 + index);
    const seconds = sessions
      .filter((item) => localDateKey(item.date) === localDateKey(date))
      .reduce((sum, item) => sum + item.seconds, 0);
    return {
      label: date
        .toLocaleDateString("pt-BR", { weekday: "short" })
        .replace(".", ""),
      seconds,
      date: date.toLocaleDateString("pt-BR"),
    };
  });
  const maxSeconds = Math.max(3600, ...days.map((item) => item.seconds));
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
    setEditing(false);
    notify?.("Perfil atualizado. Seu espaço, do seu jeito.");
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
    <div className="fp-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">A SUA JORNADA, DO SEU JEITO</p>
          <h1>Meu perfil</h1>
          <p className="muted">
            Muito além de uma nota. Veja tudo o que você está construindo.
          </p>
        </div>
        <button
          className="button secondary"
          onClick={() => {
            setDraft(profile);
            setEditing(true);
          }}
        >
          <Edit3 size={16} /> Editar perfil
        </button>
      </div>
      <section className="card student-profile">
        <div
          className="profile-banner"
          style={
            profile.banner ? { backgroundImage: `url(${profile.banner})` } : {}
          }
        >
          <span>Pequenos passos. Grandes possibilidades.</span>
          <Sparkles size={42} />
        </div>
        <div className="profile-identity">
          <div className="profile-photo">
            {profile.photo ? (
              <img src={profile.photo} alt={`Foto de ${profile.name}`} />
            ) : (
              <WizAvatar outfit={stats.outfit} size={100} />
            )}
          </div>
          <div className="profile-person">
            <h2>
              {profile.name || "Estudante WIZDOM"}{" "}
              <span className="badge">Nível {level}</span>
            </h2>
            <p>
              <GraduationCap size={16} /> Vestibulando(a) de{" "}
              {profile.course || "novas possibilidades"}
            </p>
            <p className="profile-bio">
              {profile.bio || "Construindo meu futuro, um dia de cada vez. 🌱"}
            </p>
          </div>
        </div>
        <div className="profile-xp">
          <span>
            <Sparkles size={15} />
            {stats.xp || 0} XP conquistados
          </span>
          <span>{100 - ((stats.xp || 0) % 100)} XP para o próximo nível</span>
          <progress value={(stats.xp || 0) % 100} max={100} />
        </div>
      </section>
      <div className="profile-stat-grid">
        <div className="card">
          <span className="stat-icon lavender">
            <Timer size={21} />
          </span>
          <strong>
            {Math.floor(totalSeconds / 3600)}h{" "}
            {Math.floor((totalSeconds % 3600) / 60)}min
          </strong>
          <span>de dedicação</span>
        </div>
        <div className="card">
          <span className="stat-icon mint">
            <BookOpen size={21} />
          </span>
          <strong>{sessions.length}</strong>
          <span>sessões concluídas</span>
        </div>
        <div className="card">
          <span className="stat-icon peach">
            <Coins size={21} />
          </span>
          <strong>{stats.coins || 0}</strong>
          <span>moedinhas disponíveis</span>
        </div>
      </div>
      <div className="profile-content-grid">
        <section className="card study-chart">
          <div className="section-heading">
            <div>
              <h2>Um pouquinho a cada dia</h2>
              <p className="muted">Seu tempo de estudo nos últimos 7 dias</p>
            </div>
            <Timer size={20} />
          </div>
          <div className="study-bars">
            {days.map((day) => (
              <div className="study-day" key={day.date}>
                <span>{Math.floor(day.seconds / 60)}min</span>
                <div className="study-bar-track">
                  <div
                    className="study-bar"
                    style={{
                      height: day.seconds
                        ? `${Math.max(4, (day.seconds / maxSeconds) * 100)}%`
                        : "3px",
                    }}
                    title={`${day.date}: ${Math.floor(day.seconds / 60)} minutos`}
                  />
                </div>
                <small>{day.label}</small>
              </div>
            ))}
          </div>
          {!sessions.length && (
            <p className="muted chart-empty">
              Seu gráfico começa a florescer na primeira sessão de foco.
            </p>
          )}
        </section>
        <section className="card profile-goal">
          <span className="stat-icon lavender">
            <Target size={22} />
          </span>
          <h2>O sonho que me move</h2>
          <h3>{profile.course || "Descobrir meu caminho"}</h3>
          <p className="muted">
            {profile.goal || "Construir uma rotina de estudos com mais leveza."}
          </p>
          <div>
            <GraduationCap size={17} />
            <span>Ingresso em {profile.year || "breve"}</span>
          </div>
          <div>
            <BookOpen size={17} />
            <span>{profile.school || "Minha jornada de estudos"}</span>
          </div>
          <div>
            <Trophy size={17} />
            <span>{rankingPosition}º no ranking demonstrativo</span>
          </div>
          <small className="muted">Comparação com estudantes fictícios.</small>
        </section>
      </div>
      <section className="card avatar-shop">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SEU COMPANHEIRO DE JORNADA</p>
            <h2>Um toque de você</h2>
            <p className="muted">
              Troque suas moedinhas por um novo visual para sua corujinha.
            </p>
          </div>
          <span className="badge">
            <Coins size={16} />
            {stats.coins || 0} moedas
          </span>
        </div>
        <div className="shop-layout">
          <div className="shop-preview">
            <WizAvatar outfit={stats.outfit} size={170} />
            <strong>Sua corujinha</strong>
            <span className="muted">Crescendo junto com você</span>
          </div>
          <div className="shop-items">
            {outfits.map((item) => {
              const owned = (stats.owned || ["lavanda"]).includes(item.id),
                equipped = stats.outfit === item.id,
                locked = level < item.level;
              return (
                <div
                  className={`shop-item ${equipped ? "equipped" : ""}`}
                  key={item.id}
                >
                  <span
                    className="outfit-swatch"
                    style={{ background: item.color }}
                  />
                  <strong>{item.name}</strong>
                  <small>
                    {locked
                      ? `Desbloqueia no nível ${item.level}`
                      : owned
                        ? "Já é seu"
                        : `${item.price} moedas`}
                  </small>
                  <button
                    className={`button ${equipped ? "secondary" : "primary"}`}
                    disabled={
                      locked ||
                      equipped ||
                      (!owned && (stats.coins || 0) < item.price)
                    }
                    onClick={() => choose(item)}
                  >
                    {locked ? (
                      <LockKeyhole size={14} />
                    ) : equipped ? (
                      <Check size={14} />
                    ) : !owned ? (
                      <ShoppingBag size={14} />
                    ) : null}
                    {locked
                      ? "Bloqueado"
                      : equipped
                        ? "Em uso"
                        : owned
                          ? "Usar"
                          : "Resgatar"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <div className="card level-roadmap">
        <Sparkles size={23} />
        <div>
          <h3>Cada nível, uma nova possibilidade</h3>
          <p className="muted">
            Nível 1: lavanda e menta · Nível 2: visual pêssego · Nível 3: visual
            céu. A cada 100 XP, você sobe um nível.
          </p>
        </div>
      </div>
      {editing && (
        <div className="modal-backdrop" onClick={() => setEditing(false)}>
          <form
            className="modal profile-edit-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
            onSubmit={save}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="section-heading">
              <h2 id="edit-profile-title">Seu perfil, do seu jeito</h2>
              <button
                className="button secondary icon-button"
                type="button"
                aria-label="Fechar edição"
                onClick={() => setEditing(false)}
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
                onClick={() => setEditing(false)}
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
