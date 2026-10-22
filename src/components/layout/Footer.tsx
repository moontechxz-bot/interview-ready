import React from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  ShieldAlert, 
  Mail, 
  ExternalLink, 
  BookOpen, 
  CheckCircle2
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#E5E7EB] pt-14 pb-10 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#E5E7EB]">
          
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F26A21] flex items-center justify-center text-white font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-xl text-[#111827]">
                  INTERVIEW <span className="text-[#F26A21]">READY</span>
                </span>
                <p className="text-xs text-[#9CA3AF]">ติดไปด้วยกัน by อาตี๋</p>
              </div>
            </div>
            <p className="text-[#4B5563] text-sm leading-relaxed max-w-lg">
              แพลตฟอร์มจำลองการฝึกตอบคำถามสัมภาษณ์เข้ามหาวิทยาลัย 
              ออกแบบขึ้นเพื่อให้นักเรียนระดับมัธยมปลายได้ฝึกคิด เรียบเรียงคำตอบ 
              และจับเวลาเสมือนจริงตามหมวดหมู่และหลักสูตรที่สนใจ
            </p>

            {/* Crucial Disclaimer as per Spec */}
            <div className="bg-[#F5F6F8] border border-[#E5E7EB] rounded-xl p-3.5 flex items-start gap-3 text-xs text-[#4B5563]">
              <ShieldAlert className="w-4 h-4 text-[#F26A21] shrink-0 mt-0.5" />
              <p>
                <strong>ข้อชี้แจงสำคัญ:</strong> เว็บไซต์นี้เป็นเครื่องมือเพื่อการศึกษาและการฝึกทักษะการสัมภาษณ์ 
                ไม่ใช่ระบบรับสมัครนักศึกษาทางการของมหาวิทยาลัยใด และคำถามตัวอย่างไม่ใช่ข้อสอบจริงที่มีการรับประกันผลการคัดเลือก
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#1F2937] text-base">เมนูหลัก</h4>
            <ul className="space-y-2 text-[#4B5563]">
              <li>
                <Link href="/programs" className="hover:text-[#F26A21] transition-colors flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#9CA3AF]" />
                  <span>หลักสูตรทั้งหมด 9 สาขา</span>
                </Link>
              </li>
              <li>
                <Link href="/practice" className="hover:text-[#F26A21] transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#9CA3AF]" />
                  <span>ระบบสุ่มคำถามจำลอง</span>
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-[#F26A21] transition-colors">
                  ประวัติการฝึกซ้อม
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#F26A21] transition-colors">
                  คำถามที่พบบ่อย (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#F26A21] transition-colors">
                  เกี่ยวกับเราและแนวคิด
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Admin */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#1F2937] text-base">การติดต่อและการสนับสนุน</h4>
            <ul className="space-y-2 text-[#4B5563]">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#9CA3AF]" />
                <span>contact@interviewready.dev</span>
              </li>
              <li>
                <Link href="/admin" className="text-xs text-[#9CA3AF] hover:text-[#F26A21] inline-flex items-center gap-1 mt-2">
                  <span>แดชบอร์ดผู้ดูแลระบบ (Admin)</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>

            <div className="pt-3">
              <span className="inline-block text-xs font-semibold px-2.5 py-1 bg-[#FFF1E8] text-[#D95614] rounded-lg">
                ระบบพร้อมใช้งานจริง • 250 ข้อคำถาม
              </span>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#9CA3AF] gap-3">
          <p>© {new Date().getFullYear()} ติดไปด้วยกัน by อาตี๋ (INTERVIEW READY). สงวนลิขสิทธิ์ทุกประการ.</p>
          <p className="flex items-center gap-1">
            พัฒนาด้วย Next.js & Tailwind CSS เพื่อการศึกษาของนักเรียนไทย
          </p>
        </div>

      </div>
    </footer>
  );
};
