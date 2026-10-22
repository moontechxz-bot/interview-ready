'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  BookOpen, 
  GraduationCap, 
  X,
  Compass
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getStoredPrograms } from '@/lib/storage';
import { Program } from '@/types';

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    setPrograms(getStoredPrograms());
  }, []);

  const categories = [
    { id: 'all', label: 'ทุกหลักสูตร' },
    { id: 'engineering', label: 'วิศวกรรมและเทคโนโลยี' },
    { id: 'business', label: 'ธุรกิจและการจัดการ' },
    { id: 'arts', label: 'ดนตรีและศิลปะ' },
    { id: 'education', label: 'ครุศาสตร์และการศึกษา' },
    { id: 'health', label: 'พยาบาลและสาธารณสุข' },
    { id: 'communication', label: 'นิเทศศาสตร์และสื่อสารมวลชน' },
  ];

  const filteredPrograms = programs.filter((p) => {
    // 1. Category filter
    if (selectedCategory !== 'all' && p.category !== selectedCategory) {
      return false;
    }
    // 2. Search query filter across name, degree, faculty, and major
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDegree = p.degreeName.toLowerCase().includes(q) || p.degreeShort.toLowerCase().includes(q);
      const matchFaculty = p.facultyName.toLowerCase().includes(q);
      const matchMajor = p.majorName ? p.majorName.toLowerCase().includes(q) : false;
      return matchName || matchDegree || matchFaculty || matchMajor;
    }
    return true;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      
      {/* Header Banner */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF1E8] text-xs font-semibold text-[#D95614]">
          <Compass className="w-4 h-4 text-[#F26A21]" />
          <span>หลักสูตรระดับปริญญาตรีที่เปิดให้ฝึกสัมภาษณ์</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827]">
          ค้นหาหลักสูตรและคลังคำถาม
        </h1>
        <p className="text-base text-[#4B5563] max-w-2xl leading-relaxed">
          เลือกหลักสูตรที่คุณเตรียมตัวสอบ เพื่อดูรายละเอียดแนวคำถาม สถิติความยาก 
          และทดลองสุ่มคำถามเสมือนจริงในห้องสัมภาษณ์
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
        
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาจากชื่อหลักสูตร, ปริญญา, สาขาวิชา หรือคณะ..."
            className="w-full pl-12 pr-10 py-3 rounded-xl border border-gray-200 text-sm sm:text-base focus:border-[#F26A21] focus:ring-2 focus:ring-[#F26A21]/20 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="ล้างคำค้นหา"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 pt-1">
          <span className="text-xs font-semibold text-[#9CA3AF] shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            กลุ่มสาขา:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 ${
                  isSelected
                    ? 'bg-[#F26A21] text-white shadow-sm font-semibold'
                    : 'bg-[#F5F6F8] text-[#4B5563] hover:bg-gray-200/70'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

      </div>

      {/* Results Count & Program Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs sm:text-sm text-[#4B5563]">
          <span>
            แสดงผล <strong>{filteredPrograms.length}</strong> หลักสูตร จากทั้งหมด {programs.length} หลักสูตร
          </span>
          {(searchQuery || selectedCategory !== 'all') && (
            <button
              onClick={clearFilters}
              className="text-[#F26A21] hover:underline font-semibold"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          )}
        </div>

        {filteredPrograms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program) => (
              <Card key={program.id} hoverEffect className="flex flex-col overflow-hidden group">
                
                {/* Image */}
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
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

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#F26A21]">
                      <GraduationCap className="w-4 h-4" />
                      <span>{program.degreeName} ({program.degreeShort})</span>
                    </div>

                    <h2 className="text-xl font-bold text-[#1F2937] group-hover:text-[#F26A21] transition-colors mt-1">
                      {program.name}
                    </h2>

                    {program.majorName && (
                      <p className="text-xs font-medium text-[#4B5563] mt-0.5">
                        {program.majorName}
                      </p>
                    )}

                    <p className="text-xs text-[#9CA3AF] mt-0.5 font-medium">
                      {program.facultyName}
                    </p>

                    <p className="text-sm text-[#4B5563] line-clamp-3 mt-3 leading-relaxed">
                      {program.description}
                    </p>
                  </div>

                  {/* Footer Meta */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-[#4B5563] font-medium">
                      <BookOpen className="w-4 h-4 text-[#F26A21]" />
                      <span>{program.questionCount} ข้อคำถาม</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/programs/${program.slug}`}>
                        <Button size="sm" variant="outline">
                          ดูรายละเอียด
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
        ) : (
          /* Empty State as per Spec */
          <div className="text-center py-16 px-4 bg-[#F5F6F8] rounded-3xl border border-dashed border-gray-300 space-y-4 max-w-xl mx-auto">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto text-[#9CA3AF] shadow-sm">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#1F2937]">ไม่พบหลักสูตรที่ตรงกับเงื่อนไขการค้นหา</h3>
            <p className="text-sm text-[#4B5563] leading-relaxed">
              ลองตรวจสอบการสะกดคำ หรือเปลี่ยนตัวกรองกลุ่มสาขาวิชาเพื่อดูหลักสูตรอื่นๆ
            </p>
            <div>
              <Button onClick={clearFilters} variant="primary" size="md">
                ล้างการค้นหาและดูทุกหลักสูตร
              </Button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
