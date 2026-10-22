'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  GraduationCap, 
  Compass, 
  Shuffle, 
  History, 
  HelpCircle, 
  Info,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'หน้าหลัก', href: '/', icon: GraduationCap },
    { name: 'ค้นหาหลักสูตร', href: '/programs', icon: Compass },
    { name: 'สุ่มคำถาม', href: '/practice', icon: Shuffle },
    { name: 'ประวัติการฝึก', href: '/history', icon: History },
    { name: 'คำถามที่พบบ่อย', href: '/faq', icon: HelpCircle },
    { name: 'เกี่ยวกับเรา', href: '/about', icon: Info },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo Brand */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-[#F26A21] rounded-lg p-1"
            aria-label="หน้าหลัก ติดไปด้วยกัน by อาตี๋ INTERVIEW READY"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F26A21] to-[#D95614] flex items-center justify-center text-white shadow-sm shadow-[#F26A21]/30 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#111827] flex items-center gap-1.5">
                INTERVIEW <span className="text-[#F26A21]">READY</span>
              </span>
              <span className="text-[11px] font-medium text-[#4B5563] -mt-1">
                ติดไปด้วยกัน <span className="text-[#F26A21] font-semibold">by อาตี๋</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="เมนูหลัก">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'text-[#F26A21] bg-[#FFF1E8] font-semibold'
                      : 'text-[#4B5563] hover:text-[#111827] hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link href="/admin">
              <button 
                type="button"
                className="text-xs text-[#9CA3AF] hover:text-[#4B5563] px-2.5 py-1.5 rounded-lg border border-transparent hover:border-gray-200 transition-colors flex items-center gap-1"
                title="จัดการคลังคำถาม"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </Link>
            <Link href="/practice">
              <Button size="md" variant="primary">
                เริ่มฝึกสัมภาษณ์
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link href="/practice" className="sm:hidden">
              <Button size="sm" variant="primary">
                เริ่มฝึก
              </Button>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#4B5563] hover:text-[#111827] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#F26A21]"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div 
          id="mobile-menu" 
          className="lg:hidden border-b border-[#E5E7EB] bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-fade-in"
        >
          <div className="space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-base font-medium transition-colors ${
                    active
                      ? 'bg-[#FFF1E8] text-[#F26A21] font-semibold'
                      : 'text-[#4B5563] hover:bg-gray-50 hover:text-[#111827]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${active ? 'text-[#F26A21]' : 'text-[#9CA3AF]'}`} />
                    <span>{link.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-col gap-2.5">
            <Link 
              href="/practice" 
              onClick={() => setMobileMenuOpen(false)}
              className="w-full"
            >
              <Button size="lg" variant="primary" className="w-full">
                เริ่มฝึกสัมภาษณ์ตอนนี้
              </Button>
            </Link>
            <div className="flex items-center justify-between px-2 pt-2 text-xs text-[#9CA3AF]">
              <span>ระบบเตรียมความพร้อม</span>
              <Link 
                href="/admin" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#F26A21] flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>เข้าสู่ระบบผู้ดูแล (Admin)</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
