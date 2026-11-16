import Select from "../Select.jsx";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  BookOpen,
  Check,
  Coins,
  Coffee,
  Headphones,
  Hourglass,
  LockKeyhole,
  Pause,
  Play,
  Sparkles,
  Square,
  Timer,
  X,
} from "lucide-react";
import "./focus-profile.css";
import { topicsFor } from "../curriculum.js";
import { Confetti, StreakWeek } from "../Celebration.jsx";
import { streakFor } from "../learning.js";

const subjects = [
  "Biologia",
  "Matemática",
  "Português",
  "Redação",
  "Química",
  "Física",
  "História",
  "Geografia",
  "Filosofia",
  "Inglês",
];
const formatTime = (seconds) =>
  `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0")}`;

function focusStorageKey() {
  try {
    return `wizdom-focus.${JSON.parse(localStorage.getItem("wizdom.v1"))?.current || "demo"}`;
  } catch {
    return "wizdom-focus.demo";
  }
}
function recoverFocus(key) {
  try {
    const saved = JSON.parse(sessionStorage.getItem(key));
    if (
      saved?.session &&
      ["pomodoro", "alarm", "stopwatch"].includes(saved.session.mode) &&
      Number.isFinite(saved.elapsed)
    )
      return saved;
  } catch {}
  return null;
}
export default function Focus({
  profile = {},
  stats,
  setStats,
  notify,
  initialTask,
  onStudy,
  onReview,
}) {
  const storageKey = useRef(focusStorageKey());
  const recovered = useRef(recoverFocus(storageKey.current));
  const overlayRef = useRef(null);
  const [subject, setSubject] = useState(
    initialTask?.subject || profile.favorite || "Biologia",
  );
  const [topicId, setTopicId] = useState(initialTask?.topicId || topicsFor(initialTask?.subject || profile.favorite)[0].id);
  const [title, setTitle] = useState(
    initialTask?.title || "Um passo mais perto do meu sonho",
  );
  const [mode, setMode] = useState(initialTask ? "alarm" : "pomodoro");
  const [minutes, setMinutes] = useState(initialTask?.minutes || 30);
  const [session, setSession] = useState(recovered.current?.session || null);
  const [paused, setPaused] = useState(Boolean(recovered.current));
  const [phase, setPhase] = useState(recovered.current?.phase || "focus");
  const [elapsed, setElapsed] = useState(recovered.current?.elapsed || 0);
  const [result, setResult] = useState(null);
  const started = useRef(0);
  const accumulated = useRef(recovered.current?.elapsed || 0);
  const rewarded = useRef(recovered.current?.rewarded || false);
  const transitioning = useRef(false);
  const rewardResult = useRef(recovered.current?.rewardResult || null);
  const getElapsed = () =>
    accumulated.current +
    (paused ? 0 : Math.max(0, Date.now() - started.current) / 1000);

  function reward(seconds, selected) {
    if (rewarded.current) return rewardResult.current;
    rewarded.current = true;
    const safeSeconds = Math.max(0, Math.floor(seconds));
    const fullMinutes = Math.floor(safeSeconds / 60);
    const earned = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      subject: selected.subject,
      title: selected.title,
      topicId: selected.topicId,
      seconds: safeSeconds,
      xp: fullMinutes * 4,
      coins: fullMinutes * 2,
    };
    rewardResult.current = earned;
    if (safeSeconds > 0)
      setStats((previous) => ({
        ...previous,
        xp: (previous.xp || 0) + earned.xp,
        coins: (previous.coins || 0) + earned.coins,
        sessions: [...(previous.sessions || []), earned],
      }));
    if (safeSeconds >= 60 && onStudy) onStudy({ topicId: selected.topicId || topicsFor(selected.subject)[0].id, subject: selected.subject, id: selected.taskId, date: selected.taskDate });
    return earned;
  }
  function finishStudy(seconds, selected, auto = false) {
    if (transitioning.current) return;
    transitioning.current = true;
    const earned = reward(seconds, selected);
    if (auto && selected.mode === "pomodoro") {
      setPhase("break");
      accumulated.current = 0;
      started.current = Date.now();
      setElapsed(0);
      setPaused(false);
      notify?.("Bloco concluído! Agora, 5 minutos para respirar.");
      transitioning.current = false;
    } else {
      setSession(null);
      setResult(earned);
    }
  }
  useEffect(() => {
    if (!session || paused) return;
    const tick = () => {
      const current = getElapsed();
      setElapsed(current);
      const limit =
        phase === "break"
          ? 300
          : session.mode === "pomodoro"
            ? 1800
            : session.mode === "alarm"
              ? session.minutes * 60
              : Infinity;
      if (current >= limit) {
        if (phase === "break") {
          setSession(null);
          setResult(rewardResult.current);
        } else finishStudy(limit, session, true);
      }
    };
    const id = window.setInterval(tick, 250);
    tick();
    return () => clearInterval(id);
  }, [session, paused, phase]);
  useEffect(() => {
    try {
      if (!session) {
        sessionStorage.removeItem(storageKey.current);
        return;
      }
      sessionStorage.setItem(
        storageKey.current,
        JSON.stringify({
          session,
          phase,
          elapsed,
          rewarded: rewarded.current,
          rewardResult: rewardResult.current,
        }),
      );
    } catch {}
  }, [session, phase, elapsed, paused]);
  useEffect(() => {
    if (recovered.current)
      notify?.(
        "Sua sessão foi recuperada e está em pausa. Continue quando estiver pronto(a).",
      );
  }, []);
  useEffect(() => {
    if (!session) return;
    const previous = document.body.style.overflow;
    const root = document.getElementById("root");
    const previousInert = root?.inert;
    const previousFocus = document.activeElement;
    document.body.style.overflow = "hidden";
    if (root) root.inert = true;
    overlayRef.current?.querySelector("button")?.focus();
    const trap = (event) => {
      if (event.key !== "Tab") return;
      const controls = [
        ...(overlayRef.current?.querySelectorAll(
          'button:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex="0"]',
        ) || []),
      ];
      if (!controls.length) return;
      const first = controls[0],
        last = controls[controls.length - 1];
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !overlayRef.current.contains(document.activeElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !overlayRef.current.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", trap);
    return () => {
      document.body.style.overflow = previous;
      if (root) root.inert = previousInert;
      document.removeEventListener("keydown", trap);
      previousFocus?.focus?.();
    };
  }, [Boolean(session)]);
  useEffect(() => {
    if (!session) return;
    const warn = (event) => {
      try {
        sessionStorage.setItem(
          storageKey.current,
          JSON.stringify({
            session,
            phase,
            elapsed: getElapsed(),
            rewarded: rewarded.current,
            rewardResult: rewardResult.current,
          }),
        );
      } catch {}
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [session, phase, paused]);
  function start(event) {
    event.preventDefault();
    rewarded.current = false;
    transitioning.current = false;
    rewardResult.current = null;
    accumulated.current = 0;
    started.current = Date.now();
    setElapsed(0);
    setPaused(false);
    setPhase("focus");
    setSession({
      subject,
      topicId,
      taskId: initialTask?.topicId === topicId ? initialTask.id : undefined,
      taskDate: initialTask?.topicId === topicId ? initialTask.date : undefined,
      title: title.trim() || "Minha sessão de estudos",
      mode,
      minutes: Math.max(1, Math.min(180, Number(minutes))),
    });
  }
  function togglePause() {
    if (paused) started.current = Date.now();
    else {
      accumulated.current = getElapsed();
      setElapsed(accumulated.current);
    }
    setPaused(!paused);
  }
  function leave() {
    if (phase === "break") {
      setSession(null);
      setResult(rewardResult.current);
      return;
    }
    if (
      window.confirm(
        "Sair desta sessão? O tempo desta sessão não será salvo. Para registrar seu estudo, escolha “Concluir por hoje”.",
      )
    ) {
      setSession(null);
      notify?.("Tudo bem fazer uma pausa. Volte no seu ritmo.");
    }
  }
  const limit =
    phase === "break"
      ? 300
      : session?.mode === "pomodoro"
        ? 1800
        : session?.mode === "alarm"
          ? session.minutes * 60
          : Infinity;
  const shown =
    session?.mode === "stopwatch" && phase === "focus"
      ? elapsed
      : Math.max(0, limit - elapsed);
  const totalMinutes = Math.floor(
    (stats?.sessions || []).reduce((sum, item) => sum + item.seconds, 0) / 60,
  );
  return (
    <div className="fp-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">UM MOMENTO SÓ SEU</p>
          <h1>Seu espaço de foco</h1>
          <p className="muted">
            Uma coisa de cada vez. Você não precisa dar conta de tudo hoje.
          </p>
        </div>
        <span className="badge">
          <Headphones size={15} /> Menos distrações, mais presença
        </span>
      </div>
      <div className="focus-layout">
        <form className="card focus-settings" onSubmit={start}>
          <div className="section-heading">
            <h2>O que vamos estudar?</h2>
            <span className="focus-small-icon">
              <BookOpen size={20} />
            </span>
          </div>
          <label className="field">
            Matéria
            <Select
              value={subject}
              onChange={(e) => { setSubject(e.target.value); setTopicId(topicsFor(e.target.value)[0].id); }}
            >
              {[
                ...new Set([profile.favorite, ...subjects].filter(Boolean)),
              ].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Select>
          </label>
          <label className="field">
            Assunto para revisar depois
            <Select value={topicId} onChange={e=>setTopicId(e.target.value)}>{topicsFor(subject).map(t=><option key={t.id} value={t.id}>{t.title}</option>)}</Select>
          </label>
          <label className="field">
            Nome da sessão
            <input
              value={title}
              maxLength={90}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex.: revisar funções do 2º grau"
            />
          </label>
          <fieldset className="timer-modes">
            <legend>Encontre o seu ritmo</legend>
            {[
              {
                id: "pomodoro",
                name: "Pomodoro",
                sub: "30 min + 5 min de pausa",
                icon: Coffee,
              },
              {
                id: "alarm",
                name: "Temporizador",
                sub: "Um tempo definido por você",
                icon: Hourglass,
              },
              {
                id: "stopwatch",
                name: "Cronômetro",
                sub: "Estude sem contagem regressiva",
                icon: Timer,
              },
            ].map((item) => (
              <label
                className={`timer-option ${mode === item.id ? "selected" : ""}`}
                key={item.id}
              >
                <input
                  type="radio"
                  name="mode"
                  value={item.id}
                  checked={mode === item.id}
                  onChange={() => setMode(item.id)}
                />
                <item.icon size={21} />
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.sub}</small>
                </span>
                {mode === item.id && <Check size={17} />}
              </label>
            ))}
          </fieldset>
          {mode === "alarm" && (
            <label className="field">
              Duração em minutos
              <input
                type="number"
                min="1"
                max="180"
                required
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
              />
            </label>
          )}
          <button className="button primary focus-start" type="submit">
            <Play size={17} fill="currentColor" /> Começar meu momento{" "}
            <ArrowRight size={17} />
          </button>
          <p className="focus-reward-note">
            <Coins size={15} /> Cada minuto de estudo vale 4 XP e 2 moedas.
          </p>
        </form>
        <div className="focus-aside">
          <div className="focus-quote-card">
            <div className="focus-sun">✦</div>
            <p>
              Você está plantando
              <br />o seu futuro.
            </p>
            <span>
              Até os pequenos passos
              <br />
              te levam mais longe.
            </span>
            <div className="focus-sprout">
              <i />
              <i />
              <b />
            </div>
          </div>
          <div className="card focus-summary">
            <h3>Seu tempo tem valor</h3>
            <div>
              <Timer size={21} />
              <strong>
                {totalMinutes} <small>min de dedicação</small>
              </strong>
            </div>
            <p className="muted">
              As pausas também fazem parte do caminho. Respeite o seu ritmo.
            </p>
          </div>
        </div>
      </div>
      {!!(stats?.sessions || []).length && (
        <section className="card focus-history">
          <div className="section-heading">
            <h2>Seus últimos momentos</h2>
            <span className="muted">Cada sessão conta</span>
          </div>
          {[...stats.sessions]
            .reverse()
            .slice(0, 4)
            .map((item) => (
              <div className="focus-history-row" key={item.id}>
                <span className="focus-small-icon">
                  <BookOpen size={18} />
                </span>
                <div>
                  <strong>{item.title}</strong>
                  <small>
                    {item.subject} ·{" "}
                    {new Date(item.date).toLocaleDateString("pt-BR")}
                  </small>
                </div>
                <span>{formatTime(item.seconds)}</span>
                <span className="badge">+{item.xp} XP</span>
              </div>
            ))}
        </section>
      )}
      {session &&
        createPortal(
          <div
            ref={overlayRef}
            className="focus-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="focus-title"
          >
            <button className="focus-exit button secondary" onClick={leave}>
              <X size={17} /> Sair do foco
            </button>
            <div className="focus-overlay-content">
              <span className="focus-mode-tag">
                <LockKeyhole size={15} />
                {phase === "break" ? "PAUSA MERECIDA" : "SEU MOMENTO DE FOCO"}
              </span>
              <h1 id="focus-title">
                {phase === "break"
                  ? "Respire. Você está indo bem."
                  : session.title}
              </h1>
              <p>
                {phase === "break"
                  ? "Levante, beba uma água e descanse os olhos."
                  : session.subject + " · Uma coisa de cada vez."}
              </p>
              <div
                className={`focus-clock ${phase === "break" ? "break-clock" : ""}`}
                style={{
                  "--progress": `${limit === Infinity ? 100 : Math.min(100, (elapsed / limit) * 100)}%`,
                }}
              >
                <div>
                  <span>{formatTime(shown)}</span>
                  <small>
                    {paused
                      ? "Em pausa"
                      : phase === "break"
                        ? "Tempo de descanso"
                        : session.mode === "stopwatch"
                          ? "Tempo dedicado"
                          : "Tempo para você"}
                  </small>
                </div>
              </div>
              <div className="focus-overlay-actions">
                <button className="button primary" onClick={togglePause}>
                  {paused ? <Play size={18} /> : <Pause size={18} />}{" "}
                  {paused ? "Continuar" : "Pausar"}
                </button>
                <button
                  className="button secondary"
                  onClick={() =>
                    phase === "break"
                      ? (setSession(null), setResult(rewardResult.current))
                      : finishStudy(getElapsed(), session)
                  }
                >
                  <Square size={16} />
                  {phase === "break" ? "Finalizar pausa" : "Concluir por hoje"}
                </button>
              </div>
              <p className="focus-kind-note">
                Seu esforço importa. Seu descanso também.
              </p>
            </div>
          </div>,
          document.body,
        )}
      {result && (
        <div className="modal-backdrop" onClick={() => setResult(null)}>
          <div
            className="modal focus-result"
            role="dialog"
            aria-modal="true"
            aria-labelledby="result-title"
            onClick={(e) => e.stopPropagation()}
          >
            <Confetti/>
            <span className="result-icon">
              <Sparkles size={30} />
            </span>
            <p className="eyebrow">MAIS UM PASSO NO SEU CAMINHO</p>
            <h2 id="result-title">Você fez acontecer!</h2>
            <p>
              {formatTime(result.seconds)} de dedicação em {result.subject}.
              <br />
              Tenha orgulho do seu progresso.
            </p>
            <div className="result-rewards">
              <span>
                <strong>+{result.xp}</strong> XP conquistados
              </span>
              <span>
                <strong>+{result.coins}</strong> moedinhas
              </span>
            </div>
            <p className="focus-streak"><strong>{streakFor(stats)} dias de ofensiva</strong> · seu esforço está florescendo.</p><StreakWeek stats={stats}/>
            {result.seconds >= 60 && <button className="button secondary" onClick={()=>{setResult(null);onReview?.();}}>Revisar este assunto <BookOpen size={17}/></button>}
            {result.seconds < 60 && (
              <p className="muted">
                As recompensas contam a cada minuto completo de estudo.
              </p>
            )}
            <button className="button primary" onClick={() => setResult(null)}>
              Guardar essa conquista <Check size={17} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
