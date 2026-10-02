export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed (0=A, 1=B, 2=C, 3=D, 4=E)
  topicId: string;
  topicName: string;
  explanation: string;
  source?: string;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  badge: string;
}

export type QuizMode = 'practice' | 'exam' | 'study';

export interface UserAnswer {
  questionId: number;
  selectedOption: number | null;
  isCorrect?: boolean;
  bookmarked?: boolean;
  timeSpentSeconds?: number;
}

export interface QuizResult {
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  wrongCount: number;
  scorePercentage: number;
  timeTakenSeconds: number;
  topicBreakdown: Record<string, { total: number; correct: number }>;
}
