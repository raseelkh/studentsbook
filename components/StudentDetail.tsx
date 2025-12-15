import React, { useState, useEffect } from 'react';
import { Student, Assignment, TestResult } from '../types';
import { Trophy, Star, Target, BookCheck, Plus, X, Save, Settings, Trash2, Pencil } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import StudentAvatar from './StudentAvatar';

interface StudentDetailProps {
  student: Student;
  onBack?: () => void;
  isTeacher?: boolean;
  onUpdateStudent?: (updatedStudent: Student) => void;
  onDeleteStudent?: (studentId: string) => void;
}

const StudentDetail: React.FC<StudentDetailProps> = ({ student, onBack, isTeacher = false, onUpdateStudent, onDeleteStudent }) => {
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  
  // State for Add/Edit Score
  const [scoreForm, setScoreForm] = useState({
      id: '',
      title: '',
      type: 'Homework',
      score: 0,
      maxScore: 100,
      date: new Date().toISOString().split('T')[0]
  });

  // State for Edit Profile
  const [profileForm, setProfileForm] = useState({
      name: '',
      grade: '',
      xp: 0
  });

  // State for new badge
  const [newBadge, setNewBadge] = useState('');
  const [isAddingBadge, setIsAddingBadge] = useState(false);

  // Initialize profile form when modal opens
  useEffect(() => {
    if (isEditProfileModalOpen) {
        setProfileForm({
            name: student.name,
            grade: student.grade,
            xp: student.xp
        });
    }
  }, [isEditProfileModalOpen, student]);

  const radarData = [
    { subject: 'المنطق', A: student.tests.length ? student.tests.reduce((acc, t) => acc + t.score, 0) / student.tests.length : 0, fullMark: 100 },
    { subject: 'بناء الكود', A: student.assignments.filter(a => a.type === 'Homework').length ? student.assignments.filter(a => a.type === 'Homework').reduce((acc, a) => acc + a.score, 0) / student.assignments.filter(a => a.type === 'Homework').length : 0, fullMark: 100 },
    { subject: 'الإبداع', A: student.assignments.filter(a => a.type === 'Project').length ? student.assignments.filter(a => a.type === 'Project').reduce((acc, a) => acc + a.score, 0) / student.assignments.filter(a => a.type === 'Project').length : 0, fullMark: 100 },
    { subject: 'الحضور', A: student.attendance, fullMark: 100 },
    { subject: 'السرعة', A: 75, fullMark: 100 },
  ];

  const handleOpenAddScore = () => {
      setScoreForm({
        id: '',
        title: '',
        type: 'Homework',
        score: 0,
        maxScore: 100,
        date: new Date().toISOString().split('T')[0]
      });
      setIsScoreModalOpen(true);
  };

  const handleOpenEditScore = (item: Assignment | TestResult, isTest: boolean) => {
      setScoreForm({
          id: item.id,
          title: item.title,
          type: isTest ? 'Test' : (item as Assignment).type,
          score: item.score,
          maxScore: item.maxScore,
          date: item.date
      });
      setIsScoreModalOpen(true);
  };

  const handleDeleteScore = (itemId: string, isTest: boolean) => {
      if(!onUpdateStudent) return;
      if (!window.confirm('هل أنت متأكد من حذف هذا العنصر؟ سيتم خصم النقاط.')) return;

      const updatedStudent = { ...student };
      let scoreToRemove = 0;

      if (isTest) {
          const item = updatedStudent.tests.find(t => t.id === itemId);
          if (item) scoreToRemove = item.score;
          updatedStudent.tests = updatedStudent.tests.filter(t => t.id !== itemId);
      } else {
          const item = updatedStudent.assignments.find(a => a.id === itemId);
          if (item) scoreToRemove = item.score;
          updatedStudent.assignments = updatedStudent.assignments.filter(a => a.id !== itemId);
      }

      updatedStudent.xp = Math.max(0, updatedStudent.xp - scoreToRemove);
      onUpdateStudent(updatedStudent);
  };

  const handleSaveScore = (e: React.FormEvent) => {
      e.preventDefault();
      if(!onUpdateStudent) return;

      const updatedStudent = { ...student };
      const isEditing = !!scoreForm.id;
      const isTest = scoreForm.type === 'Test';
      const scoreVal = Number(scoreForm.score);
      const maxScoreVal = Number(scoreForm.maxScore);

      if (isEditing) {
          // Adjust XP based on diff
          let oldScoreVal = 0;
          if (isTest) {
              const oldItem = updatedStudent.tests.find(t => t.id === scoreForm.id);
              if (oldItem) oldScoreVal = oldItem.score;
              updatedStudent.tests = updatedStudent.tests.map(t => 
                  t.id === scoreForm.id 
                  ? { ...t, title: scoreForm.title, score: scoreVal, maxScore: maxScoreVal, date: scoreForm.date }
                  : t
              );
          } else {
              const oldItem = updatedStudent.assignments.find(a => a.id === scoreForm.id);
              if (oldItem) oldScoreVal = oldItem.score;
              updatedStudent.assignments = updatedStudent.assignments.map(a => 
                  a.id === scoreForm.id
                  ? { ...a, title: scoreForm.title, score: scoreVal, maxScore: maxScoreVal, date: scoreForm.date, type: scoreForm.type as any }
                  : a
              );
          }
          updatedStudent.xp = updatedStudent.xp - oldScoreVal + scoreVal;

      } else {
          // Add new
          const newId = `n-${Date.now()}`;
          if (isTest) {
              updatedStudent.tests = [...updatedStudent.tests, {
                  id: newId,
                  title: scoreForm.title,
                  score: scoreVal,
                  maxScore: maxScoreVal,
                  date: scoreForm.date
              }];
          } else {
              updatedStudent.assignments = [...updatedStudent.assignments, {
                  id: newId,
                  title: scoreForm.title,
                  score: scoreVal,
                  maxScore: maxScoreVal,
                  date: scoreForm.date,
                  type: scoreForm.type as any
              }];
          }
          updatedStudent.xp += scoreVal;
      }

      onUpdateStudent(updatedStudent);
      setIsScoreModalOpen(false);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
      e.preventDefault();
      if (!onUpdateStudent) return;
      onUpdateStudent({
          ...student,
          name: profileForm.name,
          grade: profileForm.grade,
          xp: Number(profileForm.xp)
      });
      setIsEditProfileModalOpen(false);
  };

  const handleAddBadge = () => {
      if (!newBadge.trim() || !onUpdateStudent) return;
      onUpdateStudent({
          ...student,
          badges: [...student.badges, newBadge.trim()]
      });
      setNewBadge('');
      setIsAddingBadge(false);
  };

  const handleRemoveBadge = (badgeToRemove: string) => {
      if (!onUpdateStudent) return;
      onUpdateStudent({
          ...student,
          badges: student.badges.filter(b => b !== badgeToRemove)
      });
  };

  // Combine lists for the "Recent Activity" view
  const combinedHistory = [
      ...student.assignments.map(a => ({...a, category: 'assignment'})),
      ...student.tests.map(t => ({...t, category: 'test', type: 'اختبار'}))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in pb-20 relative">
      {/* Header */}
      <div className="flex justify-between items-center">
          {onBack && (
            <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-brand-orange transition-colors mb-4 group font-bold">
                <Trophy className="w-5 h-5 group-hover:scale-110 transition-transform" /> لوحة الصدارة
            </button>
          )}
          {isTeacher && (
             <div className="flex gap-2">
                 <button 
                    onClick={() => setIsEditProfileModalOpen(true)}
                    className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:border-brand-purple hover:text-brand-purple transition-colors"
                 >
                     <Settings className="w-5 h-5" /> تعديل الملف
                 </button>
                 <button 
                    onClick={handleOpenAddScore}
                    className="flex items-center gap-2 bg-brand-purple text-white px-4 py-2 rounded-xl shadow-lg shadow-purple-200 hover:bg-purple-600 transition-colors"
                 >
                     <Plus className="w-5 h-5" /> إضافة درجة
                 </button>
             </div>
          )}
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Profile Card */}
        <div className="w-full md:w-1/3 space-y-6">
            <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-xl shadow-purple-500/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-24 bg-gradient-to-l from-brand-purple to-purple-400 opacity-90"></div>
                <div className="relative z-10 flex flex-col items-center mt-8">
                    <div className="relative">
                        <StudentAvatar name={student.name} size="xl" className="border-4 border-white shadow-lg" />
                        <div className="absolute -bottom-2 -left-2 bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-white shadow-sm">
                            مستوى {student.level}
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mt-4">{student.name}</h1>
                    <p className="text-gray-500 text-sm mt-1">مستكشف علوم الحاسوب • {student.grade}</p>
                    
                    <div className="w-full mt-6 space-y-2">
                        <div className="flex justify-between text-xs font-bold text-gray-500">
                            <span>نقاط XP</span>
                            <span>{student.xp} / {student.xpToNextLevel}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden" dir="ltr">
                            <div className="bg-gradient-to-r from-purple-400 to-brand-purple h-full rounded-full transition-all duration-1000 shadow-sm" style={{ width: `${Math.min((student.xp / student.xpToNextLevel) * 100, 100)}%` }}></div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center mt-6">
                        {student.badges.map(badge => (
                            <div key={badge} className="group relative">
                                <span className="px-3 py-1 bg-purple-50 border border-purple-100 rounded-full text-xs font-bold text-brand-purple flex items-center gap-1 cursor-default">
                                    <Star className="w-3 h-3 fill-brand-purple" /> {badge}
                                </span>
                                {isTeacher && (
                                    <button 
                                        onClick={() => handleRemoveBadge(badge)}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="حذف الوسام"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        ))}
                        {isTeacher && !isAddingBadge && (
                            <button onClick={() => setIsAddingBadge(true)} className="px-2 py-1 bg-gray-50 border border-dashed border-gray-300 rounded-full text-xs text-gray-400 hover:text-brand-purple hover:border-brand-purple transition-colors">
                                + إضافة
                            </button>
                        )}
                    </div>
                    {isAddingBadge && (
                        <div className="flex items-center gap-2 mt-2 w-full animate-fade-in">
                            <input 
                                autoFocus
                                type="text" 
                                value={newBadge}
                                onChange={e => setNewBadge(e.target.value)}
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-brand-purple"
                                placeholder="اسم الوسام..."
                                onKeyDown={e => e.key === 'Enter' && handleAddBadge()}
                            />
                            <button onClick={handleAddBadge} className="text-green-600"><Plus className="w-4 h-4" /></button>
                            <button onClick={() => setIsAddingBadge(false)} className="text-red-500"><X className="w-4 h-4" /></button>
                        </div>
                    )}
                </div>
            </div>
            
        </div>

        {/* Details & Charts */}
        <div className="w-full md:w-2/3 space-y-6">
             {/* Stats Grid */}
             <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm">
                    <p className="text-gray-400 text-xs font-bold">معدل الاختبارات</p>
                    <p className="text-3xl font-black text-gray-800 mt-2">
                        {student.tests.length > 0 
                          ? Math.round(student.tests.reduce((acc, t) => acc + t.score, 0) / student.tests.length) 
                          : 0}%
                    </p>
                 </div>
                 <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm">
                    <p className="text-gray-400 text-xs font-bold">إكمال الواجبات</p>
                    <p className="text-3xl font-black text-gray-800 mt-2">
                        {Math.round((student.assignments.length / Math.max(student.assignments.length || 1, 5)) * 100)}% 
                        <span className="text-sm text-gray-400 font-medium mr-2">({student.assignments.length})</span>
                    </p>
                 </div>
             </div>

             {/* Charts Row */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm">
                     <h3 className="text-gray-800 font-bold mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-pink-500" /> رادار المهارات
                     </h3>
                     <div className="h-64" dir="ltr">
                         <ResponsiveContainer width="100%" height="100%">
                             <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#E2E8F0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#CBD5E1" tick={false} axisLine={false} />
                                <Radar name={student.name} dataKey="A" stroke="#9D7BFF" fill="#9D7BFF" fillOpacity={0.3} />
                             </RadarChart>
                         </ResponsiveContainer>
                     </div>
                 </div>

                 <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm flex flex-col">
                     <h3 className="text-gray-800 font-bold mb-4 flex items-center gap-2">
                        <BookCheck className="w-5 h-5 text-emerald-500" /> سجل الأداء
                     </h3>
                     <div className="space-y-3 flex-1 overflow-y-auto max-h-64 pr-2">
                         {combinedHistory.length === 0 && <p className="text-gray-400 text-center text-sm py-8">لا يوجد سجلات بعد</p>}
                         {combinedHistory.map((item) => (
                             <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl border border-gray-100 group">
                                 <div>
                                     <p className="text-sm font-bold text-gray-700">{item.title}</p>
                                     <div className="flex gap-2">
                                         <p className="text-xs text-gray-400 font-medium">{item.date}</p>
                                         <p className="text-xs text-brand-purple/70 font-medium bg-purple-50 px-1 rounded">{item.category === 'test' ? 'اختبار' : (item as any).type}</p>
                                     </div>
                                 </div>
                                 <div className="flex items-center gap-3">
                                     <div className={`text-sm font-bold px-3 py-1 rounded-full ${
                                         item.score >= 90 ? 'bg-green-100 text-green-600' :
                                         item.score >= 70 ? 'bg-blue-100 text-blue-600' :
                                         'bg-red-100 text-red-600'
                                     }`}>
                                         {item.score}/{item.maxScore}
                                     </div>
                                     {isTeacher && (
                                         <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                             <button 
                                                onClick={() => handleOpenEditScore(item, item.category === 'test')}
                                                className="p-1.5 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-blue-500 hover:border-blue-500"
                                             >
                                                 <Pencil className="w-3 h-3" />
                                             </button>
                                             <button 
                                                onClick={() => handleDeleteScore(item.id, item.category === 'test')}
                                                className="p-1.5 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-red-500 hover:border-red-500"
                                             >
                                                 <Trash2 className="w-3 h-3" />
                                             </button>
                                         </div>
                                     )}
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>
             </div>

             {/* Progress Line Chart */}
             <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm">
                <h3 className="text-gray-800 font-bold mb-6">تطور الدرجات</h3>
                <div className="h-64" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[...student.assignments, ...student.tests].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())}>
                             <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                             <XAxis dataKey="title" stroke="#94a3b8" tick={{fontSize: 10}} height={60} interval={0} angle={-45} textAnchor="end" />
                             <YAxis stroke="#94a3b8" domain={[0, 100]} />
                             <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#E2E8F0', borderRadius: '12px', color: '#1F2937' }} />
                             <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={3} dot={{r: 4, fill: '#10B981', strokeWidth: 2, stroke:'#fff'}} activeDot={{r: 6}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
             </div>
        </div>

        {/* Add/Edit Score Modal */}
        {isScoreModalOpen && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-6 w-full max-w-md animate-slide-up">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">{scoreForm.id ? 'تعديل الدرجة' : 'إضافة درجة جديدة'}</h2>
                        <button onClick={() => setIsScoreModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                    
                    <form onSubmit={handleSaveScore} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">عنوان المهمة / الاختبار</label>
                            <input 
                                required
                                type="text" 
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-brand-purple"
                                value={scoreForm.title}
                                onChange={e => setScoreForm({...scoreForm, title: e.target.value})}
                                placeholder="مثال: اختبار الوحدة الأولى"
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">النوع</label>
                                <select 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-brand-purple"
                                    value={scoreForm.type}
                                    onChange={e => setScoreForm({...scoreForm, type: e.target.value})}
                                >
                                    <option value="Homework">واجب منزلي</option>
                                    <option value="Project">مشروع</option>
                                    <option value="Challenge">تحدي</option>
                                    <option value="Test">اختبار</option>
                                </select>
                             </div>
                             <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">التاريخ</label>
                                <input 
                                    type="date" 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-brand-purple"
                                    value={scoreForm.date}
                                    onChange={e => setScoreForm({...scoreForm, date: e.target.value})}
                                />
                             </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">الدرجة</label>
                                <input 
                                    required
                                    type="number" 
                                    min="0"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-brand-purple"
                                    value={scoreForm.score}
                                    onChange={e => setScoreForm({...scoreForm, score: Number(e.target.value)})}
                                />
                             </div>
                             <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">الدرجة العظمى</label>
                                <input 
                                    required
                                    type="number" 
                                    min="1"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-brand-purple"
                                    value={scoreForm.maxScore}
                                    onChange={e => setScoreForm({...scoreForm, maxScore: Number(e.target.value)})}
                                />
                             </div>
                        </div>

                        <div className="pt-4">
                            <button 
                                type="submit"
                                className="w-full bg-brand-purple hover:bg-purple-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                            >
                                <Save className="w-5 h-5" /> حفظ التغييرات
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* Edit Profile Modal */}
        {isEditProfileModalOpen && (
             <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-6 w-full max-w-sm animate-slide-up">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">تعديل ملف الطالب</h2>
                        <button onClick={() => setIsEditProfileModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                    
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">الاسم</label>
                            <input 
                                required
                                type="text" 
                                value={profileForm.name}
                                onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-brand-purple"
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">الصف</label>
                            <select 
                                value={profileForm.grade}
                                onChange={(e) => setProfileForm({...profileForm, grade: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-brand-purple"
                            >
                                <option value="الصف السادس">الصف السادس</option>
                                <option value="الصف السابع">الصف السابع</option>
                                <option value="الصف الثامن">الصف الثامن</option>
                            </select>
                        </div>
                        <div>
                             <label className="block text-sm font-bold text-gray-700 mb-1">مجموع نقاط XP (تعديل يدوي)</label>
                             <input 
                                 type="number" 
                                 value={profileForm.xp}
                                 onChange={e => setProfileForm({...profileForm, xp: Number(e.target.value)})}
                                 className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-brand-purple"
                             />
                             <p className="text-xs text-gray-400 mt-1">تنبيه: تعديل النقاط يدوياً سيؤثر على حساب المستوى.</p>
                        </div>

                        <div className="pt-4 space-y-3">
                            <button 
                                type="submit"
                                className="w-full bg-brand-purple hover:bg-purple-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                            >
                                <Save className="w-5 h-5" /> حفظ البيانات
                            </button>
                            
                            {onDeleteStudent && (
                                <button 
                                    type="button"
                                    onClick={() => onDeleteStudent(student.id)}
                                    className="w-full bg-white border-2 border-red-100 hover:bg-red-50 text-red-500 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-5 h-5" /> حذف الطالب
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetail;