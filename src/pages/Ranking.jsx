import { Award, BookOpen, Check, Crown, Flame, Heart, Leaf, Medal, Sparkles, Target, Trophy } from "lucide-react";
import "./focus-profile.css";
import "./ranking.css";

const students = [
  { id: "marina", name: "Marina Costa", course: "Psicologia", xp: 860, initials: "MC", color: "#c9e4de" },
  { id: "lucas", name: "Lucas Almeida", course: "Engenharia", xp: 740, initials: "LA", color: "#f7d9c4" },
  { id: "julia", name: "Julia Santos", course: "Medicina", xp: 620, initials: "JS", color: "#dbcdf0" },
  { id: "pedro", name: "Pedro Lima", course: "Direito", xp: 480, initials: "PL", color: "#c6def1" },
  { id: "ana", name: "Ana Beatriz", course: "Arquitetura", xp: 320, initials: "AB", color: "#f2c6de" },
];
export default function Ranking({ profile = {}, stats = {}, setStats }) {
  const participating = stats.rankingOptIn !== false;
  const xp = stats.xp || 0;
  const level = Math.floor(xp / 100) + 1;
  const people = [
    ...students,
    ...(participating ? [{
      id: "self", name: profile.name || "Você", course: profile.course || "Meu próximo passo", xp,
      initials: (profile.name || "Você").split(" ").slice(0, 2).map((part) => part[0]).join(""), color: "#ddd1f5", self: true,
    }] : []),
  ].sort((a, b) => b.xp - a.xp);
  const position = people.findIndex((item) => item.self) + 1;
  const nextPerson = position > 1 ? people[position - 2] : null;
  const podium = [people[1], people[0], people[2]].filter(Boolean);
  const sessions = (stats.sessions || []).length;
  return (
    <div className="fp-page rank-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">PEQUENOS PASSOS. GRANDES CONQUISTAS.</p>
          <h1>Uma comunidade que cresce</h1>
          <p className="muted">Cada minuto de dedicação merece um lugar no pódio.</p>
        </div>
        <span className="badge rank-league"><Leaf size={15} /> Liga Florescer</span>
      </div>
      <section className="rank-showcase" aria-label="Pódio demonstrativo">
        <div className="rank-showcase-copy">
          <span className="rank-season"><Sparkles size={14} /> SUA JORNADA ATÉ AQUI</span>
          <h2>O seu esforço<br /><em>vai mais longe.</em></h2>
          <p>Ganhe XP nos momentos de foco e nas revisões. Celebre a constância e encontre o seu próprio ritmo.</p>
          <div className="rank-my-pill"><span><Trophy size={18} /></span><div><strong>{participating ? `${position}º lugar nesta demonstração` : "Seu progresso continua contando"}</strong><small>{xp.toLocaleString("pt-BR")} XP conquistados · nível {level}</small></div></div>
        </div>
        <div className="rank-podium">
          {podium.map((person) => {
            const place = people.indexOf(person) + 1;
            return <article className={`rank-podium-person place-${place}`} key={person.id}>
              {place === 1 && <Crown className="rank-crown" size={29} fill="currentColor" />}
              <div className="rank-podium-avatar" style={{ "--avatar-color": person.color }}>{person.initials}<span>{place}</span></div>
              <strong>{person.self ? "Você" : person.name.split(" ")[0]}</strong>
              <small>{person.xp} XP</small>
              <div className="rank-podium-step"><Medal size={28} /><b>{place < 10 ? `0${place}` : place}</b></div>
            </article>;
          })}
        </div>
      </section>
      <div className="ranking-note rank-demo-note"><BookOpen size={18} /><p><strong>Ranking demonstrativo.</strong> Os colegas são fictícios. Seu XP é salvo somente neste navegador e nenhum dado pessoal é publicado.</p></div>
      <div className="ranking-layout">
        <section className="card ranking-board">
          <div className="section-heading"><div><span className="eyebrow">TODO PASSO CONTA</span><h2>Jornadas que inspiram</h2><p className="muted">Classificação por XP acumulado</p></div><span className="rank-board-icon"><Award size={23} /></span></div>
          <div className="ranking-table" role="table" aria-label="Ranking demonstrativo de estudantes">
            <div className="ranking-table-head" role="row"><span role="columnheader">Posição</span><span role="columnheader">Estudante</span><span role="columnheader">Dedicação</span></div>
            {people.map((person, index) => <div className={`ranking-row ${person.self ? "ranking-self" : ""}`} role="row" key={person.id}>
              <span className="ranking-place" role="cell">{index < 3 ? <Medal size={23} className={`medal-${index}`} /> : String(index + 1).padStart(2, "0")}</span>
              <div className="ranking-student" role="cell"><span className="student-initials" style={{ background: person.color }}>{person.initials}</span><div><strong>{person.name}{person.self && <span className="you-tag">Você</span>}</strong><small>{person.course}</small></div></div>
              <strong className="ranking-points" role="cell">{person.xp.toLocaleString("pt-BR")} <small>XP</small></strong>
            </div>)}
          </div>
          {participating && <div className="rank-next"><Flame size={18} /><p>{nextPerson ? <><strong>{nextPerson.xp - xp + 1} XP</strong> para chegar ao próximo lugar. Um passo de cada vez!</> : <><strong>Você está no topo!</strong> Continue aprendendo no seu ritmo.</>}</p></div>}
        </section>
        <aside className="rank-aside">
          <div className="card rank-level-card"><span className="rank-level-icon"><Target size={25} /></span><p className="eyebrow">SUA MELHOR COMPARAÇÃO É COM VOCÊ</p><h3>Próxima parada: nível {level + 1}</h3><div className="rank-level-label"><span>{xp % 100} / 100 XP</span><strong>{100 - xp % 100} XP restantes</strong></div><div className="progress-track"><i style={{ width: `${xp % 100}%` }} /></div><p className="muted">{sessions} {sessions === 1 ? "sessão de foco registrada" : "sessões de foco registradas"}. A dedicação de hoje constrói o seu amanhã.</p></div>
          <div className="card ranking-opt-in"><Heart size={25} /><h3>O ritmo é seu.</h3><p className="muted">Você pode sair do ranking e continuar guardando cada conquista.</p><label className="ranking-toggle"><input type="checkbox" checked={participating} onChange={() => setStats?.((previous) => ({ ...previous, rankingOptIn: !participating }))} /><span>Mostrar meu perfil no ranking</span><Check size={14} className="rank-toggle-check" /></label></div>
        </aside>
      </div>
    </div>
  );
}
