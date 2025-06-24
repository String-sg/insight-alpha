/**
 * Quiz system types for the podcast app
 */

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Quiz {
  id: string;
  podcastId: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  durationThreshold: number; // Minimum listening percentage to unlock (0-1)
  estimatedTime: number; // Estimated time to complete in minutes
  imageUrl?: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  podcastId: string;
  userId?: string;
  answers: QuizAnswer[];
  score: number;
  totalQuestions: number;
  completedAt: Date;
  timeSpent: number; // Time spent in seconds
}

export interface QuizAnswer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  timeSpent: number; // Time spent on this question in seconds
}

export interface QuizResult {
  attempt: QuizAttempt;
  quiz: Quiz;
  correctAnswers: number;
  totalQuestions: number;
  scorePercentage: number;
  passingScore: number;
  passed: boolean;
  feedback: string;
}

export interface QuizProgress {
  quizId: string;
  podcastId: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  bestScore: number;
  attempts: number;
  lastAttemptDate?: Date;
  unlockedAt?: Date;
}

export interface QuizStats {
  totalQuizzes: number;
  completedQuizzes: number;
  averageScore: number;
  totalTimeSpent: number;
  streakCount: number;
  lastQuizDate?: Date;
}

export type QuizDifficulty = 'easy' | 'medium' | 'hard';
export type QuizStatus = 'locked' | 'unlocked' | 'completed' | 'passed';