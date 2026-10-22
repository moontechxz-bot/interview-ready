# ติดไปด้วยกัน by อาตี๋ (INTERVIEW READY)

แพลตฟอร์มจำลองการฝึกตอบคำถามก่อนเข้าสอบสัมภาษณ์เข้ามหาวิทยาลัย สำหรับนักเรียนระดับมัธยมศึกษาตอนปลายและผู้สมัครคัดเลือกเข้าศึกษาต่อระดับปริญญาตรี (ระบบ TCAS)

---

## 1. จุดเด่นของแพลตฟอร์ม

- **คลังคำถามตรงหลักสูตร 5 สาขา จำนวน 250 ข้อ**: รวบรวมจากเอกสารคู่มือแนวคำถามของคณะกรรมการรับเข้าศึกษาและคณาจารย์มหาวิทยาลัยจริง (50 ข้อต่อหลักสูตร)
- **ระบบสุ่มคำถามที่แม่นยำ (Unbiased Fisher-Yates Randomization)**: กรองตามหลักสูตร หมวดคำถาม และระดับความยาก โดยไม่สุ่มคำถามซ้ำในรอบเดียวกัน และไม่ดึงคำถามข้ามหลักสูตร
- **ระบบจำลองห้องสัมภาษณ์จริง**: แสดงคำถามทีละข้อ ตัวจับเวลาแบบเรียลไทม์ (30, 60, 90, 120 วินาที) พร้อมปุ่มเริ่ม หยุดชั่วคราว และเริ่มใหม่
- **Draft Autosave & Session Recovery**: บันทึกคำตอบแบบร่างอัตโนมัติเมื่อพิมพ์ หากรีเฟรชหน้าเว็บหรือย้อนกลับไปแก้ไขข้อก่อนหน้า คำตอบจะไม่สูญหาย
- **แนวทางคิด (Hint) & คำถามต่อยอด (Follow-up)**: ให้ผู้ใช้เปิดดูแนวทางการตอบที่กรรมการมองหาได้
- **หน้าสรุปผลเชิงสถิติ (Statistics Only)**: สรุปจำนวนข้อที่ตอบ ข้อที่ข้าม เวลาที่ใช้จริง พร้อมรายการคำถามที่ควรกลับมาฝึกซ้ำ และฟังก์ชันพิมพ์/คัดลอกสรุป
- **Admin Dashboard เต็มรูปแบบ**: จัดการคลังคำถาม (เพิ่ม/แก้ไข/ลบ), นำเข้าคำถามผ่าน JSON หรือ CSV (Bulk Import) พร้อมระบบตรวจสอบความถูกต้อง (Validator)
- **Design System สอดคล้องตามข้อกำหนด**: Primary Orange (`#F26A21`), Orange Light (`#FFF1E8`), White (`#FFFFFF`), Border Gray (`#E5E7EB`) และฟอนต์ภาษาไทย IBM Plex Sans Thai

---

## 2. โครงสร้าง 5 หลักสูตรที่เปิดให้บริการ

| รหัสหลักสูตร (`slug`) | ชื่อหลักสูตร | ปริญญา | คณะ | จำนวนคำถามจริง |
|---|---|---|---|:---:|
| `mechanical-engineering` | **วิศวกรรมเครื่องกล** | วิศวกรรมศาสตรบัณฑิต (วศ.บ.) | คณะวิศวกรรมศาสตร์ | **50 ข้อ** |
| `digital-business` | **ธุรกิจดิจิทัล** | บริหารธุรกิจบัณฑิต (บธ.บ.) | คณะบริหารธุรกิจ เศรษฐศาสตร์และการสื่อสาร | **50 ข้อ** |
| `music` | **ดุริยางคศาสตรบัณฑิต** | ดุริยางคศาสตรบัณฑิต (ดย.บ.) | วิทยาลัยดุริยางคศิลป์ | **50 ข้อ** |
| `logistics-supply-chain` | **โลจิสติกส์และดิจิทัลซัพพลายเชน** | วิทยาศาสตรบัณฑิต (วท.บ.) | คณะโลจิสติกส์และดิจิทัลซัพพลายเชน | **50 ข้อ** |
| `accounting` | **บัญชีบัณฑิต** | บัญชีบัณฑิต (บช.บ.) | คณะบริหารธุรกิจ เศรษฐศาสตร์และการสื่อสาร | **50 ข้อ** |

---

## 3. โครงสร้างไฟล์และสถาปัตยกรรม (Architecture)

```
interview-ready/
├── src/
│   ├── app/                         # Next.js 14 App Router Routes
│   │   ├── page.tsx                 # หน้าแรก (Hero, Search, Featured Programs, Steps, Highlights, FAQ)
│   │   ├── layout.tsx               # Root Layout, Metadata, Fonts & Viewport
│   │   ├── globals.css              # Global styles, Design Tokens & Fonts
│   │   ├── programs/
│   │   │   ├── page.tsx             # หน้าค้นหาหลักสูตร (Search, Category Filters, Empty State)
│   │   │   └── [slug]/page.tsx      # หน้ารายละเอียดหลักสูตร (Breadcrumb, Stats, Sample Qs, Tips)
│   │   ├── practice/
│   │   │   ├── page.tsx             # หน้าสุ่มคำถาม & ห้องฝึกสัมภาษณ์จริง (Timer, Textarea, Hints)
│   │   │   └── result/page.tsx      # หน้าสรุปผลการฝึก (Stats, Answer Review, Revisit Qs, Print)
│   │   ├── history/page.tsx         # หน้าประวัติการฝึกซ้อม (Review answers, Retry, Delete)
│   │   ├── about/page.tsx           # หน้าเกี่ยวกับเรา (Purpose, Disclaimer, Scope, Contact)
│   │   ├── faq/page.tsx             # หน้าคำถามที่พบบ่อย (Accordion FAQ)
│   │   ├── login/page.tsx           # หน้าเข้าสู่ระบบและคำชี้แจงสถานะสมาชิก
│   │   └── admin/page.tsx           # แดชบอร์ดผู้ดูแลระบบ (CRUD, Stats, JSON Import Validator)
│   ├── components/
│   │   ├── layout/                  # Shared Navigation & Footer
│   │   │   ├── Navbar.tsx           # Responsive Header & Mobile Slide-down
│   │   │   └── Footer.tsx           # Footer & Legal/Educational Disclaimers
│   │   └── ui/                      # Shared Reusable UI Components
│   │       ├── Button.tsx           # Button with variants (primary, outline, ghost), sizes, loading
│   │       ├── Badge.tsx            # Category & DifficultyBadges (easy, medium, hard)
│   │       ├── Card.tsx             # Container card with hover elevation
│   │       ├── Accordion.tsx        # Accessible toggle Accordion for FAQ
│   │       └── Modal.tsx            # Accessible Dialog Modal with backdrop & Escape key
│   ├── data/                        # Verified Curricula Datasets
│   │   ├── programs.ts              # 5 Programs metadata
│   │   └── questions/               # 250 Questions separated by discipline
│   │       ├── mechanical.ts        # 50 Mechanical Engineering Questions
│   │       ├── digital-business.ts  # 50 Digital Business Questions
│   │       ├── music.ts             # 50 Music Questions
│   │       ├── logistics.ts         # 50 Logistics & Supply Chain Questions
│   │       ├── accounting.ts        # 50 Accounting Questions
│   │       └── index.ts             # Combined export
│   ├── lib/
│   │   ├── storage.ts               # Storage Manager (Local / Supabase Integration)
│   │   └── randomizer.ts            # Unbiased Shuffle & Question Filter Logic
│   └── types/
│       └── index.ts                 # Full TypeScript Schema Interfaces
├── supabase/
│   └── schema.sql                   # Supabase PostgreSQL Tables, Indexes & RLS Policies
├── .env.example                     # Environment Configuration Template
├── tailwind.config.ts               # Tailwind Color Tokens & Fonts Configuration
└── tsconfig.json                    # TypeScript Configuration
```

---

## 4. วิธีการติดตั้งและรันระบบบนเครื่อง (Local Setup)

### ข้อกำหนดระบบ (Prerequisites)
- Node.js 18.17+ หรือ 20.x LTS
- npm 9+ หรือ yarn หรือ pnpm

### ขั้นตอนการรัน

1. **เข้าสู่โฟลเดอร์โปรเจกต์:**
   ```bash
   cd interview-ready
   ```

2. **ติดตั้ง Dependencies:**
   ```bash
   npm install
   ```

3. **คัดลอกไฟล์ Environment Variables:**
   ```bash
   cp .env.example .env.local
   ```

4. **รันเซิร์ฟเวอร์สำหรับทดสอบ (Development Mode):**
   ```bash
   npm run dev
   ```
   เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`

5. **การ Build สำหรับใช้งานจริง (Production Build):**
   ```bash
   npm run build
   npm run start
   ```

---

## 5. การตั้งค่าฐานข้อมูล Supabase (Production Database Setup)

หากต้องการเปิดใช้งานฐานข้อมูล PostgreSQL บนระบบคลาวด์ร่วมกับ Supabase:

1. สมัครใช้งานหรือเข้าสู่ระบบที่ [https://supabase.com](https://supabase.com) แล้วสร้างโปรเจกต์ใหม่
2. ไปที่เมนู **SQL Editor** บน Dashboard ของ Supabase
3. คัดลอกโค้ดทั้งหมดจากไฟล์ `supabase/schema.sql` ในโปรเจกต์นี้ และกด **Run**
   - โค้ดจะสร้างตาราง `programs`, `questions`, `practice_sessions`, `practice_answers`, `profiles`, และ `admin_roles`
   - กำหนดดัชนี (Indexes) และเปิดใช้งาน **Row Level Security (RLS)** เพื่อจำกัดสิทธิ์ผู้ใช้ไม่ให้เข้าถึงข้อมูลข้ามคน
4. ไปที่เมนู **Project Settings -> API** และคัดลอก:
   - `Project URL`
   - `anon public key`
5. นำค่ามากรอกในไฟล์ `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

---

## 6. ข้อชี้แจงความโปร่งใสและข้อจำกัดของระบบ (Disclaimers)

1. **ไม่ใช่ระบบของมหาวิทยาลัย**: เว็บไซต์นี้เป็นเครื่องมือสื่อการเรียนรู้สำหรับการจำลองฝึกทักษะ ไม่ใช่เว็บไซต์รับสมัครอย่างเป็นทางการของมหาวิทยาลัยใด
2. **ไม่รับประกันผลการคัดเลือก**: คำถามตัวอย่างเป็นแนวข้อสอบจำลอง ไม่ใช่ข้อสอบจริงที่รับรองว่าจะออกสอบ
3. **การประเมินผลเชิงสถิติ**: ในปัจจุบันระบบรายงานสถิติตามการฝึกจริง (จำนวนข้อ, เวลาที่ใช้) โดยไม่มีการสร้างคะแนนประเมินปลอมจากระบบที่ไม่ได้คำนวณจริง
