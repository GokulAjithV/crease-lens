import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronUp, ChevronDown, Minus, Star, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/layout/BottomNav';

export default function Rankings() {
  const navigate = useNavigate();
  const [timeTab, setTimeTab] = useState('Weekly');
  const [categoryTab, setCategoryTab] = useState('Overall');

  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const timeTabs = ['Weekly', 'Monthly', 'All-Time'];
  const categoryTabs = ['Overall', 'Batsmen', 'Bowlers', 'All-Rounders'];

  const timePeriodMap: Record<string, string> = {
    'Weekly': 'weekly',
    'Monthly': 'monthly',
    'All-Time': 'all_time'
  };

  const categoryMap: Record<string, string> = {
    'Overall': 'overall',
    'Batsmen': 'batting',
    'Bowlers': 'bowling',
    'All-Rounders': 'all_rounder'
  };

  // Load user from local storage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true);
        setError('');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const token = localStorage.getItem('token');

        const period = timePeriodMap[timeTab] || 'all_time';
        const category = categoryMap[categoryTab] || 'overall';

        const res = await fetch(`${API_URL}/api/leaderboard?category=${category}&period=${period}&limit=25`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          }
        });

        if (!res.ok) {
          throw new Error('Failed to load rankings');
        }

        const json = await res.json();
        setPlayers(json.data || []);
      } catch (err: any) {
        setError(err.message || 'An error occurred loading rankings');
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [timeTab, categoryTab]);

  const userRankIndex = players.findIndex((p: any) => p.id === user?.id);
  const userRank = userRankIndex !== -1 ? userRankIndex + 1 : 42;
  const userRating = userRankIndex !== -1 ? players[userRankIndex].rating : '1,482';
  const userWinRate = userRankIndex !== -1 ? players[userRankIndex].winRate : '75%';

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-[#121212] text-[#ffffff] font-sans relative pb-28 overflow-x-hidden shadow-2xl">
      
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 bg-[#121212]">
        <button onClick={() => navigate(-1)} className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-[#ffffff] m-0 font-headline absolute left-1/2 -translate-x-1/2">Rankings</h1>
        <div className="w-5"></div> {/* Placeholder for balance */}
      </header>
      
      <main className="px-4 py-2 space-y-6">
        
        {/* Time Tabs */}
        <div className="flex bg-[#1a1a1a] rounded-full p-1 mb-2">
          {timeTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setTimeTab(tab)}
              className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${
                timeTab === tab 
                  ? 'bg-[#2a2a2a] text-[#ffffff]' 
                  : 'text-[#a3a3a3] hover:text-[#ffffff]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categoryTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setCategoryTab(tab)}
              className={`px-4 py-1.5 rounded-full whitespace-nowrap text-xs font-bold transition-colors ${
                categoryTab === tab 
                  ? 'bg-[#a855f7] text-[#ffffff]' 
                  : 'bg-[#1a1a1a] text-[#a3a3a3] hover:bg-[#2a2a2a]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Scrollbar Indicator (Optional visual element from design) */}
        <div className="flex items-center justify-between px-1 text-[#565555]">
          <div className="w-0.5 h-2 bg-[#565555]"></div>
          <div className="h-1.5 flex-1 mx-2 bg-[#565555] rounded-full"></div>
          <div className="w-0.5 h-2 bg-[#565555]"></div>
        </div>

        {/* Your Current Rank Card */}
        <section className="bg-gradient-to-br from-[#30234d] to-[#221738] rounded-3xl p-5 border border-[#3d2c60]">
          <h3 className="text-xs font-bold text-[#a3a3a3] tracking-widest uppercase text-center mb-2">YOUR CURRENT RANK</h3>
          
          <div className="flex justify-center items-center gap-3 mb-6">
            <span className="text-5xl font-black text-[#ffffff] font-headline tracking-tighter">#{userRank}</span>
            <div className="bg-[#10b981]/20 px-2 py-1 rounded-full flex items-center gap-1 border border-[#10b981]/30">
              <ChevronUp size={12} className="text-[#10b981]" />
              <span className="text-[#10b981] text-[10px] font-bold">{userRank <= 3 ? 'Top Performer' : 'Active Scorer'}</span>
            </div>
          </div>

          <div className="bg-[#0e0e0e] rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#242424] flex items-center justify-center overflow-hidden border border-[#333]">
                 <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.first_name || 'User')}&background=242424&color=fff`} alt="User" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-[#ffffff]">{user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Crease Scorer' : 'Alex Mercer'}</span>
                <span className="text-xs text-[#a3a3a3]">{userWinRate} Win Rate</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-[#a3a3a3] font-bold">Rating</span>
              <span className="font-bold text-sm text-[#ffffff]">{userRating}</span>
            </div>
          </div>
        </section>

        {/* Top Players List */}
        <section>
          <h3 className="text-xs font-bold text-[#a3a3a3] tracking-widest uppercase mb-4 px-1">TOP PLAYERS</h3>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <Loader2 className="text-[#a855f7] animate-spin" size={20} />
              <span className="text-[9px] text-[#565555] font-bold tracking-widest uppercase">Fetching standings...</span>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-3 rounded-xl text-center">
              {error}
            </div>
          ) : players.length === 0 ? (
            <div className="text-center py-10 text-xs text-[#565555]">
              No players found in this category.
            </div>
          ) : (
            <div className="space-y-4">
              {players.map((player) => (
                <div 
                  key={player.rank} 
                  onClick={() => navigate(`/player/${player.id}`)}
                  className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-[#161616] active:scale-[0.99] transition-all cursor-pointer"
                >
                  
                  <div className="flex items-center gap-4">
                    <span className="text-base font-bold text-[#ffffff] w-4 text-center">{player.rank}</span>
                    <div className="relative">
                      <div 
                        className="w-12 h-12 rounded-full border border-[#333] flex items-center justify-center overflow-hidden text-[#ffffff] text-sm font-black"
                        style={{ backgroundColor: player.avatar_color || '#1a1a1a' }}
                      >
                        {player.name ? player.name.split(' ').map((w: any) => w[0]).join('').toUpperCase() : '??'}
                      </div>
                      {player.rank === 1 && (
                        <div className="absolute -bottom-1 -right-1 bg-[#1a1a1a] rounded-full p-0.5">
                          <Star size={12} className="fill-[#f59e0b] text-[#f59e0b]" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-sm text-[#ffffff]">{player.name}</span>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${player.badgeColor || 'bg-[#242424] text-[#a3a3a3]'}`}>
                          {player.badge}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#a3a3a3] font-semibold">{player.sub_label}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-center">
                    <span className="font-bold text-sm text-[#c799ff]">{player.rating}</span>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {player.trend === 'up' && <ChevronUp size={10} className="text-[#10b981]" />}
                      {player.trend === 'down' && <ChevronDown size={10} className="text-[#ef4444]" />}
                      {player.trend === 'up' && <span className="text-[#10b981] text-[10px] font-bold">{player.trendVal}</span>}
                      {player.trend === 'down' && <span className="text-[#ef4444] text-[10px] font-bold">{player.trendVal}</span>}
                      {player.trend === 'same' && <Minus size={10} className="text-[#565555]" />}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      <BottomNav />
    </div>
  );
}
