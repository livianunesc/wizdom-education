import { useState } from 'react';
import { Coins, Sparkles } from 'lucide-react';
import { purchase, themes, weekKey } from '../rewards.js';
import { dayKey } from '../lib.js';

export default function Shop({ stats, setStats }) {
  const [preview, setPreview] = useState(null);
  const equipped = stats.theme || 'caderno';
  const active = themes.find(theme => theme.id === (preview || equipped));
  const owned = theme => !theme.price || stats.themes?.includes(theme.id);
  return <div>
    <div className="page-heading"><div><h1>Loja</h1><p>Use moedas para personalizar a interface. O XP mede seu progresso.</p></div></div>
    <section className="card notebook-panel theme-preview" data-theme={active.id}>
      <h2>Prévia no seu espaço</h2>
      <div className="welcome-banner"><div><h3>Próxima atividade</h3><p>Matemática · 25 minutos</p><span className="badge mint">Revisão concluída</span></div></div>
    </section>
    <section className="card notebook-panel">
      <h2><Coins size={22}/> {stats.coins} moedas disponíveis</h2>
      <div className="notebook-grid">{themes.map(theme => <article className="theme-option" key={theme.id}>
        <h3>{theme.name}</h3>
        <p>{theme.id === equipped ? 'Equipado' : owned(theme) ? 'Adquirido' : `${theme.price} moedas`}</p>
        {!owned(theme) && stats.coins < theme.price && <p>Faltam {theme.price - stats.coins} moedas.</p>}
        <div className="notebook-actions">
          <button className="button secondary" aria-pressed={active.id === theme.id} onClick={() => setPreview(theme.id)}>Visualizar {theme.name}</button>
          <button className="button primary" disabled={theme.id === equipped || (!owned(theme) && stats.coins < theme.price)} onClick={() => {
            setStats(value => purchase(value, theme.id, dayKey()));
            setPreview(null);
          }}>{owned(theme) ? 'Equipar' : 'Comprar'} {theme.name}</button>
        </div>
      </article>)}</div>
    </section>
    <section className="card notebook-panel"><h2>Missões</h2>
      <ul>{[
        ['login:' + dayKey(), 'Hoje · Entrar na conta', '20 XP + 5 moedas'],
        ['block:' + dayKey(), 'Hoje · Concluir um bloco', '10 XP + 2 moedas'],
        ['review:' + dayKey(), 'Hoje · Responder uma questão', '5 XP + 2 moedas'],
        ['duo-week:' + weekKey(new Date(), dayKey), 'Nesta semana · Concluir foco em dupla', '15 XP + 3 moedas'],
      ].map(([id, label, prize]) => <li key={id}>{label} · {stats.ledger?.[id] ? '1/1' : '0/1'} · {prize}</li>)}</ul>
    </section>
    <section className="card notebook-panel"><h2><Sparkles size={22}/> Extrato</h2>
      <p>Saldo histórico incluído no total.</p>
      <ul>{Object.values(stats.ledger || {}).reverse().slice(0, 20).map((item, index) => <li key={index}>{item.day} · {item.label} · {item.xp} XP · {item.coins} moedas</li>)}</ul>
    </section>
  </div>;
}
