import { universities, prioritiesFor } from "./admissions.js";
import Character from "./Character.jsx";
import Select from "./Select.jsx";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  CalendarDays,
  GraduationCap,
} from "lucide-react";
import { subjects } from "./lib.js";
import "./auth.css";
const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const frequency = [
  "Estou começando",
  "1 a 2 dias por semana",
  "3 a 4 dias por semana",
  "5 ou mais dias por semana",
];
const courses = [
  "Medicina",
  "Direito",
  "Psicologia",
  "Engenharia",
  "Ciência da Computação",
  "Administração",
  "Arquitetura",
  "Ainda estou descobrindo",
  "Outro curso",
];
export default function Onboarding({ name, initial, onComplete, onExit }) {
  const [step, setStep] = useState(0),
    [error, setError] = useState("");
  const [profile, setProfile] = useState({
    name: name || "",
    course: "Medicina",
    favorite: "Biologia",
    difficulty: "Matemática",
    frequency: "Estou começando",
    hours: 1,
    days: [1, 2, 3, 4, 5],
    goal: "Construir uma rotina mais leve",
    year: "2027",
    school: "Ensino médio",
    routine: "Estudo na escola pela manhã",
    bio: "",
    ...initial,
  });
  const set = (key, value) => setProfile((v) => ({ ...v, [key]: value }));
  const toggleDay = (day) =>
    set(
      "days",
      profile.days.includes(day)
        ? profile.days.filter((x) => x !== day)
        : [...profile.days, day].sort(),
    );
  function next(e) {
    e.preventDefault();
    if (step === 0 && !profile.name.trim()) {
      setError("Como podemos chamar você?");
      return;
    }
    if (step === 2 && !profile.days.length) {
      setError("Escolha pelo menos um dia. Um pequeno passo já conta.");
      return;
    }
    setError("");
    if (step < 2) setStep((s) => s + 1);
    else
      onComplete({
        ...profile,
        name: profile.name.trim(),
        hours: Number(profile.hours),
        course: universities.find(item => item.id === profile.target?.id)?.course || profile.course,
        onboarded: true,
      });
  }
  const copy = [
    [
      "O sonho é seu. A gente vai junto.",
      "Vamos conhecer um pouquinho de você para montar um caminho que faça sentido.",
    ],
    [
      "Cada pessoa aprende de um jeito.",
      "O que já flui bem? E onde você gostaria de receber uma ajudinha?",
    ],
    [
      "Um plano que cabe na sua vida.",
      "Comece com uma rotina possível. Você pode ajustar tudo depois, sem pressão.",
    ],
  ];
  return (
    <main className="onboard-screen">
      <header className="onboard-header">
        <span className="auth-brand">
          wizdom<span>.</span>
        </span>
        <button className="text-button" onClick={onExit}><ArrowLeft size={16}/> Voltar ao meu espaço</button>
      </header>
      <div className="onboard-wrap">
        <aside className="onboard-aside">
          <Character className="notebook-vignette" />
          <h1>Monte seu plano de estudos</h1>
          <p>Defina seu objetivo, suas prioridades e o tempo que tem para estudar.</p>
          <div className="onboard-steps">
            {[
              "Seu próximo capítulo",
              "Seu jeito de aprender",
              "Sua rotina possível",
            ].map((label, i) => (
              <div
                key={label}
                className={i === step ? "current" : i < step ? "complete" : ""}
              >
                <span>{i < step ? <Check size={15} /> : i + 1}</span>
                {label}
              </div>
            ))}
          </div>
        </aside>
        <section className="onboard-card card">
          <div
            className="onboard-progress"
            aria-label={`Etapa ${step + 1} de 3`}
          >
            {[0, 1, 2].map((x) => (
              <span key={x} className={x <= step ? "active" : ""} />
            ))}
          </div>
          <span className="eyebrow">PASSO {step + 1} DE 3</span>
          <h2>{copy[step][0]}</h2>
          <p className="muted">{copy[step][1]}</p>
          <form onSubmit={next}>
            {step === 0 && (
              <div className="onboard-fields">
                <label className="field">
                  Como podemos chamar você?
                  <input
                    required
                    value={profile.name}
                    maxLength={50}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Seu primeiro nome"
                  />
                </label>
                <label className="field">
                  Em que momento você está?
                  <Select
                    value={profile.school}
                    onChange={(e) => set("school", e.target.value)}
                  >
                    <option>Ensino médio</option>
                    <option>Ensino médio concluído</option>
                  </Select>
                </label>
                <label className="field">
                  Qual curso faz seus olhos brilharem?
                  <Select
                    value={profile.course}
                    onChange={(e) => set("course", e.target.value)}
                  >
                    {courses.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </Select>
                </label>
                <label className="field">
                  Quando você quer entrar na faculdade?
                  <Select
                    value={profile.year}
                    onChange={(e) => set("year", e.target.value)}
                  >
                    {["2027", "2028", "2029", "Ainda estou descobrindo"].map(
                      (x) => (
                        <option key={x}>{x}</option>
                      ),
                    )}
                  </Select>
                </label>
              </div>
            )}
            {step === 0 && <label className="field">Objetivo de vestibular (opcional)
              <Select value={profile.target?.id || ""} onChange={event => {
                const offer = universities.find(item => item.id === event.target.value);
                set("target", offer ? { id: offer.id, processId: offer.processId, edition: /^\d{4}$/.test(profile.year) ? profile.year : String(new Date().getFullYear() + 1), horizon: "8" } : null);
              }}><option value="">Escolher depois</option>{universities.map(offer => <option key={offer.id} value={offer.id}>{offer.acronym} · {offer.course} · {offer.campus} · {offer.entry}</option>)}</Select>
            </label>}
            {step === 0 && profile.target && <label className="field">Edição pretendida<input type="number" required min="2000" max="2100" value={profile.target.edition} onChange={event => set("target", { ...profile.target, edition: event.target.value })}/></label>}
            {step === 1 && (
              <div className="onboard-fields">
                <label className="field">
                  Qual matéria você mais gosta ou tem facilidade?
                  <Select
                    value={profile.favorite}
                    onChange={(e) => set("favorite", e.target.value)}
                  >
                    {subjects.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </Select>
                </label>
                <label className="field">
                  Qual matéria pede um pouco mais de atenção?
                  <Select
                    value={profile.difficulty}
                    onChange={(e) => set("difficulty", e.target.value)}
                  >
                    {subjects.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </Select>
                </label>
                <label className="field">
                  Como está sua frequência de estudos hoje?
                  <Select
                    value={profile.frequency}
                    onChange={(e) => set("frequency", e.target.value)}
                  >
                    {frequency.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </Select>
                </label>
                <label className="field">
                  O que você mais quer conquistar agora?
                  <Select
                    value={profile.goal}
                    onChange={(e) => set("goal", e.target.value)}
                  >
                    {[
                      "Construir uma rotina mais leve",
                      "Ter mais confiança nas provas",
                      "Revisar sem esquecer",
                      "Melhorar nas matérias difíceis",
                      "Me preparar para o vestibular",
                    ].map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </Select>
                </label>
                <div className="onboard-tip">
                  <Sparkles size={19} />
                  <p>
                    Nos dias de pouca energia, vamos começar por uma matéria que
                    você gosta. Pequenos passos também levam longe.
                  </p>
                </div>
              </div>
            )}
            {step === 2 && profile.target && <section className="notebook-panel">
              <h3>Prévia do plano para a edição {profile.target.edition}</h3>
              <p>{profile.days.length} dias por semana · até {Math.round(Number(profile.hours) * 60)} min por dia, com pausas.</p>
              <ul>{prioritiesFor(profile.target.processId).map(item => <li key={item}>{item}</li>)}</ul>
              <p>Recomendações de estudo. Consulte o edital para os requisitos oficiais.</p>
            </section>}
            {step === 2 && (
              <div className="onboard-fields">
                <label className="field">
                  Como é sua rotina?
                  <Select
                    value={profile.routine}
                    onChange={(e) => set("routine", e.target.value)}
                  >
                    {[
                      "Estudo na escola pela manhã",
                      "Estudo na escola à tarde",
                      "Estudo em período integral",
                      "Trabalho e estudo",
                      "Tenho horários flexíveis",
                    ].map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </Select>
                </label>
                <label className="field">
                  Quanto tempo cabe no seu dia?
                  <Select
                    value={profile.hours}
                    onChange={(e) => set("hours", e.target.value)}
                  >
                    {[0.5, 1, 1.5, 2, 3, 4, 5, 6, 7, 8].map((x) => (
                      <option key={x} value={x}>
                        {x === 0.5
                          ? "30 minutos"
                          : x === 1
                            ? "1 hora"
                            : x === 1.5
                              ? "1 hora e 30 minutos"
                              : `${x} horas`}{" "}
                        por dia
                      </option>
                    ))}
                  </Select>
                </label>
                <fieldset className="onboard-days">
                  <legend>Em quais dias você gostaria de estudar?</legend>
                  <div>
                    {days.map((d, i) => (
                      <button
                        key={d}
                        type="button"
                        aria-pressed={profile.days.includes(i)}
                        className={profile.days.includes(i) ? "selected" : ""}
                        onClick={() => toggleDay(i)}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <div className="onboard-tip">
                  <CalendarDays size={20} />
                  <p>
                    <strong>Seu plano é flexível.</strong> O check-in diário vai
                    adaptar os estudos à sua energia. Descansar também faz
                    parte.
                  </p>
                </div>
              </div>
            )}
            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}
            <div className="onboard-actions">
              {step > 0 ? (
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => {
                    setError("");
                    setStep((s) => s - 1);
                  }}
                >
                  <ArrowLeft size={16} /> Voltar
                </button>
              ) : (
                <span />
              )}
              <button type="submit" className="button primary">
                {step === 2 ? "Criar meu plano" : "Continuar"}
                {step === 2 ? (
                  <GraduationCap size={18} />
                ) : (
                  <ArrowRight size={17} />
                )}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
