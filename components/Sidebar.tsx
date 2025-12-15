import React from 'react';
import { LayoutDashboard, Users, Trophy, Code2 } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'لوحة القيادة', icon: LayoutDashboard },
    { id: 'students', label: 'جميع الطلاب', icon: Users },
    { id: 'leaderboard', label: 'لوحة المتصدرين', icon: Trophy },
  ];

  return (
    <div className="w-20 md:w-64 bg-white border-l border-gray-100 flex flex-col h-screen fixed right-0 top-0 z-10 transition-all duration-300 shadow-sm">
      <div className="p-6 flex items-center justify-center md:justify-start gap-3 border-b border-gray-100">
        <div className="p-2 bg-brand-orange rounded-xl shadow-lg shadow-orange-500/20 shrink-0">
           <Code2 className="text-white w-6 h-6" />
        </div>
        <span className="text-sm font-bold text-gray-800 hidden md:block tracking-tight leading-tight">سجل المهارات والتقنية الرقمية</span>
      </div>

      <nav className="flex-1 py-6 space-y-2 px-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-bold ${
              activeView === item.id
                ? 'bg-brand-purple text-white shadow-lg shadow-purple-500/30'
                : 'text-gray-400 hover:bg-purple-50 hover:text-brand-purple'
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeView === item.id ? 'text-white' : 'text-gray-400 group-hover:text-brand-purple'}`} />
            <span className="hidden md:block">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;