'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Timer as TimerIcon, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb, 
  Clock,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge, DifficultyBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { getStoredPrograms, getStoredQuestions, setActiveSession, getActiveSession } from '@/lib/storage';
import { createPracticeSession } from '@/lib/randomizer';
import { Program, Question, PracticeSession } from '@/types';

export default function PracticePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultProgramSlug = searchParams.get('program') || 'mechanical-engineering';

  const [programs, setPrograms] = useState<Program[]>([]);
  const [questionsPool, setQuestionsPool] = useState<Question[]>([]);

  // Configuration Form State
  const [selectedProgramSlug, setSelectedProgramSlug] = useState<string>(defaultProgramSlug);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCount, setSelectedCount] = useState<number>(5);
  const [selectedMode, setSelectedMode] = useState<'one_by_one' | 'continuous' | 'category_focused'>('one_by_one');
  const [timerSecondsChoice, setTimerSecondsChoice] = useState<number>(60);

  // Flow State
  const [viewState, setViewState] = useState<'configure' | 'confirm' | 'practicing'>('configure');
  const [configError, setConfigError] = useState<string | null>(null);

  // Active Session State
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showFinishConfirm, setShowFinishConfirm] = useState<boolean>(false);

  // Timer State
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load programs & check active session recovery
  useEffect(() => {
    const loadedPrograms = getStoredPrograms();
    setPrograms(loadedPrograms);
    const loadedQuestions = getStoredQuestions();
    setQuestionsPool(loadedQuestions);

    // Check for ongoing session to recover as per Spec Section 11
    const existingSession = getActiveSession();
    if (existingSession && existingSession.status === 'in_progress') {
      setSession(existingSession);
      setSelectedProgramSlug(existingSession.programSlug);
      // find first unanswered or current index
      const initialIdx = 0;
      setCurrentIndex(initialIdx);
      const qId = existingSession.questionIds[initialIdx];
      setCurrentAnswer(existingSession.answers[qId]?.answerText || '');
      setTimeLeft(existingSession.timerDurationSeconds || 60);
      setViewState('practicing');
    }
  }, []);

  // Update query param if program changes
  useEffect(() => {
    if (searchParams.get('program')) {
      setSelectedProgramSlug(searchParams.get('program')!);
    }
  }, [searchParams]);

  // Current Question Object
  const currentQuestion: Question | undefined = session
    ? questionsPool.find(q => q.id === session.questionIds[currentIndex])
    : undefined;

  // Real-time calculation of available candidate count
  const availableMatchingCount = questionsPool.filter(q => {
    if (q.programSlug !== selectedProgramSlug || q.status !== 'published') return false;
    if (selectedCategory !== 'all' && q.category !== selectedCategory) return false;
    if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
    return true;
  }).length;

  // Handle Timer ticking
  useEffect(() => {
    if (viewState === 'practicing' && isTimerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setIsTimeUp(true);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [viewState, isTimerRunning, timeLeft]);

  // Start practicing confirmation
  const handleProceedToConfirm = () => {
    setConfigError(null);
    if (availableMatchingCount === 0) {
      setConfigError(`ไม่พบคำถามที่ตรงกับตัวกรองที่เลือกสำหรับหลักสูตรนี้ (มีคำถามตรงเงื่อนไข 0 ข้อ) กรุณาเปลี่ยนหมวดหรือความยาก`);
      return;
    }
    setViewState('confirm');
  };

  // Launch Practice Session
  const handleStartSession = () => {
    const result = createPracticeSession({
      programSlug: selectedProgramSlug,
      category: selectedCategory,
      difficulty: selectedDifficulty,
      requestedCount: selectedCount,
      mode: selectedMode,
      timerDurationSeconds: timerSecondsChoice,
    });

    if (!result.success || !result.session) {
      setConfigError(result.error || 'เกิดข้อผิดพลาดในการสุ่มคำถาม');
      setViewState('configure');
      return;
    }

    setSession(result.session);
    setActiveSession(result.session);
    setCurrentIndex(0);
    setCurrentAnswer('');
    setShowHint(false);
    setTimeLeft(timerSecondsChoice);
    setIsTimerRunning(timerSecondsChoice > 0);
    setIsTimeUp(false);
    setViewState('practicing');
  };

  // Save draft for current question
  const saveCurrentAnswerToSession = (answerText: string, status: 'answered' | 'skipped' | 'draft') => {
    if (!session || !currentQuestion) return;
    const qId = currentQuestion.id;
    const timeSpent = Math.max(0, (session.timerDurationSeconds || 60) - timeLeft);

    const updatedSession: PracticeSession = {
      ...session,
      answers: {
        ...session.answers,
        [qId]: {
          questionId: qId,
          answerText,
          timeSpentSeconds: timeSpent,
          status: status === 'draft' ? (answerText.trim() ? 'answered' : 'skipped') : status,
        },
      },
    };

    setSession(updatedSession);
    setActiveSession(updatedSession);
  };

  // Navigate Questions
  const goToQuestion = (targetIndex: number) => {
    if (!session) return;
    // Save current
    saveCurrentAnswerToSession(currentAnswer, currentAnswer.trim() ? 'answered' : 'draft');

    // Load target answer
    const nextQId = session.questionIds[targetIndex];
    const savedAnswer = session.answers[nextQId]?.answerText || '';
    setCurrentIndex(targetIndex);
    setCurrentAnswer(savedAnswer);
    setShowHint(false);

    // Reset Timer for next question
    setTimeLeft(session.timerDurationSeconds || 60);
    setIsTimerRunning(session.timerDurationSeconds > 0);
    setIsTimeUp(false);
  };

  // Complete and submit session
  const handleFinishPractice = () => {
    if (!session) return;
    saveCurrentAnswerToSession(currentAnswer, currentAnswer.trim() ? 'answered' : 'draft');

    const finalSession = getActiveSession() || session;
    const answersList = Object.values(finalSession.answers);
    const answeredCount = answersList.filter(a => a.answerText.trim() !== '').length;
    const skippedCount = finalSession.totalQuestions - answeredCount;

    const completedSession: PracticeSession = {
      ...finalSession,
      answeredCount,
      skippedCount,
      completedAt: new Date().toISOString(),
      status: 'completed',
    };

    setActiveSession(null); // clear active
    // Save to completed storage
    import('@/lib/storage').then(mod => {
      mod.saveSession(completedSession);
      router.push(`/practice/result?session=${completedSession.id}`);
    });
  };

  // Current selected program
  const currentConfigProgram = programs.find(p => p.slug === selectedProgramSlug);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

      {/* ============================================================== */}
      {/* 1. CONFIGURATION VIEW */}
      {/* ============================================================== */}
      {viewState === 'configure' && (
        <div className="space-y-8 animate-fade-in">
          
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-wider uppercase text-[#F26A21]">INTERVIEW SIMULATION</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
              ตั้งค่าการฝึกและสุ่มคำถาม
            </h1>
            <p className="text-sm text-[#4B5563]">
              เลือกหลักสูตร หมวดคำถาม ระดับความยาก และระบบจับเวลาเพื่อเริ่มต้นจำลองห้องสัมภาษณ์
            </p>
          </div>

          {configError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-sm text-rose-800">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">ไม่สามารถเริ่มการฝึกได้</p>
                <p className="text-xs text-rose-700 mt-0.5">{configError}</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 shadow-sm space-y-8">
            
            {/* Step 1: Program Selection */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-[#1F2937] flex items-center justify-between">
                <span>1. เลือกหลักสูตรที่ต้องการฝึก</span>
                <span className="text-xs text-[#F26A21] font-medium">บังคับเลือก</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {programs.map((p) => {
                  const isSelected = selectedProgramSlug === p.slug;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedProgramSlug(p.slug);
                        setConfigError(null);
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-[#F26A21] bg-[#FFF1E8]/30 ring-2 ring-[#F26A21]/20'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="primary" size="sm">{p.categoryLabel}</Badge>
                        <span className="text-xs text-[#9CA3AF] font-medium">{p.questionCount} ข้อ</span>
                      </div>
                      <h4 className="font-bold text-base text-[#1F2937] leading-tight">{p.name}</h4>
                      <p className="text-xs text-[#4B5563] mt-1">{p.degreeShort} • {p.facultyName}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Category Filter */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-[#1F2937]">
                2. หมวดคำถาม
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'all', label: 'ทุกหมวดคำถาม' },
                  { id: 'general', label: 'คำถามทั่วไปและแนะนำตัว' },
                  { id: 'motivation', label: 'แรงจูงใจในการเลือกเรียน' },
                  { id: 'technical', label: 'ความรู้เฉพาะสาขา' },
                  { id: 'problem_solving', label: 'แก้ปัญหาและสถานการณ์' },
                  { id: 'teamwork', label: 'จุดแข็ง จุดอ่อน และทีม' },
                  { id: 'future_goals', label: 'เป้าหมายในอนาคต' },
                  { id: 'followup', label: 'คำถามต่อยอดจากคำตอบ' },
                ].map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all text-center ${
                        isSelected
                          ? 'border-[#F26A21] bg-[#F26A21] text-white font-semibold'
                          : 'border-gray-200 hover:bg-gray-50 text-[#4B5563]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Difficulty & Count & Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 border-t border-gray-100">
              
              {/* Difficulty */}
              <div className="space-y-2.5">
                <label className="text-sm font-bold text-[#1F2937]">3. ระดับความยาก</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'all', label: 'ทั้งหมด' },
                    { id: 'easy', label: 'ง่าย' },
                    { id: 'medium', label: 'ปานกลาง' },
                    { id: 'hard', label: 'ท้าทาย' },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setSelectedDifficulty(d.id)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                        selectedDifficulty === d.id
                          ? 'bg-[#1F2937] text-white border-[#1F2937]'
                          : 'border-gray-200 text-[#4B5563] hover:bg-gray-50'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of questions */}
              <div className="space-y-2.5">
                <label className="text-sm font-bold text-[#1F2937]">4. จำนวนคำถาม</label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 15, 20].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setSelectedCount(num)}
                      className={`py-2 rounded-xl border text-xs font-bold text-center transition-all ${
                        selectedCount === num
                          ? 'bg-[#F26A21] text-white border-[#F26A21]'
                          : 'border-gray-200 text-[#4B5563] hover:bg-gray-50'
                      }`}
                    >
                      {num} ข้อ
                    </button>
                  ))}
                </div>
              </div>

              {/* Timer duration per question */}
              <div className="space-y-2.5">
                <label className="text-sm font-bold text-[#1F2937] flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#F26A21]" />
                  <span>5. เวลาตอบต่อข้อ</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[30, 60, 90, 120].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setTimerSecondsChoice(sec)}
                      className={`py-2 rounded-xl border text-xs font-bold text-center transition-all ${
                        timerSecondsChoice === sec
                          ? 'bg-[#1F2937] text-white border-[#1F2937]'
                          : 'border-gray-200 text-[#4B5563] hover:bg-gray-50'
                      }`}
                    >
                      {sec} วิ
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Practice Mode */}
            <div className="space-y-2.5 pt-2 border-t border-gray-100">
              <label className="text-sm font-bold text-[#1F2937]">6. รูปแบบการฝึก</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'one_by_one' as const, title: 'ฝึกคิดทีละข้อ', desc: 'มีเวลาให้อ่านและทบทวนอย่างอิสระ' },
                  { id: 'continuous' as const, title: 'จำลองสัมภาษณ์ต่อเนื่อง', desc: 'เปลี่ยนคำถามตามเวลาเสมือนจริง' },
                  { id: 'category_focused' as const, title: 'สุ่มคำถามเฉพาะหมวด', desc: 'เน้นเจาะลึกทักษะเฉพาะด้าน' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setSelectedMode(mode.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedMode === mode.id
                        ? 'border-[#F26A21] bg-[#FFF1E8]/30 font-semibold'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-bold text-sm text-[#1F2937]">{mode.title}</div>
                    <div className="text-xs text-[#9CA3AF] mt-0.5">{mode.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Real-Time Match Status & Submit */}
            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-sm text-[#4B5563] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#F26A21]" />
                <span>
                  พบคำถามตรงตามตัวกรอง: <strong className="text-[#1F2937]">{availableMatchingCount} ข้อ</strong>
                  {availableMatchingCount > 0 && availableMatchingCount < selectedCount && (
                    <span className="text-amber-600 ml-1 text-xs">(จะสุ่มเท่าที่มี {availableMatchingCount} ข้อ)</span>
                  )}
                </span>
              </div>

              <Button
                size="lg"
                variant="primary"
                onClick={handleProceedToConfirm}
                disabled={availableMatchingCount === 0}
                rightIcon={<ChevronRight className="w-5 h-5" />}
              >
                ตรวจสอบและเริ่มฝึก
              </Button>
            </div>

          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* 2. CONFIRMATION SUMMARY VIEW (Section 6.5 Requirement) */}
      {/* ============================================================== */}
      {viewState === 'confirm' && currentConfigProgram && (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
          
          <div className="space-y-1 text-center">
            <h2 className="text-2xl font-bold text-[#111827]">สรุปเงื่อนไขการฝึกสัมภาษณ์</h2>
            <p className="text-sm text-[#4B5563]">ตรวจสอบความพร้อมก่อนเข้าสู่ห้องจำลองสัมภาษณ์</p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 shadow-sm space-y-5">
            <div className="p-4 bg-[#FFF1E8]/50 rounded-2xl border border-[#FED7AA]/60 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-[#F26A21] shrink-0" />
              <div>
                <h4 className="font-bold text-[#111827] text-base">{currentConfigProgram.name}</h4>
                <p className="text-xs text-[#4B5563]">{currentConfigProgram.degreeName} ({currentConfigProgram.degreeShort})</p>
              </div>
            </div>

            <div className="divide-y divide-gray-100 text-sm">
              <div className="py-2.5 flex justify-between">
                <span className="text-[#9CA3AF]">หมวดคำถาม:</span>
                <span className="font-semibold text-[#1F2937]">{selectedCategory === 'all' ? 'ทุกหมวดคำถาม' : selectedCategory}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#9CA3AF]">ระดับความยาก:</span>
                <span className="font-semibold text-[#1F2937]">{selectedDifficulty === 'all' ? 'ทุกระดับความยาก' : selectedDifficulty}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#9CA3AF]">จำนวนข้อที่จะฝึก:</span>
                <span className="font-bold text-[#F26A21]">{Math.min(selectedCount, availableMatchingCount)} ข้อ</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#9CA3AF]">เวลาตอบต่อข้อ:</span>
                <span className="font-semibold text-[#1F2937]">{timerSecondsChoice} วินาที</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#9CA3AF]">การบันทึกคำตอบ:</span>
                <span className="font-semibold text-emerald-600">บันทึก Draft อัตโนมัติ</span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setViewState('configure')}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              >
                กลับไปแก้ไขตัวเลือก
              </Button>

              <Button
                variant="primary"
                size="lg"
                onClick={handleStartSession}
                rightIcon={<Play className="w-4 h-4 fill-white" />}
              >
                เริ่มการฝึกทันที
              </Button>
            </div>

          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* 3. PRACTICING INTERVIEW SCREEN (Section 6.6 Requirement) */}
      {/* ============================================================== */}
      {viewState === 'practicing' && session && currentQuestion && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Top Bar: Progress and Timer */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Program & Question Index */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#F26A21]">{session.programName}</span>
                <span className="text-xs text-gray-300">•</span>
                <span className="text-xs text-[#9CA3AF]">หมวด: {currentQuestion.categoryNameTh}</span>
              </div>
              <div className="text-base font-extrabold text-[#111827] mt-0.5">
                คำถามข้อที่ {currentIndex + 1} จาก {session.totalQuestions}
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center gap-3">
              <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-mono font-bold text-lg ${
                isTimeUp
                  ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                  : timeLeft <= 10
                  ? 'bg-amber-50 border-amber-300 text-amber-700'
                  : 'bg-gray-50 border-gray-200 text-[#1F2937]'
              }`}>
                <TimerIcon className={`w-5 h-5 ${isTimeUp ? 'text-rose-600' : 'text-[#F26A21]'}`} />
                <span>{timeLeft}s</span>
              </div>

              {/* Timer Action Buttons */}
              <button
                type="button"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                title={isTimerRunning ? 'หยุดเวลาชั่วคราว' : 'เริ่มจับเวลาต่อ'}
                aria-label={isTimerRunning ? 'หยุดเวลา' : 'เริ่มเวลา'}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTimeLeft(session.timerDurationSeconds || 60);
                  setIsTimerRunning(true);
                  setIsTimeUp(false);
                }}
                className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                title="เริ่มนับเวลาข้อนี้ใหม่"
                aria-label="เริ่มนับเวลาใหม่"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowFinishConfirm(true)}
              >
                จบการฝึก
              </Button>
            </div>

          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#F26A21] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / session.totalQuestions) * 100}%` }}
            />
          </div>

          {/* Time Up Notification Banner (doesn't delete text) */}
          {isTimeUp && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs sm:text-sm text-rose-800 animate-fade-in">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span><strong>หมดเวลาสำหรับข้อนี้แล้ว!</strong> คำตอบที่คุณพิมพ์ไว้ยังคงอยู่ครบถ้วน คุณสามารถแก้ไขหรือกดถัดไปได้ทันที</span>
              </div>
            </div>
          )}

          {/* Single Question Main Card */}
          <Card className="p-6 sm:p-10 space-y-6">
            
            {/* Meta tags */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-400 font-semibold">{currentQuestion.id}</span>
                <span className="text-xs text-gray-300">•</span>
                <Badge variant="default" size="sm">{currentQuestion.categoryNameTh}</Badge>
              </div>
              <DifficultyBadge difficulty={currentQuestion.difficulty} size="sm" />
            </div>

            {/* Big Question Prompt as per Spec 6.6 */}
            <h2 className="text-xl sm:text-3xl font-extrabold text-[#111827] leading-relaxed">
              &ldquo;{currentQuestion.question}&rdquo;
            </h2>

            {/* Hint & Follow-up Questions Section */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="text-xs sm:text-sm font-semibold text-[#F26A21] hover:text-[#D95614] inline-flex items-center gap-1.5 focus:outline-none"
              >
                <Lightbulb className="w-4 h-4" />
                <span>{showHint ? 'ซ่อนแนวทางคิด (Hint)' : 'คลิกเพื่อดูแนวทางคิดและสิ่งที่กรรมการอยากฟัง'}</span>
              </button>

              {showHint && (
                <div className="mt-3 p-4 bg-[#FFF1E8]/60 rounded-2xl border border-[#FED7AA] text-xs sm:text-sm text-[#4B5563] space-y-2 animate-fade-in">
                  <p>
                    <strong className="text-[#D95614]">แนวทางคิด: </strong>
                    {currentQuestion.hint}
                  </p>
                  {currentQuestion.followUpQuestions && currentQuestion.followUpQuestions.length > 0 && (
                    <div className="pt-2 border-t border-[#FED7AA]/60 text-xs text-gray-600">
                      <strong>คำถามต่อยอดที่เป็นไปได้: </strong>
                      {currentQuestion.followUpQuestions.join(', ')}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Answer Input Textarea */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
                <label htmlFor="answer-textarea" className="font-semibold text-[#4B5563]">
                  พิมพ์คำตอบของคุณ (จำลองการพูด):
                </label>
                <span>{currentAnswer.length} ตัวอักษร</span>
              </div>
              <textarea
                id="answer-textarea"
                rows={6}
                value={currentAnswer}
                onChange={(e) => {
                  setCurrentAnswer(e.target.value);
                  saveCurrentAnswerToSession(e.target.value, 'draft');
                }}
                placeholder="พิมพ์คำตอบของคุณที่นี่... สามารถทดลองตอบตามโครงสร้าง STAR หรือเรียบเรียงความคิดก่อนพูดจริง"
                className="w-full p-4 rounded-2xl border border-gray-200 text-sm sm:text-base leading-relaxed focus:border-[#F26A21] focus:ring-2 focus:ring-[#F26A21]/20 outline-none transition-all resize-y"
              />
              <p className="text-[11px] text-gray-400">
                * บันทึกแบบร่างอัตโนมัติในเบราว์เซอร์ ไม่บังคับตอบ สามารถกดข้ามได้หากต้องการ
              </p>
            </div>

            {/* Navigation Bottom Controls */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-between gap-3">
              
              {/* Back Button */}
              <Button
                variant="outline"
                size="md"
                onClick={() => goToQuestion(currentIndex - 1)}
                disabled={currentIndex === 0}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              >
                ย้อนกลับ
              </Button>

              <div className="flex items-center gap-2">
                {/* Skip button */}
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => {
                    saveCurrentAnswerToSession('', 'skipped');
                    if (currentIndex < session.totalQuestions - 1) {
                      goToQuestion(currentIndex + 1);
                    } else {
                      handleFinishPractice();
                    }
                  }}
                >
                  ข้ามข้อนี้
                </Button>

                {/* Next or Finish Button */}
                {currentIndex < session.totalQuestions - 1 ? (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => goToQuestion(currentIndex + 1)}
                    rightIcon={<ChevronRight className="w-4 h-4" />}
                  >
                    บันทึกและไปข้อถัดไป
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleFinishPractice}
                    rightIcon={<CheckCircle2 className="w-4 h-4" />}
                  >
                    ส่งคำตอบและดูผลสรุป
                  </Button>
                )}
              </div>

            </div>

          </Card>

          {/* Modal to confirm ending session */}
          <Modal
            isOpen={showFinishConfirm}
            onClose={() => setShowFinishConfirm(false)}
            title="ยืนยันการจบการฝึกก่อนกำหนด?"
          >
            <div className="space-y-4">
              <p className="text-sm text-[#4B5563]">
                คุณได้ตอบไปแล้ว {Object.values(session.answers).filter(a => a.answerText.trim() !== '').length} ข้อ จากทั้งหมด {session.totalQuestions} ข้อ 
                หากจบการฝึกตอนนี้ ระบบจะสรุปผลเฉพาะข้อที่คุณได้บันทึกไว้
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" size="sm" onClick={() => setShowFinishConfirm(false)}>
                  ฝึกต่อ
                </Button>
                <Button variant="danger" size="sm" onClick={handleFinishPractice}>
                  จบการฝึกและดูผล
                </Button>
              </div>
            </div>
          </Modal>

        </div>
      )}

    </div>
  );
}
