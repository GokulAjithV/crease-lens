import React from 'react';
import { CalendarDays, BarChart2, FileText } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const BatBallIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width="24" height="24">
    <path d="M14 4l6 6-11 11-6-6L14 4z" />
    <circle cx="18" cy="18" r="2" fill="currentColor" stroke="none" />
  </svg>
);

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: 'matches', icon: BatBallIcon, label: 'MATCHES', path: '/' },
    { id: 'scores', icon: CalendarDays, label: 'SCORES', path: '/scores' },
    { id: 'stats', icon: BarChart2, label: 'STATS', path: '/stats' },
    { id: 'news', icon: FileText, label: 'NEWS', path: '/news' }
  ];

  return (
    <div className="fixed bottom-0 w-full max-w-[390px] bg-[#0e0e0e] rounded-t-[2rem] pt-4 pb-6 px-6 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
      <div className="flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path !== '/' && location.pathname.startsWith(item.path));
          const Icon = item.icon;
          
          if (isActive) {
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-1 bg-[#281b40] py-2 px-6 rounded-2xl transition-all"
              >
                <Icon className="text-[#d8b4fe]" />
                <span className="text-[10px] font-bold text-[#d8b4fe] tracking-wider">{item.label}</span>
              </button>
            );
          }
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 py-2 px-2 transition-colors text-[#565555] hover:text-[#a3a3a3]"
            >
              <Icon className="text-[#565555]" />
              <span className="text-[10px] font-bold tracking-wider">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
