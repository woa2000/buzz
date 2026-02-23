export type Team = 'Alpha' | 'Bravo' | 'Charlie' | 'Delta';

export interface Player {
  id: string;
  team: Team;
  name: string;
  joinedAt: number;
}

export interface BuzzEvent {
  team: Team;
  playerName: string;
  timestamp: number;
  position: number; // 1st, 2nd, 3rd, 4th
}

export interface SessionState {
  isActive: boolean;
  acceptingAnswers: boolean;
  players: Player[];
  buzzRanking: BuzzEvent[]; // Array ordered by timestamp
  sessionId: string;
}

export interface SSEMessage {
  type: 'session-update' | 'buzz' | 'reset';
  data: SessionState;
}
