import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Plus, RotateCcw, Share2, Trophy, Sparkles, Menu, X, User, BarChart3, Users, Zap, ClipboardList, Radio, LogOut, Loader2 } from 'lucide-react';
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
  
  const [liveMatches, setLiveMatches] = useState<any[]>([]);
  const [loadingLive, setLoadingLive] = useState(true);

  useEffect(() => {
    async function fetchLiveMatches() {
      try {
        setLoadingLive(true);
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const res = await fetch(`${API_URL}/api/matches/live`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.data) {
            setLiveMatches(data.data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch live matches', err);
      } finally {
        setLoadingLive(false);
      }
    }
    fetchLiveMatches();
  }, []);

  const handleResumeScoring = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('token');
      
      const res = await fetch(`${API_URL}/api/matches?limit=20`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        }
      });
      if (res.ok) {
        const data = await res.json();
        const matchesList = data.data || [];
        
        // Find latest match created by user that is not completed or abandoned
        const resumeMatch = matchesList.find(
          (m: any) => m.created_by === user?.id && !['completed', 'abandoned'].includes(m.status)
        );
        
        if (resumeMatch) {
          if (resumeMatch.status === 'setup') {
            navigate(`/match/${resumeMatch.id}/toss`);
          } else if (resumeMatch.status === 'toss') {
            navigate(`/match/${resumeMatch.id}/playing-xi/${resumeMatch.team_a_id}`);
          } else {
            navigate(`/match/${resumeMatch.id}/scoring`);
          }
        } else {
          alert('No active matches found to resume. Start a new match!');
          navigate('/match/select-team');
        }
      }
    } catch (err) {
      console.error('Failed to resume scoring', err);
    }
  };

  // Load user from local storage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  let displayName = 'User';
  let initial = 'U';

  if (user?.first_name || user?.last_name || user?.full_name || user?.name) {
    const fn = user.first_name || '';
    const ln = user.last_name || '';
    displayName = fn || ln ? `${fn} ${ln}`.trim() : (user.full_name || user.name);
    
    if (fn && ln) {
      initial = (fn.charAt(0) + ln.charAt(0)).toUpperCase();
    } else {
      const parts = displayName.trim().split(/\s+/);
      if (parts.length > 1) {
        initial = (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
      } else {
        initial = displayName.charAt(0).toUpperCase();
      }
    }
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
        {loadingLive ? (
          <section className="bg-[#161616] rounded-2xl p-6 border border-[#222] flex flex-col items-center justify-center py-12 gap-2">
            <Loader2 className="animate-spin text-[#a855f7]" size={24} />
            <span className="text-xs text-[#a3a3a3]">Checking live matches...</span>
          </section>
        ) : liveMatches.length === 0 ? (
          <section className="bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-2xl p-5 border border-[#222] shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center text-center gap-4 py-8 relative">
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#565555] rounded-b-2xl"></div>
            <div className="w-12 h-12 rounded-full bg-[#a855f7]/10 flex items-center justify-center">
              <Zap size={24} className="text-[#a855f7]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">No Live Matches</h4>
              <p className="text-xs text-[#a3a3a3] mt-1 max-w-[240px] leading-relaxed">
                Create a new match and start scoring to see live updates.
              </p>
            </div>
            <button
              onClick={() => navigate('/match/select-team')}
              className="bg-[#a855f7] hover:bg-[#c799ff] text-black font-bold py-2 px-6 rounded-full text-xs transition-colors shadow-lg"
            >
              Start Match
            </button>
          </section>
        ) : (() => {
          const match = liveMatches[0];
          const teamA = match.team_a;
          const teamB = match.team_b;
          const innings = match.current_innings;
          
          let isTeamABatting = false;
          let isTeamBBatting = false;
          let runs = 0;
          let wickets = 0;
          let overs = "0.0";
          
          if (innings) {
            isTeamABatting = innings.batting_team_id === teamA.id;
            isTeamBBatting = innings.batting_team_id === teamB.id;
            runs = innings.total_runs || 0;
            wickets = innings.total_wickets || 0;
            overs = String(innings.overs_played || "0.0");
          }

          // Simple run rate helper
          const floatOvers = parseFloat(overs) || 0.0;
          const totalBalls = Math.floor(floatOvers) * 6 + Math.round((floatOvers - Math.floor(floatOvers)) * 10);
          const runRate = totalBalls > 0 ? ((runs / totalBalls) * 6).toFixed(1) : "0.0";

          return (
            <section className="bg-gradient-to-br from-[#281b40] to-[#1a1a1a] rounded-2xl p-5 relative border border-[#2a1a3a] shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#a855f7] rounded-b-2xl"></div>
              
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></div>
                  <span className="text-[#10b981] text-[10px] font-bold tracking-widest uppercase">Live Match</span>
                </div>
                <div className="bg-[#1f1f1f] px-3 py-1 rounded-md">
                  <span className="text-xs font-semibold">{match.match_type || 'T20'}</span>
                </div>
              </div>

              {/* Teams and Score */}
              <div className="flex justify-between items-center mb-6">
                {/* Team A */}
                <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                  <div 
                    className="w-14 h-14 rounded-full border flex items-center justify-center"
                    style={{ 
                      backgroundColor: '#1a1a1a', 
                      borderColor: isTeamABatting ? teamA.color : '#333'
                    }}
                  >
                    <span 
                      className="font-bold text-lg" 
                      style={{ color: isTeamABatting ? '#ffffff' : '#a3a3a3' }}
                    >
                      {teamA.initials}
                    </span>
                  </div>
                  <span className="text-xs font-semibold truncate w-full text-center">{teamA.name}</span>
                  {isTeamABatting && (
                    <span className="text-[8px] bg-[#a855f7]/25 text-[#c799ff] font-bold px-1.5 py-0.5 rounded">BATTING</span>
                  )}
                </div>
                
                {/* Center score */}
                <div className="flex flex-col items-center justify-center px-2">
                  {innings ? (
                    <>
                      <div className="flex items-baseline">
                        <span className="text-4xl font-black">{runs}</span>
                        <span className="text-xl text-[#a3a3a3] font-bold">/{wickets}</span>
                      </div>
                      <span className="text-[10px] text-[#a3a3a3] font-bold tracking-widest mt-1">OVERS {overs}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl font-black text-[#565555]">VS</span>
                      <span className="text-[8px] text-[#a855f7] font-bold mt-1 tracking-widest uppercase">
                        {match.status}
                      </span>
                    </>
                  )}
                </div>
                
                {/* Team B */}
                <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                  <div 
                    className="w-14 h-14 rounded-full border flex items-center justify-center"
                    style={{ 
                      backgroundColor: '#1a1a1a', 
                      borderColor: isTeamBBatting ? teamB.color : '#333'
                    }}
                  >
                    <span 
                      className="font-bold text-lg" 
                      style={{ color: isTeamBBatting ? '#ffffff' : '#a3a3a3' }}
                    >
                      {teamB.initials}
                    </span>
                  </div>
                  <span className="text-xs font-semibold truncate w-full text-center">{teamB.name}</span>
                  {isTeamBBatting && (
                    <span className="text-[8px] bg-[#a855f7]/25 text-[#c799ff] font-bold px-1.5 py-0.5 rounded">BATTING</span>
                  )}
                  {!isTeamABatting && !isTeamBBatting && (
                    <span className="text-[8px] text-[#565555] font-bold mt-1 tracking-widest">YET TO BAT</span>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-[#a3a3a3] font-medium">Run Rate: {runRate}</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate(`/match/${match.id}/scorecard`)}
                    className="bg-[#1f1f1f] border border-[#333] hover:bg-[#2a2a2a] text-[#ffffff] font-bold py-2 px-4 rounded-full flex items-center gap-2 text-xs transition-colors"
                  >
                    <Play size={12} className="fill-[#fff]" />
                    Watch
                  </button>
                  {match.created_by === user?.id && (
                    <button 
                      onClick={() => {
                        if (match.status === 'setup') {
                          navigate(`/match/${match.id}/toss`);
                        } else if (match.status === 'toss') {
                          navigate(`/match/${match.id}/playing-xi/${match.team_a.id}`);
                        } else {
                          navigate(`/match/${match.id}/scoring`);
                        }
                      }}
                      className="bg-[#a855f7] hover:bg-[#c799ff] text-[#000000] font-bold py-2 px-4 rounded-full flex items-center gap-2 text-xs transition-colors"
                    >
                      <RotateCcw size={12} />
                      Score
                    </button>
                  )}
                </div>
              </div>
            </section>
          );
        })()}

        {/* Quick Actions */}
        <section className="flex gap-3">
          <div onClick={() => navigate('/match/select-team')} className="flex-1 bg-[#161616] border-l-4 border-[#a855f7] rounded-xl p-4 flex flex-col justify-center cursor-pointer hover:bg-[#1f1f1f] transition-colors h-[90px]">
            <div className="w-6 h-6 rounded-full border border-[#a855f7] flex items-center justify-center mb-2">
              <Plus size={14} className="text-[#a855f7]" />
            </div>
            <span className="text-[11px] font-bold text-[#c799ff]">START MATCH</span>
          </div>
          <div onClick={handleResumeScoring} className="flex-[0.8] bg-[#161616] rounded-xl p-4 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-[#1f1f1f] transition-colors h-[90px]">
            <RotateCcw size={20} className="text-[#a855f7] mb-2" />
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

