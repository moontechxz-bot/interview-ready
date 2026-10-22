import React from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  Target, 
  Users, 
  ShieldAlert, 
  Mail, 
  BookOpen, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      
      {/* Header */}
      <div className="space-y-3 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF1E8] text-xs font-semibold text-[#D95614]">
          <GraduationCap className="w-4 h-4 text-[#F26A21]" />
          <span>เกี่ยวกับโครงการ INTERVIEW READY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827]">
          ติดไปด้วยกัน <span className="text-[#F26A21]">by อาตี๋</span>
        </h1>
        <p className="text-base text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
          แพลตฟอร์มการศึกษาที่สร้างขึ้นเพื่อช่วยให้นักเรียนไทยได้มีพื้นที่ฝึกคิด เรียบเรียงคำพูด 
          และก้าวเข้าสู่ห้องสอบสัมภาษณ์มหาวิทยาลัยด้วยความมั่นใจ
        </p>
      </div>

      {/* Critical Disclaimer Card as per Spec 6.10 */}
      <div className="bg-[#FFF1E8]/70 border-2 border-[#FED7AA] rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-[#D95614] font-bold text-base sm:text-lg">
          <ShieldAlert className="w-6 h-6 shrink-0" />
          <span>ข้อชี้แจงและขอบเขตข้อจำกัดของระบบ (Disclaimer)</span>
        </div>
        <p className="text-sm text-[#4B5563] leading-relaxed">
          เว็บไซต์ <strong>&ldquo;ติดไปด้วยกัน by อาตี๋ (INTERVIEW READY)&rdquo;</strong> เป็นเครื่องมือสื่อการเรียนรู้สำหรับการจำลองฝึกทักษะการตอบคำถาม 
          <strong>ไม่ใช่เว็บไซต์ทางการของมหาวิทยาลัยใด และไม่มีส่วนเกี่ยวข้องกับระบบรับสมัครนักศึกษาของสถาบันอุดมศึกษา</strong> 
          คำถามและแนวทางตอบเป็นเพียงแบบฝึกหัดจำลองตามโครงสร้างความรู้มาตรฐาน ไม่ใช่ข้อสอบจริงและไม่มีการรับประกันผลการคัดเลือก
        </p>
      </div>

      {/* Purpose & Target Audience */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <Card className="p-6 sm:p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF1E8] text-[#F26A21] flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[#1F2937]">วัตถุประสงค์ของเว็บไซต์</h2>
          <ul className="space-y-2.5 text-sm text-[#4B5563]">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#F26A21] shrink-0 mt-0.5" />
              <span>ช่วยให้นักเรียนได้ฝึกคิดและจัดระเบียบความคิดก่อนวันสอบจริง</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#F26A21] shrink-0 mt-0.5" />
              <span>ลดความประหม่าและความตื่นเต้นด้วยการฝึกจับเวลาเสมือนจริง</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#F26A21] shrink-0 mt-0.5" />
              <span>รวบรวมแนวคำถามเฉพาะทาง 5 หลักสูตรที่เป็นรูปธรรมและมีแนวทางคิด</span>
            </li>
          </ul>
        </Card>

        <Card className="p-6 sm:p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF1E8] text-[#F26A21] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[#1F2937]">กลุ่มเป้าหมายหลัก</h2>
          <ul className="space-y-2.5 text-sm text-[#4B5563]">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#F26A21] shrink-0 mt-0.5" />
              <span>นักเรียนระดับมัธยมศึกษาตอนปลาย (ม.4 - ม.6) ทั่วประเทศ</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#F26A21] shrink-0 mt-0.5" />
              <span>ผู้สมัครคัดเลือกเข้าศึกษาต่อระดับปริญญาตรี (ระบบ TCAS ทุกรอบ)</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#F26A21] shrink-0 mt-0.5" />
              <span>ครูแนะแนวและผู้ปกครองที่ต้องการนำแบบทดสอบไปฝึกซ้อมให้นักเรียน</span>
            </li>
          </ul>
        </Card>

      </div>

      {/* Sources of Data & Standards */}
      <Card className="p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1F2937]">แหล่งที่มาของคลังคำถามและแนวทางคำตอบ</h2>
            <p className="text-xs text-[#9CA3AF]">การจัดทำข้อมูลเชิงวิชาการ</p>
          </div>
        </div>

        <p className="text-sm text-[#4B5563] leading-relaxed">
          ชุดคำถามทั้งหมด 250 ข้อในระบบ ได้รับการเรียบเรียงขึ้นตามโครงสร้างเอกสารแนวคำถามสัมภาษณ์เข้าศึกษาต่อระดับอุดมศึกษา 
          โดยคณะกรรมการดำเนินงานการรับเข้าศึกษาและอาจารย์ประจำมหาวิทยาลัย ครอบคลุมทั้งสิ้น 5 สาขาวิชาหลัก ได้แก่ 
          วิศวกรรมเครื่องกล, ธุรกิจดิจิทัล, ดุริยางคศาสตรบัณฑิต, โลจิสติกส์และดิจิทัลซัพพลายเชน, และบัญชีบัณฑิต
        </p>
      </Card>

      {/* Contact Channel as per Spec */}
      <div className="bg-[#F5F6F8] rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="text-lg font-bold text-[#1F2937]">ช่องทางติดต่อผู้ดูแลระบบ</h2>
          <p className="text-sm text-[#4B5563]">หากมีข้อเสนอแนะเกี่ยวกับคลังคำถามหรือแจ้งปัญหาการใช้งานเว็บไซต์</p>
          <p className="text-xs text-[#9CA3AF] flex items-center justify-center sm:justify-start gap-1.5 pt-1">
            <Mail className="w-4 h-4 text-[#F26A21]" />
            <span>อีเมลติดต่อ: contact@interviewready.dev</span>
          </p>
        </div>

        <Link href="/practice">
          <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
            เริ่มทดลองฝึกสัมภาษณ์
          </Button>
        </Link>
      </div>

    </div>
  );
}
