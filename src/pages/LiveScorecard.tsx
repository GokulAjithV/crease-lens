import React, { useState } from 'react';
import { ArrowLeft, Settings, Swords, Target } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface TeamData {
  id: string;
  name: string;
  initials: string;
  color: string;
}

type ScorecardTab = 'scorecard' | 'commentary' | 'wagon' | 'stats';

const battingData = [
  { name: 'Virat Kohli', status: 'not out', runs: 104, balls: 92, fours: 12, sixes: 2, sr: 113.0, isActive: true },
  { name: 'KL Rahul', status: 'not out', runs: 42, balls: 54, fours: 4, sixes: 1, sr: 77.7, isActive: true },
  { name: 'Rohit Sharma', status: 'c Maxwell b Starc', runs: 85, balls: 62, fours: 8, sixes: 5, sr: 137.1, isActive: false },
  { name: 'Shubman Gill', status: 'lbw b Cummins', runs: 23, balls: 18, fours: 4, sixes: 0, sr: 127.7, isActive: false },
  { name: 'Shreyas Iyer', status: 'b Zampa', runs: 14, balls: 11, fours: 2, sixes: 0, sr: 127.2, isActive: false },
];

const bowlingData = [
  { name: 'Pat Cummins', overs: 8.2, maidens: 0, runs: 54, wickets: 1, econ: 6.48, isCurrent: true },
  { name: 'Mitchell Starc', overs: 9.0, maidens: 1, runs: 62, wickets: 1, econ: 6.88, isCurrent: false },
  { name: 'Adam Zampa', overs: 10.0, maidens: 0, runs: 48, wickets: 1, econ: 4.80, isCurrent: false },
  { name: 'Glenn Maxwell', overs: 7.0, maidens: 0, runs: 52, wickets: 0, econ: 7.43, isCurrent: false },
  { name: 'Marcus Stoinis', overs: 6.0, maidens: 0, runs: 44, wickets: 1, econ: 7.33, isCurrent: false },
];

const commentary = [
  { over: '44.2', text: 'Kohli flicks through mid-wicket for a single. 104 up!', type: '1' },
  { over: '44.1', text: 'Full delivery, driven to covers. Dot ball.', type: '0' },
  { over: '43.6', text: 'FOUR! Rahul cuts it past point, races to the boundary.', type: '4' },
  { over: '43.5', text: 'Short ball, pulled away for 2 runs.', type: '2' },
  { over: '43.4', text: 'SIX! Kohli launches Cummins over long-on! Massive hit!', type: '6' },
  { over: '43.3', text: 'Width offered, Kohli slashes but misses. Dot ball.', type: '0' },
  { over: '43.2', text: 'Good length, pushed to mid-off for a single.', type: '1' },
  { over: '43.1', text: 'Back of a length, defended solidly. No run.', type: '0' },
];

export default function LiveScorecard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { team1, team2 } = (location.state as { team1: TeamData | null; team2: TeamData | null }) || {};

  const [activeTab, setActiveTab] = useState<ScorecardTab>('scorecard');

  const tabs: { id: ScorecardTab; label: string }[] = [
    { id: 'scorecard', label: 'Scorecard' },
    { id: 'commentary', label: 'Commentary' },
    { id: 'wagon', label: 'Wagon Wheel' },
    { id: 'stats', label: 'Stats' },
  ];

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-[#000000] text-[#ffffff] font-sans relative overflow-x-hidden shadow-2xl">

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 bg-[#000000]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-sm font-black text-[#ffffff] tracking-wider uppercase">Live Scoring</h1>
        </div>
        <button className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors">
          <Settings size={18} />
        </button>
      </header>

      {/* Scoreboard Card */}
      <div className="px-4 pb-4">
        <div className="bg-gradient-to-br from-[#2d1b4e] via-[#1a1a2e] to-[#1a1a1a] rounded-2xl p-5 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#a855f7]/10 rounded-full blur-3xl"></div>

          {/* Score Row */}
          <div className="flex items-center justify-between mb-3 relative z-10">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: team1?.color || '#a855f7' }}
              >
                <span className="text-xs font-bold text-[#000]">{team1?.initials || 'IND'}</span>
              </div>
              <div>
                <span className="text-4xl font-black text-[#ffffff] tracking-tight">284</span>
                <span className="text-2xl font-black text-[#a3a3a3]">/4</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#242424] flex items-center justify-center">
              <span className="text-[9px] font-bold text-[#a3a3a3]">{team2?.initials || 'AUS'}</span>
            </div>
          </div>

          {/* Live + Overs */}
          <div className="flex items-center gap-2 mb-3 relative z-10">
            <span className="text-[9px] font-bold text-[#10b981]">● LIVE</span>
            <span className="text-[10px] font-bold text-[#a3a3a3]">• 44.2 OV</span>
          </div>

          {/* Team names */}
          <div className="flex items-center justify-between mb-3 relative z-10">
            <span className="text-[10px] font-bold text-[#a3a3a3]">{team1?.initials || 'IND'}</span>
            <span className="text-[10px] font-bold text-[#a3a3a3]">{team2?.initials || 'AUS'}</span>
          </div>

          {/* Target + CRR */}
          <div className="flex items-center justify-between bg-[#000]/30 rounded-lg px-3 py-2 relative z-10">
            <span className="text-[10px] text-[#a3a3a3]">Target: <span className="font-bold text-[#fbbf24]">Projected 345</span></span>
            <span className="text-[10px] text-[#a3a3a3]">CRR: <span className="font-bold text-[#c799ff]">6.42</span></span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pb-3">
        <div className="flex border-b border-[#1a1a1a]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 pb-3 text-xs font-bold text-center transition-all relative ${
                activeTab === tab.id ? 'text-[#ffffff]' : 'text-[#565555] hover:text-[#a3a3a3]'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#a855f7] rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      <main className="px-4 pb-24 space-y-5">

        {/* =============== SCORECARD TAB =============== */}
        {activeTab === 'scorecard' && (
          <>
            {/* BATTING */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Swords size={14} className="text-[#c799ff]" />
                  <span className="text-sm font-black text-[#ffffff] uppercase tracking-wider">Batting</span>
                </div>
                <span className="text-[10px] font-bold text-[#a855f7]">1ST INNINGS</span>
              </div>

              {/* Table Header */}
              <div className="flex items-center px-3 py-2 bg-[#111] rounded-t-lg">
                <span className="flex-1 text-[8px] font-bold text-[#565555] tracking-widest">BATSMAN</span>
                <span className="w-8 text-[8px] font-bold text-[#565555] tracking-widest text-center">R</span>
                <span className="w-8 text-[8px] font-bold text-[#565555] tracking-widest text-center">B</span>
                <span className="w-8 text-[8px] font-bold text-[#565555] tracking-widest text-center">4s</span>
                <span className="w-8 text-[8px] font-bold text-[#565555] tracking-widest text-center">6s</span>
                <span className="w-10 text-[8px] font-bold text-[#565555] tracking-widest text-right">SR</span>
              </div>

              {/* Batsman Rows */}
              {battingData.map((bat, i) => (
                <div
                  key={i}
                  className={`flex items-center px-3 py-3 ${
                    bat.isActive ? 'bg-[#1a1a1a] border-l-2 border-[#a855f7]' : 'bg-transparent border-l-2 border-transparent'
                  } ${i < battingData.length - 1 ? 'border-b border-[#111]' : ''}`}
                >
                  <div className="flex-1 min-w-0">
                    <span className={`text-xs font-bold block ${bat.isActive ? 'text-[#ffffff]' : 'text-[#a3a3a3]'}`}>
                      {bat.name}{bat.isActive ? '*' : ''}
                    </span>
                    <span className="text-[9px] text-[#565555] italic">{bat.status}</span>
                  </div>
                  <span className={`w-8 text-xs font-bold text-center ${bat.isActive ? 'text-[#ffffff]' : 'text-[#a3a3a3]'}`}>{bat.runs}</span>
                  <span className="w-8 text-xs text-[#a3a3a3] text-center">{bat.balls}</span>
                  <span className="w-8 text-xs text-[#a3a3a3] text-center">{bat.fours}</span>
                  <span className="w-8 text-xs text-[#a3a3a3] text-center">{bat.sixes}</span>
                  <span className={`w-10 text-xs font-bold text-right ${bat.sr >= 130 ? 'text-[#22c55e]' : bat.sr >= 100 ? 'text-[#a3a3a3]' : 'text-[#f59e0b]'}`}>
                    {bat.sr.toFixed(1)}
                  </span>
                </div>
              ))}

              {/* Extras & Total */}
              <div className="flex items-center justify-between px-3 py-2 bg-[#111] mt-1 rounded-b-lg">
                <span className="text-[9px] text-[#565555]">Extras: <span className="text-[#a3a3a3]">16 (wd 6, nb 4, b 2, lb 4)</span></span>
                <span className="text-xs font-black text-[#ffffff]">284/4</span>
              </div>
            </section>

            {/* BOWLING */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Target size={14} className="text-[#c799ff]" />
                <span className="text-sm font-black text-[#ffffff] uppercase tracking-wider">Bowling</span>
              </div>

              {/* Table Header */}
              <div className="flex items-center px-3 py-2 bg-[#111] rounded-t-lg">
                <span className="flex-1 text-[8px] font-bold text-[#565555] tracking-widest">BOWLER</span>
                <span className="w-9 text-[8px] font-bold text-[#565555] tracking-widest text-center">O</span>
                <span className="w-7 text-[8px] font-bold text-[#565555] tracking-widest text-center">M</span>
                <span className="w-9 text-[8px] font-bold text-[#565555] tracking-widest text-center">R</span>
                <span className="w-7 text-[8px] font-bold text-[#565555] tracking-widest text-center">W</span>
                <span className="w-10 text-[8px] font-bold text-[#565555] tracking-widest text-right">Econ</span>
              </div>

              {/* Bowler Rows */}
              {bowlingData.map((bowl, i) => (
                <div
                  key={i}
                  className={`flex items-center px-3 py-3 ${
                    bowl.isCurrent ? 'bg-[#1a1a1a] border-l-2 border-[#fbbf24]' : 'bg-transparent border-l-2 border-transparent'
                  } ${i < bowlingData.length - 1 ? 'border-b border-[#111]' : ''}`}
                >
                  <span className={`flex-1 text-xs font-bold ${bowl.isCurrent ? 'text-[#ffffff]' : 'text-[#a3a3a3]'}`}>
                    {bowl.name}{bowl.isCurrent ? '*' : ''}
                  </span>
                  <span className="w-9 text-xs text-[#a3a3a3] text-center">{bowl.overs}</span>
                  <span className="w-7 text-xs text-[#a3a3a3] text-center">{bowl.maidens}</span>
                  <span className="w-9 text-xs text-[#a3a3a3] text-center">{bowl.runs}</span>
                  <span className={`w-7 text-xs font-bold text-center ${bowl.wickets > 0 ? 'text-[#22c55e]' : 'text-[#a3a3a3]'}`}>
                    {bowl.wickets}
                  </span>
                  <span className={`w-10 text-xs font-bold text-right ${bowl.econ <= 6 ? 'text-[#22c55e]' : bowl.econ <= 8 ? 'text-[#a3a3a3]' : 'text-[#f59e0b]'}`}>
                    {bowl.econ.toFixed(2)}
                  </span>
                </div>
              ))}
            </section>

            {/* Current Partnership */}
            <section className="bg-[#1a1a1a] rounded-2xl p-4">
              <span className="text-[8px] font-bold text-[#565555] tracking-widest uppercase block mb-2">CURRENT PARTNERSHIP</span>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-black text-[#ffffff]">86</span>
                  <span className="text-sm text-[#a3a3a3] ml-1">(94 balls)</span>
                </div>
                <div className="flex -space-x-2">
                  <div className="w-9 h-9 rounded-full bg-[#a855f7] flex items-center justify-center ring-2 ring-[#000]">
                    <span className="text-[9px] font-bold text-[#000]">VK</span>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-[#3b82f6] flex items-center justify-center ring-2 ring-[#000]">
                    <span className="text-[9px] font-bold text-[#000]">KR</span>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* =============== COMMENTARY TAB =============== */}
        {activeTab === 'commentary' && (
          <section className="space-y-1">
            {commentary.map((c, i) => {
              const typeColor = c.type === '4' ? 'bg-[#22c55e] text-[#000]'
                : c.type === '6' ? 'bg-[#6366f1] text-[#fff]'
                : c.type === '0' ? 'bg-[#333] text-[#a3a3a3]'
                : 'bg-[#444] text-[#fff]';
              return (
                <div key={i} className="flex gap-3 py-3 border-b border-[#111]">
                  <div className="flex flex-col items-center gap-1 flex-shrink-0 w-12">
                    <span className="text-[9px] font-bold text-[#565555]">{c.over}</span>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center ${typeColor}`}>
                      <span className="text-[10px] font-bold">{c.type}</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#e5e5e5] leading-relaxed flex-1">{c.text}</p>
                </div>
              );
            })}
          </section>
        )}

        {/* =============== WAGON WHEEL TAB =============== */}
        {activeTab === 'wagon' && (
          <section className="flex flex-col items-center gap-6">
            <div className="w-64 h-64 rounded-full border-2 border-[#1a1a1a] relative flex items-center justify-center">
              {/* Pitch rectangle */}
              <div className="w-6 h-20 bg-[#2d1b4e] rounded-sm absolute"></div>
              {/* Shot lines */}
              {[
                { angle: -30, length: 110, color: '#22c55e' },
                { angle: 15, length: 125, color: '#6366f1' },
                { angle: -75, length: 95, color: '#22c55e' },
                { angle: 45, length: 120, color: '#a3a3a3' },
                { angle: -15, length: 80, color: '#a3a3a3' },
                { angle: 60, length: 115, color: '#22c55e' },
                { angle: -50, length: 130, color: '#6366f1' },
                { angle: 80, length: 70, color: '#a3a3a3' },
              ].map((shot, i) => (
                <div
                  key={i}
                  className="absolute bottom-1/2 left-1/2 origin-bottom"
                  style={{
                    transform: `rotate(${shot.angle}deg)`,
                    width: '2px',
                    height: `${shot.length}px`,
                    backgroundColor: shot.color,
                    opacity: 0.7,
                  }}
                />
              ))}
              {/* Center dot */}
              <div className="absolute w-3 h-3 bg-[#a855f7] rounded-full z-10"></div>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#22c55e]"></div><span className="text-[10px] text-[#a3a3a3]">Fours</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#6366f1]"></div><span className="text-[10px] text-[#a3a3a3]">Sixes</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#a3a3a3]"></div><span className="text-[10px] text-[#a3a3a3]">Others</span></div>
            </div>
          </section>
        )}

        {/* =============== STATS TAB =============== */}
        {activeTab === 'stats' && (
          <section className="space-y-4">
            {[
              { label: 'Run Rate', phases: [{ name: 'PP (1-6)', val: 7.8 }, { name: 'Middle (7-15)', val: 5.9 }, { name: 'Death (16-20)', val: 8.2 }] },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#1a1a1a] rounded-2xl p-4">
                <span className="text-[9px] font-bold text-[#565555] tracking-widest uppercase block mb-3">{stat.label}</span>
                <div className="space-y-3">
                  {stat.phases.map((phase) => (
                    <div key={phase.name} className="flex items-center gap-3">
                      <span className="text-[10px] text-[#a3a3a3] w-20">{phase.name}</span>
                      <div className="flex-1 h-2 bg-[#111] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${phase.val >= 8 ? 'bg-[#22c55e]' : phase.val >= 6 ? 'bg-[#a855f7]' : 'bg-[#f59e0b]'}`}
                          style={{ width: `${(phase.val / 12) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-[#ffffff] w-8 text-right">{phase.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Boundary Count */}
            <div className="bg-[#1a1a1a] rounded-2xl p-4">
              <span className="text-[9px] font-bold text-[#565555] tracking-widest uppercase block mb-3">BOUNDARIES</span>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#111] rounded-xl p-3 text-center">
                  <span className="text-2xl font-black text-[#22c55e]">30</span>
                  <span className="text-[9px] text-[#a3a3a3] block mt-1">Fours</span>
                </div>
                <div className="bg-[#111] rounded-xl p-3 text-center">
                  <span className="text-2xl font-black text-[#6366f1]">8</span>
                  <span className="text-[9px] text-[#a3a3a3] block mt-1">Sixes</span>
                </div>
              </div>
            </div>

            {/* Dot Ball % */}
            <div className="bg-[#1a1a1a] rounded-2xl p-4">
              <span className="text-[9px] font-bold text-[#565555] tracking-widest uppercase block mb-3">DOT BALL PERCENTAGE</span>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#111" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#a855f7" strokeWidth="3" strokeDasharray="94.2" strokeDashoffset="31.1" strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-[#ffffff]">67%</span>
                </div>
                <div>
                  <span className="text-xs text-[#a3a3a3]">178 of 266 balls were scoring shots</span>
                </div>
              </div>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}
