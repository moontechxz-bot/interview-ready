import { PracticeSession, PracticeAnswer } from '@/types';
import { getStoredQuestions, getProgramBySlug } from './storage';

export interface RandomizeOptions {
  programSlug: string;
  category?: string; // 'all' or specific category
  difficulty?: string; // 'all' or specific ('easy' | 'medium' | 'hard')
  requestedCount: number; // 5, 10, 15, 20
  mode?: 'one_by_one' | 'continuous' | 'category_focused';
  timerDurationSeconds?: number;
}

export interface RandomizeResult {
  success: boolean;
  session?: PracticeSession;
  error?: string;
  availableCount?: number;
}

/**
 * Fisher-Yates shuffle algorithm for unbiased random permutation
 */
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generate a randomized practice session conforming to Section 11 specifications
 */
export function createPracticeSession(options: RandomizeOptions): RandomizeResult {
  const {
    programSlug,
    category = 'all',
    difficulty = 'all',
    requestedCount,
    mode = 'one_by_one',
    timerDurationSeconds = 60,
  } = options;

  // 1. Verify program existence
  const program = getProgramBySlug(programSlug);
  if (!program) {
    return {
      success: false,
      error: `ไม่พบข้อมูลหลักสูตรที่เลือก (${programSlug})`,
    };
  }

  // 2. Fetch all questions and filter ONLY published questions from the EXACT program
  const allQuestions = getStoredQuestions();
  let candidateQuestions = allQuestions.filter(
    q => q.programSlug === programSlug && q.status === 'published'
  );

  // 3. Filter by category if not 'all'
  if (category && category !== 'all') {
    candidateQuestions = candidateQuestions.filter(q => q.category === category);
  }

  // 4. Filter by difficulty if not 'all'
  if (difficulty && difficulty !== 'all') {
    candidateQuestions = candidateQuestions.filter(q => q.difficulty === difficulty);
  }

  const availableCount = candidateQuestions.length;

  // 5. Check if any questions match
  if (availableCount === 0) {
    return {
      success: false,
      availableCount: 0,
      error: `ยังไม่มีคำถามที่ตรงตามเงื่อนไขในหลักสูตร "${program.name}" กรุณาปรับเปลี่ยนหมวดคำถามหรือระดับความยาก`,
    };
  }

  // 6. Check if available questions are less than requested
  const actualCountToTake = Math.min(requestedCount, availableCount);

  // 7. Unbiased shuffle without repetition within the session
  const shuffled = shuffleArray(candidateQuestions);
  const selectedQuestions = shuffled.slice(0, actualCountToTake);
  const selectedQuestionIds = selectedQuestions.map(q => q.id);

  // 8. Initialize answers record
  const initialAnswers: Record<string, PracticeAnswer> = {};
  selectedQuestionIds.forEach(qId => {
    initialAnswers[qId] = {
      questionId: qId,
      answerText: '',
      timeSpentSeconds: 0,
      status: 'draft',
    };
  });

  // 9. Build Session object
  const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const newSession: PracticeSession = {
    id: sessionId,
    isGuest: true,
    programSlug,
    programName: program.name,
    selectedCategory: category,
    selectedDifficulty: difficulty,
    totalQuestions: actualCountToTake,
    answeredCount: 0,
    skippedCount: 0,
    totalTimeSpentSeconds: 0,
    startedAt: new Date().toISOString(),
    questionIds: selectedQuestionIds,
    answers: initialAnswers,
    mode,
    timerDurationSeconds,
    status: 'in_progress',
  };

  return {
    success: true,
    session: newSession,
    availableCount,
  };
}
