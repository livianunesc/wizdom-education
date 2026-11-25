import { randomBytes, randomUUID } from 'node:crypto';

const lease = 8_000;
const inviteLifetime = 15 * 60_000;
const roomLifetime = 24 * 60 * 60_000;

export function duoService(now = Date.now) {
  const rooms = new Map();
  const fail = (message, status = 400) => { throw Object.assign(new Error(message), { status }); };

  function freeze(room) {
    const lastTogether = Math.min(...room.players.map(player => player.seen));
    const confirmed = Math.max(0, lastTogether - room.since);
    room.remaining = Math.max(0, room.remaining - confirmed);
    room.state = 'paused';
    room.players.forEach(player => { player.ready = false; });
  }

  function settle(room, time) {
    if (room.state !== 'running') return;
    const end = room.since + room.remaining;
    const connectedUntil = Math.min(...room.players.map(player => player.seen + lease));
    if (room.players.every(player => player.seen >= end)) {
      room.state = 'completed';
      room.remaining = 0;
    } else if (connectedUntil <= time) {
      // Discard the interval since the last confirmation from both participants.
      freeze(room);
    }
  }

  return function act({ action, code, token, name, minutes }) {
    const time = now();
    for (const [key, room] of rooms) {
      if (time >= room.created + roomLifetime) rooms.delete(key);
    }
    let room = rooms.get(code);
    let player;
    if (action === 'create' || action === 'join') {
      if (typeof name !== 'string' || !name.trim() || name.length > 60) fail('Informe um nome de até 60 caracteres.');
      if (action === 'create') {
        if (!Number.isInteger(minutes) || minutes < 1 || minutes > 120) fail('Escolha entre 1 e 120 minutos.');
        if (rooms.size >= 1000) fail('O serviço está cheio. Tente novamente em alguns minutos.', 503);
        code = randomBytes(9).toString('base64url');
        room = { id: randomUUID(), created: time, minutes, remaining: minutes * 60_000, state: 'waiting', players: [] };
        rooms.set(code, room);
      }
      if (!room || time >= room.created + inviteLifetime || room.state !== 'waiting') fail('Convite expirado ou indisponível.', 404);
      if (room.players.length >= 2) fail('A sala está cheia.', 409);
      player = { token: randomBytes(32).toString('base64url'), name: name.trim(), seen: time, ready: false };
      room.players.push(player);
    } else {
      player = room?.players.find(item => item.token === token);
      if (!player) fail('Sua participação nesta sala expirou.', 404);
      settle(room, time);
      player.seen = time;
      settle(room, time);
      if (action === 'ready' && ['waiting', 'paused'].includes(room.state)) {
        player.ready = true;
        if (room.players.length === 2 && room.players.every(item => item.ready && item.seen + lease > time)) {
          room.state = 'running';
          room.since = time;
        }
      }
      if (action === 'pause' && room.state === 'running') freeze(room);
      if (action === 'leave' && !['completed', 'cancelled'].includes(room.state)) room.state = 'cancelled';
      if (action === 'claim' && room.state !== 'completed') fail('Concluam a sessão juntos antes de resgatar.', 409);
      if (!['status', 'ready', 'pause', 'leave', 'claim'].includes(action)) fail('Ação desconhecida.');
    }
    const endAt = room.state === 'running' ? room.since + room.remaining : null;
    return {
      code, token: player.token, state: room.state, now: time, endAt, remaining: room.remaining, minutes: room.minutes,
      players: room.players.map(item => ({ name: item.name, ready: item.ready, connected: item.seen + lease > time, self: player === item })),
      // The receipt ID remains stable across retries. Local account storage applies it once.
      receipt: action === 'claim' ? { id: 'duo:' + room.id, base: room.minutes * 4, bonus: room.minutes, coins: room.minutes * 2 } : undefined,
    };
  };
}

export function duoMiddleware() {
  const act = duoService();
  return async (req, res, next) => {
    if (req.url?.split('?')[0] !== '/api/duo') return next();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    try {
      if (req.method !== 'POST') throw Object.assign(new Error('Use POST.'), { status: 405 });
      let body = '';
      for await (const part of req) {
        body += part;
        if (body.length > 4096) break;
      }
      if (!body || body.length > 4096) throw new Error('Pedido inválido.');
      res.end(JSON.stringify(act(JSON.parse(body))));
    } catch (error) {
      res.statusCode = error.status || 400;
      res.end(JSON.stringify({ error: error.status ? error.message : 'Pedido inválido.' }));
    }
  };
}
