import { Student } from './types';

// Helper to calculate level stats
export const calculateLevelStats = (xp: number) => {
  const XP_PER_LEVEL = 1000;
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const xpToNextLevel = level * XP_PER_LEVEL;
  return { level, xpToNextLevel };
};

const RAW_STUDENTS_DATA = [
  {
    id: 's1',
    name: 'أحمد علي',
    grade: 'الصف الثامن',
    xp: 4500,
    badges: ['صائد الأخطاء', 'سيد الحلقات', 'محترف بايثون'],
    attendance: 95,
    strengths: ['الخوارزميات', 'كتابة بايثون'],
    weaknesses: ['تنسيقات CSS'],
    assignments: [
      { id: 'a1', title: 'مقدمة في بايثون', score: 95, maxScore: 100, date: '2023-10-01', type: 'Homework' },
      { id: 'a2', title: 'الحلقات التكرارية', score: 88, maxScore: 100, date: '2023-10-08', type: 'Homework' },
      { id: 'a3', title: 'مشروع لعبة الفضاء', score: 100, maxScore: 100, date: '2023-10-20', type: 'Project' },
      { id: 'a4', title: 'تحدي تصحيح الأخطاء', score: 45, maxScore: 50, date: '2023-10-25', type: 'Challenge' },
    ],
    tests: [
      { id: 't1', title: 'اختبار المنطق النصفي', score: 92, maxScore: 100, date: '2023-10-15' },
      { id: 't2', title: 'اختبار هياكل البيانات', score: 85, maxScore: 100, date: '2023-11-01' },
    ],
  },
  {
    id: 's2',
    name: 'سارة يوسف',
    grade: 'الصف الثامن',
    xp: 3800,
    badges: ['عبقرية التصميم', 'بطلة HTML'],
    attendance: 88,
    strengths: ['تصميم الواجهات', 'الإبداع'],
    weaknesses: ['منطق الخلفية'],
    assignments: [
      { id: 'a1', title: 'مقدمة في بايثون', score: 80, maxScore: 100, date: '2023-10-01', type: 'Homework' },
      { id: 'a2', title: 'الحلقات التكرارية', score: 75, maxScore: 100, date: '2023-10-08', type: 'Homework' },
      { id: 'a3', title: 'مشروع لعبة الفضاء', score: 98, maxScore: 100, date: '2023-10-20', type: 'Project' },
    ],
    tests: [
      { id: 't1', title: 'اختبار المنطق النصفي', score: 78, maxScore: 100, date: '2023-10-15' },
      { id: 't2', title: 'اختبار هياكل البيانات', score: 72, maxScore: 100, date: '2023-11-01' },
    ],
  },
  {
    id: 's3',
    name: 'ياسر محمد',
    grade: 'الصف السابع',
    xp: 5200,
    badges: ['المبرمج السريع', 'مطور شامل', 'قائد فريق'],
    attendance: 100,
    strengths: ['جافا سكريبت', 'قواعد البيانات', 'القيادة'],
    weaknesses: ['التوثيق'],
    assignments: [
      { id: 'a1', title: 'أساسيات الويب', score: 100, maxScore: 100, date: '2023-10-01', type: 'Homework' },
      { id: 'a2', title: 'أحداث JS', score: 100, maxScore: 100, date: '2023-10-08', type: 'Homework' },
      { id: 'a3', title: 'مشروع المعرض الشخصي', score: 95, maxScore: 100, date: '2023-10-20', type: 'Project' },
    ],
    tests: [
      { id: 't1', title: 'اختبار HTML/CSS', score: 98, maxScore: 100, date: '2023-10-15' },
      { id: 't2', title: 'اختبار منطق JS', score: 96, maxScore: 100, date: '2023-11-01' },
    ],
  },
  {
    id: 's4',
    name: 'ميار أحمد',
    grade: 'الصف السابع',
    xp: 2500,
    badges: ['نجمة صاعدة'],
    attendance: 80,
    strengths: ['الإصرار', 'طرح الأسئلة'],
    weaknesses: ['البوابات المنطقية', 'أخطاء الكتابة'],
    assignments: [
      { id: 'a1', title: 'أساسيات الويب', score: 65, maxScore: 100, date: '2023-10-01', type: 'Homework' },
      { id: 'a2', title: 'أحداث JS', score: 70, maxScore: 100, date: '2023-10-08', type: 'Homework' },
      { id: 'a3', title: 'مشروع المعرض الشخصي', score: 85, maxScore: 100, date: '2023-10-20', type: 'Project' },
    ],
    tests: [
      { id: 't1', title: 'اختبار HTML/CSS', score: 60, maxScore: 100, date: '2023-10-15' },
      { id: 't2', title: 'اختبار منطق JS', score: 65, maxScore: 100, date: '2023-11-01' },
    ],
  },
  {
    id: 's5',
    name: 'نوح سالم',
    grade: 'الصف الثامن',
    xp: 4800,
    badges: ['خبير الخوارزميات', 'صياد الأخطاء'],
    attendance: 92,
    strengths: ['بايثون', 'حل المشكلات'],
    weaknesses: ['تصميم الواجهات'],
    assignments: [
      { id: 'a1', title: 'مقدمة في بايثون', score: 98, maxScore: 100, date: '2023-10-01', type: 'Homework' },
      { id: 'a2', title: 'الحلقات التكرارية', score: 92, maxScore: 100, date: '2023-10-08', type: 'Homework' },
      { id: 'a3', title: 'مشروع لعبة الفضاء', score: 89, maxScore: 100, date: '2023-10-20', type: 'Project' },
    ],
    tests: [
      { id: 't1', title: 'اختبار المنطق النصفي', score: 94, maxScore: 100, date: '2023-10-15' },
      { id: 't2', title: 'اختبار هياكل البيانات', score: 88, maxScore: 100, date: '2023-11-01' },
    ],
  },
  {
    id: 's6',
    name: 'إيمان حسن',
    grade: 'الصف السابع',
    xp: 3200,
    badges: ['عقل مبدع'],
    attendance: 100,
    strengths: ['تحريك CSS', 'العمل الجماعي'],
    weaknesses: ['متغيرات JS'],
    assignments: [
      { id: 'a1', title: 'أساسيات الويب', score: 95, maxScore: 100, date: '2023-10-01', type: 'Homework' },
      { id: 'a2', title: 'أحداث JS', score: 80, maxScore: 100, date: '2023-10-08', type: 'Homework' },
    ],
    tests: [
      { id: 't1', title: 'اختبار HTML/CSS', score: 88, maxScore: 100, date: '2023-10-15' },
      { id: 't2', title: 'اختبار منطق JS', score: 75, maxScore: 100, date: '2023-11-01' },
    ],
  },
  {
    id: 's7',
    name: 'ليلى محمود',
    grade: 'الصف السادس',
    xp: 1500,
    badges: ['مبتدئ سكراتش'],
    attendance: 98,
    strengths: ['التخيل', 'القصص'],
    weaknesses: ['الطباعة'],
    assignments: [
      { id: 'a1', title: 'مشروعي الأول', score: 90, maxScore: 100, date: '2023-10-05', type: 'Project' },
      { id: 'a2', title: 'التحريك البسيط', score: 85, maxScore: 100, date: '2023-10-12', type: 'Homework' },
    ],
    tests: [
      { id: 't1', title: 'أساسيات الحاسوب', score: 88, maxScore: 100, date: '2023-10-20' },
    ],
  },
  {
    id: 's8',
    name: 'عمر خالد',
    grade: 'الصف السادس',
    xp: 800,
    badges: [],
    attendance: 85,
    strengths: ['الألعاب'],
    weaknesses: ['التركيز'],
    assignments: [
      { id: 'a1', title: 'مشروعي الأول', score: 70, maxScore: 100, date: '2023-10-05', type: 'Project' },
      { id: 'a2', title: 'التحريك البسيط', score: 65, maxScore: 100, date: '2023-10-12', type: 'Homework' },
    ],
    tests: [
      { id: 't1', title: 'أساسيات الحاسوب', score: 72, maxScore: 100, date: '2023-10-20' },
    ],
  },
  {
    id: 's9',
    name: 'فاطمة زكي',
    grade: 'الصف السادس',
    xp: 2200,
    badges: ['الفنان الرقمي', 'سيد الألوان'],
    attendance: 100,
    strengths: ['التصميم', 'الرسم'],
    weaknesses: ['الحساب'],
    assignments: [
      { id: 'a1', title: 'مشروعي الأول', score: 100, maxScore: 100, date: '2023-10-05', type: 'Project' },
      { id: 'a2', title: 'التحريك البسيط', score: 95, maxScore: 100, date: '2023-10-12', type: 'Homework' },
    ],
    tests: [
      { id: 't1', title: 'أساسيات الحاسوب', score: 90, maxScore: 100, date: '2023-10-20' },
    ],
  },
  {
    id: 's10',
    name: 'حسن إبراهيم',
    grade: 'الصف الثامن',
    xp: 3600,
    badges: ['مساعد المعلم'],
    attendance: 90,
    strengths: ['مساعدة الآخرين', 'بايثون'],
    weaknesses: ['إدارة الوقت'],
    assignments: [
      { id: 'a1', title: 'مقدمة في بايثون', score: 85, maxScore: 100, date: '2023-10-01', type: 'Homework' },
      { id: 'a2', title: 'الحلقات التكرارية', score: 82, maxScore: 100, date: '2023-10-08', type: 'Homework' },
      { id: 'a3', title: 'مشروع لعبة الفضاء', score: 90, maxScore: 100, date: '2023-10-20', type: 'Project' },
    ],
    tests: [
      { id: 't1', title: 'اختبار المنطق النصفي', score: 80, maxScore: 100, date: '2023-10-15' },
      { id: 't2', title: 'اختبار هياكل البيانات', score: 75, maxScore: 100, date: '2023-11-01' },
    ],
  },
];

export const MOCK_STUDENTS: Student[] = RAW_STUDENTS_DATA.map((s) => {
  const stats = calculateLevelStats(s.xp);
  // Cast type to 'any' initially for the raw data since it doesn't have level/xpToNextLevel yet
  const student = s as any; 
  return {
    ...student,
    level: stats.level,
    xpToNextLevel: stats.xpToNextLevel,
  };
});