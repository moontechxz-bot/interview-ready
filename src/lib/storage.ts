import { Program, Question, PracticeSession, AdminStats } from '@/types';
import { INITIAL_PROGRAMS } from '@/data/programs';
import { INITIAL_QUESTIONS } from '@/data/questions';

const STORAGE_KEYS = {
  PROGRAMS: 'interview_ready_programs_v2',
  QUESTIONS: 'interview_ready_questions_v2',
  SESSIONS: 'interview_ready_sessions_v1',
  ACTIVE_SESSION: 'interview_ready_active_session_v1',
  ADMIN_AUTH: 'interview_ready_admin_auth_v1',
};

// --- Programs ---
export function getStoredPrograms(): Program[] {
  if (typeof window === 'undefined') {
    return INITIAL_PROGRAMS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRAMS);
    let parsed: Program[] = raw ? JSON.parse(raw) : [];
    
    // Merge any missing initial programs
    const existingSlugs = new Set(parsed.map(p => p.slug));
    const missing = INITIAL_PROGRAMS.filter(p => !existingSlugs.has(p.slug));
    if (missing.length > 0 || !raw) {
      parsed = [...parsed, ...missing];
      saveStoredPrograms(parsed);
    }

    // Recalculate dynamic question count based on actual published questions
    const questions = getStoredQuestions();
    return parsed.map(p => ({
      ...p,
      questionCount: questions.filter(q => q.programSlug === p.slug && q.status === 'published').length
    }));
  } catch (err) {
    console.error('Failed to load programs from localStorage:', err);
    return INITIAL_PROGRAMS;
  }
}

export function saveStoredPrograms(programs: Program[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(programs));
}

export function getProgramBySlug(slug: string): Program | undefined {
  const programs = getStoredPrograms();
  return programs.find(p => p.slug === slug);
}

// --- Questions ---
export function getStoredQuestions(): Question[] {
  if (typeof window === 'undefined') {
    return INITIAL_QUESTIONS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    let parsed: Question[] = raw ? JSON.parse(raw) : [];
    
    // Merge any missing initial questions
    const existingIds = new Set(parsed.map(q => q.id));
    const missing = INITIAL_QUESTIONS.filter(q => !existingIds.has(q.id));
    if (missing.length > 0 || !raw) {
      parsed = [...parsed, ...missing];
      saveStoredQuestions(parsed);
    }
    return parsed;
  } catch (err) {
    console.error('Failed to load questions from localStorage:', err);
    return INITIAL_QUESTIONS;
  }
}

export function saveStoredQuestions(questions: Question[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
}

// --- Practice Sessions & History ---
export function getStoredSessions(): PracticeSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to load practice sessions:', err);
    return [];
  }
}

export function saveSession(session: PracticeSession): void {
  if (typeof window === 'undefined') return;
  const sessions = getStoredSessions();
  const existingIdx = sessions.findIndex(s => s.id === session.id);
  if (existingIdx >= 0) {
    sessions[existingIdx] = session;
  } else {
    sessions.unshift(session);
  }
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
}

export function deleteSession(sessionId: string): void {
  if (typeof window === 'undefined') return;
  const sessions = getStoredSessions().filter(s => s.id !== sessionId);
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
}

export function getActiveSession(): PracticeSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setActiveSession(session: PracticeSession | null): void {
  if (typeof window === 'undefined') return;
  if (!session) {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
  } else {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(session));
  }
}

// --- Admin Stats ---
export function getAdminStats(): AdminStats {
  const programs = getStoredPrograms();
  const questions = getStoredQuestions();
  const sessions = getStoredSessions();

  return {
    totalPrograms: programs.length,
    publishedPrograms: programs.filter(p => p.status === 'published').length,
    totalQuestions: questions.length,
    publishedQuestions: questions.filter(q => q.status === 'published').length,
    draftQuestions: questions.filter(q => q.status === 'draft').length,
    totalPracticeSessions: sessions.length,
  };
}
