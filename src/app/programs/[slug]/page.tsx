'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronRight, 
  Play, 
  AlertCircle,
  Lightbulb,
  ShieldCheck,
  Layers,
  BarChart2,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge, DifficultyBadge } from '@/components/ui/Badge';
import { getProgramBySlug, getStoredQuestions } from '@/lib/storage';
import { Program, Question } from '@/types';

export default function ProgramDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [program, setProgram] = useState<Program | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sampleQuestions, setSampleQuestions] = useState<Question[]>([]);
  const [showAnswerIdx, setShowAnswerIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;
    const foundProgram = getProgramBySlug(slug);
    if (foundProgram) {
      setProgram(foundProgram);
      const allQ = getStoredQuestions();
      const programQ = allQ.filter(q => q.programSlug === slug && q.status === 'published');
      setQuestions(programQ);
      setSampleQuestions(programQ.slice(0, 5)); // First 5 as sample questions
    }
  }, [slug]);

  if (!program) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-[#F26A21] mx-auto" />
        <h1 className="text-2xl font-bold text-[#111827]">ไม่พบหลักสูตรที่คุณต้องการ</h1>
        <p className="text-sm text-[#4B5563]">หลักสูตรนี้อาจยังไม่เปิดให้บริการหรือลิงก์ไม่ถูกต้อง</p>
        <Link href="/programs">
          <Button variant="primary">กลับสู่หน้ารายการหลักสูตร</Button>
        </Link>
      </div>
    );
  }

  // Calculate difficulty distribution
  const easyCount = questions.filter(q => q.difficulty === 'easy').length;
  const mediumCount = questions.filter(q => q.difficulty === 'medium').length;
  const hardCount = questions.filter(q => q.difficulty === 'hard').length;

  // Categories breakdown
  const categoryMap: Record<string, number> = {};
  questions.forEach(q => {
    categoryMap[q.categoryNameTh] = (categoryMap[q.categoryNameTh] || 0) + 1;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      
      {/* 1. Breadcrumb as per Spec */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-[#9CA3AF]">
        <Link href="/" className="hover:text-[#F26A21] transition-colors">
          หน้าหลัก
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href="/programs" className="hover:text-[#F26A21] transition-colors">
          ค้นหาหลักสูตร
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-[#1F2937] font-semibold truncate max-w-xs sm:max-w-none">
          {program.name}
        </span>
      </nav>

      {/* 2. Program Hero Info Card */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">{program.categoryLabel}</Badge>
            <span className="text-xs text-[#9CA3AF]">•</span>
            <span className="text-xs font-semibold text-[#F26A21]">
              {program.degreeName} ({program.degreeShort})
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111827] leading-tight">
            {program.name}
          </h1>

          <div className="text-sm text-[#4B5563] space-y-1">
            <p className="font-semibold text-[#1F2937]">{program.facultyName}</p>
            {program.majorName && <p>{program.majorName}</p>}
          </div>

          <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed pt-2">
            {program.description}
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link href={`/practice?program=${program.slug}`}>
              <Button size="lg" variant="primary" leftIcon={<Play className="w-4 h-4 fill-white" />}>
                เริ่มฝึกสัมภาษณ์หลักสูตรนี้
              </Button>
            </Link>
            <div className="text-xs text-[#9CA3AF] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>คลังคำถามผ่านการตรวจสอบแล้ว</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Panel */}
        <div className="bg-[#F5F6F8] rounded-2xl p-6 border border-[#E5E7EB] space-y-5">
          <h2 className="text-sm font-bold text-[#1F2937] uppercase tracking-wider flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#F26A21]" />
            สถิติคลังคำถามที่พร้อมใช้งานจริง
          </h2>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-white p-3.5 rounded-xl border border-gray-200">
              <span className="text-2xl font-black text-[#F26A21]">{questions.length}</span>
              <p className="text-xs text-[#4B5563] font-medium mt-0.5">คำถามทั้งหมด</p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-gray-200">
              <span className="text-2xl font-black text-[#111827]">{Object.keys(categoryMap).length}</span>
              <p className="text-xs text-[#4B5563] font-medium mt-0.5">หมวดหมู่</p>
            </div>
          </div>

          {/* Difficulty breakdown */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-semibold text-[#4B5563] block">การกระจายตามระดับความยาก:</span>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-emerald-700 font-medium">ระดับง่าย</span>
                <span className="font-bold text-[#111827]">{easyCount} ข้อ</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${(easyCount / (questions.length || 1)) * 100}%` }} />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-amber-700 font-medium">ระดับปานกลาง</span>
                <span className="font-bold text-[#111827]">{mediumCount} ข้อ</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${(mediumCount / (questions.length || 1)) * 100}%` }} />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-rose-700 font-medium">ระดับท้าทาย</span>
                <span className="font-bold text-[#111827]">{hardCount} ข้อ</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${(hardCount / (questions.length || 1)) * 100}%` }} />
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 3. Category Breakdown & Preparation Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Categories list */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#F26A21]" />
            หมวดคำถามของหลักสูตรนี้
          </h2>
          <div className="divide-y divide-gray-100">
            {Object.entries(categoryMap).map(([categoryName, count]) => (
              <div key={categoryName} className="py-3 flex items-center justify-between text-sm">
                <span className="text-[#4B5563] font-medium">{categoryName}</span>
                <Badge variant="default" size="sm">{count} ข้อ</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Preparation tips */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[#F26A21]" />
            คำแนะนำเฉพาะสำหรับการเตรียมตัวสัมภาษณ์
          </h2>
          <p className="text-xs text-[#9CA3AF]">
            ข้อแนะนำทั่วไปที่คณาจารย์ประจำสาขามักให้ความสำคัญในวันสัมภาษณ์จริง
          </p>

          <ul className="space-y-3 pt-2">
            {program.suggestedPrepTips?.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-[#4B5563]">
                <CheckCircle2 className="w-5 h-5 text-[#F26A21] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* 4. Sample Questions Section with Hints Toggle */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111827]">คำถามตัวอย่างของหลักสูตรนี้</h2>
            <p className="text-xs sm:text-sm text-[#4B5563] mt-0.5">
              ตัวอย่าง 5 ข้อแรกจากคลังข้อสอบจริง พร้อมแนวทางคิดที่อาจารย์มองหา
            </p>
          </div>
          <Link href={`/practice?program=${program.slug}`}>
            <Button size="sm" variant="primary">
              สุ่มคำถามเต็มรูปแบบ
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {sampleQuestions.map((q, idx) => {
            const isExpanded = showAnswerIdx === idx;
            return (
              <div key={q.id} className="p-5 rounded-2xl border border-gray-200/90 bg-[#F5F6F8]/40 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#9CA3AF]">{q.id}</span>
                    <span className="text-xs font-medium text-[#F26A21]">• {q.categoryNameTh}</span>
                  </div>
                  <DifficultyBadge difficulty={q.difficulty} size="sm" />
                </div>

                <p className="text-base sm:text-lg font-bold text-[#1F2937] leading-snug">
                  {q.question}
                </p>

                {/* Hint toggle */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAnswerIdx(isExpanded ? null : idx)}
                    className="text-xs font-semibold text-[#F26A21] hover:text-[#D95614] inline-flex items-center gap-1.5 focus:outline-none"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>{isExpanded ? 'ซ่อนแนวทางคิด' : 'ดูแนวทางคิดและสิ่งที่กรรมการมองหา'}</span>
                  </button>

                  {isExpanded && (
                    <div className="mt-3 p-4 bg-white rounded-xl border border-orange-200/80 text-xs sm:text-sm text-[#4B5563] space-y-2 animate-fade-in">
                      <p>
                        <strong className="text-[#D95614]">แนวทางคิด: </strong>
                        {q.hint}
                      </p>
                      {q.followUpQuestions && q.followUpQuestions.length > 0 && (
                        <div className="pt-2 border-t border-gray-100 text-xs text-gray-500">
                          <strong>คำถามต่อยอดที่เป็นไปได้: </strong>
                          {q.followUpQuestions.join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
