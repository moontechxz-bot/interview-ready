const fs = require('fs');
const path = require('path');

const srcPath = 'c:/Users/pawit/OneDrive/เดสก์ท็อป/code_artifact (2).md';
const content = fs.readFileSync(srcPath, 'utf8');

function parseQuestions(sectionText) {
  const qBlocks = sectionText.split(/###\s*(\d+)\.\s*/);
  const questions = [];
  for (let i = 1; i < qBlocks.length; i += 2) {
    const qNum = parseInt(qBlocks[i], 10);
    const block = qBlocks[i+1];
    const lines = block.split('\n');
    const questionTitle = lines[0].trim();
    
    let guideline = '';
    let sampleAnswer = '';
    
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (line.includes('แนวทางการตอบ:')) {
        guideline = line.replace(/^\*\s*\*\*แนวทางการตอบ:\*\*\s*/, '')
                        .replace(/^\*\s*แนวทางการตอบ:\s*/, '')
                        .trim();
      } else if (line.includes('ตัวอย่างแนวตอบ:')) {
        sampleAnswer = line.replace(/^\*\s*\*?ตัวอย่างแนวตอบ:\*?\s*/, '')
                           .replace(/^\*\s*\*\*ตัวอย่างแนวตอบ:\*\*\s*/, '')
                           .trim();
      }
    }

    questions.push({ qNum, questionTitle, guideline, sampleAnswer });
  }
  return questions;
}

const parts = content.split(/# ส่วนที่\s*(\d+):/);

const metaMap = {
  1: {
    prefix: 'NUR',
    slug: 'nursing',
    sourceRef: 'คู่มือแนวคำถามสัมภาษณ์พยาบาลศาสตรบัณฑิต',
    catMap: (n) => {
      if (n <= 10) return { cat: 'motivation', name: 'เจตคติและแรงบันดาลใจ' };
      if (n <= 20) return { cat: 'problem_solving', name: 'จริยธรรมและการแก้ปัญหา' };
      if (n <= 30) return { cat: 'technical', name: 'วิชาการและระบบสาธารณสุข' };
      if (n <= 40) return { cat: 'teamwork', name: 'การทำงานเป็นทีมและพัฒนาตนเอง' };
      return { cat: 'future_goals', name: 'เป้าหมายและความพร้อมกับสถาบัน' };
    },
    diffMap: (n) => {
      if ([1, 2, 6, 7, 31, 35, 37, 38, 40].includes(n)) return 'easy';
      if ([13, 14, 16, 17, 23, 25, 26, 28, 30, 44, 48].includes(n)) return 'hard';
      return 'medium';
    },
    followUps: (n) => {
      const map = {
        1: ['หากในอนาคตพบกับภาระงานที่หนักจนเหนื่อยล้า อะไรจะเป็นสิ่งที่คอยเตือนใจให้คุณยังสู้ต่อ?'],
        2: ['หากมีเพื่อนร่วมงานเกิดความเครียดสะสม คุณมีวิธีช่วยเหลือหรือให้กำลังใจอย่างไร?'],
        3: ['คุณคิดว่าการสร้างความร่วมมือในทีมสุขภาพต้องอาศัยทักษะใดมากที่สุด?'],
        11: ['หากญาติของผู้ป่วยไม่เห็นด้วยกับการตัดสินใจของผู้ป่วยเอง คุณจะมีบทบาทไกล่เกลี่ยอย่างไร?'],
        13: ['หากหัวหน้าเวรไม่ยอมรับฟังข้อสังเกตของคุณ คุณจะดำเนินการอย่างไรต่อไป?'],
        14: ['ในสถานการณ์ฉุกเฉิน คุณคิดว่าสิ่งใดสำคัญที่สุดในการควบคุมสติของตนเอง?'],
        17: ['กระบวนการรายงานความเสี่ยง (Risk Incident Report) มีประโยชน์ต่อองค์กรอย่างไร?'],
        21: ['คุณคิดว่าชุมชนควรมีบทบาทอย่างไรในการร่วมดูแลผู้สูงอายุที่มีภาวะพึ่งพิง?'],
        22: ['คุณมีแนวคิดในการนำแอปพลิเคชันหรือเทคโนโลยีมาประยุกต์ใช้ในการติดตามอาการผู้ป่วยอย่างไร?']
      };
      return map[n] || ['หากผู้สัมภาษณ์ถามประเด็นนี้เพิ่มเติม คุณจะยกตัวอย่างกรณีศึกษาใดประกอบ?'];
    }
  },
  2: {
    prefix: 'COMM',
    slug: 'communication-arts',
    sourceRef: 'คู่มือแนวคำถามสัมภาษณ์นิเทศศาสตรบัณฑิต',
    catMap: (n) => {
      if (n <= 10) return { cat: 'motivation', name: 'ทัศนคติและแรงบันดาลใจ' };
      if (n <= 20) return { cat: 'technical', name: 'เทคโนโลยีและจริยธรรมสื่อ' };
      if (n <= 30) return { cat: 'problem_solving', name: 'สถานการณ์จำลองและไหวพริบ' };
      if (n <= 40) return { cat: 'teamwork', name: 'ประสบการณ์และความพร้อม' };
      return { cat: 'future_goals', name: 'วิสัยทัศน์และคำถามปิดท้าย' };
    },
    diffMap: (n) => {
      if ([1, 3, 4, 7, 32, 33, 37].includes(n)) return 'easy';
      if ([11, 12, 16, 18, 21, 25, 28, 41, 44, 45].includes(n)) return 'hard';
      return 'medium';
    },
    followUps: (n) => {
      const map = {
        1: ['คุณมองว่าทักษะสำคัญที่สุดของ Creator ยุคใหม่ที่แตกต่างจากนักสื่อสารในอดีตคืออะไร?'],
        2: ['หากมีแคมเปญสื่อที่ได้ยอดวิวหลักล้านแต่ส่งผลลบต่อสังคม คุณจะประเมินผลสำเร็จอย่างไร?'],
        11: ['คุณมีหลักเกณฑ์ในการกำหนดขอบเขตการใช้ AI เพื่อไม่ให้ละเมิดลิขสิทธิ์หรือความถูกต้องอย่างไร?'],
        16: ['ความเร็วในการชี้แจงกับความถูกต้องของข้อมูล คุณให้ความสำคัญกับสิ่งใดก่อนในภาวะวิกฤต?'],
        21: ['หากเกิดเหตุการณ์ไฟล์งานสูญหาย คุณจะมีมาตรการสำรองข้อมูล (Backup Plan) อย่างไรในอนาคต?']
      };
      return map[n] || ['หากได้รับโจทย์ให้นำเสนอประเด็นนี้ในรูปแบบคลิป 60 วินาที คุณจะเปิดเรื่องอย่างไร?'];
    }
  },
  3: {
    prefix: 'ECE',
    slug: 'early-childhood-education',
    sourceRef: 'คู่มือแนวคำถามสัมภาษณ์การศึกษาปฐมวัย',
    catMap: (n) => {
      if (n <= 10) return { cat: 'motivation', name: 'แรงจูงใจและพัฒนาการเด็ก' };
      if (n <= 20) return { cat: 'problem_solving', name: 'การจัดการชั้นเรียนและจิตวิทยา' };
      if (n <= 30) return { cat: 'technical', name: 'นวัตกรรมการสอนและสื่อปฐมวัย' };
      if (n <= 40) return { cat: 'teamwork', name: 'ความสัมพันธ์ชุมชนและวิชาชีพครู' };
      return { cat: 'future_goals', name: 'ทัศนคติและคำถามปิดท้าย' };
    },
    diffMap: (n) => {
      if ([1, 2, 6, 8, 34, 38, 47].includes(n)) return 'easy';
      if ([5, 12, 14, 15, 21, 27, 32, 33, 36, 42].includes(n)) return 'hard';
      return 'medium';
    },
    followUps: (n) => {
      const map = {
        1: ['คุณคิดว่าครูปฐมวัยมีบทบาทอย่างไรในการค้นหาความถนัดเฉพาะตัวของเด็กตั้งแต่ยังเล็ก?'],
        4: ['คุณจะอธิบายให้ผู้ปกครองที่อยากให้เด็กเน้นทำแบบฝึกหัดเข้าใจความสำคัญของการเล่นได้อย่างไร?'],
        11: ['หากผ่านไป 1 เดือนแล้วเด็กยังคงร้องไห้ทุกเช้า คุณจะมีขั้นตอนการดูแลซ่อมเสริมอย่างไร?'],
        15: ['คุณจะมีวิธีการสังเกตพฤติกรรมเด็กและจดบันทึกอย่างไรโดยไม่รบกวนการทำกิจกรรมของเด็ก?'],
        21: ['คุณคิดว่าแนวคิดมอนเตสซอรีกับไฮสโคป มีจุดเหมือนและจุดต่างกันอย่างไรในทางปฏิบัติ?']
      };
      return map[n] || ['คุณจะนำเทคนิคหรือสื่อนวัตกรรมชิ้นใดมาช่วยเสริมกิจกรรมการเรียนรู้นี้?'];
    }
  }
};

const outputDir = 'c:/Users/pawit/OneDrive/เดสก์ท็อป/interview-ready/src/data/questions';

for (let p = 1; p <= 3; p++) {
  const meta = metaMap[p];
  const partIndex = (p - 1) * 2 + 1;
  const questions = parseQuestions(parts[partIndex + 1]);
  
  let tsCode = `import { Question } from '@/types';\n\n`;
  const varName = p === 1 ? 'NURSING_QUESTIONS' : p === 2 ? 'COMMUNICATION_ARTS_QUESTIONS' : 'EARLY_CHILDHOOD_QUESTIONS';
  tsCode += `export const ${varName}: Question[] = [\n`;
  
  questions.forEach(q => {
    const qId = `${meta.prefix}-${String(q.qNum).padStart(3, '0')}`;
    const catInfo = meta.catMap(q.qNum);
    const difficulty = meta.diffMap(q.qNum);
    const followUps = meta.followUps(q.qNum);
    
    const cleanSample = q.sampleAnswer.replace(/^["'“”]|["'“”]$/g, '').trim();
    const fullHint = `${q.guideline}\n\nตัวอย่างแนวตอบ: "${cleanSample}"`;
    
    tsCode += `  {\n`;
    tsCode += `    id: ${JSON.stringify(qId)},\n`;
    tsCode += `    programSlug: ${JSON.stringify(meta.slug)},\n`;
    tsCode += `    category: ${JSON.stringify(catInfo.cat)},\n`;
    tsCode += `    categoryNameTh: ${JSON.stringify(catInfo.name)},\n`;
    tsCode += `    difficulty: ${JSON.stringify(difficulty)},\n`;
    tsCode += `    question: ${JSON.stringify(q.questionTitle)},\n`;
    tsCode += `    hint: ${JSON.stringify(fullHint)},\n`;
    tsCode += `    sampleAnswer: ${JSON.stringify(cleanSample)},\n`;
    tsCode += `    followUpQuestions: ${JSON.stringify(followUps)},\n`;
    tsCode += `    sourceReference: ${JSON.stringify(meta.sourceRef)},\n`;
    tsCode += `    status: 'published',\n`;
    tsCode += `    createdAt: '2026-01-15T00:00:00Z',\n`;
    tsCode += `    updatedAt: '2026-01-15T00:00:00Z',\n`;
    tsCode += `  },\n`;
  });
  
  tsCode += `];\n`;
  
  const fileName = p === 1 ? 'nursing.ts' : p === 2 ? 'communication-arts.ts' : 'early-childhood.ts';
  const targetPath = path.join(outputDir, fileName);
  fs.writeFileSync(targetPath, tsCode, 'utf8');
  console.log('Successfully wrote', fileName, 'with', questions.length, 'questions');
}

// Also write formatted interview_questions_guide.md to both locations
const guidePathDesktop = 'c:/Users/pawit/OneDrive/เดสก์ท็อป/interview_questions_guide.md';
const guidePathProject = 'c:/Users/pawit/OneDrive/เดสก์ท็อป/interview-ready/interview_questions_guide.md';
fs.writeFileSync(guidePathDesktop, content, 'utf8');
fs.writeFileSync(guidePathProject, content, 'utf8');
console.log('Saved interview_questions_guide.md to Desktop and Project');
