'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  BookOpen, 
  HelpCircle, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Upload, 
  FileJson, 
  CheckCircle2, 
  BarChart2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge, DifficultyBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { 
  getStoredPrograms, 
  saveStoredPrograms, 
  getStoredQuestions, 
  saveStoredQuestions, 
  getAdminStats 
} from '@/lib/storage';
import { Program, Question, QuestionStatus, DifficultyLevel, QuestionCategory, AdminStats } from '@/types';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'programs' | 'questions' | 'import'>('overview');
  
  // Data states
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Filter & Search states
  const [questionSearch, setQuestionSearch] = useState<string>('');
  const [filterProgramSlug, setFilterProgramSlug] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modals state
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState<boolean>(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);

  // Question Form State
  const [qFormProgramSlug, setQFormProgramSlug] = useState<string>('mechanical-engineering');
  const [qFormCategory, setQFormCategory] = useState<QuestionCategory>('technical');
  const [qFormCategoryTh, setQFormCategoryTh] = useState<string>('ความรู้เฉพาะสาขา');
  const [qFormDifficulty, setQFormDifficulty] = useState<DifficultyLevel>('medium');
  const [qFormText, setQFormText] = useState<string>('');
  const [qFormHint, setQFormHint] = useState<string>('');
  const [qFormFollowUp, setQFormFollowUp] = useState<string>('');
  const [qFormStatus, setQFormStatus] = useState<QuestionStatus>('published');

  // Import State
  const [importJsonText, setImportJsonText] = useState<string>('');
  const [importValidationResult, setImportValidationResult] = useState<{
    validItems: Question[];
    invalidErrors: string[];
  } | null>(null);

  // Load Data
  const refreshData = () => {
    setPrograms(getStoredPrograms());
    setQuestions(getStoredQuestions());
    setStats(getAdminStats());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Filtered Questions List
  const filteredQuestions = questions.filter((q) => {
    if (filterProgramSlug !== 'all' && q.programSlug !== filterProgramSlug) return false;
    if (filterDifficulty !== 'all' && q.difficulty !== filterDifficulty) return false;
    if (filterStatus !== 'all' && q.status !== filterStatus) return false;
    if (questionSearch.trim() !== '') {
      const query = questionSearch.toLowerCase();
      return (
        q.question.toLowerCase().includes(query) ||
        q.id.toLowerCase().includes(query) ||
        q.hint.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Open Create Question Modal
  const openCreateQuestionModal = () => {
    setEditingQuestion(null);
    setQFormProgramSlug('mechanical-engineering');
    setQFormCategory('technical');
    setQFormCategoryTh('ความรู้เฉพาะสาขา');
    setQFormDifficulty('medium');
    setQFormText('');
    setQFormHint('');
    setQFormFollowUp('');
    setQFormStatus('published');
    setIsQuestionModalOpen(true);
  };

  // Open Edit Question Modal
  const openEditQuestionModal = (q: Question) => {
    setEditingQuestion(q);
    setQFormProgramSlug(q.programSlug);
    setQFormCategory(q.category);
    setQFormCategoryTh(q.categoryNameTh);
    setQFormDifficulty(q.difficulty);
    setQFormText(q.question);
    setQFormHint(q.hint);
    setQFormFollowUp(q.followUpQuestions?.join(', ') || '');
    setQFormStatus(q.status);
    setIsQuestionModalOpen(true);
  };

  // Handle Save Question
  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qFormText.trim()) return;

    const followUps = qFormFollowUp
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    let updatedList: Question[];

    if (editingQuestion) {
      // Edit
      updatedList = questions.map(q => {
        if (q.id === editingQuestion.id) {
          return {
            ...q,
            programSlug: qFormProgramSlug,
            category: qFormCategory,
            categoryNameTh: qFormCategoryTh,
            difficulty: qFormDifficulty,
            question: qFormText.trim(),
            hint: qFormHint.trim(),
            followUpQuestions: followUps,
            status: qFormStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return q;
      });
    } else {
      // Create new
      const newId = `CUSTOM-${Date.now().toString().slice(-4)}`;
      const newQ: Question = {
        id: newId,
        programSlug: qFormProgramSlug,
        category: qFormCategory,
        categoryNameTh: qFormCategoryTh,
        difficulty: qFormDifficulty,
        question: qFormText.trim(),
        hint: qFormHint.trim(),
        followUpQuestions: followUps,
        status: qFormStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      updatedList = [newQ, ...questions];
    }

    saveStoredQuestions(updatedList);
    refreshData();
    setIsQuestionModalOpen(false);
  };

  // Delete Question
  const handleDeleteQuestion = () => {
    if (!questionToDelete) return;
    const updated = questions.filter(q => q.id !== questionToDelete.id);
    saveStoredQuestions(updated);
    refreshData();
    setQuestionToDelete(null);
  };

  // Toggle Program Status (published / draft)
  const toggleProgramStatus = (progId: string) => {
    const updated = programs.map(p => {
      if (p.id === progId) {
        return {
          ...p,
          status: (p.status === 'published' ? 'draft' : 'published') as 'published' | 'draft',
        };
      }
      return p;
    });
    saveStoredPrograms(updated);
    refreshData();
  };

  // Validate JSON or CSV Import Text
  const handleValidateImport = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      const valid: Question[] = [];
      const errors: string[] = [];

      items.forEach((item, index) => {
        if (!item.question || typeof item.question !== 'string') {
          errors.push(`แถวที่ ${index + 1}: ขาดข้อความคำถาม (question)`);
          return;
        }
        if (!item.programSlug) {
          errors.push(`แถวที่ ${index + 1}: ขาดรหัสหลักสูตร (programSlug)`);
          return;
        }

        valid.push({
          id: item.id || `IMP-${Date.now().toString().slice(-4)}-${index + 1}`,
          programSlug: item.programSlug,
          category: item.category || 'technical',
          categoryNameTh: item.categoryNameTh || 'ความรู้เฉพาะสาขา',
          difficulty: item.difficulty || 'medium',
          question: item.question,
          hint: item.hint || 'ไม่มีคำใบ้',
          followUpQuestions: Array.isArray(item.followUpQuestions) ? item.followUpQuestions : [],
          status: item.status || 'published',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      });

      setImportValidationResult({ validItems: valid, invalidErrors: errors });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setImportValidationResult({
        validItems: [],
        invalidErrors: [`รูปแบบ JSON ไม่ถูกต้อง: ${msg}`],
      });
    }
  };

  // Execute Batch Import
  const handleExecuteImport = () => {
    if (!importValidationResult || importValidationResult.validItems.length === 0) return;
    const combined = [...importValidationResult.validItems, ...questions];
    saveStoredQuestions(combined);
    refreshData();
    setImportJsonText('');
    setImportValidationResult(null);
    setActiveTab('questions');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-900 text-white text-xs font-semibold mb-1.5">
            <ShieldCheck className="w-4 h-4 text-[#F26A21]" />
            <span>Admin Control Panel (ระบบจัดการข้อมูล)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
            แดชบอร์ดจัดการคลังคำถามและหลักสูตร
          </h1>
          <p className="text-xs sm:text-sm text-[#4B5563] mt-0.5">
            เพิ่ม แก้ไข ลบ และนำเข้าข้อมูลโดยไม่ต้องแตะโค้ดในระบบ
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="outline" size="sm">
              ไปหน้าเว็บไซต์
            </Button>
          </Link>
          <Button variant="primary" size="sm" onClick={openCreateQuestionModal} leftIcon={<Plus className="w-4 h-4" />}>
            เพิ่มคำถามใหม่
          </Button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-1">
        {[
          { id: 'overview' as const, label: 'ภาพรวมระบบ', icon: BarChart2 },
          { id: 'questions' as const, label: `คลังคำถาม (${questions.length})`, icon: HelpCircle },
          { id: 'programs' as const, label: `หลักสูตร (${programs.length})`, icon: BookOpen },
          { id: 'import' as const, label: 'นำเข้าข้อมูล JSON / CSV', icon: Upload },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-all border-b-2 shrink-0 ${
                isActive
                  ? 'border-[#F26A21] text-[#F26A21] bg-[#FFF1E8]/20'
                  : 'border-transparent text-[#4B5563] hover:text-[#111827]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* 1. OVERVIEW TAB */}
      {/* ============================================================== */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-8 animate-fade-in">
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5">
              <span className="text-xs text-[#9CA3AF] font-medium block">หลักสูตรทั้งหมด</span>
              <span className="text-3xl font-black text-[#111827] mt-1 block">{stats.totalPrograms}</span>
              <span className="text-xs text-emerald-600 font-semibold mt-1 block">
                เผยแพร่อยู่: {stats.publishedPrograms} หลักสูตร
              </span>
            </Card>

            <Card className="p-5">
              <span className="text-xs text-[#9CA3AF] font-medium block">คำถามทั้งหมดในระบบ</span>
              <span className="text-3xl font-black text-[#F26A21] mt-1 block">{stats.totalQuestions}</span>
              <span className="text-xs text-emerald-600 font-semibold mt-1 block">
                เผยแพร่แล้ว: {stats.publishedQuestions} ข้อ
              </span>
            </Card>

            <Card className="p-5">
              <span className="text-xs text-[#9CA3AF] font-medium block">คำถามฉบับร่าง (Draft)</span>
              <span className="text-3xl font-black text-amber-600 mt-1 block">{stats.draftQuestions}</span>
              <span className="text-xs text-gray-400 font-medium mt-1 block">รอตรวจสอบ</span>
            </Card>

            <Card className="p-5">
              <span className="text-xs text-[#9CA3AF] font-medium block">รอบการฝึกสะสม</span>
              <span className="text-3xl font-black text-blue-600 mt-1 block">{stats.totalPracticeSessions}</span>
              <span className="text-xs text-gray-400 font-medium mt-1 block">ในเครื่องนี้</span>
            </Card>
          </div>

          {/* Quick Access List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <h3 className="font-bold text-base text-[#1F2937] flex items-center justify-between">
                <span>จำนวนคำถามแยกตามหลักสูตร</span>
                <Link href="/programs" className="text-xs text-[#F26A21] hover:underline">ดูหน้าหลักสูตร</Link>
              </h3>
              <div className="divide-y divide-gray-100">
                {programs.map(p => {
                  const qCount = questions.filter(q => q.programSlug === p.slug && q.status === 'published').length;
                  return (
                    <div key={p.id} className="py-2.5 flex items-center justify-between text-sm">
                      <span className="font-medium text-[#1F2937]">{p.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="primary" size="sm">{qCount} ข้อ</Badge>
                        <span className={`text-[11px] px-2 py-0.5 rounded ${p.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                          {p.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="font-bold text-base text-[#1F2937]">การจัดการและเครื่องมือ</h3>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('import')}
                  className="w-full p-4 rounded-xl border border-gray-200 hover:border-[#F26A21] hover:bg-orange-50/20 text-left transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <FileJson className="w-5 h-5 text-[#F26A21]" />
                    <div>
                      <h4 className="font-bold text-sm text-[#1F2937]">นำเข้าคำถาม (Bulk Import)</h4>
                      <p className="text-xs text-[#9CA3AF]">เพิ่มชุดคำถามใหม่ทีละหลายสิบข้อผ่าน JSON หรือ CSV</p>
                    </div>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                </button>

                <button
                  type="button"
                  onClick={openCreateQuestionModal}
                  className="w-full p-4 rounded-xl border border-gray-200 hover:border-[#F26A21] hover:bg-orange-50/20 text-left transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Plus className="w-5 h-5 text-[#F26A21]" />
                    <div>
                      <h4 className="font-bold text-sm text-[#1F2937]">สร้างคำถามใหม่เดี่ยวๆ</h4>
                      <p className="text-xs text-[#9CA3AF]">กำหนดหลักสูตร หมวดหมู่ ความยาก และเฉลยแนวคิด</p>
                    </div>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </Card>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* 2. QUESTIONS MANAGEMENT TAB */}
      {/* ============================================================== */}
      {activeTab === 'questions' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={questionSearch}
                onChange={(e) => setQuestionSearch(e.target.value)}
                placeholder="ค้นหาข้อความคำถาม รหัสคำถาม หรือคำใบ้..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:border-[#F26A21] outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500 font-semibold">หลักสูตร:</span>
                <select
                  value={filterProgramSlug}
                  onChange={(e) => setFilterProgramSlug(e.target.value)}
                  className="p-1.5 rounded-lg border border-gray-200 bg-white"
                >
                  <option value="all">ทุกหลักสูตร</option>
                  {programs.map(p => (
                    <option key={p.slug} value={p.slug}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-gray-500 font-semibold">ความยาก:</span>
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="p-1.5 rounded-lg border border-gray-200 bg-white"
                >
                  <option value="all">ทุกระดับ</option>
                  <option value="easy">ง่าย</option>
                  <option value="medium">ปานกลาง</option>
                  <option value="hard">ท้าทาย</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-gray-500 font-semibold">สถานะ:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="p-1.5 rounded-lg border border-gray-200 bg-white"
                >
                  <option value="all">ทุกสถานะ</option>
                  <option value="published">เผยแพร่แล้ว (Published)</option>
                  <option value="draft">ฉบับร่าง (Draft)</option>
                  <option value="archived">เก็บถาวร (Archived)</option>
                </select>
              </div>

              <span className="ml-auto text-gray-400">
                พบ {filteredQuestions.length} ข้อ
              </span>
            </div>
          </div>

          {/* Questions Table */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F5F6F8] text-xs font-bold text-[#1F2937] uppercase border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3">รหัส</th>
                    <th className="px-4 py-3">หลักสูตร</th>
                    <th className="px-4 py-3">คำถาม</th>
                    <th className="px-4 py-3">หมวด</th>
                    <th className="px-4 py-3">ความยาก</th>
                    <th className="px-4 py-3">สถานะ</th>
                    <th className="px-4 py-3 text-right">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredQuestions.map((q) => (
                    <tr key={q.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-bold text-gray-500 whitespace-nowrap">
                        {q.id}
                      </td>
                      <td className="px-4 py-3 text-xs font-medium text-[#1F2937] whitespace-nowrap">
                        {programs.find(p => p.slug === q.programSlug)?.name || q.programSlug}
                      </td>
                      <td className="px-4 py-3 font-medium text-[#111827] max-w-md">
                        <p className="line-clamp-2">{q.question}</p>
                        <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">คำใบ้: {q.hint}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                        {q.categoryNameTh}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <DifficultyBadge difficulty={q.difficulty} size="sm" />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          q.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : q.status === 'draft'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}>
                          {q.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditQuestionModal(q)}
                            className="p-1.5 text-gray-500 hover:text-[#F26A21] hover:bg-orange-50 rounded-lg transition-colors"
                            title="แก้ไข"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setQuestionToDelete(q)}
                            className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="ลบ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredQuestions.length === 0 && (
              <div className="text-center py-12 text-sm text-gray-400">
                ไม่พบคำถามที่ตรงกับตัวกรอง
              </div>
            )}
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* 3. PROGRAMS MANAGEMENT TAB */}
      {/* ============================================================== */}
      {activeTab === 'programs' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((p) => {
              const qCount = questions.filter(q => q.programSlug === p.slug && q.status === 'published').length;
              return (
                <Card key={p.id} className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="primary" size="sm">{p.categoryLabel}</Badge>
                    <button
                      type="button"
                      onClick={() => toggleProgramStatus(p.id)}
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-colors ${
                        p.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-amber-100 hover:text-amber-800'
                          : 'bg-gray-100 text-gray-600 hover:bg-emerald-100 hover:text-emerald-800'
                      }`}
                    >
                      สถานะ: {p.status === 'published' ? 'เผยแพร่อยู่' : 'ปิดการแสดง'}
                    </button>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-[#1F2937]">{p.name}</h3>
                    <p className="text-xs text-[#F26A21] font-semibold">{p.degreeName} ({p.degreeShort})</p>
                    <p className="text-xs text-gray-500 mt-0.5">{p.facultyName}</p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                    <span>คำถามที่เผยแพร่จริง: <strong>{qCount} ข้อ</strong></span>
                    <Link href={`/programs/${p.slug}`} className="text-[#F26A21] hover:underline font-semibold">
                      ดูหน้าเว็บ
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. JSON / CSV BULK IMPORT TAB (Spec Section 9) */}
      {/* ============================================================== */}
      {activeTab === 'import' && (
        <div className="space-y-6 max-w-4xl animate-fade-in">
          
          <div className="p-5 bg-white rounded-2xl border border-gray-200 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#1F2937]">นำเข้าคำถามจาก JSON (Bulk Import)</h2>
              <p className="text-xs text-[#4B5563] mt-1">
                วางโครงสร้าง JSON Array ของคำถามที่ต้องการเพิ่มเข้าระบบ ระบบจะตรวจสอบความถูกต้องของฟิลด์ก่อนบันทึก
              </p>
            </div>

            <textarea
              rows={8}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder={`[
  {
    "id": "CUSTOM-001",
    "programSlug": "mechanical-engineering",
    "category": "technical",
    "categoryNameTh": "ความรู้เฉพาะสาขา",
    "difficulty": "medium",
    "question": "ข้อความคำถามจำลอง...",
    "hint": "แนวทางคิดสำหรับข้อนี้...",
    "followUpQuestions": ["คำถามต่อยอด 1"],
    "status": "published"
  }
]`}
              className="w-full p-3 font-mono text-xs rounded-xl border border-gray-200 focus:border-[#F26A21] outline-none"
            />

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setImportJsonText(JSON.stringify([
                    {
                      id: "SAMPLE-01",
                      programSlug: "accounting",
                      category: "technical",
                      categoryNameTh: "ความรู้เฉพาะสาขา",
                      difficulty: "easy",
                      question: "ทำไมงบดุลต้องมียอดดุลเท่ากันเสมอ?",
                      hint: "อธิบายตามสมการบัญชี สินทรัพย์ = หนี้สิน + ทุน",
                      followUpQuestions: ["หากเดบิตไม่เท่ากับเครดิตระบบจะแจ้งเตือนอย่างไร?"],
                      status: "published"
                    }
                  ], null, 2));
                }}
              >
                โหลดตัวอย่าง JSON
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={handleValidateImport}
                disabled={!importJsonText.trim()}
              >
                ตรวจสอบความถูกต้อง (Validate)
              </Button>
            </div>
          </div>

          {/* Validation Result Preview */}
          {importValidationResult && (
            <Card className="p-6 space-y-4 animate-fade-in">
              <h3 className="font-bold text-base text-[#1F2937] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>ผลการตรวจสอบข้อมูลนำเข้า</span>
              </h3>

              {importValidationResult.invalidErrors.length > 0 && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-1 text-xs text-rose-800">
                  <p className="font-bold">พบข้อผิดพลาด ({importValidationResult.invalidErrors.length} จุด):</p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {importValidationResult.invalidErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {importValidationResult.validItems.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs text-emerald-700 font-semibold">
                    ✓ พบข้อมูลที่ถูกต้องพร้อมนำเข้าจำนวน {importValidationResult.validItems.length} ข้อ
                  </p>
                  <div className="max-h-40 overflow-y-auto p-3 bg-gray-50 rounded-xl text-xs space-y-1">
                    {importValidationResult.validItems.map((item, idx) => (
                      <div key={idx} className="truncate">
                        <strong>[{item.programSlug}]</strong> {item.question}
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleExecuteImport}
                    className="w-full sm:w-auto"
                  >
                    ยืนยันนำเข้าข้อมูล {importValidationResult.validItems.length} ข้อ
                  </Button>
                </div>
              )}
            </Card>
          )}

        </div>
      )}

      {/* ============================================================== */}
      {/* Question Create / Edit Modal */}
      {/* ============================================================== */}
      <Modal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        title={editingQuestion ? 'แก้ไขคำถาม' : 'เพิ่มคำถามใหม่เข้าระบบ'}
        maxWidth="xl"
      >
        <form onSubmit={handleSaveQuestion} className="space-y-4 text-sm">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">หลักสูตร</label>
              <select
                value={qFormProgramSlug}
                onChange={(e) => setQFormProgramSlug(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 bg-white"
              >
                {programs.map(p => (
                  <option key={p.slug} value={p.slug}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">ระดับความยาก</label>
              <select
                value={qFormDifficulty}
                onChange={(e) => setQFormDifficulty(e.target.value as DifficultyLevel)}
                className="w-full p-2.5 rounded-xl border border-gray-200 bg-white"
              >
                <option value="easy">ง่าย</option>
                <option value="medium">ปานกลาง</option>
                <option value="hard">ท้าทาย</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">ชื่อหมวดหมู่ภาษาไทย</label>
              <input
                type="text"
                required
                value={qFormCategoryTh}
                onChange={(e) => setQFormCategoryTh(e.target.value)}
                placeholder="เช่น ความรู้เฉพาะสาขา, แรงจูงใจ"
                className="w-full p-2.5 rounded-xl border border-gray-200"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">สถานะ</label>
              <select
                value={qFormStatus}
                onChange={(e) => setQFormStatus(e.target.value as QuestionStatus)}
                className="w-full p-2.5 rounded-xl border border-gray-200 bg-white"
              >
                <option value="published">เผยแพร่จริง (Published)</option>
                <option value="draft">ฉบับร่าง (Draft)</option>
                <option value="archived">เก็บถาวร (Archived)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">ข้อความคำถาม</label>
            <textarea
              required
              rows={3}
              value={qFormText}
              onChange={(e) => setQFormText(e.target.value)}
              placeholder="พิมพ์ข้อความคำถามสัมภาษณ์..."
              className="w-full p-2.5 rounded-xl border border-gray-200"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">แนวทางคิด / สิ่งที่กรรมการมองหา (Hint)</label>
            <textarea
              rows={2}
              value={qFormHint}
              onChange={(e) => setQFormHint(e.target.value)}
              placeholder="อธิบายแนวทางการตอบ ประเด็นสำคัญที่ควรพูดถึง..."
              className="w-full p-2.5 rounded-xl border border-gray-200"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">คำถามต่อยอด (คั่นด้วยเครื่องหมายจุลภาค ,)</label>
            <input
              type="text"
              value={qFormFollowUp}
              onChange={(e) => setQFormFollowUp(e.target.value)}
              placeholder="เช่น หากเกิดปัญหา X คุณจะทำอย่างไร?, ทำไมถึงคิดเช่นนั้น?"
              className="w-full p-2.5 rounded-xl border border-gray-200"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsQuestionModalOpen(false)}>
              ยกเลิก
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingQuestion ? 'บันทึกการแก้ไข' : 'สร้างคำถาม'}
            </Button>
          </div>

        </form>
      </Modal>

      {/* Delete Question Confirmation Modal */}
      <Modal
        isOpen={Boolean(questionToDelete)}
        onClose={() => setQuestionToDelete(null)}
        title="ยืนยันการลบคำถาม?"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#4B5563]">
            คุณต้องการลบคำถาม <strong>&ldquo;{questionToDelete?.question}&rdquo;</strong> (รหัส {questionToDelete?.id}) หรือไม่?
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setQuestionToDelete(null)}>
              ยกเลิก
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteQuestion}>
              ยืนยันการลบ
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
