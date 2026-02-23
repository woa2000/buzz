export type Team = 'Alpha' | 'Bravo' | 'Charlie' | 'Delta';

export interface Player {
  id: string;
  team: Team;
  joinedAt: number;
}

export interface BuzzEvent {
  team: Team;
  timestamp: number;
}

export interface SessionState {
  isActive: boolean;
  acceptingAnswers: boolean;
  players: Player[];
  currentBuzz: BuzzEvent | null;
  sessionId: string;
}

export interface SSEMessage {
  type: 'session-update' | 'buzz' | 'reset';
  data: SessionState;
}
