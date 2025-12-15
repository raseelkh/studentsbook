import React from 'react';
import { Student } from '../types';
import { TrendingUp, Users, BookOpen, Award, ArrowLeft, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import StudentAvatar from './StudentAvatar';

interface DashboardProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  selectedGrade: string;
  onGradeChange: (grade: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ students, onSelectStudent, selectedGrade, onGradeChange }) => {
  const grades = ['الكل', 'الصف السادس', 'الصف السابع', 'الصف الثامن'];

  // Calculate aggregate stats
  const averageAttendance = students.length > 0 ? Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / students.length) : 0;
  const totalXP = students.reduce((acc, s) => acc + s.xp, 0);
  const topStudent = students.length > 0 ? students.reduce((prev, current) => (prev.xp > current.xp) ? prev : current) : null;

  // Prepare chart data
  const allAssignments = students.flatMap(s => s.assignments);
  const assignmentTitles = Array.from(new Set(allAssignments.map(a => a.title)));
  
  const chartData = assignmentTitles.map(title => {
    const relevantAssignments = allAssignments.filter(a => a.title === title);
    const avgScore = relevantAssignments.reduce((acc, a) => acc + (a.score / a.maxScore) * 100, 0) / relevantAssignments.length;
    return { name: title, score: Math.round(avgScore) };
  });

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">مركز قيادة الصف</h1>
          <p className="text-gray-500">نظرة عامة على تقدم الطلاب ومشاركتهم.</p>
        </div>
        
        {/* Grade Filter */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
            <Filter className="w-5 h-5 text-brand-purple ml-2" />
            <select 
                value={selectedGrade === 'All' ? 'الكل' : (selectedGrade === '6th Grade' ? 'الصف السادس' : (selectedGrade === '7th Grade' ? 'الصف السابع' : 'الصف الثامن'))}
                onChange={(e) => {
                    const val = e.target.value;
                    const mapped = val === 'الكل' ? 'All' : (val === 'الصف السادس' ? '6th Grade' : (val === 'الصف السابع' ? '7th Grade' : '8th Grade'));
                    onGradeChange(mapped);
                }}
                className="bg-transparent text-gray-700 font-bold outline-none cursor-pointer pl-4"
            >
                {grades.map(g => <option key={g} value={g} className="text-gray-700">{g === 'الكل' ? 'جميع الصفوف' : g}</option>)}
            </select>
        </div>
      </div>

      {/* Key Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            icon={Users} 
            label="الطلاب النشطين" 
            value={students.length.toString()} 
            color="text-blue-500"
            bg="bg-blue-50"
        />
        <StatCard 
            icon={TrendingUp} 
            label="متوسط الحضور" 
            value={`${averageAttendance}%`} 
            color="text-green-500"
            bg="bg-green-50"
        />
        <StatCard 
            icon={Award} 
            label="مجموع نقاط XP" 
            value={totalXP.toLocaleString()} 
            color="text-purple-500"
            bg="bg-purple-50"
        />
         <StatCard 
            icon={BookOpen} 
            label="المبرمج الأول" 
            value={topStudent ? topStudent.name.split(' ')[0] : '-'} 
            subtext={topStudent ? `مستوى ${topStudent.level}` : ''}
            color="text-brand-orange"
            bg="bg-orange-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-purple" />
            أداء الواجبات المنزلية
          </h2>
          <div className="h-64 w-full" dir="ltr"> 
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} />
                <YAxis stroke="#94a3b8" tick={{fontSize: 12}} orientation="left" /> 
                <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#F1F5F9', color: '#1F2937', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#9D7BFF' }}
                    cursor={{fill: '#F3F0FF'}}
                />
                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.score > 85 ? '#10B981' : entry.score > 70 ? '#3B82F6' : '#FF6B4A'} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Student List */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-4">الطلاب {selectedGrade !== 'All' && `(${selectedGrade === '6th Grade' ? 'الصف السادس' : (selectedGrade === '7th Grade' ? 'الصف السابع' : 'الصف الثامن')})`}</h2>
            <div className="flex-1 overflow-y-auto pl-2 space-y-3 max-h-[400px]">
                {students.map(student => (
                    <div 
                        key={student.id} 
                        onClick={() => onSelectStudent(student)}
                        className="group flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-purple-50 border border-gray-100 hover:border-brand-purple/30 cursor-pointer transition-all duration-200"
                    >
                        <div className="flex items-center gap-3">
                            <StudentAvatar 
                                name={student.name} 
                                size="sm" 
                                className="group-hover:border-brand-purple transition-colors" 
                            />
                            <div>
                                <p className="font-bold text-gray-800 group-hover:text-brand-purple">{student.name}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <span className="bg-gray-100 px-2 py-0.5 rounded-full text-brand-purple font-bold">Lvl {student.level}</span>
                                    <span>{student.xp} XP</span>
                                </div>
                            </div>
                        </div>
                        <ArrowLeft className="w-5 h-5 text-gray-300 group-hover:text-brand-orange transition-transform group-hover:-translate-x-1" />
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, subtext, color, bg }: any) => (
    <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${bg} ${color}`}>
                <Icon className={`w-6 h-6`} />
            </div>
            <div>
                <p className="text-gray-400 text-sm font-bold">{label}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-black text-gray-800">{value}</h3>
                    {subtext && <span className="text-xs text-gray-500 font-medium">{subtext}</span>}
                </div>
            </div>
        </div>
    </div>
);

export default Dashboard;