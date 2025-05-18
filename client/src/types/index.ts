export interface User {
  name: string;
  initials: string;
  testsCompleted: number;
  rank: number;
}

export interface Score {
  time: number;
  date: Date;
}

export interface Stats {
  bestScore: number;
  bestScoreDate: Date | null;
  average: number;
  testsCompleted: number;
  todayBest: number | null;
  chartPoints: number[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  unlockedAt?: Date;
  condition: (stats: Stats, scores: Score[]) => boolean;
  gradient: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  initials: string;
  bestTime: number;
  date: Date;
  isCurrentUser: boolean;
  avatarGradient: string;
}

export interface Settings {
  darkMode: boolean;
  sound: boolean;
  showGhost: boolean;
  username: string;
}

export type GameState = 
  | 'resting'
  | 'countdown'
  | 'waiting'
  | 'target'
  | 'result'
  | 'tooSoon';

export interface GameContext {
  user: User;
  stats: Stats;
  scores: Score[];
  gameState: GameState;
  settings: Settings;
  achievements: Achievement[];
  leaderboard: LeaderboardEntry[];
  lastReactionTime: number | null;
  isNewBest: boolean;
  startTime: number | null;
  updateSettings: (settings: Partial<Settings>) => void;
  startGame: () => void;
  handleTargetClick: () => void;
  handleTooEarlyClick: () => void;
  resetGameData: () => void;
  generateChallengeCode: () => string;
}
