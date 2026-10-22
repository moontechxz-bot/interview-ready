'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle2, 
  RotateCcw, 
  Printer, 
  Share2, 
  BookOpen, 
  AlertCircle, 
  Calendar,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge, DifficultyBadge } from '@/components/ui/Badge';
import { getStoredSessions, getStoredQuestions } from '@/lib/storage';
import { PracticeSession, Question } from '@/types';
import confetti from 'canvas-confetti';

export default function PracticeResultPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session');

  const [session, setSession] = useState<PracticeSession | null>(null);
  const [questionsMap, setQuestionsMap] = useState<Record<string, Question>>({});
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    // Launch festive celebration confetti on successful finish
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F26A21', '#D95614', '#FED7AA', '#10B981']
      });
    } catch {}

    const allSessions = getStoredSessions();
    const foundSession = sessionId 
      ? allSessions.find(s => s.id === sessionId) 
      : allSessions[0];

    if (foundSession) {
      setSession(foundSession);
      const allQ = getStoredQuestions();
      const map: Record<string, Question> = {};
      allQ.forEach(q => {
        map[q.id] = q;
      });
      setQuestionsMap(map);
    }
  }, [sessionId]);

  if (!session) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-[#F26A21] mx-auto" />
        <h1 className="text-2xl font-bold text-[#111827]">ไม่พบข้อมูลรอบการฝึกสัมภาษณ์</h1>
        <p className="text-sm text-[#4B5563]">กรุณาเริ่มการฝึกจากหน้าหลักหรือหน้าระบบสุ่มคำถาม</p>
        <Link href="/practice">
          <Button variant="primary">ไปหน้าสุ่มคำถาม</Button>
        </Link>
      </div>
    );
  }

  // Calculate statistics
  const answersList = Object.values(session.answers);
  const answeredCount = answersList.filter(a => a.answerText.trim() !== '').length;
  const skippedCount = session.totalQuestions - answeredCount;
  const totalTimeSpentSeconds = answersList.reduce((acc, curr) => acc + (curr.timeSpentSeconds || 0), 0);

  const formattedDate = new Date(session.startedAt).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Questions recommended to revisit (skipped questions or short answers)
  const revisitQuestions = session.questionIds.filter(qId => {
    const a = session.answers[qId];
    return !a || a.answerText.trim().length < 20;
  });

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleCopySummary = () => {
    const text = `ผลการฝึกสัมภาษณ์: ${session.programName}\nวันที่: ${formattedDate}\nตอบแล้ว: ${answeredCount}/${session.totalQuestions} ข้อ\nเวลาที่ใช้: ${totalTimeSpentSeconds} วินาที\nแพลตฟอร์ม: INTERVIEW READY (ติดไปด้วยกัน by อาตี๋)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 print:py-2">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-10 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <Badge variant="primary">จบการฝึกซ้อมแล้ว</Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
            สรุปผลการฝึกสัมภาษณ์
          </h1>
          <p className="text-base font-semibold text-[#F26A21]">
            หลักสูตร: {session.programName}
          </p>
          <p className="text-xs text-[#9CA3AF] flex items-center justify-center gap-1.5 pt-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>วันและเวลา: {formattedDate}</span>
          </p>
        </div>

        {/* Stats Grid as per Spec Section 6.7 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-2xl mx-auto">
          <div className="p-4 rounded-2xl bg-[#F5F6F8] border border-gray-100">
            <span className="text-2xl font-black text-[#111827]">{session.totalQuestions}</span>
            <p className="text-xs text-[#4B5563] mt-0.5">จำนวนข้อทั้งหมด</p>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
            <span className="text-2xl font-black text-emerald-700">{answeredCount}</span>
            <p className="text-xs text-emerald-800 mt-0.5">ตอบแล้ว</p>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
            <span className="text-2xl font-black text-amber-700">{skippedCount}</span>
            <p className="text-xs text-amber-800 mt-0.5">ข้ามคำถาม</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#FFF1E8] border border-[#FED7AA]">
            <span className="text-2xl font-black text-[#D95614]">{totalTimeSpentSeconds}s</span>
            <p className="text-xs text-[#D95614] mt-0.5">เวลาที่ใช้จริง</p>
          </div>
        </div>

        {/* Disclaimer about Statistics-Only without AI Fabrication */}
        <p className="text-xs text-gray-400 max-w-md mx-auto pt-2">
          * ระบบแสดงผลสรุปเชิงสถิติตามการฝึกจริง ไม่มีการคิดคะแนนคาดเดาหรือรับประกันโอกาสสอบติด
        </p>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3 print:hidden">
          <Link href={`/practice?program=${session.programSlug}`}>
            <Button variant="primary" size="md" leftIcon={<RotateCcw className="w-4 h-4" />}>
              ฝึกหลักสูตรนี้อีกครั้ง
            </Button>
          </Link>
          <Link href={`/programs/${session.programSlug}`}>
            <Button variant="outline" size="md" leftIcon={<BookOpen className="w-4 h-4" />}>
              กลับหน้าหลักสูตร
            </Button>
          </Link>
          <Button variant="ghost" size="md" onClick={handlePrint} leftIcon={<Printer className="w-4 h-4" />}>
            พิมพ์ผลสรุป (Print)
          </Button>
          <Button variant="ghost" size="md" onClick={handleCopySummary} leftIcon={<Share2 className="w-4 h-4" />}>
            {copied ? 'คัดลอกแล้ว!' : 'คัดลอกสรุป'}
          </Button>
        </div>

      </div>

      {/* Recommended Questions to Revisit */}
      {revisitQuestions.length > 0 && (
        <div className="bg-amber-50/60 rounded-3xl border border-amber-200/80 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-base sm:text-lg text-amber-900">
              คำถามที่ควรกลับมาฝึกซ้ำ ({revisitQuestions.length} ข้อ)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-amber-800">
            ข้อเหล่านี้คุณได้กดข้ามหรือตอบไว้สั้นมาก แนะนำให้ลองทบทวนแนวทางคิดและฝึกตอบเพิ่มเติม
          </p>
          <ul className="space-y-2">
            {revisitQuestions.map(qId => {
              const q = questionsMap[qId];
              if (!q) return null;
              return (
                <li key={qId} className="p-3 bg-white rounded-xl border border-amber-200 text-xs sm:text-sm text-[#1F2937] font-medium flex items-start gap-2">
                  <span className="text-[#F26A21] font-bold shrink-0">•</span>
                  <span>{q.question}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Detailed Review of Each Question and Answer */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[#111827] flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#F26A21]" />
          <span>ทบทวนคำตอบทีละข้อ ({session.totalQuestions} ข้อ)</span>
        </h2>

        <div className="space-y-4">
          {session.questionIds.map((qId, index) => {
            const q = questionsMap[qId];
            const answer = session.answers[qId];
            const hasAnswer = answer && answer.answerText.trim() !== '';

            return (
              <Card key={qId} className="p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="w-6 h-6 rounded-full bg-[#FFF1E8] text-[#D95614] flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-[#9CA3AF] font-mono">{qId}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-[#4B5563]">{q?.categoryNameTh || 'คำถามสัมภาษณ์'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasAnswer ? (
                      <Badge variant="success" size="sm">ตอบแล้ว</Badge>
                    ) : (
                      <Badge variant="warning" size="sm">ข้ามข้อนี้</Badge>
                    )}
                    {q && <DifficultyBadge difficulty={q.difficulty} size="sm" />}
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#1F2937]">
                  {q?.question || 'กำลังโหลดคำถาม...'}
                </h3>

                {/* User's Answer */}
                <div className="p-4 rounded-2xl bg-[#F5F6F8] border border-gray-200/80 space-y-1">
                  <span className="text-xs font-semibold text-[#9CA3AF] block">
                    คำตอบที่คุณบันทึกไว้:
                  </span>
                  {hasAnswer ? (
                    <p className="text-sm text-[#111827] whitespace-pre-wrap leading-relaxed">
                      {answer.answerText}
                    </p>
                  ) : (
                    <p className="text-sm italic text-gray-400">
                      (ไม่มีการบันทึกคำตอบสำหรับข้อนี้)
                    </p>
                  )}
                  {answer?.timeSpentSeconds !== undefined && (
                    <span className="text-[11px] text-gray-400 block pt-1">
                      เวลาที่ใช้: {answer.timeSpentSeconds} วินาที
                    </span>
                  )}
                </div>

                {/* Hint and Followup */}
                {q && (
                  <div className="p-4 rounded-2xl bg-orange-50/40 border border-orange-100 text-xs sm:text-sm text-[#4B5563] space-y-2">
                    <p>
                      <strong className="text-[#D95614]">แนวทางคิดที่เหมาะสม: </strong>
                      {q.hint}
                    </p>
                    {q.followUpQuestions && q.followUpQuestions.length > 0 && (
                      <p className="text-gray-500 text-xs border-t border-orange-100 pt-2">
                        <strong>คำถามต่อยอดที่อาจพบ: </strong>
                        {q.followUpQuestions.join(', ')}
                      </p>
                    )}
                  </div>
                )}

              </Card>
            );
          })}
        </div>
      </div>

    </div>
  );
}
