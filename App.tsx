import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StudentDetail from './components/StudentDetail';
import Leaderboard from './components/Leaderboard';
import LoginScreen from './components/LoginScreen';
import StudentAvatar from './components/StudentAvatar';
import { MOCK_STUDENTS, calculateLevelStats } from './constants';
import { Student } from './types';
import { LogOut, ArrowRight, UserPlus, X, Save } from 'lucide-react';

const App: React.FC = () => {
  // Data State (Lifted up from constants)
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);

  // Auth State
  const [userRole, setUserRole] = useState<'teacher' | 'student' | null>(null);
  const [currentUser, setCurrentUser] = useState<Student | null>(null);

  // View State
  const [activeView, setActiveView] = useState('dashboard');
  const [studentViewMode, setStudentViewMode] = useState<'profile' | 'leaderboard'>('profile');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  
  // Filter State
  const [selectedGrade, setSelectedGrade] = useState('All');

  // UI State
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [newStudentData, setNewStudentData] = useState({ name: '', grade: 'الصف السادس' });

  // Computed: Filter students based on grade
  const filteredStudents = useMemo(() => {
    if (selectedGrade === 'All') return students;
    return students.filter(s => s.grade === selectedGrade);
  }, [selectedGrade, students]);

  // Derived: Current student object for detailed view
  const selectedStudent = useMemo(() => {
    return students.find(s => s.id === selectedStudentId) || null;
  }, [selectedStudentId, students]);

  // Handlers
  const handleLoginTeacher = () => {
    setUserRole('teacher');
    setActiveView('dashboard');
  };

  const handleLoginStudent = (student: Student) => {
    setUserRole('student');
    // Important: Find the fresh version of the student from state
    const currentStudentData = students.find(s => s.id === student.id) || student;
    setCurrentUser(currentStudentData);
    setStudentViewMode('profile');
    setSelectedStudentId(currentStudentData.id);
    setActiveView('student-detail');
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentUser(null);
    setSelectedStudentId(null);
    setSelectedGrade('All');
    setActiveView('dashboard');
    setStudentViewMode('profile');
  };

  const handleStudentSelect = (student: Student) => {
    setSelectedStudentId(student.id);
    setActiveView('student-detail');
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
      // Recalculate levels whenever a student is updated
      const stats = calculateLevelStats(updatedStudent.xp);
      const finalizedStudent = {
          ...updatedStudent,
          level: stats.level,
          xpToNextLevel: stats.xpToNextLevel
      };

      setStudents(prev => prev.map(s => s.id === finalizedStudent.id ? finalizedStudent : s));
  };

  const handleDeleteStudent = (studentId: string) => {
      if (window.confirm('هل أنت متأكد من حذف هذا الطالب نهائياً؟ لا يمكن التراجع عن هذا الإجراء.')) {
          setStudents(prev => prev.filter(s => s.id !== studentId));
          setSelectedStudentId(null);
          setActiveView('students');
      }
  };

  const handleAddStudentSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newId = `s${Date.now()}`; // Simple unique ID
      const newStudent: Student = {
          id: newId,
          name: newStudentData.name,
          grade: newStudentData.grade,
          xp: 0,
          level: 1,
          xpToNextLevel: 1000,
          badges: [],
          assignments: [],
          tests: [],
          attendance: 100,
          strengths: [],
          weaknesses: []
      };

      setStudents(prev => [...prev, newStudent]);
      setIsAddStudentModalOpen(false);
      setNewStudentData({ name: '', grade: 'الصف السادس' });
  };

  if (!userRole) {
    return <LoginScreen onLoginTeacher={handleLoginTeacher} onLoginStudent={handleLoginStudent} />;
  }

  // Teacher View Logic
  if (userRole === 'teacher') {
    return (
      <div className="min-h-screen bg-brand-light text-gray-800 font-sans flex">
        <Sidebar activeView={activeView} setActiveView={(view) => {
            if (view !== 'student-detail') setSelectedStudentId(null);
            setActiveView(view);
        }} />
        
        {/* Logout Button (Floating) */}
        <button onClick={handleLogout} className="fixed bottom-4 right-4 z-50 p-2 bg-white text-gray-500 shadow-lg rounded-full hover:bg-red-50 hover:text-red-500 transition-colors md:right-6 md:bottom-6 border border-gray-100" title="تسجيل الخروج">
            <LogOut className="w-5 h-5" />
        </button>

        <main className="mr-20 md:mr-64 w-full min-h-screen transition-all duration-300">
           {activeView === 'student-detail' && selectedStudent ? (
              <StudentDetail 
                student={selectedStudent} 
                onBack={() => {
                    setSelectedStudentId(null);
                    setActiveView('students'); // Return to students list
                }}
                isTeacher={true}
                onUpdateStudent={handleUpdateStudent}
                onDeleteStudent={handleDeleteStudent}
              />
           ) : activeView === 'students' ? (
              <div className="p-8">
                  <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-gray-800">دليل الطلاب</h2>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <select 
                            value={selectedGrade}
                            onChange={(e) => setSelectedGrade(e.target.value)}
                            className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl outline-none focus:border-brand-purple shadow-sm flex-1 md:flex-none"
                        >
                            <option value="All">جميع الصفوف</option>
                            <option value="الصف السادس">الصف السادس</option>
                            <option value="الصف السابع">الصف السابع</option>
                            <option value="الصف الثامن">الصف الثامن</option>
                        </select>
                        <button 
                            onClick={() => setIsAddStudentModalOpen(true)}
                            className="flex items-center gap-2 bg-brand-orange text-white px-4 py-2 rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-600 transition-colors font-bold whitespace-nowrap"
                        >
                            <UserPlus className="w-5 h-5" /> طالب جديد
                        </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredStudents.map(s => (
                          <div key={s.id} onClick={() => handleStudentSelect(s)} className="bg-white p-4 rounded-2xl border border-gray-100 hover:border-brand-orange shadow-sm hover:shadow-md cursor-pointer flex items-center gap-4 transition-all group">
                              <StudentAvatar name={s.name} className="border border-gray-100" />
                              <div className="text-right">
                                  <h3 className="text-gray-800 font-bold group-hover:text-brand-orange transition-colors">{s.name}</h3>
                                  <p className="text-gray-500 text-xs">{s.grade}</p>
                                  <p className="text-gray-400 text-xs">{s.assignments.length} واجبات</p>
                              </div>
                          </div>
                      ))}
                  </div>

                  {/* Add Student Modal */}
                  {isAddStudentModalOpen && (
                      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                          <div className="bg-white rounded-3xl p-6 w-full max-w-sm animate-slide-up">
                              <div className="flex justify-between items-center mb-6">
                                  <h3 className="text-xl font-bold text-gray-800">إضافة طالب جديد</h3>
                                  <button onClick={() => setIsAddStudentModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                      <X className="w-5 h-5 text-gray-500" />
                                  </button>
                              </div>
                              <form onSubmit={handleAddStudentSubmit} className="space-y-4">
                                  <div>
                                      <label className="block text-sm font-bold text-gray-700 mb-1">اسم الطالب</label>
                                      <input 
                                          required
                                          type="text" 
                                          value={newStudentData.name}
                                          onChange={(e) => setNewStudentData({...newStudentData, name: e.target.value})}
                                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-brand-purple"
                                          placeholder="الاسم الثلاثي"
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-bold text-gray-700 mb-1">الصف</label>
                                      <select 
                                          value={newStudentData.grade}
                                          onChange={(e) => setNewStudentData({...newStudentData, grade: e.target.value})}
                                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-brand-purple"
                                      >
                                          <option value="الصف السادس">الصف السادس</option>
                                          <option value="الصف السابع">الصف السابع</option>
                                          <option value="الصف الثامن">الصف الثامن</option>
                                      </select>
                                  </div>
                                  <button 
                                      type="submit"
                                      className="w-full bg-brand-purple hover:bg-purple-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 mt-2"
                                  >
                                      <Save className="w-5 h-5" /> حفظ البيانات
                                  </button>
                              </form>
                          </div>
                      </div>
                  )}
              </div>
           ) : activeView === 'leaderboard' ? (
              <div className="pt-4">
                 <div className="px-8 flex justify-end">
                    <select 
                        value={selectedGrade}
                        onChange={(e) => setSelectedGrade(e.target.value)}
                        className="bg-white border border-gray-200 text-gray-700 px-3 py-1 text-sm rounded-lg outline-none focus:border-brand-purple shadow-sm"
                    >
                        <option value="All">جميع الصفوف</option>
                        <option value="الصف السادس">الصف السادس</option>
                        <option value="الصف السابع">الصف السابع</option>
                        <option value="الصف الثامن">الصف الثامن</option>
                    </select>
                 </div>
                 <Leaderboard students={filteredStudents} />
              </div>
           ) : (
              <Dashboard 
                students={filteredStudents} 
                onSelectStudent={handleStudentSelect} 
                selectedGrade={selectedGrade}
                onGradeChange={setSelectedGrade}
              />
           )}
        </main>
      </div>
    );
  }

  // Student View Logic
  if (userRole === 'student' && currentUser) {
      // Find the student object in the live state to ensure updates are reflected
      const liveStudentData = students.find(s => s.id === currentUser.id) || currentUser;
      const classMates = students.filter(s => s.grade === liveStudentData.grade);

      return (
          <div className="min-h-screen bg-brand-light text-gray-800 font-sans">
              <nav className="bg-white border-b border-gray-100 p-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg text-brand-purple">بوابة الطالب - سجل المهارات والتقنية الرقمية</span>
                  </div>
                  <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-orange transition-colors">
                      <LogOut className="w-4 h-4" /> خروج
                  </button>
              </nav>
              <div className="container mx-auto max-w-5xl pt-6">
                {studentViewMode === 'profile' ? (
                    <StudentDetail 
                        student={liveStudentData} 
                        onBack={() => setStudentViewMode('leaderboard')} 
                    />
                ) : (
                    <div className="animate-fade-in">
                        <button 
                            onClick={() => setStudentViewMode('profile')}
                            className="mx-8 mb-4 flex items-center gap-2 text-gray-500 hover:text-brand-orange font-bold transition-colors"
                        >
                            <ArrowRight className="w-5 h-5" /> العودة لملفي الشخصي
                        </button>
                        <Leaderboard students={classMates} currentStudentId={liveStudentData.id} />
                    </div>
                )}
              </div>
          </div>
      );
  }

  return null;
};

export default App;