import React, { useState } from 'react';
import { ArrowLeft, ChevronUp, ChevronDown, Minus, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/layout/BottomNav';

export default function Rankings() {
  const navigate = useNavigate();
  const [timeTab, setTimeTab] = useState('Weekly');
  const [categoryTab, setCategoryTab] = useState('Overall');

  const timeTabs = ['Weekly', 'Monthly', 'All-Time'];
  const categoryTabs = ['Overall', 'Batsmen', 'Bowlers', 'All-Rounders'];

  const topPlayers = [
    { rank: 1, name: 'Sarah Jenkins', badge: 'ELITE', badgeColor: 'bg-[#f59e0b]/20 text-[#f59e0b]', winRate: '92%', rating: '2,104', trend: 'up', trendVal: '3' },
    { rank: 2, name: 'Marcus Thorne', badge: 'PRO', badgeColor: 'bg-[#a3a3a3]/20 text-[#a3a3a3]', winRate: '88%', rating: '2,089', trend: 'same', trendVal: '-' },
    { rank: 3, name: 'Elena Rostova', badge: 'SKILLED', badgeColor: 'bg-[#d97706]/20 text-[#d97706]', winRate: '85%', rating: '2,015', trend: 'down', trendVal: '1' },
    { rank: 4, name: 'David Chen', badge: 'RISING', badgeColor: 'bg-[#a855f7]/20 text-[#a855f7]', winRate: '79%', rating: '1,950', trend: 'up', trendVal: '2' },
  ];

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
            <span className="text-5xl font-black text-[#ffffff] font-headline tracking-tighter">#42</span>
            <div className="bg-[#10b981]/20 px-2 py-1 rounded-full flex items-center gap-1 border border-[#10b981]/30">
              <ChevronUp size={12} className="text-[#10b981]" />
              <span className="text-[#10b981] text-[10px] font-bold">2 this week</span>
            </div>
          </div>

          <div className="bg-[#0e0e0e] rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#242424] flex items-center justify-center overflow-hidden border border-[#333]">
                 <img src="https://ui-avatars.com/api/?name=Alex+Mercer&background=242424&color=fff" alt="User" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-[#ffffff]">Alex Mercer</span>
                <span className="text-xs text-[#a3a3a3]">Top 5%</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-[#a3a3a3] font-bold">Rating</span>
              <span className="font-bold text-sm text-[#ffffff]">1,482</span>
            </div>
          </div>
        </section>

        {/* Top Players List */}
        <section>
          <h3 className="text-xs font-bold text-[#a3a3a3] tracking-widest uppercase mb-4 px-1">TOP PLAYERS</h3>
          
          <div className="space-y-4">
            {topPlayers.map((player) => (
              <div key={player.rank} className="flex items-center justify-between px-1">
                
                <div className="flex items-center gap-4">
                  <span className="text-base font-bold text-[#ffffff] w-4 text-center">{player.rank}</span>
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center overflow-hidden">
                      <img src={`https://ui-avatars.com/api/?name=${player.name}&background=1a1a1a&color=fff`} alt={player.name} className="w-full h-full object-cover" />
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
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${player.badgeColor}`}>
                        {player.badge}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#a3a3a3]">{player.winRate} Win Rate</span>
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
        </section>

      </main>

      <BottomNav />
    </div>
  );
}
