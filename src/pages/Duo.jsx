import { useEffect, useRef, useState } from 'react';
import { Users } from 'lucide-react';

const invitation = () => new URLSearchParams(location.search).get('duo') || '';
const labels = { waiting: 'Aguardando prontidão', running: 'Em foco', paused: 'Pausado', cancelled: 'Encerrado sem recompensa', completed: 'Sessão concluída' };

export default function Duo({ accountId, name, reward, onLogin }) {
  const key = 'wizdom.duo.' + accountId;
  const [entry, setEntry] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
  });
  const [room, setRoom] = useState(null);
  const [code, setCode] = useState(invitation);
  const [minutes, setMinutes] = useState(25);
  const [error, setError] = useState('');
  const [claimed, setClaimed] = useState(false);
  const [clock, setClock] = useState(Date.now);
  const [offset, setOffset] = useState(0);
  const pending = useRef(null);

  async function request(action) {
    if (pending.current) {
      if (action === 'status' || pending.current.action !== 'status') return;
      await pending.current.done;
      if (pending.current) return;
    }
    let complete;
    const done = new Promise(resolve => { complete = resolve; });
    pending.current = { action, done };
    try {
      const response = await fetch('/api/duo', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, name, minutes, code: entry?.code ?? code.trim(), token: entry?.token }),
        signal: AbortSignal.timeout(5000),
      });
      if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('Abra a versão online da Wizdom com o serviço de dupla.');
      const next = await response.json();
      if (!response.ok) throw new Error(next.error);
      setClock(Date.now());
      setOffset(next.now - Date.now());
      setRoom(next);
      setError('');
      if (['create', 'join'].includes(action)) {
        const credentials = { code: next.code, token: next.token };
        localStorage.setItem(key, JSON.stringify(credentials));
        setEntry(credentials);
        const url = new URL(location.href);
        url.searchParams.set('duo', next.code);
        history.replaceState(null, '', url);
        setClaimed(false);
      }
      if (next.receipt) {
        reward(next.receipt);
        setClaimed(true);
      }
    } catch (cause) {
      setError(cause.name === 'TimeoutError' || cause instanceof TypeError ? 'Conexão interrompida. Tentando recuperar a sala.' : cause.message);
    } finally {
      pending.current = null;
      complete();
    }
  }

  useEffect(() => {
    if (!entry || !accountId) return;
    request('status');
    const poll = setInterval(() => request('status'), 1500);
    const ticker = setInterval(() => setClock(Date.now()), 250);
    return () => { clearInterval(poll); clearInterval(ticker); };
  }, [entry, accountId]);

  function forget() {
    localStorage.removeItem(key);
    setEntry(null);
    setRoom(null);
    setError('');
    setCode('');
    const url = new URL(location.href);
    url.searchParams.delete('duo');
    history.replaceState(null, '', url);
  }

  const remaining = Math.ceil(Math.max(0, room?.endAt ? room.endAt - (clock + offset) : room?.remaining || 0) / 1000);
  const timer = [Math.floor(remaining / 60), remaining % 60].map(n => String(n).padStart(2, '0')).join(':');
  const invite = new URL(location.href);
  if (entry) invite.searchParams.set('duo', entry.code);

  return <section className="card notebook-panel">
    <h2><Users size={22} /> Estudar com um amigo</h2>
    <p>Os dois confirmam para começar ou retomar. Qualquer um pode pausar para os dois. Se a conexão cair, a sala pausa após alguns segundos e descarta o tempo sem confirmação. Sair encerra a sessão para a dupla.</p>
    <p>Cada minuto concluído em dupla rende 4 XP + 1 XP de bônus (25%) e 2 moedas.</p>
    {location.protocol === 'file:' ? <p>Abra a versão hospedada para usar o foco em dupla.</p> :
      !accountId ? <button className="button primary" onClick={onLogin}>Entrar com minha conta local</button> :
      !entry ? <div className="notebook-grid">
        <form onSubmit={event => { event.preventDefault(); request('create'); }}>
          <label>Duração em minutos <input type="number" min="1" max="120" required value={minutes} onChange={event => setMinutes(event.target.valueAsNumber)} /></label>
          <button className="button primary">Criar sala privada</button>
        </form>
        <form onSubmit={event => { event.preventDefault(); request('join'); }}>
          <label>Código do convite <input required value={code} onChange={event => setCode(event.target.value)} /></label>
          <button className="button secondary">Entrar na sala</button>
        </form>
      </div> : <>
        {room?.state === 'waiting' && <p>Convite válido por 15 minutos. <a href={invite.href}>Link de convite</a> · Código <code>{entry.code}</code></p>}
        {room && <><p role="status">{labels[room.state]}</p><strong className="duo-clock">{timer}</strong>
          <ul>{room.players.map((item, index) => <li key={index}>{item.name}{item.self ? ' (você)' : ''} · {item.connected ? item.ready ? 'Pronto' : 'Presente' : 'Desconectado'}</li>)}</ul>
        </>}
        <div className="notebook-actions">
          {['waiting', 'paused'].includes(room?.state) && <button className="button primary" onClick={() => request('ready')}>Confirmar prontidão</button>}
          {room?.state === 'running' && <button className="button secondary" onClick={() => request('pause')}>Pausar para os dois</button>}
          {room && !['completed', 'cancelled'].includes(room.state) && <button className="button secondary" onClick={() => request('leave')}>Encerrar sala</button>}
          {room?.state === 'completed' && <button className="button primary" disabled={claimed} onClick={() => request('claim')}>{claimed ? 'Recompensa registrada' : `Resgatar ${room.minutes * 4} + ${room.minutes} XP`}</button>}
          {(!room || ['completed', 'cancelled'].includes(room.state)) && <button className="button secondary" onClick={forget}>Voltar aos convites</button>}
        </div>
      </>}
    {error && <p role="alert">{error}</p>}
  </section>;
}
