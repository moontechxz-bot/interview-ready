'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  History, 
  Trash2, 
  RotateCcw, 
  ExternalLink, 
  Calendar, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { getStoredSessions, deleteSession } from '@/lib/storage';
import { PracticeSession } from '@/types';

export default function HistoryPage() {
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  useEffect(() => {
    setSessions(getStoredSessions());
  }, []);

  const handleDelete = () => {
    if (!sessionToDelete) return;
    deleteSession(sessionToDelete);
    setSessions(getStoredSessions());
    setSessionToDelete(null);
  };

  const clearAllHistory = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('interview_ready_sessions_v1');
      setSessions([]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF1E8] text-xs font-semibold text-[#D95614] mb-2">
            <History className="w-3.5 h-3.5 text-[#F26A21]" />
            <span>ประวัติรอบการฝึกสัมภาษณ์</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
            ประวัติการฝึกซ้อมของคุณ
          </h1>
          <p className="text-sm text-[#4B5563] mt-0.5">
            เรียกดูคำตอบเดิมที่เคยพิมพ์ไว้ ทบทวนข้อผิดพลาด และฝึกซ้ำเพื่อความมั่นใจ
          </p>
        </div>

        {sessions.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllHistory}
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 self-start sm:self-auto"
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            ล้างประวัติทั้งหมด
          </Button>
        )}
      </div>

      {/* Guest Storage Transparency Notice as per Spec 6.8 */}
      <div className="p-4 bg-[#F5F6F8] rounded-2xl border border-gray-200/80 flex items-start gap-3 text-xs text-[#4B5563]">
        <ShieldAlert className="w-4 h-4 text-[#F26A21] shrink-0 mt-0.5" />
        <p>
          <strong>นโยบายความเป็นส่วนตัว:</strong> ข้อมูลประวัติการฝึกถูกจัดเก็บไว้เฉพาะในเบราว์เซอร์ของอุปกรณ์คุณแบบชั่วคราว (Local Storage) เพื่อให้คุณสามารถตรวจทานคำตอบได้โดยไม่ต้องเปิดเผยตัวตน ข้อมูลจะไม่ถูกส่งไปยังบุคคลภายนอกและสามารถลบได้ตลอดเวลา
        </p>
      </div>

      {/* Sessions List */}
      {sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.map((s) => {
            const dateStr = new Date(s.startedAt).toLocaleDateString('th-TH', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });
            const answersCount = Object.values(s.answers || {}).filter(a => a.answerText?.trim() !== '').length;

            return (
              <Card key={s.id} className="p-5 sm:p-6 transition-all hover:border-[#F26A21]/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Left info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="primary" size="sm">{s.programName}</Badge>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-[#9CA3AF] flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {dateStr}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-[#4B5563]">
                      <span>จำนวนคำถาม: <strong>{s.totalQuestions} ข้อ</strong></span>
                      <span className="text-gray-300">•</span>
                      <span className="text-emerald-700 font-medium">ตอบแล้ว: {answersCount} ข้อ</span>
                      <span className="text-gray-300">•</span>
                      <span>สถานะ: {s.status === 'completed' ? 'ฝึกครบถ้วน' : 'อยู่ระหว่างฝึก'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <Link href={`/practice/result?session=${s.id}`}>
                      <Button variant="outline" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                        ดูคำตอบเดิม
                      </Button>
                    </Link>

                    <Link href={`/practice?program=${s.programSlug}`}>
                      <Button variant="primary" size="sm" rightIcon={<RotateCcw className="w-3.5 h-3.5" />}>
                        ฝึกอีกครั้ง
                      </Button>
                    </Link>

                    <button
                      type="button"
                      onClick={() => setSessionToDelete(s.id)}
                      className="p-2 text-gray-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                      title="ลบรอบนี้"
                      aria-label="ลบรอบนี้"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-[#F5F6F8] rounded-3xl border border-dashed border-gray-300 space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto text-[#9CA3AF] shadow-sm">
            <History className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[#1F2937]">ยังไม่มีประวัติการฝึกซ้อม</h3>
          <p className="text-sm text-[#4B5563]">
            คุณยังไม่ได้เริ่มทำแบบฝึกสัมภาษณ์ใดๆ ลองเลือกหลักสูตรที่สนใจและเริ่มฝึกรอบแรกเลย!
          </p>
          <div>
            <Link href="/practice">
              <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                เริ่มฝึกสัมภาษณ์ทันที
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(sessionToDelete)}
        onClose={() => setSessionToDelete(null)}
        title="ยืนยันการลบประวัติรอบนี้?"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#4B5563]">
            เมื่อลบแล้ว ข้อมูลคำตอบที่คุณเคยพิมพ์ไว้ในรอบนี้จะไม่สามารถกู้คืนได้อีก
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setSessionToDelete(null)}>
              ยกเลิก
            </Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>
              ยืนยันการลบ
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
