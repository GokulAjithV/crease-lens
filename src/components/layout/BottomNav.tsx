import React from 'react';
import { Users, Trophy, Brain, Home } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const BatBallIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width="22" height="22">
    <path d="M14 4l6 6-11 11-6-6L14 4z" />
    <circle cx="18" cy="18" r="2" fill="currentColor" stroke="none" />
  </svg>
);

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: 'home', icon: Home, label: 'HOME', path: '/home' },
    { id: 'matches', icon: BatBallIcon, label: 'MATCHES', path: '/matches' },
    { id: 'teams', icon: Users, label: 'TEAMS', path: '/teams' },
    { id: 'performers', icon: Trophy, label: 'PERFORMERS', path: '/rankings' },
    { id: 'scouting', icon: Brain, label: 'AI SCOUT', path: '/scouting' }
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-[#0e0e0e] rounded-t-[2rem] pt-3 pb-5 px-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.85)] border-t border-[#1f1f1f]">
      <div className="flex justify-between items-center gap-1">
        {navItems.map((item) => {
          const isActive = (() => {
            if (item.id === 'home') {
              return location.pathname === '/home' || location.pathname === '/';
            }
            if (item.id === 'matches') {
              return location.pathname === '/matches' || location.pathname.startsWith('/match');
            }
            if (item.id === 'teams') {
              return location.pathname.startsWith('/team');
            }
            if (item.id === 'performers') {
              return location.pathname === '/rankings';
            }
            if (item.id === 'scouting') {
              return location.pathname === '/scouting';
            }
            return location.pathname === item.path;
          })();

          const Icon = item.icon;
          
          if (isActive) {
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-1 bg-[#281b40] py-2 px-3.5 rounded-2xl transition-all border border-[#a855f7]/30 cursor-pointer"
              >
                <Icon className="text-[#d8b4fe]" />
                <span className="text-[9px] font-black text-[#d8b4fe] tracking-wider uppercase">{item.label}</span>
              </button>
            );
          }
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 py-2 px-3.5 transition-colors text-[#565555] hover:text-[#a3a3a3] cursor-pointer"
            >
              <Icon className="text-[#565555]" />
              <span className="text-[9px] font-bold tracking-wider uppercase">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
