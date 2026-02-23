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

export function addPlayer(team: Team): Player {
  const player: Player = {
    id: Math.random().toString(36).substring(7),
    team,
    joinedAt: Date.now(),
  };
  
  // Remove any existing player from the same team
  session.players = session.players.filter(p => p.team !== team);
  session.players.push(player);
  
  broadcastUpdate();
  return player;
}

export function registerBuzz(team: Team): { success: boolean; position: number | null; session: SessionState } {
  // Only accept buzz if session is accepting answers
  if (!session.acceptingAnswers) {
    return { success: false, position: null, session: getSession() };
  }

  // Check if this team already buzzed
  const alreadyBuzzed = session.buzzRanking.some(b => b.team === team);
  if (alreadyBuzzed) {
    return { success: false, position: null, session: getSession() };
  }

  const position = session.buzzRanking.length + 1;
  const buzzEvent: BuzzEvent = {
    team,
    timestamp: Date.now(),
    position,
  };

  session.buzzRanking.push(buzzEvent);
  
  // Stop accepting answers after all 4 teams have buzzed
  if (session.buzzRanking.length >= 4) {
    session.acceptingAnswers = false;
  }
  
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
