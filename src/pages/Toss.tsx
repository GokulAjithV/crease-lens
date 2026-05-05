import React, { useState } from 'react';
import { ArrowLeft, RotateCcw, Swords, Shield } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface TeamData {
  id: string;
  name: string;
  initials: string;
  color: string;
  players: number;
  matches: number;
  sub: string;
}

type Step = 'toss_winner' | 'decision' | 'confirmed';

export default function Toss() {
  const navigate = useNavigate();
  const location = useLocation();
  const { team1, team2 } = (location.state as { team1: TeamData | null; team2: TeamData | null }) || { team1: null, team2: null };

  const [step, setStep] = useState<Step>('toss_winner');
  const [tossWinner, setTossWinner] = useState<TeamData | null>(null);
  const [decision, setDecision] = useState<'bat' | 'bowl' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);

  const tossLoser = tossWinner?.id === team1?.id ? team2 : team1;

  const handleSelectWinner = (team: TeamData) => {
    setIsFlipping(true);
    setTossWinner(team);
    // Simulate coin flip animation
    setTimeout(() => {
      setIsFlipping(false);
      setStep('decision');
    }, 1200);
  };

  const handleDecision = (choice: 'bat' | 'bowl') => {
    setDecision(choice);
    setStep('confirmed');
  };

  const handleProceed = () => {
    navigate(`/match/1/playing-xi/${team1?.id || '1'}`, { state: { team1, team2, tossWinner, decision, currentTeamIndex: 0 } });
  };

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-[#000000] text-[#ffffff] font-sans relative overflow-x-hidden shadow-2xl">

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center gap-3 px-4 py-4 bg-[#000000]">
        <button onClick={() => navigate(-1)} className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-[#ffffff]">Toss</h1>
      </header>

      <main className="px-4 flex flex-col items-center justify-center" style={{ minHeight: 'calc(100vh - 72px - 100px)' }}>

        {/* Step 1: Who won the toss */}
        {step === 'toss_winner' && !isFlipping && (
          <div className="w-full flex flex-col items-center gap-8 animate-fadeIn">
            {/* Coin */}
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#f59e0b] via-[#fbbf24] to-[#f59e0b] flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.25)]">
              <span className="text-4xl">🪙</span>
            </div>

            <div className="text-center">
              <h2 className="text-xl font-bold text-[#ffffff] mb-1">Who won the toss?</h2>
              <p className="text-xs text-[#a3a3a3]">Tap the team that won</p>
            </div>

            {/* Team Selection */}
            <div className="w-full flex gap-3">
              {[team1, team2].filter(Boolean).map((team) => (
                <button
                  key={team!.id}
                  onClick={() => handleSelectWinner(team!)}
                  className="flex-1 bg-[#1a1a1a] rounded-2xl p-5 flex flex-col items-center gap-3 hover:bg-[#222] border-2 border-transparent hover:border-[#a855f7]/40 transition-all active:scale-[0.97]"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_16px_rgba(168,85,247,0.15)]"
                    style={{ backgroundColor: team!.color }}
                  >
                    <span className="text-xl font-bold text-[#000]">{team!.initials}</span>
                  </div>
                  <span className="text-sm font-bold text-[#ffffff] text-center leading-tight">{team!.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Coin Flip Animation */}
        {isFlipping && (
          <div className="flex flex-col items-center gap-6">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#f59e0b] via-[#fbbf24] to-[#f59e0b] flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.4)] animate-spin">
              <span className="text-4xl">🪙</span>
            </div>
            <p className="text-sm font-bold text-[#a3a3a3] animate-pulse">Flipping the coin...</p>
          </div>
        )}

        {/* Step 2: Bat or Bowl Decision */}
        {step === 'decision' && (
          <div className="w-full flex flex-col items-center gap-8 animate-fadeIn">
            {/* Winner Badge */}
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center shadow-[0_0_24px_rgba(168,85,247,0.3)] ring-4 ring-[#a855f7]/30"
                style={{ backgroundColor: tossWinner?.color || '#a855f7' }}
              >
                <span className="text-2xl font-bold text-[#000]">{tossWinner?.initials}</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-base font-bold text-[#ffffff]">{tossWinner?.name}</span>
                  <span className="bg-[#a855f7] text-[#ffffff] text-[8px] font-bold px-2 py-0.5 rounded-full">WON TOSS</span>
                </div>
                <p className="text-xs text-[#a3a3a3]">What do they choose?</p>
              </div>
            </div>

            {/* Bat / Bowl Cards */}
            <div className="w-full flex gap-3">
              <button
                onClick={() => handleDecision('bat')}
                className="flex-1 bg-[#1a1a1a] rounded-2xl p-6 flex flex-col items-center gap-4 hover:bg-[#222] border-2 border-transparent hover:border-[#a855f7]/40 transition-all active:scale-[0.97] group"
              >
                <div className="w-14 h-14 rounded-full bg-[#2d1b4e] flex items-center justify-center group-hover:bg-[#3d2c60] transition-colors">
                  <Swords size={24} className="text-[#c799ff]" />
                </div>
                <div className="text-center">
                  <span className="text-base font-bold text-[#ffffff] block">Bat First</span>
                  <span className="text-[10px] text-[#a3a3a3]">{tossWinner?.name} bats</span>
                </div>
              </button>

              <button
                onClick={() => handleDecision('bowl')}
                className="flex-1 bg-[#1a1a1a] rounded-2xl p-6 flex flex-col items-center gap-4 hover:bg-[#222] border-2 border-transparent hover:border-[#a855f7]/40 transition-all active:scale-[0.97] group"
              >
                <div className="w-14 h-14 rounded-full bg-[#2d1b4e] flex items-center justify-center group-hover:bg-[#3d2c60] transition-colors">
                  <Shield size={24} className="text-[#c799ff]" />
                </div>
                <div className="text-center">
                  <span className="text-base font-bold text-[#ffffff] block">Bowl First</span>
                  <span className="text-[10px] text-[#a3a3a3]">{tossWinner?.name} bowls</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 'confirmed' && (
          <div className="w-full flex flex-col items-center gap-6 animate-fadeIn">
            {/* Result Card */}
            <div className="w-full bg-gradient-to-br from-[#2d1b4e] to-[#1a1a1a] rounded-2xl p-6 border border-[#a855f7]/20">
              <div className="flex items-center justify-between mb-6">
                {/* Toss Winner */}
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_16px_rgba(168,85,247,0.2)] ring-2 ring-[#a855f7]"
                    style={{ backgroundColor: tossWinner?.color || '#a855f7' }}
                  >
                    <span className="text-lg font-bold text-[#000]">{tossWinner?.initials}</span>
                  </div>
                  <span className="text-xs font-bold text-[#ffffff] text-center">{tossWinner?.name}</span>
                  <span className="bg-[#a855f7] text-[#ffffff] text-[8px] font-bold px-2 py-0.5 rounded-full">
                    {decision === 'bat' ? '🏏 BATTING' : '⚾ BOWLING'}
                  </span>
                </div>

                {/* VS */}
                <div className="flex flex-col items-center gap-1 mx-2">
                  <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                    <span className="text-[10px] font-black text-[#565555]">VS</span>
                  </div>
                </div>

                {/* Toss Loser */}
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_16px_rgba(0,0,0,0.3)]"
                    style={{ backgroundColor: tossLoser?.color || '#333' }}
                  >
                    <span className="text-lg font-bold text-[#ffffff]">{tossLoser?.initials}</span>
                  </div>
                  <span className="text-xs font-bold text-[#ffffff] text-center">{tossLoser?.name}</span>
                  <span className="bg-[#242424] text-[#a3a3a3] text-[8px] font-bold px-2 py-0.5 rounded-full">
                    {decision === 'bat' ? '⚾ BOWLING' : '🏏 BATTING'}
                  </span>
                </div>
              </div>

              {/* Summary Line */}
              <div className="bg-[#000000]/40 rounded-xl px-4 py-3 text-center">
                <p className="text-xs text-[#a3a3a3]">
                  <span className="font-bold text-[#ffffff]">{tossWinner?.name}</span> won the toss and elected to{' '}
                  <span className="font-bold text-[#c799ff]">{decision === 'bat' ? 'bat' : 'bowl'} first</span>
                </p>
              </div>
            </div>

            {/* Redo Toss */}
            <button
              onClick={() => {
                setStep('toss_winner');
                setTossWinner(null);
                setDecision(null);
              }}
              className="flex items-center gap-2 text-[#a3a3a3] hover:text-[#ffffff] transition-colors"
            >
              <RotateCcw size={14} />
              <span className="text-xs font-bold">Redo Toss</span>
            </button>
          </div>
        )}

      </main>

      {/* Footer — only show on confirmed */}
      {step === 'confirmed' && (
        <div className="fixed bottom-0 w-full max-w-[390px] bg-gradient-to-t from-[#000000] via-[#000000] to-transparent px-4 pt-6 pb-8 z-50">
          <button
            onClick={handleProceed}
            className="w-full bg-[#a855f7] text-[#ffffff] py-4 rounded-2xl font-bold text-sm shadow-[0_4px_20px_rgba(168,85,247,0.35)] hover:bg-[#c799ff] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Select Playing XI
            <span className="text-base">→</span>
          </button>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
