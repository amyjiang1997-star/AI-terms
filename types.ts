export interface QuestionOption {
  key: string;
  text: string;
}

export interface Question {
  id: number;
  question_cn: string;
  options: QuestionOption[];
  correct_key: string; // Restored for frontend validation
  term: string;
  memory: string;
  example: string;
  example_cn: string;
}

export type GameStatus = 'START' | 'QUIZ' | 'FEEDBACK' | 'GAMEOVER' | 'TROPHY';

export interface GameState {
  status: GameStatus;
  currentQuestionIndex: number;
  score: number;
  progress: boolean[]; 
  startTime: number;
  endTime: number | null;
  isMuted: boolean;
}