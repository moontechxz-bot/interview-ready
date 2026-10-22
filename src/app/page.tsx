'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Sparkles, 
  Timer, 
  BookOpen, 
  ArrowRight, 
  Lightbulb,
  ChevronRight,
  BrainCircuit
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Accordion } from '@/components/ui/Accordion';
import { getStoredPrograms } from '@/lib/storage';
import { Program } from '@/types';

export default function HomePage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setPrograms(getStoredPrograms());
  }, []);

  const filteredPrograms = programs.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.degreeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.facultyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const faqItems = [
    {
      id: 'faq-1',
      question: 'เว็บไซต์นี้ใช้งานอย่างไร และเริ่มฝึกอย่างไร?',
      answer: 'คุณสามารถเริ่มต้นได้ทันทีโดยไม่ต้องลงทะเบียน เพียงเลือกหลักสูตรที่สนใจ กำหนดระดับความยาก และเลือกจำนวนข้อคำถาม จากนั้นระบบจะสุ่มคำถามขึ้นมาพร้อมตัวจับเวลาและช่องให้พิมพ์คำตอบจำลองสถานการณ์จริง'
    },
    {
      id: 'faq-2',
      question: 'ต้องสมัครสมาชิกเพื่อเริ่มฝึกคำถามหรือไม่?',
      answer: 'ไม่จำเป็นครับ ผู้ใช้ทุกคนสามารถทดลองฝึกทำสัมภาษณ์ได้ทันทีโดยไม่ต้องสมัครสมาชิก โดยระบบจะบันทึกประวัติการฝึกของท่านไว้บนเบราว์เซอร์เครื่องของท่านอย่างปลอดภัย'
    },
    {
      id: 'faq-3',
      question: 'คำถามสัมภาษณ์ในระบบนำมาจากแหล่งใด?',
      answer: 'ชุดคำถามมากกว่า 400 ข้อ ครอบคลุม 8 หลักสูตรยอดนิยม รวบรวมและเรียบเรียงตามโครงสร้างคู่มือแนวคำถามสัมภาษณ์ของคณะกรรมการรับเข้าศึกษาและคณาจารย์มหาวิทยาลัย ครอบคลุมทั้ง Passion แรงบันดาลใจ ความรู้เฉพาะทาง จริยธรรม และสถานการณ์จำลอง'
    },
    {
      id: 'faq-4',
      question: 'ระบบมีการบันทึกคำตอบและกู้คืนเมื่อรีเฟรชหรือไม่?',
      answer: 'มีระบบบันทึก Draft คำตอบระหว่างการฝึกอัตโนมัติ หากเกิดการรีเฟรชหน้าเว็บหรือย้อนกลับไปแก้ไขข้อก่อนหน้า คำตอบที่เคยพิมพ์ไว้จะไม่สูญหาย'
    },
    {
      id: 'faq-5',
      question: 'สามารถใช้งานผ่านโทรศัพท์มือถือหรือแท็บเล็ตได้หรือไม่?',
      answer: 'ได้ 100% ครับ เว็บไซต์ออกแบบตามหลัก Responsive Design ปรับขนาดตัวอักษร เมนู ช่องกรอกคำตอบ และตัวจับเวลาให้แตะใช้งานบนสมาร์ทโฟนได้อย่างสะดวกสบาย'
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF1E8]/40 via-white to-white pt-12 sm:pt-20 pb-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF1E8] border border-[#FED7AA] text-xs sm:text-sm font-semibold text-[#D95614] animate-fade-in">
            <Sparkles className="w-4 h-4 text-[#F26A21]" />
            <span>คลังคำถามเจาะลึก 8 หลักสูตรมหาวิทยาลัย 400 ข้อ พร้อมแนวทางตอบ</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#111827] tracking-tight max-w-4xl mx-auto leading-tight">
            เตรียมพร้อมก่อนวันสัมภาษณ์
          </h1>

          <p className="text-base sm:text-xl text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
            ฝึกคิด ฝึกตอบ และเพิ่มความมั่นใจก่อนก้าวเข้าสู่มหาวิทยาลัย 
            ด้วยคลังคำถามสัมภาษณ์ที่ออกแบบตามหลักสูตรที่คุณสนใจ
          </p>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
            <Link href="/practice" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" className="w-full sm:w-auto text-base shadow-md shadow-[#F26A21]/20" rightIcon={<ArrowRight className="w-5 h-5" />}>
                เริ่มฝึกสัมภาษณ์
              </Button>
            </Link>
            <Link href="/programs" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base bg-white">
                ค้นหาหลักสูตร
              </Button>
            </Link>
          </div>

          {/* Search Input Bar in Hero */}
          <div className="pt-8 max-w-xl mx-auto">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อหลักสูตร หรือคณะ เช่น เครื่องกล, บัญชี, ดนตรี..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-white/90 backdrop-blur shadow-sm text-sm sm:text-base focus:border-[#F26A21] focus:ring-2 focus:ring-[#F26A21]/20 outline-none transition-all"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 2. Featured 9 Programs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-[#F26A21]">CURRICULUM PROGRAMS</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827]">หลักสูตรแนะนำทั้ง 9 สาขาวิชา</h2>
            <p className="text-sm sm:text-base text-[#4B5563] mt-1">คัดสรรคลังคำถามตามเกณฑ์มาตรฐานการรับเข้าศึกษาของแต่ละสาขา</p>
          </div>
          <Link href="/programs">
            <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
              ดูรายละเอียดหลักสูตรทั้งหมด
            </Button>
          </Link>
        </div>

        {/* Program Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <Card key={program.id} hoverEffect className="flex flex-col overflow-hidden group">
              {/* Card Image */}
              <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                <img
                  src={program.imagePath}
                  alt={program.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3">
                  <Badge variant="primary" size="sm">
                    {program.categoryLabel}
                  </Badge>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-xs font-medium text-[#F26A21]">
                    {program.degreeName} ({program.degreeShort})
                  </span>
                  <h3 className="text-lg font-bold text-[#1F2937] group-hover:text-[#F26A21] transition-colors mt-0.5">
                    {program.name}
                  </h3>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">{program.facultyName}</p>
                  
                  <p className="text-sm text-[#4B5563] line-clamp-2 mt-3 leading-relaxed">
                    {program.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-[#4B5563] font-medium">
                    <BookOpen className="w-4 h-4 text-[#F26A21]" />
                    <span>{program.questionCount} คำถามพร้อมฝึก</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Link href={`/programs/${program.slug}`}>
                      <Button size="sm" variant="outline">
                        ดูข้อมูล
                      </Button>
                    </Link>
                    <Link href={`/practice?program=${program.slug}`}>
                      <Button size="sm" variant="primary">
                        เริ่มฝึก
                      </Button>
                    </Link>
                  </div>
                </div>

              </div>
            </Card>
          ))}
        </div>

        {filteredPrograms.length === 0 && (
          <div className="text-center py-12 bg-[#F5F6F8] rounded-2xl border border-dashed border-gray-300">
            <p className="text-base text-gray-600 font-medium">ไม่พบหลักสูตรที่ตรงกับคำค้นหา &ldquo;{searchQuery}&rdquo;</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 text-sm text-[#F26A21] hover:underline font-semibold"
            >
              ล้างคำค้นหาเพื่อดูทั้งหมด
            </button>
          </div>
        )}
      </section>

      {/* 3. How It Works Steps */}
      <section id="how-it-works" className="bg-[#F5F6F8] py-16 sm:py-20 border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold tracking-wider uppercase text-[#F26A21]">PRACTICE WORKFLOW</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827]">ขั้นตอนการฝึกสัมภาษณ์ง่ายๆ ใน 4 สเต็ป</h2>
            <p className="text-sm sm:text-base text-[#4B5563]">
              จำลองสถานการณ์จริงทีละขั้นตอน เพื่อเตรียมความพร้อมและปรับแก้จุดบกพร่องก่อนวันจริง
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-card space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-[#FFF1E8] text-[#D95614] font-bold text-lg flex items-center justify-center">
                1
              </div>
              <h3 className="font-bold text-lg text-[#1F2937]">เลือกหลักสูตรที่สนใจ</h3>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                เลือกสาขาวิชาที่คุณกำลังเตรียมตัวสอบสัมภาษณ์ เพื่อให้ได้ชุดคำถามที่ตรงกับสายวิชาชีพจริง
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-card space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-[#FFF1E8] text-[#D95614] font-bold text-lg flex items-center justify-center">
                2
              </div>
              <h3 className="font-bold text-lg text-[#1F2937]">ตั้งค่าตัวจับเวลา</h3>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                เลือกระดับความยาก จำนวนข้อ (5-20 ข้อ) และเวลาตอบต่อข้อ 30-120 วินาที เพื่อฝึกความกระชับ
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-card space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-[#FFF1E8] text-[#D95614] font-bold text-lg flex items-center justify-center">
                3
              </div>
              <h3 className="font-bold text-lg text-[#1F2937]">พิมพ์คำตอบและดูแนวคิด</h3>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                ฝึกพิมพ์เรียบเรียงคำตอบในช่องที่จัดไว้ พร้อมเปิดดู Hint แนวทางคิดและคำถามต่อยอดเพื่อความรอบด้าน
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-card space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-[#FFF1E8] text-[#D95614] font-bold text-lg flex items-center justify-center">
                4
              </div>
              <h3 className="font-bold text-lg text-[#1F2937]">สรุปผลและทบทวน</h3>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                ตรวจทานคำตอบทั้งหมด ประเมินเวลาที่ใช้จริง และดูคำถามที่ควรกลับมาฝึกซ้ำเพื่อความคล่องแคล่ว
              </p>
            </div>

          </div>

          <div className="text-center pt-2">
            <Link href="/practice">
              <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-5 h-5" />}>
                ทดลองสุ่มคำถามตอนนี้
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* 4. System Key Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-wider uppercase text-[#F26A21]">HIGHLIGHTS</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111827]">จุดเด่นของระบบ INTERVIEW READY</h2>
          <p className="text-sm sm:text-base text-[#4B5563]">
            ออกแบบมาเพื่อการฝึกฝนจริงโดยเฉพาะ ไม่ใช่แค่เว็บอ่านคำถามทั่วไป
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl border border-gray-200/80 bg-white hover:border-[#F26A21]/40 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FFF1E8] text-[#F26A21] flex items-center justify-center">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#1F2937]">คลังคำถามแยกตามหลักสูตร</h3>
            <p className="text-sm text-[#4B5563] leading-relaxed">
              ไม่สุ่มคำถามปะปนข้ามหลักสูตร ทุกข้อมาจากโครงสร้างคำถามสัมภาษณ์จริงของอาจารย์มหาวิทยาลัย ทั้งสายวิศวกรรม ธุรกิจ ดนตรี โลจิสติกส์ และบัญชี
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-gray-200/80 bg-white hover:border-[#F26A21]/40 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FFF1E8] text-[#F26A21] flex items-center justify-center">
              <Timer className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#1F2937]">ระบบจับเวลาและเตือนแบบ Real-time</h3>
            <p className="text-sm text-[#4B5563] leading-relaxed">
              ฝึกตอบภายใต้เวลาจำกัดจริง สามารถหยุดพักหรือเริ่มใหม่ได้ และเมื่อหมดเวลาคำตอบที่พิมพ์ไว้จะไม่หายไป ช่วยให้รู้จังหวะการพูดที่กระชับ
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-gray-200/80 bg-white hover:border-[#F26A21]/40 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FFF1E8] text-[#F26A21] flex items-center justify-center">
              <Lightbulb className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#1F2937]">แนวทางคิด & คำถามต่อยอด</h3>
            <p className="text-sm text-[#4B5563] leading-relaxed">
              มีปุ่มเปิดดู Hint เพื่อเป็นไกด์ไลน์ในการคิดคำตอบ พร้อมคำถามติดตาม (Follow-up Questions) ที่กรรมการมักจะถามซ้ำเมื่อเราตอบจบ
            </p>
          </div>
        </div>
      </section>

      {/* 5. Interview Strategy & STAR technique guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-gray-900 to-[#1F2937] text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-6">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold tracking-wider uppercase text-[#F26A21]">INTERVIEW TIPS</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              เทคนิคการตอบคำถามสัมภาษณ์ด้วยโครงสร้าง STAR
            </h2>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              เมื่อเจอกรรมการถามคำถามเชิงสถานการณ์หรือประสบการณ์ (เช่น เล่าโครงงานที่คุณเคยทำ หรือเหตุการณ์แก้ปัญหาเฉพาะหน้า) 
              ให้จัดเรียงคำตอบเป็น 4 ขั้นตอน:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/10 space-y-2">
              <span className="text-2xl font-black text-[#F26A21]">S</span>
              <h4 className="font-bold text-base text-white">Situation (สถานการณ์)</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                อธิบายบริบทสั้นๆ ว่าเหตุการณ์เกิดขึ้นที่ไหน ตอนกำลังทำอะไร และเจอปัญหาใด
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/10 space-y-2">
              <span className="text-2xl font-black text-[#F26A21]">T</span>
              <h4 className="font-bold text-base text-white">Task (เป้าหมาย/ภารกิจ)</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                ชี้แจงบทบาทหน้าที่และความรับผิดชอบของคุณในเหตุการณ์นั้นว่าต้องแก้ไขอะไร
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/10 space-y-2">
              <span className="text-2xl font-black text-[#F26A21]">A</span>
              <h4 className="font-bold text-base text-white">Action (การลงมือทำ)</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                เล่าขั้นตอนการแก้ปัญหาเชิงตรรกะของคุณ การใช้ทักษะวิชาการ และการประสานทีม
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/10 space-y-2">
              <span className="text-2xl font-black text-[#F26A21]">R</span>
              <h4 className="font-bold text-base text-white">Result (ผลลัพธ์ที่ได้)</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                สรุปความสำเร็จเป็นรูปธรรม และสิ่งที่ได้เรียนรู้จากการลงมือทำในครั้งนั้น
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold tracking-wider uppercase text-[#F26A21]">FREQUENTLY ASKED QUESTIONS</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111827]">คำถามที่พบบ่อย (FAQ)</h2>
          <p className="text-sm sm:text-base text-[#4B5563]">
            ข้อสงสัยเกี่ยวกับการใช้งานคลังคำถามและการฝึกซ้อม
          </p>
        </div>

        <Accordion items={faqItems} />

        <div className="text-center pt-4">
          <Link href="/faq" className="text-sm font-semibold text-[#F26A21] hover:underline">
            ดูคำถามที่พบบ่อยทั้งหมดเพิ่มเติม →
          </Link>
        </div>
      </section>

    </div>
  );
}
