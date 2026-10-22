export type ProgramCategory = 'engineering' | 'business' | 'arts' | 'health' | 'education' | 'communication';

export type QuestionCategory = 
  | 'general' 
  | 'motivation' 
  | 'technical' 
  | 'problem_solving' 
  | 'teamwork' 
  | 'future_goals' 
  | 'followup';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type QuestionStatus = 'draft' | 'published' | 'archived';

export interface Program {
  id: string;
  slug: string;
  name: string;
  degreeName: string;
  degreeShort: string;
  facultyName: string;
  majorName?: string;
  category: ProgramCategory;
  categoryLabel: string;
  description: string;
  imagePath: string;
  questionCount: number;
  status: 'published' | 'draft';
  suggestedPrepTips?: string[];
  sampleQuestionsPreview?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  programSlug: string;
  programId?: string;
  category: QuestionCategory;
  categoryNameTh: string;
  difficulty: DifficultyLevel;
  question: string;
  hint: string;
  sampleAnswer?: string;
  followUpQuestions: string[];
  sourceReference?: string | null;
  status: QuestionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PracticeAnswer {
  questionId: string;
  answerText: string;
  timeSpentSeconds: number;
  status: 'answered' | 'skipped' | 'draft';
}

export interface PracticeSession {
  id: string;
  userId?: string;
  isGuest: boolean;
  programSlug: string;
  programName: string;
  selectedCategory: string; // 'all' or specific category
  selectedDifficulty: string; // 'all' or specific
  totalQuestions: number;
  answeredCount: number;
  skippedCount: number;
  totalTimeSpentSeconds: number;
  startedAt: string;
  completedAt?: string;
  questionIds: string[];
  answers: Record<string, PracticeAnswer>;
  mode: 'one_by_one' | 'continuous' | 'category_focused';
  timerDurationSeconds: number; // 30, 60, 90, 120 or 0
  status: 'in_progress' | 'completed' | 'abandoned';
}

export interface AdminStats {
  totalPrograms: number;
  publishedPrograms: number;
  totalQuestions: number;
  publishedQuestions: number;
  draftQuestions: number;
  totalPracticeSessions: number;
}
