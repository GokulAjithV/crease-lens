import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Plus, RotateCcw, Share2, Trophy, Sparkles, Menu, X, User, BarChart3, Users, Zap, ClipboardList, Radio, LogOut } from 'lucide-react';
import BottomNav from '../components/layout/BottomNav';

const menuItems = [
  { label: 'Player Profile', desc: 'View stats & match history', icon: User, path: '/player/1', color: '#a855f7' },
  { label: 'Rankings', desc: 'Weekly MVPs & leaderboard', icon: BarChart3, path: '/rankings', color: '#22c55e' },
  { label: 'Start New Match', desc: 'Set up teams & begin scoring', icon: Zap, path: '/match/select-team', color: '#fbbf24' },
  { label: 'Manage Teams', desc: 'Create & edit team rosters', icon: Users, path: '/team/add', color: '#3b82f6' },
  { label: 'Live Scorecard', desc: 'View detailed match scorecard', icon: Radio, path: '/match/1/scorecard', color: '#ef4444' },
  { label: 'Match Summary', desc: 'Post-match report & analysis', icon: ClipboardList, path: '/match/1/summary', color: '#f59e0b' },
];

export default function Homepage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Load user from local storage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  let displayName = 'User';
  let initial = 'U';

  if (user?.first_name || user?.last_name || user?.name) {
    const fn = user.first_name || '';
    const ln = user.last_name || '';
    displayName = fn || ln ? `${fn} ${ln}`.trim() : user.name;
    initial = displayName.charAt(0).toUpperCase();
  } else if (user?.phone) {
    displayName = user.phone;
    // Don't use +, get the first digit of the local number roughly (after +91)
    const cleanPhone = user.phone.replace('+91', '').trim();
    initial = cleanPhone ? cleanPhone.charAt(0) : 'U';
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-[#0e0e0e] text-[#ffffff] font-sans relative pb-28 overflow-x-hidden shadow-2xl">

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 bg-[#0e0e0e]">
        <button
          onClick={() => setMenuOpen(true)}
          className="w-10 h-10 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center hover:bg-[#222] active:scale-95 transition-all"
        >
          <Menu size={18} className="text-[#c799ff]" />
        </button>
        <h1 className="text-2xl font-black text-[#c799ff] tracking-wider uppercase">CREASE</h1>
        <div className="w-10 h-10 rounded-full border-2 border-[#a855f7] overflow-hidden flex items-center justify-center bg-[#1a1a1a]">
          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(initial)}&background=1a1a1a&color=fff`} alt={displayName} className="w-full h-full object-cover" />
        </div>
      </header>

      {/* Side Drawer */}
      {menuOpen && (
        <>
          <div onClick={() => setMenuOpen(false)} className="fixed inset-0 bg-[#000]/70 z-[60] backdrop-blur-sm" />
          <div className="fixed top-0 left-0 bottom-0 z-[70] w-[280px] bg-[#111] shadow-[4px_0_30px_rgba(0,0,0,0.6)] animate-drawerSlide flex flex-col">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 pt-6 pb-5 border-b border-[#1a1a1a]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#a855f7] to-[#7c3aed] flex items-center justify-center">
                  <span className="text-sm font-bold text-[#fff]">{initial}</span>
                </div>
                <div>
                  <span className="text-sm font-black text-[#ffffff] block">{displayName}</span>
                  <span className="text-[9px] text-[#565555]">Stadium Noir Player</span>
                </div>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-7 h-7 rounded-full bg-[#1a1a1a] flex items-center justify-center hover:bg-[#242424] transition-colors"
              >
                <X size={14} className="text-[#a3a3a3]" />
              </button>
            </div>

            {/* Drawer Items */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => { setMenuOpen(false); navigate(item.path); }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[#1a1a1a] active:scale-[0.98] transition-all text-left"
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.color + '15' }}>
                    <item.icon size={16} style={{ color: item.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[13px] font-bold text-[#ffffff] block">{item.label}</span>
                    <span className="text-[9px] text-[#565555]">{item.desc}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Drawer Footer */}
            <div className="px-5 py-4 border-t border-[#1a1a1a] flex justify-between items-center">
              <span className="text-[8px] text-[#333] tracking-widest uppercase">Crease Lens v1.0</span>
              <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs text-[#ef4444] font-bold hover:text-[#f87171] transition-colors">
                <LogOut size={12} />
                LOGOUT
              </button>
            </div>
          </div>
        </>
      )}

      {/* Drawer Animation */}
      <style>{`
        @keyframes drawerSlide {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-drawerSlide {
          animation: drawerSlide 0.25s ease-out;
        }
      `}</style>

      <main className="px-4 py-2 space-y-6">
        
        {/* Live Match Card */}
        <section className="bg-gradient-to-br from-[#281b40] to-[#1a1a1a] rounded-2xl p-5 relative border border-[#2a1a3a] shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#a855f7] rounded-b-2xl"></div>
          
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
              <span className="text-[#10b981] text-[10px] font-bold tracking-widest uppercase">Live Match</span>
            </div>
            <div className="bg-[#1f1f1f] px-3 py-1 rounded-md">
              <span className="text-xs font-semibold">T20 League</span>
            </div>
          </div>

          {/* Teams and Score */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full border border-[#a855f7] bg-[#1a1a1a] flex items-center justify-center">
                <span className="font-bold text-lg text-[#c799ff]">RCB</span>
              </div>
              <span className="text-xs font-semibold">Royal Chal</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex items-baseline">
                <span className="text-4xl font-black">184</span>
                <span className="text-xl text-[#a3a3a3] font-bold">/4</span>
              </div>
              <span className="text-[10px] text-[#a3a3a3] font-bold tracking-widest mt-1">OVERS 16.2</span>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full border border-[#333] bg-[#1a1a1a] flex items-center justify-center">
                <span className="font-bold text-lg text-[#a3a3a3]">CSK</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs font-semibold">Super Kings</span>
                <span className="text-[8px] text-[#a855f7] font-bold mt-1 tracking-widest">YET TO BAT</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-[#a3a3a3] font-medium">Run Rate: 11.3</span>
            <button className="bg-[#a855f7] hover:bg-[#c799ff] transition-colors text-[#000000] font-bold py-2 px-4 rounded-full flex items-center gap-2 text-xs">
              <Play size={12} className="fill-black" />
              Watch Live
            </button>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="flex gap-3">
          <div onClick={() => navigate('/match/select-team')} className="flex-1 bg-[#161616] border-l-4 border-[#a855f7] rounded-xl p-4 flex flex-col justify-center cursor-pointer hover:bg-[#1f1f1f] transition-colors h-[90px]">
            <div className="w-6 h-6 rounded-full border border-[#a855f7] flex items-center justify-center mb-2">
              <Plus size={14} className="text-[#a855f7]" />
            </div>
            <span className="text-[11px] font-bold text-[#c799ff]">START MATCH</span>
          </div>
          <div className="flex-[0.8] bg-[#161616] rounded-xl p-4 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-[#1f1f1f] transition-colors h-[90px]">
            <RotateCcw size={20} className="text-[#565555] mb-2" />
            <span className="text-[9px] font-bold text-[#a3a3a3]">RESUME SCORING</span>
          </div>
          <div className="flex-[0.6] bg-[#161616] rounded-xl p-4 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-[#1f1f1f] transition-colors h-[90px]">
            <Share2 size={20} className="text-[#565555] mb-2" />
            <span className="text-[9px] font-bold text-[#a3a3a3]">SHARE</span>
          </div>
        </section>

        {/* Weekly MVPs */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold tracking-widest uppercase">WEEKLY MVPS</h3>
            <button onClick={() => navigate('/rankings')} className="text-[#a855f7] text-xs font-bold tracking-widest uppercase">VIEW ALL</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="min-w-[100px] bg-[#161616] border border-[#2d1b4e] rounded-2xl p-4 flex flex-col items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-2 bg-[#4af8e3] rounded-bl-lg"></div>
              <div className="w-12 h-12 rounded-full bg-[#a855f7] flex items-center justify-center mb-3">
                <span className="text-lg font-bold text-[#000000]">VK</span>
              </div>
              <span className="font-bold text-xs mb-1">V. Kohli</span>
              <div className="flex items-center gap-1 text-[10px]">
                <span className="text-[#a855f7] font-bold">482 pts</span>
                <span className="text-[#4af8e3] font-bold text-[8px]">↑2</span>
              </div>
            </div>
            
            <div className="min-w-[100px] bg-[#161616] rounded-2xl p-4 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#f59e0b] flex items-center justify-center mb-3">
                <span className="text-lg font-bold text-[#000000]">RS</span>
              </div>
              <span className="font-bold text-xs mb-1">R. Sharma</span>
              <div className="flex items-center gap-1 text-[10px]">
                <span className="text-[#a3a3a3] font-bold">410 pts</span>
                <span className="text-[#ef4444] font-bold text-[8px]">↓1</span>
              </div>
            </div>
            
            <div className="min-w-[100px] bg-[#161616] rounded-2xl p-4 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#10b981] flex items-center justify-center mb-3">
                <span className="text-lg font-bold text-[#000000]">HP</span>
              </div>
              <span className="font-bold text-xs mb-1">H. Pandya</span>
              <div className="flex items-center gap-1 text-[10px]">
                <span className="text-[#a3a3a3] font-bold">385 pts</span>
                <span className="text-[#565555] font-bold text-[8px]">-</span>
              </div>
            </div>
          </div>
        </section>

        {/* AI Insight Teaser */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#c799ff] fill-[#c799ff]/20" />
              <h3 className="text-sm font-bold tracking-widest uppercase m-0 text-[#ffffff]">AI INSIGHT</h3>
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#2d1b4e]/40 to-[#1a1a1a] border border-[#2d1b4e] rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute -top-8 -right-4 text-[#c799ff]/5 transform rotate-12">
              <Sparkles size={120} />
            </div>
            
            <p className="text-[13px] text-[#e5e2e1] leading-relaxed italic relative z-10 m-0 mb-4 font-sans">
              "RCB's middle order looks vulnerable against spin. Recommending bringing on early slow bowlers in the next match."
            </p>
            
            <div className="flex justify-between items-center relative z-10 border-t border-[#2d1b4e] pt-3 mt-1">
              <div className="bg-[#1a1a1a] px-2 py-1 rounded border border-[#2d1b4e]">
                <span className="text-[9px] text-[#a3a3a3] font-bold tracking-widest uppercase">MATCH PREVIEW</span>
              </div>
              <button className="text-[#c799ff] text-[10px] font-bold tracking-widest uppercase flex items-center gap-1 hover:text-[#d8b4fe] transition-colors">
                FULL REPORT
                <Sparkles size={10} />
              </button>
            </div>
          </div>
        </section>

        {/* Recent Battles */}
        <section>
          <div className="mb-4">
            <h3 className="text-sm font-bold tracking-widest uppercase">RECENT BATTLES</h3>
          </div>
          <div className="bg-[#161616] rounded-2xl p-4">
            <div className="flex justify-between items-center mb-5">
              <div className="bg-[#2d1b4e] px-3 py-1 rounded-full">
                <span className="text-[#c799ff] text-[9px] font-bold tracking-widest uppercase">TOURNAMENT FINAL</span>
              </div>
              <Trophy size={14} className="text-[#f59e0b] fill-[#f59e0b]" />
            </div>
            
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#242424] flex items-center justify-center">
                  <span className="text-[8px] font-bold text-[#a3a3a3]">MI</span>
                </div>
                <span className="font-bold text-sm">Mumbai I.</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-sm text-[#ffffff] mr-1">165/8</span>
                <span className="text-[10px] text-[#a3a3a3] font-bold">(20.0)</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#242424] flex items-center justify-center">
                  <span className="text-[8px] font-bold text-[#a3a3a3]">DC</span>
                </div>
                <span className="font-bold text-sm text-[#a3a3a3]">Delhi C.</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-sm text-[#a3a3a3] mr-1">152/9</span>
                <span className="text-[10px] text-[#a3a3a3] font-bold">(20.0)</span>
              </div>
            </div>
            
            <div className="text-left">
              <span className="text-[#565555] text-xs font-semibold">MI won by 13 runs</span>
            </div>
          </div>
        </section>

      </main>

      <BottomNav />
    </div>
  );
}

