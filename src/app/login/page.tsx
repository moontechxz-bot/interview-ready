'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  Lock, 
  Mail, 
  Info, 
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function LoginPage() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Honest status informing the user about authentication setup as per Spec 6.9
    setStatusMessage(
      'ระบบเปิดให้ฝึกสัมภาษณ์แบบ Guest ได้ทันทีโดยไม่ต้องเข้าสู่ระบบ หากต้องการเชื่อมต่อระบบสมาชิกเต็มรูปแบบ กรุณากำหนดค่า SUPABASE_URL และ SUPABASE_ANON_KEY ในไฟล์ .env'
    );
  };

  return (
    <div className="max-w-md mx-auto px-4 py-14 sm:py-20 space-y-6">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#F26A21] text-white flex items-center justify-center mx-auto shadow-md shadow-[#F26A21]/20">
          <GraduationCap className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#111827]">
          {isRegisterMode ? 'สมัครสมาชิกผู้ใช้งาน' : 'เข้าสู่ระบบ INTERVIEW READY'}
        </h1>
        <p className="text-xs text-[#9CA3AF]">ติดไปด้วยกัน by อาตี๋</p>
      </div>

      {/* Auth Card */}
      <Card className="p-6 sm:p-8 space-y-5">
        
        {statusMessage && (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl text-xs text-[#D95614] space-y-1 animate-fade-in">
            <div className="flex items-center gap-1.5 font-bold">
              <Info className="w-4 h-4 shrink-0" />
              <span>การเชื่อมต่อระบบสมาชิก</span>
            </div>
            <p className="leading-relaxed">{statusMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1F2937] block">อีเมล (Email)</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#F26A21] focus:ring-2 focus:ring-[#F26A21]/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1F2937] block">รหัสผ่าน (Password)</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#F26A21] focus:ring-2 focus:ring-[#F26A21]/20 outline-none transition-all"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" size="md" className="w-full mt-2">
            {isRegisterMode ? 'สร้างบัญชีผู้ใช้' : 'เข้าสู่ระบบ'}
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setStatusMessage(null);
            }}
            className="text-xs text-[#F26A21] hover:underline font-semibold"
          >
            {isRegisterMode ? 'มีบัญชีอยู่แล้ว? เข้าสู่ระบบ' : 'ยังไม่มีบัญชี? สมัครสมาชิก'}
          </button>
        </div>

      </Card>

      {/* Guest Mode Direct Access */}
      <div className="text-center space-y-2">
        <p className="text-xs text-[#9CA3AF]">
          ต้องการเริ่มฝึกสัมภาษณ์ทันทีโดยไม่เข้าสู่ระบบ?
        </p>
        <Link href="/practice">
          <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            เริ่มฝึกในโหมดทดลอง (Guest Mode)
          </Button>
        </Link>
      </div>

    </div>
  );
}
