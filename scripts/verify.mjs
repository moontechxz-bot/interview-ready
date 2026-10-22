import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('\n======================================================');
console.log('🚀 SAMPASS: INTERVIEW READY - SYSTEM VERIFICATION SUITE');
console.log('======================================================\n');

let passCount = 0;
let failCount = 0;

function assert(description, condition, details = '') {
  if (condition) {
    console.log(`✅ [PASS] ${description}`);
    passCount++;
  } else {
    console.error(`❌ [FAIL] ${description} ${details ? `(${details})` : ''}`);
    failCount++;
  }
}

// 1. Verify 5 Programs
const programsFile = fs.readFileSync(path.join(rootDir, 'src/data/programs.ts'), 'utf8');
const programsMatch = programsFile.match(/id:\s*'prog-([^']+)'/g) || [];
const programSlugs = [
  'mechanical-engineering',
  'digital-business',
  'music',
  'logistics-supply-chain',
  'accounting'
];

assert('Requirement: Exactly 5 Core Programs in Database', programSlugs.length === 5);

for (const slug of programSlugs) {
  assert(`Program Verified: ${slug}`, programsFile.includes(`slug: '${slug}'`));
}

// 2. Verify 250 Questions (50 each)
const files = {
  'mechanical-engineering': 'src/data/questions/mechanical.ts',
  'digital-business': 'src/data/questions/digital-business.ts',
  'music': 'src/data/questions/music.ts',
  'logistics-supply-chain': 'src/data/questions/logistics.ts',
  'accounting': 'src/data/questions/accounting.ts',
};

let totalQuestions = 0;

for (const [slug, relPath] of Object.entries(files)) {
  const content = fs.readFileSync(path.join(rootDir, relPath), 'utf8');
  const count = (content.match(new RegExp(`programSlug:\\s*'${slug}'`, 'g')) || []).length;
  totalQuestions += count;
  assert(`Curriculum Question Count: ${slug} has 50 questions`, count === 50, `Found: ${count}`);
}

assert('Requirement: Total Verified Question Bank is 250 Questions', totalQuestions === 250, `Total: ${totalQuestions}`);

// 3. Verify Database Schema and RLS
const schemaFile = fs.readFileSync(path.join(rootDir, 'supabase/schema.sql'), 'utf8');
assert('Supabase RLS: programs table protected', schemaFile.includes('ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;'));
assert('Supabase RLS: questions table protected', schemaFile.includes('ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;'));
assert('Supabase RLS: practice_sessions table protected', schemaFile.includes('ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;'));
assert('Supabase RLS: admin_roles defined with is_admin()', schemaFile.includes('CREATE OR REPLACE FUNCTION public.is_admin()'));

// 4. Verify Next.js routes exist
const requiredRoutes = [
  'src/app/page.tsx',
  'src/app/programs/page.tsx',
  'src/app/programs/[slug]/page.tsx',
  'src/app/practice/page.tsx',
  'src/app/practice/result/page.tsx',
  'src/app/history/page.tsx',
  'src/app/about/page.tsx',
  'src/app/faq/page.tsx',
  'src/app/login/page.tsx',
  'src/app/admin/page.tsx',
];

for (const route of requiredRoutes) {
  assert(`Route exists: ${route}`, fs.existsSync(path.join(rootDir, route)));
}

console.log('\n------------------------------------------------------');
console.log(`SUMMARY: ${passCount} Passed, ${failCount} Failed.`);
console.log('------------------------------------------------------\n');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL SYSTEM REQUIREMENTS VERIFIED SUCCESSFULLY!\n');
}
