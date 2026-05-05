import React, { useState } from 'react';
import { ArrowLeft, MoreVertical, TrendingUp, Zap, Sparkles, Trophy } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

type ProfileTab = 'batting' | 'bowling' | 'history';

const playerData = {
  name: 'Raj Kumar',
  initials: 'RK',
  team: 'Village Kings',
  teamColor: '#a855f7',
  rating: 7.31,
  roles: [
    { label: 'BATSMAN', color: '#22c55e' },
    { label: 'CAPTAIN', color: '#a855f7' },
    { label: 'RHB', color: '#565555' },
  ],
  trend: 12,
  stats: { matches: 24, runs: 876, wickets: 18, catches: 12 },
};

const battingAverages = {
  matches: 24, innings: 22, average: 42.3, strikeRate: 138.4,
  totalRuns: 876, highScore: '98*', fifties: 6, hundreds: 0,
  fours: 84, sixes: 32,
};

const bowlingAverages = {
  matches: 24, innings: 18, average: 28.6, economy: 7.8,
  totalWickets: 18, bestBowling: '3/22', fiveWickets: 0, maidens: 4,
  dotBalls: 112, wides: 14,
};

const recentForm = [
  { score: 76, vs: 'DX', highlight: true },
  { score: 12, vs: 'MK', highlight: false },
  { score: 45, vs: 'TL', highlight: false },
  { score: 8, vs: 'RB', highlight: true },
  { score: 54, vs: 'VN', highlight: false },
];

const matchHistory = [
  { id: 1, team: 'Village Kings', vs: 'District XI', date: 'Apr 22, 2026', format: 'T20', won: true, batting: '76', battingBalls: '48', bowling: null, mom: true },
  { id: 2, team: 'Village Kings', vs: 'Town Blazers', date: 'Apr 15, 2026', format: 'T20', won: false, batting: '12', battingBalls: '10', bowling: '1-22', mom: false },
  { id: 3, team: 'Village Kings', vs: 'River End CC', date: 'Apr 08, 2026', format: 'T20', won: true, batting: '45', battingBalls: '30', bowling: null, mom: true },
  { id: 4, team: 'Village Kings', vs: 'District XI', date: 'Apr 01, 2026', format: 'T20', won: false, batting: '8', battingBalls: '12', bowling: null, mom: false },
  { id: 5, team: 'Village Kings', vs: 'Thunder CC', date: 'Mar 25, 2026', format: 'T20', won: true, batting: '54', battingBalls: '38', bowling: '2-18', mom: false },
];

const performanceMetrics = [
  { label: 'vs Pace', value: 'SR 182', pct: 91 },
  { label: 'vs Spin', value: 'SR 94', pct: 47 },
  { label: 'Powerplay', value: 'Avg 56', pct: 70, highlight: true },
  { label: 'Death Overs', value: 'Avg 31', pct: 39 },
];

export default function PlayerProfile() {
  const navigate = useNavigate();
  const { playerId } = useParams();
  const [activeTab, setActiveTab] = useState<ProfileTab>('batting');

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-[#000000] text-[#ffffff] font-sans relative overflow-x-hidden shadow-2xl">

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 bg-[#000000]">
        <button onClick={() => navigate(-1)} className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors">
          <ArrowLeft size={20} />
        </button>
        <span className="text-sm font-black text-[#c799ff] tracking-widest uppercase">Crease Pulse</span>
        <button className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors">
          <MoreVertical size={18} />
        </button>
      </header>

      {/* Profile Hero Card */}
      <div className="px-4 pb-5">
        <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-[#fbbf24]/30">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#a855f7] to-[#7c3aed] flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.25)] ring-2 ring-[#fbbf24]/40">
                <span className="text-2xl font-black text-[#ffffff]">{playerData.initials}</span>
              </div>
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-black text-[#ffffff] mb-1">{playerData.name}</h2>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30">BATTING ALL-ROUNDER</span>
              </div>
            </div>
            {/* Rating */}
            <div className="text-right flex-shrink-0">
              <span className="text-[8px] font-bold text-[#a3a3a3] tracking-widest uppercase block">RATING</span>
              <span className="text-2xl font-black text-[#c799ff]">{playerData.rating.toString().replace('.', '')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 pb-5">
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'MATCHES', value: playerData.stats.matches, accent: false },
            { label: 'RUNS', value: playerData.stats.runs, accent: true },
            { label: 'WICKETS', value: playerData.stats.wickets, accent: false },
            { label: 'CATCHES', value: playerData.stats.catches, accent: false },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl py-3 text-center ${s.accent ? 'bg-[#2d1b4e] border border-[#a855f7]/30' : 'bg-[#1a1a1a]'}`}>
              <span className="text-[7px] font-bold text-[#565555] tracking-widest uppercase block mb-1">{s.label}</span>
              <span className={`text-lg font-black ${s.accent ? 'text-[#c799ff]' : 'text-[#ffffff]'}`}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pill Tabs */}
      <div className="px-4 pb-4">
        <div className="flex gap-2">
          {[
            { id: 'batting' as ProfileTab, label: 'Batting' },
            { id: 'bowling' as ProfileTab, label: 'Bowling' },
            { id: 'history' as ProfileTab, label: 'Match History' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#a855f7] text-[#ffffff]'
                  : 'bg-[#1a1a1a] text-[#a3a3a3] hover:bg-[#222]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="px-4 pb-8 space-y-5">

        {/* =============== BATTING TAB =============== */}
        {activeTab === 'batting' && (
          <>
            {/* Batting Averages */}
            <section className="bg-[#1a1a1a] rounded-2xl p-4">
              <h3 className="text-sm font-bold text-[#ffffff] mb-4">Batting Averages</h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                {[
                  { label: 'Matches', value: battingAverages.matches },
                  { label: 'Innings', value: battingAverages.innings },
                  { label: 'Average', value: battingAverages.average, color: '#22c55e' },
                  { label: 'Strike Rate', value: battingAverages.strikeRate, color: '#22c55e' },
                  { label: 'Total Runs', value: battingAverages.totalRuns },
                  { label: 'High Score', value: battingAverages.highScore },
                  { label: '50s', value: battingAverages.fifties },
                  { label: '100s', value: battingAverages.hundreds },
                  { label: '4s', value: battingAverages.fours },
                  { label: '6s', value: battingAverages.sixes },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between border-b border-[#111] pb-2">
                    <span className="text-xs text-[#a3a3a3]">{stat.label}</span>
                    <span className={`text-sm font-bold ${stat.color ? `text-[${stat.color}]` : 'text-[#ffffff]'}`}
                      style={stat.color ? { color: stat.color } : {}}
                    >
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Form */}
            <section>
              <h3 className="text-[9px] font-bold text-[#565555] tracking-widest uppercase mb-3">RECENT FORM (LAST 5)</h3>
              <div className="flex gap-3 justify-center">
                {recentForm.map((f, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-black ${
                      f.highlight && f.score >= 50 ? 'bg-[#22c55e] text-[#000]'
                        : f.highlight ? 'bg-[#a855f7] text-[#ffffff]'
                        : 'bg-[#1a1a1a] text-[#ffffff] border border-[#333]'
                    }`}>
                      {f.score}
                    </div>
                    <span className="text-[8px] text-[#565555]">vs {f.vs}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Performance Metrics */}
            <section className="bg-[#1a1a1a] rounded-2xl p-4">
              <h3 className="text-sm font-bold text-[#ffffff] mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                {performanceMetrics.map((m) => (
                  <div key={m.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-[#a3a3a3]">{m.label}</span>
                      <span className={`text-xs font-bold ${m.highlight ? 'text-[#22c55e]' : 'text-[#ffffff]'}`}>{m.value}</span>
                    </div>
                    <div className="h-1.5 bg-[#111] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${m.pct >= 70 ? 'bg-[#22c55e]' : m.pct >= 50 ? 'bg-[#a855f7]' : 'bg-[#f59e0b]'}`}
                        style={{ width: `${m.pct}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Crease AI Insight */}
            <section className="bg-gradient-to-br from-[#2d1b4e] to-[#1a1a1a] rounded-2xl p-5 border border-[#a855f7]/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} className="text-[#c799ff]" />
                <span className="text-[9px] font-bold text-[#c799ff] tracking-widest uppercase">CREASE AI INSIGHT</span>
              </div>
              <p className="text-xs text-[#e5e5e5] leading-relaxed">
                Exceptional acceleration against pace in the powerplay. Struggles slightly to rotate strike 
                against left-arm orthodox spin in middle overs.
              </p>
            </section>
          </>
        )}

        {/* =============== BOWLING TAB =============== */}
        {activeTab === 'bowling' && (
          <>
            <section className="bg-[#1a1a1a] rounded-2xl p-4">
              <h3 className="text-sm font-bold text-[#ffffff] mb-4">Bowling Averages</h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                {[
                  { label: 'Matches', value: bowlingAverages.matches },
                  { label: 'Innings', value: bowlingAverages.innings },
                  { label: 'Average', value: bowlingAverages.average, color: '#22c55e' },
                  { label: 'Economy', value: bowlingAverages.economy, color: '#f59e0b' },
                  { label: 'Total Wickets', value: bowlingAverages.totalWickets },
                  { label: 'Best Bowling', value: bowlingAverages.bestBowling },
                  { label: '5 Wickets', value: bowlingAverages.fiveWickets },
                  { label: 'Maidens', value: bowlingAverages.maidens },
                  { label: 'Dot Balls', value: bowlingAverages.dotBalls },
                  { label: 'Wides', value: bowlingAverages.wides },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between border-b border-[#111] pb-2">
                    <span className="text-xs text-[#a3a3a3]">{stat.label}</span>
                    <span className="text-sm font-bold" style={stat.color ? { color: stat.color } : { color: '#ffffff' }}>
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Bowling Performance */}
            <section className="bg-[#1a1a1a] rounded-2xl p-4">
              <h3 className="text-sm font-bold text-[#ffffff] mb-4">Bowling Zones</h3>
              <div className="space-y-4">
                {[
                  { label: 'Powerplay', value: 'Econ 6.2', pct: 78 },
                  { label: 'Middle Overs', value: 'Econ 7.4', pct: 63 },
                  { label: 'Death Overs', value: 'Econ 9.8', pct: 42 },
                  { label: 'Yorkers', value: '72% accurate', pct: 72 },
                ].map((m) => (
                  <div key={m.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-[#a3a3a3]">{m.label}</span>
                      <span className={`text-xs font-bold ${m.pct >= 70 ? 'text-[#22c55e]' : m.pct >= 50 ? 'text-[#a3a3a3]' : 'text-[#f59e0b]'}`}>{m.value}</span>
                    </div>
                    <div className="h-1.5 bg-[#111] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${m.pct >= 70 ? 'bg-[#22c55e]' : m.pct >= 50 ? 'bg-[#a855f7]' : 'bg-[#f59e0b]'}`}
                        style={{ width: `${m.pct}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* =============== HISTORY TAB =============== */}
        {activeTab === 'history' && (
          <section className="space-y-4">
            {matchHistory.map((match) => (
              <div key={match.id} className="bg-[#1a1a1a] rounded-2xl p-4">
                {/* Match Header */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black ${
                      match.won ? 'bg-[#22c55e] text-[#000]' : 'bg-[#ef4444] text-[#ffffff]'
                    }`}>
                      {match.won ? 'W' : 'L'}
                    </div>
                    <span className="text-sm font-bold text-[#ffffff]">{match.team} vs {match.vs}</span>
                  </div>
                  {match.mom && (
                    <Trophy size={16} className="text-[#fbbf24]" />
                  )}
                </div>
                <div className="flex items-center gap-2 mb-3 pl-8">
                  <span className="text-[10px] text-[#565555]">{match.date}</span>
                  <span className="text-[10px] text-[#565555]">|</span>
                  <span className="text-[10px] text-[#565555]">{match.format}</span>
                </div>

                {/* Stats Card */}
                <div className="bg-[#111] rounded-xl px-4 py-3">
                  <div className="flex gap-6">
                    <div>
                      <span className="text-[8px] font-bold text-[#565555] tracking-widest uppercase block mb-1">BATTING</span>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-lg font-black text-[#ffffff]">{match.batting}</span>
                        <span className="text-xs text-[#a3a3a3]">({match.battingBalls})</span>
                      </div>
                    </div>
                    {match.bowling && (
                      <>
                        <div className="w-px bg-[#242424]"></div>
                        <div>
                          <span className="text-[8px] font-bold text-[#565555] tracking-widest uppercase block mb-1">BOWLING</span>
                          <span className="text-lg font-black text-[#ffffff]">{match.bowling}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

      </main>
    </div>
  );
}
