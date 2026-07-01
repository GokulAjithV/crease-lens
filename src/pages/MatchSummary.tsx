import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Share2, BarChart3, Star, Sparkles } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

type Tab = 'summary' | 'performers' | 'ai';

export default function MatchSummary() {
  const navigate = useNavigate();
  const { matchId } = useParams<{ matchId: string }>();

  const [activeTab, setActiveTab] = useState<Tab>('summary');
  const [performerView, setPerformerView] = useState<'batting' | 'bowling'>('batting');
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError('');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const token = localStorage.getItem('token');
        
        const res = await fetch(`${API_URL}/api/matches/${matchId}/summary`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        
        if (!res.ok) {
          throw new Error('Failed to load match summary');
        }
        
        const json = await res.json();
        setData(json.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load summary');
      } finally {
        setLoading(false);
      }
    };
    
    if (matchId) {
      fetchSummary();
    }
  }, [matchId]);

  const handleShareSummary = async () => {
    if (!data) return;
    const { match, team_a, team_b, winner_name, innings } = data;
    
    const marginStr = match.win_margin ? `by ${match.win_margin} ${match.win_type}` : '';
    const resultLine = winner_name ? `🏆 *${winner_name} won ${marginStr}!*` : '🏏 *Match In Progress*';
    
    let inningsText = '';
    innings.forEach((inn: any) => {
      inningsText += `\n📈 *Innings ${inn.innings_number}: ${inn.batting_team_name}*\n👉 ${inn.total_runs}/${inn.total_wickets} in ${inn.overs_played} Ov\n🔥 Top Batter: ${inn.top_batsman}\n🎯 Top Bowler: ${inn.top_bowler}\n`;
    });
    
    const shareUrl = `${window.location.origin}/match/${matchId}/scorecard`;
    const message = `🏏 *Match Report: ${team_a.name} vs ${team_b.name}*
${resultLine}
${inningsText}
See full live ball-by-ball scorecard & wagon wheel on Crease:
🔗 ${shareUrl}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Match Report: ${team_a.name} vs ${team_b.name}`,
          text: message,
        });
      } else {
        await navigator.clipboard.writeText(message);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      // User cancelled share
    }
  };

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-[#000000] text-[#ffffff] font-sans relative overflow-x-hidden shadow-2xl">

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 bg-[#000000]">
        <button onClick={() => navigate('/home')} className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-sm font-bold text-[#c799ff] tracking-wider uppercase">Match Summary</h1>
        <div className="flex items-center gap-2">
          {copied && <span className="text-[10px] text-[#22c55e] font-bold">Copied!</span>}
          <button onClick={handleShareSummary} className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors">
            <Share2 size={18} />
          </button>
        </div>
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

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-[#a855f7] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-[#a3a3a3] mt-3 font-bold uppercase tracking-wider">Loading match report...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <p className="text-sm text-[#f87171] font-bold">{error}</p>
          <button
            onClick={() => navigate('/home')}
            className="mt-4 bg-[#242424] hover:bg-[#333] text-white font-bold py-2 px-6 rounded-xl text-xs"
          >
            Go Home
          </button>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && data && (
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
                  {data.match.status === 'completed' ? (
                    <>
                      <h2 className="text-2xl font-black text-[#ffffff]">{data.winner_name || 'Match Tied!'}</h2>
                      {data.match.win_margin ? (
                        <p className="text-sm text-[#a3a3a3] mt-1">won by {data.match.win_margin} {data.match.win_type}</p>
                      ) : (
                        <p className="text-sm text-[#a3a3a3] mt-1">Match ended in a tie</p>
                      )}
                    </>
                  ) : data.match.status === 'innings_break' ? (
                    <>
                      <h2 className="text-2xl font-black text-[#ffffff]">Innings Break</h2>
                      {data.innings[0] && (
                        <p className="text-sm text-[#a3a3a3] mt-1">Target: {data.innings[0].total_runs + 1} runs</p>
                      )}
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-black text-[#ffffff]">Live Scoring</h2>
                      {data.toss_winner_name && (
                        <p className="text-sm text-[#a3a3a3] mt-1">Toss won by {data.toss_winner_name}</p>
                      )}
                    </>
                  )}
                </div>
              </section>

              {/* Player of the Match / Top Performer */}
              {(() => {
                const topBat = data.performers.batting[0];
                const topBowl = data.performers.bowling[0];
                const player = topBat || topBowl;
                if (!player) return null;
                
                const isBatter = !!topBat;
                const initials = player.team_name ? player.team_name.split(' ').map((w: any) => w[0]).join('').substring(0, 2).toUpperCase() : 'POTM';
                
                return (
                  <section className="bg-gradient-to-r from-[#3d2c0a] to-[#1a1a1a] rounded-2xl p-4 border border-[#fbbf24]/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] flex items-center justify-center">
                          <span className="text-lg font-bold text-[#000]">{initials}</span>
                        </div>
                        <div>
                          <span className="text-[8px] font-bold text-[#fbbf24] tracking-widest uppercase block mb-0.5">MATCH TOP PERFORMER</span>
                          <span className="text-sm font-bold text-[#ffffff]">{player.name}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        {isBatter ? (
                          <>
                            <span className="text-lg font-black text-[#ffffff]">{player.runs}</span>
                            <span className="text-xs text-[#a3a3a3]"> ({player.balls})</span>
                          </>
                        ) : (
                          <>
                            <span className="text-lg font-black text-[#ffffff]">{player.wickets}-{player.runs}</span>
                            <span className="text-xs text-[#a3a3a3]"> ({player.overs})</span>
                          </>
                        )}
                      </div>
                    </div>
                  </section>
                );
              })()}

              {/* Innings Cards */}
              {data.innings.map((inn: any) => {
                const isWinner = data.winner_name && inn.batting_team_name === data.winner_name;
                const runs = inn.total_runs;
                const oversPlayed = parseFloat(inn.overs_played) || 0;
                let crr = "0.00";
                
                if (oversPlayed > 0) {
                  const parts = inn.overs_played.toString().split('.');
                  const ov = parseInt(parts[0]) || 0;
                  const bl = parseInt(parts[1]) || 0;
                  const totalBalls = ov * 6 + bl;
                  crr = ((runs / totalBalls) * 6).toFixed(2);
                }
                
                const teamA = data.team_a;
                const teamB = data.team_b;
                const teamInitials = inn.batting_team_name.split(' ').map((w: any) => w[0]).join('').substring(0, 3).toUpperCase();
                const teamColor = inn.batting_team_id === teamA.id ? (teamA.color || '#a855f7') : (teamB.color || '#fbbf24');
                
                return (
                  <section
                    key={inn.innings_number}
                    className={`bg-[#1a1a1a] rounded-2xl p-4 space-y-3 ${isWinner ? 'border border-[#a855f7]/30' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: teamColor }}
                        >
                          <span className="text-[10px] font-bold text-[#000]">{teamInitials}</span>
                        </div>
                        <span className="text-sm font-bold text-[#ffffff]">{inn.batting_team_name}</span>
                      </div>
                      <span className="bg-[#2d1b4e] text-[#c799ff] text-[8px] font-bold px-2 py-0.5 rounded-full">INNINGS {inn.innings_number}</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-[#ffffff]">{inn.total_runs}</span>
                        <span className="text-xl font-black text-[#a3a3a3]">/{inn.total_wickets}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-[#a3a3a3]">{inn.overs_played} Ov</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[8px] text-[#565555]">CRR</span>
                          <span className="text-[10px] font-bold text-[#c799ff]">{crr}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-[#111] rounded-lg px-3 py-2">
                        <span className="text-[7px] font-bold text-[#565555] tracking-widest uppercase block mb-0.5">TOP BATTER</span>
                        <span className="text-[10px] font-bold text-[#ffffff]">{inn.top_batsman}</span>
                      </div>
                      <div className="flex-1 bg-[#111] rounded-lg px-3 py-2">
                        <span className="text-[7px] font-bold text-[#565555] tracking-widest uppercase block mb-0.5">TOP BOWLER</span>
                        <span className="text-[10px] font-bold text-[#ffffff]">{inn.top_bowler}</span>
                      </div>
                    </div>
                  </section>
                );
              })}
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
                  <div className="flex items-center px-3 py-2">
                    <span className="w-8 text-[8px] font-bold text-[#565555] tracking-widest">#</span>
                    <span className="flex-1 text-[8px] font-bold text-[#565555] tracking-widest">BATTER</span>
                    <span className="w-16 text-[8px] font-bold text-[#565555] tracking-widest text-right">R (B)</span>
                    <span className="w-14 text-[8px] font-bold text-[#565555] tracking-widest text-right">SR</span>
                  </div>
                  {data.performers.batting.length === 0 ? (
                    <p className="text-center py-6 text-xs text-[#565555]">No batting performers recorded.</p>
                  ) : (
                    data.performers.batting.map((player: any) => (
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
                            <span className="text-[9px] font-bold text-[#a3a3a3]">{player.name.split(' ').map((w: any) => w[0]).join('').substring(0, 2).toUpperCase()}</span>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#ffffff] block">{player.name}</span>
                            <span className="text-[9px] text-[#565555]">{player.team_name}</span>
                          </div>
                        </div>
                        <span className="w-16 text-xs font-bold text-[#ffffff] text-right">{player.runs} ({player.balls})</span>
                        <span className={`w-14 text-xs font-bold text-right ${player.rank === 1 ? 'text-[#c799ff]' : 'text-[#a3a3a3]'}`}>
                          {player.sr.toFixed(1)}
                        </span>
                      </div>
                    ))
                  )}
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
                  {data.performers.bowling.length === 0 ? (
                    <p className="text-center py-6 text-xs text-[#565555]">No bowling performers recorded.</p>
                  ) : (
                    data.performers.bowling.map((player: any) => (
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
                            <span className="text-[9px] font-bold text-[#a3a3a3]">{player.name.split(' ').map((w: any) => w[0]).join('').substring(0, 2).toUpperCase()}</span>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#ffffff] block">{player.name}</span>
                            <span className="text-[9px] text-[#565555]">{player.team_name}</span>
                          </div>
                        </div>
                        <span className="w-16 text-xs font-bold text-[#ffffff] text-right">{player.wickets}-{player.runs} ({player.overs})</span>
                        <span className={`w-14 text-xs font-bold text-right ${player.rank === 1 ? 'text-[#c799ff]' : 'text-[#a3a3a3]'}`}>
                          {player.econ.toFixed(1)}
                        </span>
                      </div>
                    ))
                  )}
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
                <p 
                  className="text-sm text-[#e5e5e5] leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ 
                    __html: data.ai_insights
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  }}
                />
              </div>

              {/* Match Momentum Chart */}
              <div className="bg-[#1a1a1a] rounded-2xl p-4">
                <span className="text-[9px] font-bold text-[#565555] tracking-widest uppercase block mb-2">MATCH MOMENTUM</span>
                <div className="space-y-2">
                  {['PP (1-6)', 'Middle (7-14)', 'Death (15-20)'].map((phase, idx) => {
                    const phaseKey = ['pp', 'mid', 'death'][idx];
                    const team1Runs = data.phase_runs["1"]?.[phaseKey] || 0;
                    const team2Runs = data.phase_runs["2"]?.[phaseKey] || 0;
                    const maxRuns = Math.max(team1Runs, team2Runs, 1);
                    
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
      )}

    </div>
  );
}
