import React, { useState } from 'react';
import { User, ShieldCheck, ArrowLeft, Code2, Lock } from 'lucide-react';
import { MOCK_STUDENTS } from '../constants';
import { Student } from '../types';

interface LoginScreenProps {
  onLoginTeacher: () => void;
  onLoginStudent: (student: Student) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginTeacher, onLoginStudent }) => {
  const [mode, setMode] = useState<'selection' | 'student' | 'teacher_auth'>('selection');
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const student = MOCK_STUDENTS.find(s => s.id.toLowerCase() === inputValue.toLowerCase());
    if (student) {
      onLoginStudent(student);
    } else {
      setError('معرف الطالب غير موجود. جرب "s1", "s2"');
    }
  };

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue === '123456') {
      onLoginTeacher();
    } else {
      setError('كلمة المرور غير صحيحة');
    }
  };

  const resetForm = (newMode: 'selection' | 'student' | 'teacher_auth') => {
    setMode(newMode);
    setInputValue('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-gray-100 rounded-[32px] p-8 shadow-2xl shadow-purple-100">
        <div className="flex justify-center mb-6">
            <div className="p-4 bg-brand-purple rounded-3xl shadow-lg shadow-brand-purple/20 rotate-3">
                <Code2 className="w-10 h-10 text-white" />
            </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">سجل المهارات والتقنية الرقمية</h1>
        <p className="text-gray-500 text-center mb-8">اختر بوابتك للمتابعة</p>

        {mode === 'selection' ? (
          <div className="space-y-4">
            <button 
              onClick={() => resetForm('teacher_auth')}
              className="w-full bg-white hover:bg-gray-50 border-2 border-gray-100 hover:border-brand-purple p-4 rounded-2xl flex items-center gap-4 transition-all group shadow-sm hover:shadow-md"
            >
              <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-brand-purple transition-colors">
                <ShieldCheck className="w-6 h-6 text-brand-purple group-hover:text-white" />
              </div>
              <div className="text-right flex-1">
                <h3 className="text-gray-800 font-bold group-hover:text-brand-purple">بوابة المعلم</h3>
                <p className="text-gray-400 text-sm">محمية بكلمة مرور</p>
              </div>
              <Lock className="w-5 h-5 text-gray-300 group-hover:text-brand-purple" />
            </button>

            <button 
              onClick={() => resetForm('student')}
              className="w-full bg-white hover:bg-gray-50 border-2 border-gray-100 hover:border-brand-orange p-4 rounded-2xl flex items-center gap-4 transition-all group shadow-sm hover:shadow-md"
            >
              <div className="p-3 bg-orange-50 rounded-xl group-hover:bg-brand-orange transition-colors">
                <User className="w-6 h-6 text-brand-orange group-hover:text-white" />
              </div>
              <div className="text-right flex-1">
                <h3 className="text-gray-800 font-bold group-hover:text-brand-orange">بوابة الطالب</h3>
                <p className="text-gray-400 text-sm">تحقق من تقدمك والأوسمة</p>
              </div>
              <ArrowLeft className="w-5 h-5 text-gray-300 group-hover:text-brand-orange" />
            </button>
          </div>
        ) : (
          <form onSubmit={mode === 'student' ? handleStudentSubmit : handleTeacherSubmit} className="space-y-6 animate-fade-in">
             <div>
               <label className="block text-gray-600 text-sm font-bold mb-2">
                 {mode === 'student' ? 'أدخل معرف الطالب (ID)' : 'أدخل كلمة مرور المعلم'}
               </label>
               <input 
                 type={mode === 'student' ? 'text' : 'password'}
                 value={inputValue}
                 onChange={(e) => {
                    setInputValue(e.target.value);
                    setError('');
                 }}
                 placeholder={mode === 'student' ? "مثال: s1, s2" : "••••••"}
                 className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-brand-orange focus:bg-white transition-all text-right font-medium"
                 dir="ltr"
                 autoFocus
               />
               {error && <p className="text-red-500 text-xs mt-2 flex items-center gap-1 font-bold"> {error}</p>}
             </div>
             
             <button 
                type="submit"
                className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/30 transition-all hover:scale-[1.02]"
             >
                دخول
             </button>
             
             <button 
                type="button"
                onClick={() => setMode('selection')}
                className="w-full text-gray-400 hover:text-gray-600 text-sm font-medium"
             >
                إلغاء
             </button>
          </form>
        )}
        
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
             <p className="text-gray-400 text-xs">
                {mode === 'teacher_auth' ? 'كلمة المرور للتجربة: 123456' : 'معرفات للتجربة: s1, s2, s3, s4'}
             </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;