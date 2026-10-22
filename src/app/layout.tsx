import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'ติดไปด้วยกัน by อาตี๋ | INTERVIEW READY - แพลตฟอร์มฝึกสัมภาษณ์เข้ามหาวิทยาลัย',
  description: 'เตรียมพร้อมก่อนวันสัมภาษณ์จริง ฝึกคิด ฝึกตอบ และเพิ่มความมั่นใจก่อนก้าวเข้าสู่มหาวิทยาลัย ด้วยคลังคำถามสัมภาษณ์เฉพาะหลักสูตร จับเวลาและบันทึกคำตอบจริง',
  keywords: [
    'ฝึกสัมภาษณ์',
    'สอบสัมภาษณ์มหาวิทยาลัย',
    'TCAS',
    'สัมภาษณ์วิศวะ',
    'สัมภาษณ์บัญชี',
    'สัมภาษณ์ธุรกิจดิจิทัล',
    'สัมภาษณ์ดนตรี',
    'สัมภาษณ์โลจิสติกส์',
    'ติดไปด้วยกัน by อาตี๋'
  ],
  authors: [{ name: 'ติดไปด้วยกัน by อาตี๋' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="min-h-screen flex flex-col bg-white text-[#4B5563] antialiased selection:bg-[#FFF1E8] selection:text-[#F26A21]">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
