import React, { useState } from 'react';
import { ArrowLeft, RotateCcw, MoreVertical } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface TeamData {
  id: string;
  name: string;
  initials: string;
  color: string;
}

interface BallEntry {
  id: number;
  runs: number;
  type: 'normal' | 'wide' | 'noball' | 'bye' | 'legbye' | 'wicket';
}

const ballColor = (entry: BallEntry) => {
  if (entry.type === 'wicket') return 'bg-[#ef4444] text-[#fff]';
  if (entry.runs === 4) return 'bg-[#22c55e] text-[#000]';
  if (entry.runs === 6) return 'bg-[#6366f1] text-[#fff]';
  if (entry.type === 'wide' || entry.type === 'noball') return 'bg-[#f59e0b] text-[#000]';
  if (entry.runs === 0) return 'bg-[#333] text-[#a3a3a3]';
  return 'bg-[#444] text-[#fff]';
};

const ballLabel = (entry: BallEntry) => {
  if (entry.type === 'wicket') return 'W';
  if (entry.type === 'wide') return `Wd${entry.runs > 1 ? `+${entry.runs - 1}` : ''}`;
  if (entry.type === 'noball') return `Nb${entry.runs > 1 ? `+${entry.runs - 1}` : ''}`;
  if (entry.type === 'bye') return `B${entry.runs}`;
  if (entry.type === 'legbye') return `Lb${entry.runs}`;
  return `${entry.runs}`;
};

export default function LiveScoring() {
  const navigate = useNavigate();
  const location = useLocation();
  const { team1, team2, tossWinner, decision } = (location.state as {
    team1: TeamData | null; team2: TeamData | null; tossWinner: TeamData | null; decision: string | null;
  }) || {};

  const battingTeam = tossWinner && decision === 'bat' ? tossWinner : team1;
  const bowlingTeam = tossWinner && decision === 'bat' ? (tossWinner?.id === team1?.id ? team2 : team1) : team2;

  const [totalRuns, setTotalRuns] = useState(142);
  const [wickets, setWickets] = useState(4);
  const [overs, setOvers] = useState(16);
  const [balls, setBalls] = useState(2);
  const [target] = useState(210);
  const [thisOver, setThisOver] = useState<BallEntry[]>([
    { id: 1, runs: 1, type: 'normal' },
    { id: 2, runs: 4, type: 'normal' },
    { id: 3, runs: 0, type: 'normal' },
    { id: 4, runs: 2, type: 'normal' },
  ]);

  // Batsmen
  const [striker, setStriker] = useState({ name: 'Virat Kohli', runs: 42, balls: 28, fours: 5, sixes: 2 });
  const [nonStriker, setNonStriker] = useState({ name: 'Rohit Sharma', runs: 12, balls: 10, fours: 1, sixes: 0 });
  // Bowler
  const [bowler] = useState({ name: 'Jasprit Bumrah', overs: 3.2, maidens: 1, runs: 28, wickets: 1 });

  const crr = overs > 0 ? (totalRuns / (overs + balls / 6)).toFixed(2) : '0.00';
  const remaining = target - totalRuns;
  const ballsLeft = (20 - overs) * 6 - balls;
  const rrr = ballsLeft > 0 ? ((remaining / ballsLeft) * 6).toFixed(2) : '0.00';

  const [extraMode, setExtraMode] = useState<string | null>(null);

  const addBall = (runs: number, type: BallEntry['type'] = 'normal') => {
    const entry: BallEntry = { id: Date.now(), runs, type };
    setThisOver((prev) => [...prev, entry]);

    if (type === 'wicket') {
      setWickets((w) => w + 1);
    } else {
      setTotalRuns((t) => t + runs);
      if (type !== 'wide' && type !== 'noball') {
        setStriker((s) => ({ ...s, runs: s.runs + (type === 'bye' || type === 'legbye' ? 0 : runs), balls: s.balls + 1 }));
      }
      if (type === 'wide' || type === 'noball') {
        setTotalRuns((t) => t + 1); // extra run
      }
    }

    // Advance ball count for legal deliveries
    if (type !== 'wide' && type !== 'noball') {
      if (balls >= 5) {
        setBalls(0);
        setOvers((o) => o + 1);
        setThisOver([]);
      } else {
        setBalls((b) => b + 1);
      }
    }

    // Swap strike on odd runs
    if (runs % 2 !== 0 && type !== 'wicket') {
      const temp = { ...striker };
      setStriker({ ...nonStriker });
      setNonStriker(temp);
    }

    setExtraMode(null);
  };

  const handleUndo = () => {
    if (thisOver.length === 0) return;
    const last = thisOver[thisOver.length - 1];
    setThisOver((prev) => prev.slice(0, -1));
    if (last.type === 'wicket') {
      setWickets((w) => Math.max(0, w - 1));
    } else {
      setTotalRuns((t) => Math.max(0, t - last.runs - (last.type === 'wide' || last.type === 'noball' ? 1 : 0)));
    }
    if (last.type !== 'wide' && last.type !== 'noball') {
      if (balls === 0 && overs > 0) {
        setBalls(5);
        setOvers((o) => o - 1);
      } else {
        setBalls((b) => Math.max(0, b - 1));
      }
    }
  };

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-[#000000] text-[#ffffff] font-sans relative overflow-x-hidden shadow-2xl">

      {/* Header Bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-[#000000]">
        <button onClick={() => navigate(-1)} className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold text-[#10b981] animate-pulse">● LIVE</span>
        </div>
        <button className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors">
          <MoreVertical size={20} />
        </button>
      </header>

      {/* Scoreboard */}
      <div className="px-4 pb-3">
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-2xl px-5 py-5">
          {/* Team Name & Live */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: battingTeam?.color || '#a855f7' }}
              >
                <span className="text-xs font-bold text-[#000]">{battingTeam?.initials || 'VK'}</span>
              </div>
              <span className="text-base font-bold text-[#ffffff]">{battingTeam?.name || 'Village Kings'}</span>
            </div>
            <span className="text-xs text-[#a3a3a3]">vs {bowlingTeam?.name || 'Royal Challengers'}</span>
          </div>

          {/* Main Score */}
          <div className="flex items-end justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-[#ffffff] tracking-tight">{totalRuns}</span>
              <span className="text-3xl font-black text-[#a3a3a3]">/</span>
              <span className="text-3xl font-black text-[#a3a3a3]">{wickets}</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-[#c799ff] block">{overs}.{balls}</span>
              <span className="text-[10px] text-[#a3a3a3] uppercase tracking-wider">Overs</span>
            </div>
          </div>
        </div>
      </div>

      <main className="px-3 py-3 space-y-3 pb-4">

        {/* Target Info */}
        <div className="flex items-center justify-between bg-[#1a1a1a] rounded-xl px-4 py-2.5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[8px] font-bold text-[#a3a3a3]">CRR</span>
              <span className="bg-[#2d1b4e] text-[#c799ff] text-[10px] font-bold px-2 py-0.5 rounded-full">{crr}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[8px] font-bold text-[#a3a3a3]">REQ</span>
              <span className="bg-[#3b1d1d] text-[#f87171] text-[10px] font-bold px-2 py-0.5 rounded-full">{rrr}</span>
            </div>
          </div>
          <div className="bg-[#3d2c0a] px-3 py-1 rounded-lg">
            <span className="text-[10px] font-bold text-[#fbbf24]">{remaining} needed from {ballsLeft} balls</span>
          </div>
        </div>

        {/* Batsmen & Bowler */}
        <div className="flex gap-2">
          {/* Striker */}
          <div className="flex-1 bg-[#1a1a1a] rounded-xl p-3 border-l-2 border-[#fbbf24]">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[10px] font-bold text-[#fbbf24]">★</span>
              <span className="text-xs font-bold text-[#ffffff] truncate">{striker.name}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-[#ffffff]">{striker.runs}</span>
              <span className="text-[10px] text-[#a3a3a3]">({striker.balls})</span>
            </div>
            <div className="flex gap-2 mt-1">
              <span className="text-[8px] text-[#22c55e] font-bold">{striker.fours}×4s</span>
              <span className="text-[8px] text-[#6366f1] font-bold">{striker.sixes}×6s</span>
            </div>
          </div>

          {/* Non-Striker */}
          <div className="flex-1 bg-[#1a1a1a] rounded-xl p-3 max-w-[90px]">
            <span className="text-[10px] text-[#a3a3a3] block mb-2 truncate">{nonStriker.name}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-[#a3a3a3]">{nonStriker.runs}</span>
              <span className="text-[9px] text-[#565555]">({nonStriker.balls})</span>
            </div>
          </div>

          {/* Bowler */}
          <div className="flex-1 bg-[#1a1a1a] rounded-xl p-3 border-l-2 border-[#a855f7]">
            <span className="text-[10px] text-[#c799ff] block mb-2 truncate">{bowler.name}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-[#ffffff]">{bowler.wickets}-{bowler.runs}</span>
              <span className="text-[9px] text-[#a3a3a3]">({bowler.overs})</span>
            </div>
          </div>
        </div>

        {/* This Over */}
        <div className="bg-[#1a1a1a] rounded-xl px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-bold text-[#565555] tracking-widest uppercase">THIS OVER</span>
            <span className="text-[9px] text-[#a3a3a3]">
              {thisOver.reduce((s, b) => s + b.runs + (b.type === 'wide' || b.type === 'noball' ? 1 : 0), 0)} runs
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {thisOver.map((entry) => (
              <div
                key={entry.id}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${ballColor(entry)}`}
              >
                {ballLabel(entry)}
              </div>
            ))}
            {/* Remaining dots */}
            {Array.from({ length: Math.max(0, 6 - thisOver.filter(b => b.type !== 'wide' && b.type !== 'noball').length) }).map((_, i) => (
              <div key={`empty-${i}`} className="w-8 h-8 rounded-full border border-[#333] flex items-center justify-center">
                <span className="text-[10px] text-[#333]">·</span>
              </div>
            ))}
          </div>
        </div>

        {/* Extra Mode Indicator */}
        {extraMode && (
          <div className="bg-[#3d2c0a] rounded-xl px-4 py-2 flex items-center justify-between">
            <span className="text-xs font-bold text-[#fbbf24]">
              {extraMode === 'wide' ? 'Wide Ball' : extraMode === 'noball' ? 'No Ball' : extraMode === 'bye' ? 'Bye' : 'Leg Bye'} — tap runs
            </span>
            <button onClick={() => setExtraMode(null)} className="text-[#a3a3a3] text-xs font-bold">Cancel</button>
          </div>
        )}

        {/* Scoring Grid */}
        <div className="grid grid-cols-4 gap-2">
          {[0, 1, 2, 3].map((r) => (
            <button
              key={r}
              onClick={() => addBall(r, extraMode as BallEntry['type'] || 'normal')}
              className="bg-[#1a1a1a] rounded-xl py-4 text-center hover:bg-[#2a2a2a] active:scale-95 transition-all"
            >
              <span className="text-xl font-black text-[#ffffff]">{r}</span>
            </button>
          ))}
          <button
            onClick={() => addBall(4, extraMode as BallEntry['type'] || 'normal')}
            className="bg-[#22c55e] rounded-xl py-4 text-center hover:bg-[#16a34a] active:scale-95 transition-all col-span-2"
          >
            <span className="text-xl font-black text-[#000]">4</span>
          </button>
          <button
            onClick={() => addBall(6, extraMode as BallEntry['type'] || 'normal')}
            className="bg-[#6366f1] rounded-xl py-4 text-center hover:bg-[#4f46e5] active:scale-95 transition-all col-span-2"
          >
            <span className="text-xl font-black text-[#ffffff]">6</span>
          </button>
        </div>

        {/* Extras Row */}
        <div className="flex gap-2">
          {(['wide', 'noball', 'bye', 'legbye'] as const).map((extra) => (
            <button
              key={extra}
              onClick={() => setExtraMode(extraMode === extra ? null : extra)}
              className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold text-center transition-all ${
                extraMode === extra
                  ? 'bg-[#f59e0b] text-[#000]'
                  : 'bg-[#1a1a1a] text-[#a3a3a3] hover:bg-[#222]'
              }`}
            >
              {extra === 'wide' ? 'WIDE' : extra === 'noball' ? 'NO BALL' : extra === 'bye' ? 'BYE' : 'LEG BYE'}
            </button>
          ))}
        </div>

        {/* Wicket + Undo Row */}
        <div className="flex gap-2">
          <button
            onClick={() => addBall(0, 'wicket')}
            className="flex-1 bg-[#ef4444] rounded-xl py-3.5 text-center hover:bg-[#dc2626] active:scale-95 transition-all"
          >
            <span className="text-sm font-black text-[#ffffff]">WICKET</span>
          </button>
          <button
            onClick={handleUndo}
            className="bg-[#1a1a1a] rounded-xl px-5 py-3.5 flex items-center gap-2 hover:bg-[#2a2a2a] active:scale-95 transition-all"
          >
            <RotateCcw size={14} className="text-[#a3a3a3]" />
            <span className="text-xs font-bold text-[#a3a3a3]">UNDO</span>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <button className="flex-1 bg-[#1a1a1a] rounded-xl py-2.5 text-[10px] font-bold text-[#a3a3a3] text-center hover:bg-[#222] transition-colors">
            SCORECARD
          </button>
          <button className="flex-1 bg-[#1a1a1a] rounded-xl py-2.5 text-[10px] font-bold text-[#a3a3a3] text-center hover:bg-[#222] transition-colors">
            CHANGE BOWLER
          </button>
          <button
            onClick={() => navigate(`/match/1/summary`, { state: { team1, team2, totalRuns, wickets, overs, balls } })}
            className="flex-1 bg-[#2d1b4e] rounded-xl py-2.5 text-[10px] font-bold text-[#c799ff] text-center hover:bg-[#3d2c60] transition-colors"
          >
            END INNINGS
          </button>
        </div>

      </main>
    </div>
  );
}
