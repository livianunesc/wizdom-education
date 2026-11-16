import { useState } from "react";
import {
  ArrowUpRight,
  Atom,
  BookOpen,
  Globe2,
  GraduationCap,
  Medal,
  Sparkles,
} from "lucide-react";
import "./opportunities.css";

const olympics = [
  {
    name: "OBMEP",
    full: "Olimpíada Brasileira de Matemática das Escolas Públicas",
    category: "Matemática",
    icon: Sparkles,
    tone: "lavender",
    description:
      "Um desafio de raciocínio para descobrir novas formas de pensar. A participação acontece por meio da escola.",
    eligibility: "Ensino fundamental e médio · conforme edital",
    link: "https://www.obmep.org.br/",
  },
  {
    name: "OBA",
    full: "Olimpíada Brasileira de Astronomia e Astronáutica",
    category: "Ciências",
    icon: Globe2,
    tone: "blue",
    description:
      "Para quem olha para o céu com curiosidade. Explore astronomia, astronáutica e os mistérios do universo.",
    eligibility: "Ensino fundamental e médio · conforme edital",
    link: "https://www.oba.org.br/",
  },
  {
    name: "OBF",
    full: "Olimpíada Brasileira de Física",
    category: "Física",
    icon: Atom,
    tone: "mint",
    description:
      "Transforme sua curiosidade sobre o mundo em uma experiência de aprendizado, com problemas e descobertas.",
    eligibility: "Estudantes de escolas participantes · conforme edital",
    link: "https://www.sbfisica.org.br/v1/olimpiada/",
  },
  {
    name: "ONHB",
    full: "Olimpíada Nacional em História do Brasil",
    category: "História",
    icon: BookOpen,
    tone: "peach",
    description:
      "História se aprende em equipe. Investigue fontes, interprete documentos e conheça diferentes perspectivas.",
    eligibility: "Equipes de estudantes e professor · conforme edital",
    link: "https://www.olimpiadadehistoria.com.br/",
  },
];
export default function Olympics({ profile = {} }) {
  const [browse, setBrowse] = useState(false);
  const [category, setCategory] = useState("Todas");
  const eligible = profile.school === "Ensino médio";
  return (
    <div className="olympics-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">APRENDER TAMBÉM É DESCOBRIR</span>
          <h1>Desafios que abrem portas.</h1>
          <p className="muted">
            Olimpíadas do conhecimento para ir além da sala de aula.
          </p>
        </div>
        <span className="op-heading-icon">
          <Medal size={30} />
        </span>
      </div>
      {!eligible && !browse ? (
        <section className="card olympics-eligibility">
          <GraduationCap size={43} />
          <h2>Novas descobertas, no seu momento.</h2>
          <p>
            Estas oportunidades são voltadas principalmente a estudantes do
            ensino médio. No seu perfil, você informou outra etapa de ensino.
          </p>
          <p className="muted">
            Você pode conhecer as olimpíadas e consultar as regras de
            participação nos sites oficiais.
          </p>
          <button className="button primary" onClick={() => setBrowse(true)}>
            Explorar oportunidades <ArrowUpRight size={17} />
          </button>
        </section>
      ) : (
        <>
          <div className="op-discover-banner">
            <div className="op-banner-symbol">
              <Medal size={25} />
            </div>
            <div>
              <h3>
                {eligible
                  ? "Selecionadas para sua fase de ensino"
                  : "Conheça as olimpíadas do conhecimento"}
              </h3>
              <p>
                Aprenda, faça conexões e celebre cada descoberta. A participação
                vale mais que a medalha.
              </p>
            </div>
          </div>
          <div className="olympics-categories" aria-label="Filtrar por área">
            {["Todas", "Matemática", "Ciências", "Física", "História"].map(
              (c) => (
                <button
                  className={`button secondary ${category === c ? "is-active" : ""}`}
                  key={c}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ),
            )}
          </div>
          <div className="olympics-grid">
            {olympics
              .filter((o) => category === "Todas" || category === o.category)
              .map((o) => (
                <article className="card olympic-card" key={o.name}>
                  <div className={`olympic-card-icon tone-${o.tone}`}>
                    <o.icon size={28} />
                  </div>
                  <span className="badge">{o.category}</span>
                  <h2>{o.name}</h2>
                  <h3>{o.full}</h3>
                  <p className="muted">{o.description}</p>
                  <p className="olympic-eligibility">
                    <GraduationCap size={16} />
                    {o.eligibility}
                  </p>
                  <a
                    className="university-details"
                    href={o.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Conhecer e consultar inscrições <ArrowUpRight size={18} />
                  </a>
                </article>
              ))}
          </div>
          <p className="op-data-note">
            A elegibilidade e o calendário variam a cada edição. Confira o
            edital oficial e converse com sua escola para participar.
          </p>
        </>
      )}
    </div>
  );
}
