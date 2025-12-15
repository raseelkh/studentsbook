import React from 'react';
import { Student } from '../types';
import { Trophy, Crown, Star, MoreVertical } from 'lucide-react';
import StudentAvatar from './StudentAvatar';

interface LeaderboardProps {
  students: Student[];
  currentStudentId?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ students, currentStudentId }) => {
  const sortedStudents = [...students].sort((a, b) => b.xp - a.xp);
  const topThree = sortedStudents.slice(0, 3);
  const restOfStudents = sortedStudents.slice(3); // Students from rank 4 onwards
  
  // Find current student's rank and data
  const userRankIndex = sortedStudents.findIndex(s => s.id === currentStudentId);
  const userRank = userRankIndex + 1;
  const isUserInTopThree = userRankIndex !== -1 && userRankIndex < 3;
  const userData = userRankIndex !== -1 ? sortedStudents[userRankIndex] : null;

  const isTeacherView = !currentStudentId;

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in max-w-5xl mx-auto">
      <div className="text-center mb-20 md:mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">قاعة المشاهير</h2>
        <p className="text-gray-500">نحتفل بأبطال الكود لهذا الفصل</p>
      </div>

      {/* Podium */}
      <div className="flex justify-center items-end gap-4 mb-12 h-64 md:h-80 pb-4">
        {/* 2nd Place */}
        {topThree[1] && (
          <div className={`flex flex-col items-center animate-slide-up ${currentStudentId === topThree[1].id ? 'scale-105' : ''}`} style={{ animationDelay: '0.1s' }}>
            <div className="flex flex-col items-center mb-3">
               <StudentAvatar 
                  name={topThree[1].name} 
                  size="lg" 
                  className={`border-4 shadow-md ${currentStudentId === topThree[1].id ? 'border-brand-purple' : 'border-gray-200'}`} 
               />
               <p className={`font-bold mt-2 ${currentStudentId === topThree[1].id ? 'text-brand-purple' : 'text-gray-700'}`}>{topThree[1].name}</p>
               <p className="text-brand-purple text-sm font-bold">{topThree[1].xp} XP</p>
            </div>
            <div className="w-24 md:w-32 h-32 md:h-40 bg-gradient-to-t from-gray-200 to-gray-100 rounded-t-2xl border-t-4 border-gray-300 flex flex-col justify-end items-center pb-4 shadow-sm">
               <span className="text-4xl font-black text-gray-400">2</span>
            </div>
          </div>
        )}

        {/* 1st Place */}
        {topThree[0] && (
          <div className={`flex flex-col items-center z-10 animate-slide-up ${currentStudentId === topThree[0].id ? 'scale-105' : ''}`}>
            <div className="relative mb-3 flex flex-col items-center">
               <Crown className="w-10 h-10 text-yellow-400 absolute -top-12 animate-bounce drop-shadow-md" />
               <StudentAvatar 
                  name={topThree[0].name} 
                  size="xl" 
                  className={`border-4 shadow-xl ${currentStudentId === topThree[0].id ? 'border-brand-purple' : 'border-yellow-400'}`} 
               />
               <p className={`font-bold mt-2 text-lg ${currentStudentId === topThree[0].id ? 'text-brand-purple' : 'text-gray-900'}`}>{topThree[0].name}</p>
               <p className="text-yellow-500 text-sm font-black">{topThree[0].xp} XP</p>
            </div>
            <div className="w-28 md:w-40 h-48 md:h-60 bg-gradient-to-t from-yellow-100 to-yellow-50 rounded-t-2xl border-t-4 border-yellow-400 flex flex-col justify-end items-center pb-4 shadow-xl shadow-yellow-500/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-white opacity-30"></div>
                <Trophy className="w-12 h-12 text-yellow-500 mb-2" />
               <span className="text-5xl font-black text-yellow-600/30">1</span>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {topThree[2] && (
          <div className={`flex flex-col items-center animate-slide-up ${currentStudentId === topThree[2].id ? 'scale-105' : ''}`} style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-col items-center mb-3">
               <StudentAvatar 
                  name={topThree[2].name} 
                  size="lg" 
                  className={`border-4 shadow-md ${currentStudentId === topThree[2].id ? 'border-brand-purple' : 'border-orange-200'}`} 
               />
               <p className={`font-bold mt-2 ${currentStudentId === topThree[2].id ? 'text-brand-purple' : 'text-gray-700'}`}>{topThree[2].name}</p>
               <p className="text-brand-purple text-sm font-bold">{topThree[2].xp} XP</p>
            </div>
            <div className="w-24 md:w-32 h-24 md:h-32 bg-gradient-to-t from-orange-100 to-orange-50 rounded-t-2xl border-t-4 border-orange-300 flex flex-col justify-end items-center pb-4 shadow-sm">
               <span className="text-4xl font-black text-orange-800/20">3</span>
            </div>
          </div>
        )}
      </div>

      {/* STUDENT VIEW: User Rank (Only if logged in and not in top 3) */}
      {!isTeacherView && userData && !isUserInTopThree && (
        <div className="max-w-3xl mx-auto animate-fade-in">
           <div className="flex justify-center py-4">
                <MoreVertical className="text-gray-300 w-6 h-6" />
           </div>
           
           <div className="flex items-center gap-4 p-4 bg-brand-purple/5 rounded-2xl border-2 border-brand-purple shadow-lg transform hover:scale-[1.02] transition-transform">
                <div className="w-10 font-black text-2xl text-brand-purple flex justify-center">
                   #{userRank}
                </div>
                <StudentAvatar name={userData.name} className="border-2 border-brand-purple" />
                <div className="flex-1 text-right">
                    <div className="flex items-center gap-2">
                        <h3 className="text-gray-900 font-bold text-lg">{userData.name}</h3>
                        <span className="bg-brand-purple text-white text-[10px] px-2 py-0.5 rounded-full font-bold">أنت</span>
                    </div>
                    <p className="text-gray-500 text-xs">مستوى {userData.level} • {userData.grade}</p>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-gray-800 font-mono text-lg">{userData.xp}</span>
                </div>
            </div>
        </div>
      )}

      {/* STUDENT VIEW: Truncated message */}
      {!isTeacherView && sortedStudents.length > 3 && !userData && (
          <p className="text-center text-gray-400 text-sm mt-8">
            ... والمزيد من المبدعين في القائمة!
          </p>
      )}

      {/* TEACHER VIEW: Show ALL remaining students */}
      {isTeacherView && restOfStudents.length > 0 && (
        <div className="max-w-3xl mx-auto mt-8 animate-fade-in">
            <h3 className="text-center text-gray-400 font-bold mb-6 flex items-center justify-center gap-2">
                <Star className="w-4 h-4" /> بقية القائمة
            </h3>
            <div className="space-y-3">
                {restOfStudents.map((student, index) => (
                    <div key={student.id} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-brand-purple/50 shadow-sm transition-all hover:scale-[1.01]">
                         <div className="w-10 font-bold text-gray-400 text-xl flex justify-center">
                            #{index + 4}
                         </div>
                         <StudentAvatar name={student.name} className="border border-gray-100" />
                         <div className="flex-1 text-right">
                             <h3 className="text-gray-800 font-bold">{student.name}</h3>
                             <p className="text-gray-400 text-xs">مستوى {student.level} • {student.grade}</p>
                         </div>
                         <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                             <Star className="w-4 h-4 text-brand-purple" />
                             <span className="font-bold text-gray-700 font-mono">{student.xp}</span>
                         </div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;