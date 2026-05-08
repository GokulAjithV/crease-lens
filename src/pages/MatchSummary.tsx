import React, { useState } from 'react';
import { ArrowLeft, Trophy, Share2, BarChart3, Star, Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface TeamData {
  id: string;
  name: string;
  initials: string;
  color: string;
}

type Tab = 'summary' | 'performers' | 'ai';

const topBatters = [
  { rank: 1, name: 'Virat Kohli', team: 'Village Kings', runs: 84, balls: 42, sr: 200.0, fours: 8, sixes: 4 },
  { rank: 2, name: 'Rohit Sharma', team: 'Village Kings', runs: 56, balls: 38, sr: 147.4, fours: 6, sixes: 2 },
  { rank: 3, name: 'KL Rahul', team: 'Royal Challengers', runs: 44, balls: 30, sr: 146.7, fours: 5, sixes: 1 },
  { rank: 4, name: 'Shreyas Iyer', team: 'Village Kings', runs: 32, balls: 22, sr: 145.5, fours: 3, sixes: 1 },
  { rank: 5, name: 'Hardik Pandya', team: 'Royal Challengers', runs: 28, balls: 15, sr: 186.7, fours: 2, sixes: 2 },
];

const topBowlers = [
  { rank: 1, name: 'Jasprit Bumrah', team: 'Village Kings', overs: 4, maidens: 1, runs: 22, wickets: 3, econ: 5.5 },
  { rank: 2, name: 'Mohammed Shami', team: 'Village Kings', overs: 4, maidens: 0, runs: 34, wickets: 2, econ: 8.5 },
  { rank: 3, name: 'Yuzvendra Chahal', team: 'Royal Challengers', overs: 4, maidens: 0, runs: 38, wickets: 2, econ: 9.5 },
  { rank: 4, name: 'Axar Patel', team: 'Royal Challengers', overs: 3, maidens: 0, runs: 28, wickets: 1, econ: 9.3 },
];

export default function MatchSummary() {
  const navigate = useNavigate();
  const location = useLocation();
  const { team1, team2 } = (location.state as { team1: TeamData | null; team2: TeamData | null }) || {};

  const [activeTab, setActiveTab] = useState<Tab>('summary');
  const [performerView, setPerformerView] = useState<'batting' | 'bowling'>('batting');

  const winner = team1;
  const loser = team2;

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-[#000000] text-[#ffffff] font-sans relative overflow-x-hidden shadow-2xl">

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 bg-[#000000]">
        <button onClick={() => navigate('/home')} className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-sm font-bold text-[#c799ff] tracking-wider uppercase">Match Summary</h1>
        <button className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors">
          <Share2 size={18} />
        </button>
      </header>

      {/* Tabs */}
      <div className="px-4 pb-4">
        <div className="flex bg-[#1a1a1a] rounded-xl p-1">
          {([
            { id: 'summary' as Tab, label: 'Summary', icon: <BarChart3 size={14} /> },
            { id: 'performers' as Tab, label: 'Performers', icon: <Star size={14} /> },
            { id: 'ai' as Tab, label: 'Crease AI', icon: <Sparkles size={14} /> },
          ]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#ffffff] text-[#000000]'
                  : 'text-[#a3a3a3] hover:text-[#ffffff]'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="px-4 pb-8 space-y-5">

        {/* ===================== SUMMARY TAB ===================== */}
        {activeTab === 'summary' && (
          <>
            {/* Result Banner */}
            <section className="flex flex-col items-center gap-3 py-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.3)]">
                <Trophy size={28} className="text-[#000]" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-black text-[#ffffff]">{winner?.name || 'Village Kings'} Won!</h2>
                <p className="text-sm text-[#a3a3a3] mt-1">by 24 runs</p>
              </div>
            </section>

            {/* Player of the Match */}
            <section className="bg-gradient-to-r from-[#3d2c0a] to-[#1a1a1a] rounded-2xl p-4 border border-[#fbbf24]/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] flex items-center justify-center">
                    <span className="text-lg font-bold text-[#000]">VK</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-bold text-[#fbbf24] tracking-widest uppercase block mb-0.5">PLAYER OF THE MATCH</span>
                    <span className="text-sm font-bold text-[#ffffff]">Virat Kohli</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-[#ffffff]">84</span>
                  <span className="text-xs text-[#a3a3a3]"> (42)</span>
                </div>
              </div>
            </section>

            {/* Innings Cards */}
            {[
              { label: 'INNINGS 1', team: winner, score: 210, wickets: 6, overs: 20, crr: '10.50', topBat: 'V. Kohli — 84(42)', topBowl: 'Y. Chahal — 2/38(4)', isWinner: true },
              { label: 'INNINGS 2', team: loser, score: 186, wickets: 8, overs: 20, crr: '9.30', topBat: 'KL Rahul — 44(30)', topBowl: 'J. Bumrah — 3/22(4)', isWinner: false },
            ].map((innings) => (
              <section
                key={innings.label}
                className={`bg-[#1a1a1a] rounded-2xl p-4 space-y-3 ${innings.isWinner ? 'border border-[#a855f7]/30' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: innings.team?.color || '#a855f7' }}
                    >
                      <span className="text-[10px] font-bold text-[#000]">{innings.team?.initials || '??'}</span>
                    </div>
                    <span className="text-sm font-bold text-[#ffffff]">{innings.team?.name || 'Team'}</span>
                  </div>
                  <span className="bg-[#2d1b4e] text-[#c799ff] text-[8px] font-bold px-2 py-0.5 rounded-full">{innings.label}</span>
                </div>
                <div className="flex items-end justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-[#ffffff]">{innings.score}</span>
                    <span className="text-xl font-black text-[#a3a3a3]">/{innings.wickets}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#a3a3a3]">{innings.overs} Ov</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[8px] text-[#565555]">CRR</span>
                      <span className="text-[10px] font-bold text-[#c799ff]">{innings.crr}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-[#111] rounded-lg px-3 py-2">
                    <span className="text-[7px] font-bold text-[#565555] tracking-widest uppercase block mb-0.5">TOP BATTER</span>
                    <span className="text-[10px] font-bold text-[#ffffff]">{innings.topBat}</span>
                  </div>
                  <div className="flex-1 bg-[#111] rounded-lg px-3 py-2">
                    <span className="text-[7px] font-bold text-[#565555] tracking-widest uppercase block mb-0.5">TOP BOWLER</span>
                    <span className="text-[10px] font-bold text-[#ffffff]">{innings.topBowl}</span>
                  </div>
                </div>
              </section>
            ))}
          </>
        )}

        {/* ===================== PERFORMERS TAB ===================== */}
        {activeTab === 'performers' && (
          <>
            {/* Batting / Bowling Toggle */}
            <div className="flex bg-[#1a1a1a] rounded-xl p-1">
              <button
                onClick={() => setPerformerView('batting')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold text-center transition-all ${
                  performerView === 'batting' ? 'bg-[#ffffff] text-[#000]' : 'text-[#a3a3a3]'
                }`}
              >
                Batting
              </button>
              <button
                onClick={() => setPerformerView('bowling')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold text-center transition-all ${
                  performerView === 'bowling' ? 'bg-[#ffffff] text-[#000]' : 'text-[#a3a3a3]'
                }`}
              >
                Bowling
              </button>
            </div>

            {/* Batting Table */}
            {performerView === 'batting' && (
              <div className="space-y-2">
                {/* Header */}
                <div className="flex items-center px-3 py-2">
                  <span className="w-8 text-[8px] font-bold text-[#565555] tracking-widest">#</span>
                  <span className="flex-1 text-[8px] font-bold text-[#565555] tracking-widest">BATTER</span>
                  <span className="w-16 text-[8px] font-bold text-[#565555] tracking-widest text-right">R (B)</span>
                  <span className="w-14 text-[8px] font-bold text-[#565555] tracking-widest text-right">SR</span>
                </div>
                {topBatters.map((player) => (
                  <div
                    key={player.rank}
                    className={`flex items-center px-3 py-3 rounded-xl ${
                      player.rank === 1 ? 'bg-[#3d2c0a] border border-[#fbbf24]/20' : 'bg-[#1a1a1a]'
                    }`}
                  >
                    <span className={`w-8 text-sm font-black ${player.rank === 1 ? 'text-[#fbbf24]' : 'text-[#565555]'}`}>
                      {player.rank}
                    </span>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#242424] flex items-center justify-center">
                        <span className="text-[9px] font-bold text-[#a3a3a3]">{player.name.split(' ').map(w => w[0]).join('')}</span>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#ffffff] block">{player.name}</span>
                        <span className="text-[9px] text-[#565555]">{player.team}</span>
                      </div>
                    </div>
                    <span className="w-16 text-xs font-bold text-[#ffffff] text-right">{player.runs} ({player.balls})</span>
                    <span className={`w-14 text-xs font-bold text-right ${player.rank === 1 ? 'text-[#c799ff]' : 'text-[#a3a3a3]'}`}>
                      {player.sr.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Bowling Table */}
            {performerView === 'bowling' && (
              <div className="space-y-2">
                <div className="flex items-center px-3 py-2">
                  <span className="w-8 text-[8px] font-bold text-[#565555] tracking-widest">#</span>
                  <span className="flex-1 text-[8px] font-bold text-[#565555] tracking-widest">BOWLER</span>
                  <span className="w-16 text-[8px] font-bold text-[#565555] tracking-widest text-right">W-R (O)</span>
                  <span className="w-14 text-[8px] font-bold text-[#565555] tracking-widest text-right">ECON</span>
                </div>
                {topBowlers.map((player) => (
                  <div
                    key={player.rank}
                    className={`flex items-center px-3 py-3 rounded-xl ${
                      player.rank === 1 ? 'bg-[#3d2c0a] border border-[#fbbf24]/20' : 'bg-[#1a1a1a]'
                    }`}
                  >
                    <span className={`w-8 text-sm font-black ${player.rank === 1 ? 'text-[#fbbf24]' : 'text-[#565555]'}`}>
                      {player.rank}
                    </span>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#242424] flex items-center justify-center">
                        <span className="text-[9px] font-bold text-[#a3a3a3]">{player.name.split(' ').map(w => w[0]).join('')}</span>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#ffffff] block">{player.name}</span>
                        <span className="text-[9px] text-[#565555]">{player.team}</span>
                      </div>
                    </div>
                    <span className="w-16 text-xs font-bold text-[#ffffff] text-right">{player.wickets}-{player.runs} ({player.overs})</span>
                    <span className={`w-14 text-xs font-bold text-right ${player.rank === 1 ? 'text-[#c799ff]' : 'text-[#a3a3a3]'}`}>
                      {player.econ.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ===================== AI TAB ===================== */}
        {activeTab === 'ai' && (
          <section className="space-y-4">
            <div className="bg-gradient-to-br from-[#2d1b4e] to-[#1a1a1a] rounded-2xl p-5 border border-[#a855f7]/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-[#c799ff]" />
                <span className="text-xs font-bold text-[#c799ff]">CREASE AI INSIGHTS</span>
              </div>
              <p className="text-sm text-[#e5e5e5] leading-relaxed mb-4">
                Village Kings dominated with a clinical batting performance. <strong>Virat Kohli's 84(42)</strong> was the highlight, 
                striking at 200 with 8 fours and 4 sixes. The middle overs (7-14) saw <strong>12.8 RPO</strong>, 
                the highest in any T20 match this season for the team.
              </p>
              <p className="text-sm text-[#e5e5e5] leading-relaxed mb-4">
                <strong>Jasprit Bumrah's 3/22</strong> in the powerplay was decisive, removing both openers 
                and keeping the required rate above 10 throughout the chase. Royal Challengers never recovered 
                from the early wickets.
              </p>
              <div className="bg-[#000]/30 rounded-xl px-4 py-3">
                <span className="text-[9px] font-bold text-[#565555] tracking-widest uppercase block mb-1">KEY STAT</span>
                <p className="text-xs text-[#fbbf24] font-bold">
                  Village Kings scored 78 runs in the death overs (15-20) — their highest ever in a T20.
                </p>
              </div>
            </div>

            <div className="bg-[#1a1a1a] rounded-2xl p-4">
              <span className="text-[9px] font-bold text-[#565555] tracking-widest uppercase block mb-2">MATCH MOMENTUM</span>
              {/* Simple momentum bars */}
              <div className="space-y-2">
                {['PP (1-6)', 'Middle (7-14)', 'Death (15-20)'].map((phase, i) => {
                  const team1Runs = [48, 84, 78][i];
                  const team2Runs = [32, 72, 82][i];
                  const maxRuns = Math.max(team1Runs, team2Runs);
                  return (
                    <div key={phase} className="space-y-1">
                      <span className="text-[9px] text-[#a3a3a3]">{phase}</span>
                      <div className="flex gap-1 items-center">
                        <div className="flex-1 bg-[#111] rounded-full h-3 overflow-hidden">
                          <div className="h-full bg-[#a855f7] rounded-full" style={{ width: `${(team1Runs / maxRuns) * 100}%` }}></div>
                        </div>
                        <span className="text-[9px] font-bold text-[#c799ff] w-7 text-right">{team1Runs}</span>
                        <span className="text-[7px] text-[#565555]">vs</span>
                        <span className="text-[9px] font-bold text-[#a3a3a3] w-7">{team2Runs}</span>
                        <div className="flex-1 bg-[#111] rounded-full h-3 overflow-hidden">
                          <div className="h-full bg-[#333] rounded-full" style={{ width: `${(team2Runs / maxRuns) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}
