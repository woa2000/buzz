import type { SessionState, BuzzEvent, Team, Player } from './types';

// In-memory session state (sufficient for single session)
let session: SessionState = {
  isActive: false,
  acceptingAnswers: false,
  players: [],
  buzzRanking: [],
  sessionId: generateSessionId(),
};

// SSE clients
const clients: Set<WritableStreamDefaultWriter> = new Set();

function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function getSession(): SessionState {
  return { ...session };
}

export function createSession(): SessionState {
  session = {
    isActive: true,
    acceptingAnswers: false,
    players: [],
    buzzRanking: [],
    sessionId: generateSessionId(),
  };
  broadcastUpdate();
  return getSession();
}

export function startAcceptingAnswers(): SessionState {
  session.acceptingAnswers = true;
  session.buzzRanking = [];
  broadcastUpdate();
  return getSession();
}

export function stopAcceptingAnswers(): SessionState {
  session.acceptingAnswers = false;
  broadcastUpdate();
  return getSession();
}

export function resetBuzz(): SessionState {
  session.buzzRanking = [];
  session.acceptingAnswers = false;
  broadcastUpdate();
  return getSession();
}

export function addPlayer(team: Team, name: string): Player {
  const player: Player = {
    id: Math.random().toString(36).substring(7),
    team,
    name,
    joinedAt: Date.now(),
  };
  
  // Allow multiple players per team
  session.players.push(player);
  
  broadcastUpdate();
  return player;
}

export function registerBuzz(playerId: string): { success: boolean; position: number | null; session: SessionState } {
  // Only accept buzz if session is accepting answers
  if (!session.acceptingAnswers) {
    return { success: false, position: null, session: getSession() };
  }

  // Check if this player already buzzed
  const alreadyBuzzed = session.buzzRanking.some(b => b.playerId === playerId);
  if (alreadyBuzzed) {
    return { success: false, position: null, session: getSession() };
  }

  // Get player info
  const player = session.players.find(p => p.id === playerId);
  if (!player) {
    return { success: false, position: null, session: getSession() };
  }

  const position = session.buzzRanking.length + 1;
  const buzzEvent: BuzzEvent = {
    playerId: player.id,
    team: player.team,
    playerName: player.name,
    timestamp: Date.now(),
    position,
  };

  session.buzzRanking.push(buzzEvent);
  
  // Do not auto-stop accepting answers - let the host control this
  
  broadcastUpdate();
  
  return { success: true, position, session: getSession() };
}

// SSE Client Management
export function addSSEClient(writer: WritableStreamDefaultWriter) {
  clients.add(writer);
}

export function removeSSEClient(writer: WritableStreamDefaultWriter) {
  clients.delete(writer);
}

function broadcastUpdate() {
  const message = JSON.stringify({
    type: 'session-update',
    data: session,
  });

  const encoder = new TextEncoder();
  const data = encoder.encode(`data: ${message}\n\n`);

  // Send to all connected clients
  clients.forEach(async (writer) => {
    try {
      await writer.write(data);
    } catch (error) {
      // Remove disconnected clients
      clients.delete(writer);
    }
  });
}
