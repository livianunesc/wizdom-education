import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Compass,
  ArrowUpRight,
  GraduationCap,
} from "lucide-react";
import Character from "./Character.jsx";
import compassBooks from "./assets/compass-books.webp";
import "./auth.css";

export default function Auth({ mode, setMode, onSubmit, onClose, onDemo }) {
  const signup = mode === "signup";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const update = (key, value) => setForm((v) => ({ ...v, [key]: value }));
  async function submit(e) {
    e.preventDefault();
    setError("");
    if (signup && !form.name.trim()) {
      setError("Como podemos chamar você?");
      return;
    }
    if (form.password.length < 8) {
      setError("Use uma senha de demonstração com pelo menos 8 caracteres.");
      return;
    }
    setBusy(true);
    try {
      const message = await onSubmit({
        ...form,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
      });
      if (message) setError(message);
    } catch {
      setError("Não foi possível continuar. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }
  function switchMode() {
    setError("");
    setMode(signup ? "login" : "signup");
  }
  return (
    <main className="auth-screen">
      <section className="auth-story">
        <button
          className="auth-brand"
          onClick={onClose}
          aria-label="WIZDOM, voltar à demonstração"
        >
          <span className="studio-mark" aria-hidden="true"><Compass size={23} /></span> wizdom<span>.</span>
        </button>
        <div className="auth-story-content">
          <div className="auth-illustration-scene">
            <span className="auth-orbit orbit-one" aria-hidden="true" />
            <span className="auth-orbit orbit-two" aria-hidden="true" />
            <img src={compassBooks} width="630" height="630" alt="" />
          </div>
          <h1>Seu próximo passo começa aqui.</h1>
          <p>Planeje a semana, pratique por assunto e acompanhe sua evolução para o vestibular.</p>
        </div>
      </section>
      <section className="auth-form-section">
        <button className="auth-back" onClick={onClose}>
          <ArrowLeft size={16} /> Voltar à demonstração
        </button>
        <div className="auth-form-content">
          <span className="auth-welcome-icon"><GraduationCap size={26} /></span>
          <Character className="auth-mobile-character notebook-vignette" />
          <h2>{signup ? "Crie sua conta" : "Entre na Wizdom"}</h2>
          <p className="muted">
            {signup
              ? "Monte seu cronograma e salve seu progresso."
              : "Acesse seu cronograma, suas questões e seu progresso."}
          </p>
          <div className="auth-tabs" aria-label="Acesso">
            <button
              className={!signup ? "active" : ""}
              aria-pressed={!signup}
              onClick={() => {
                setError("");
                setMode("login");
              }}
            >
              Entrar
            </button>
            <button
              className={signup ? "active" : ""}
              aria-pressed={signup}
              onClick={() => {
                setError("");
                setMode("signup");
              }}
            >
              Criar conta
            </button>
          </div>
          <form onSubmit={submit}>
            {signup && (
              <label className="field">
                Como podemos chamar você?
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  autoComplete="given-name"
                  placeholder="Seu primeiro nome"
                  maxLength={50}
                  required
                />
              </label>
            )}
            <label className="field">
              E-mail
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                autoComplete="email"
                placeholder="voce@exemplo.com"
                required
                maxLength={150}
              />
            </label>
            <label className="field">
              Senha de demonstração
              <div className="password-input">
                <input
                  type={visible ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  autoComplete={signup ? "new-password" : "current-password"}
                  placeholder="Pelo menos 8 caracteres"
                  minLength={8}
                  maxLength={120}
                  required
                />
                <button
                  type="button"
                  onClick={() => setVisible((v) => !v)}
                  aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
                >
                  {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}
            <button
              className="button primary auth-submit"
              disabled={busy}
              type="submit"
            >
              {busy
                ? "Um instante…"
                : signup
                  ? "Criar meu espaço"
                  : "Entrar no meu espaço"}
              <ArrowRight size={17} />
            </button>
          </form>
          <div className="auth-demo-divider"><span />ou explore sem cadastro<span /></div>
          <div className="auth-demo-accounts" aria-label="Contas demonstrativas">
            <button type="button" onClick={() => onDemo ? onDemo("medicina") : onClose()}><span className="auth-demo-avatar mint">J</span><span><strong>Júlia · Medicina</strong><small>Conhecer a plataforma</small></span><ArrowUpRight size={16} /></button>
            <button type="button" onClick={() => onDemo ? onDemo("engenharia") : onClose()}><span className="auth-demo-avatar blue">L</span><span><strong>Leo · Engenharia</strong><small>Experimentar outro plano</small></span><ArrowUpRight size={16} /></button>
          </div>
          <div className="auth-prototype">
            <LockKeyhole size={17} />
            <p>
              <strong>Você está em um protótipo.</strong> O cadastro funciona
              somente neste navegador. Use dados fictícios e uma senha de teste.
            </p>
          </div>
          <p className="auth-switch">
            {signup ? "Já tem uma conta aqui?" : "Primeira vez por aqui?"}{" "}
            <button onClick={switchMode}>
              {signup ? "Entre no seu espaço" : "Crie sua conta"}
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
