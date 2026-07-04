import React, { useEffect, useState } from 'react';
import { ArrowLeft, MoreVertical, Sparkles, Trophy, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

type ProfileTab = 'batting' | 'bowling' | 'history';

export default function PlayerProfile() {
  const navigate = useNavigate();
  const { playerId } = useParams<{ playerId: string }>();
  const [activeTab, setActiveTab] = useState<ProfileTab>('batting');

  const [player, setPlayer] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProfileData() {
      if (!playerId) return;
      try {
        setLoading(true);
        setError('');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // 1. Fetch user profile
        const userRes = await fetch(`${API_URL}/api/players/${playerId}`, { headers });
        if (!userRes.ok) throw new Error('Failed to load user profile');
        const userJson = await userRes.json();
        
        // 2. Fetch user stats
        const statsRes = await fetch(`${API_URL}/api/players/${playerId}/stats`, { headers });
        if (!statsRes.ok) throw new Error('Failed to load user stats');
        const statsJson = await statsRes.json();

        // 3. Fetch user matches
        const historyRes = await fetch(`${API_URL}/api/players/${playerId}/matches`, { headers });
        if (!historyRes.ok) throw new Error('Failed to load match history');
        const historyJson = await historyRes.json();

        setPlayer(userJson.data || {});
        setStats(statsJson.data || {});
        setHistory(historyJson.data || []);
      } catch (err: any) {
        setError(err.message || 'An error occurred while loading profile');
      } finally {
        setLoading(false);
      }
    }

    fetchProfileData();
  }, [playerId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[390px] min-h-screen bg-[#000000] text-[#ffffff] font-sans flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-[#a855f7]" size={32} />
        <span className="text-xs font-black tracking-widest text-[#565555] uppercase">Loading Pulse profile...</span>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="mx-auto max-w-[390px] min-h-screen bg-[#000000] text-[#ffffff] font-sans flex flex-col items-center justify-center p-6 gap-4">
        <AlertCircle className="text-red-500" size={40} />
        <p className="text-sm font-bold text-center text-red-500">{error || 'Player profile not found'}</p>
        <button 
          onClick={() => navigate(-1)} 
          className="bg-[#161616] border border-[#242424] text-xs font-bold px-6 py-2.5 rounded-xl hover:text-[#a855f7] transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Setup initials
  let initials = '';
  if (player.first_name) initials += player.first_name[0].toUpperCase();
  if (player.last_name) initials += player.last_name[0].toUpperCase();
  if (!initials) initials = player.name ? player.name.slice(0, 2).toUpperCase() : '??';

  const fullName = `${player.first_name || ''} ${player.last_name || ''}`.trim() || 'Player';

  // Compute dynamic tags
  const rolesList = [];
  if (player.role) {
    rolesList.push({ label: player.role.toUpperCase(), color: '#22c55e' });
  } else {
    rolesList.push({ label: 'ALL-ROUNDER', color: '#22c55e' });
  }
  
  if (player.batting_style) {
    const batText = player.batting_style === 'right_hand' ? 'RHB' : 'LHB';
    rolesList.push({ label: batText, color: '#565555' });
  }

  // Dynamic Rating based on performance
  const ratingValue = stats ? (5.0 + (stats.runs / 150) + (stats.wickets * 0.4)).toFixed(2) : '7.31';
  const ratingDisplay = ratingValue.replace('.', '');

  // Map recent form (last 5 scores)
  const recentFormMapped = history.slice(0, 5).map(m => {
    const runs = m.batting_runs || 0;
    return {
      score: runs,
      vs: m.opponent_name ? m.opponent_name.split(' ').map((w: string) => w[0]).join('').toUpperCase() : '??',
      highlight: runs >= 30
    };
  });

  // Performance metrics relative ratios
  const srPct = stats ? Math.min(100, Math.round((stats.strike_rate / 200) * 100)) : 50;
  const avgPct = stats ? Math.min(100, Math.round((stats.batting_average / 60) * 100)) : 50;
  const econPct = stats ? Math.max(0, Math.min(100, Math.round(((12 - stats.economy) / 8) * 100))) : 50;

  const performanceMetrics = [
    { label: 'Batting Strike Rate', value: `SR ${stats?.strike_rate || 0}`, pct: srPct },
    { label: 'Batting Average', value: `Avg ${stats?.batting_average || 0.0}`, pct: avgPct, highlight: true },
    { label: 'Bowling Economy', value: `Econ ${stats?.economy || 0.0}`, pct: econPct },
  ];

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-[#000000] text-[#ffffff] font-sans relative overflow-x-hidden shadow-2xl flex flex-col">

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 bg-[#000000]">
        <button onClick={() => navigate(-1)} className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors cursor-pointer">
          <ArrowLeft size={20} />
        </button>
        <span className="text-xs font-black text-[#c799ff] tracking-widest uppercase">Crease Pulse</span>
        <button className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors cursor-pointer">
          <MoreVertical size={18} />
        </button>
      </header>

      {/* Profile Hero Card */}
      <div className="px-4 pb-5">
        <div className="bg-[#161616] rounded-2xl p-4 border border-[#fbbf24]/30">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.25)] ring-2 ring-[#fbbf24]/40 text-black font-black text-2xl"
                style={{ backgroundColor: player.avatar_color || '#7c3aed' }}
              >
                {initials}
              </div>
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-black text-[#ffffff] mb-1.5 truncate">{fullName}</h2>
              <div className="flex flex-wrap items-center gap-1.5">
                {rolesList.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="text-[8px] font-black px-2 py-0.5 rounded border"
                    style={{ backgroundColor: `${tag.color}15`, color: tag.color, borderColor: `${tag.color}30` }}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>
            {/* Rating */}
            <div className="text-right flex-shrink-0">
              <span className="text-[8px] font-bold text-[#a3a3a3] tracking-widest uppercase block">RATING</span>
              <span className="text-2xl font-black text-[#c799ff]">{ratingDisplay}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="px-4 pb-5">
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'MATCHES', value: stats?.matches || 0, accent: false },
            { label: 'RUNS', value: stats?.runs || 0, accent: true },
            { label: 'WICKETS', value: stats?.wickets || 0, accent: false },
            { label: 'INNINGS', value: stats?.batting_innings || 0, accent: false },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl py-3 text-center ${s.accent ? 'bg-[#2d1b4e] border border-[#a855f7]/30' : 'bg-[#161616]'}`}>
              <span className="text-[7px] font-bold text-[#565555] tracking-widest uppercase block mb-1">{s.label}</span>
              <span className={`text-lg font-black ${s.accent ? 'text-[#c799ff]' : 'text-[#ffffff]'}`}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State Banner (if no matches played) */}
      {stats?.matches === 0 && (
        <div className="px-4 pb-5">
          <div className="bg-[#111] border border-[#242424] rounded-2xl p-6 text-center space-y-3">
            <Sparkles className="text-[#a855f7] mx-auto animate-pulse" size={24} />
            <h4 className="text-sm font-black text-[#ffffff]">No Match Telemetry Yet</h4>
            <p className="text-xs text-[#a3a3a3] leading-relaxed max-w-[260px] mx-auto">
              This player profile has not participated in any matches or scored deliveries yet.
            </p>
            <div className="pt-2">
              <button 
                onClick={() => navigate('/rankings')}
                className="bg-[#2d1b4e] border border-[#a855f7]/30 hover:border-[#a855f7] text-[#c799ff] text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                View Active Standings
              </button>
            </div>
          </div>
        </div>
      )}

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
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#a855f7] text-[#ffffff]'
                  : 'bg-[#161616] text-[#a3a3a3] hover:bg-[#222]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats Area */}
      <main className="px-4 pb-12 space-y-5 flex-1">

        {/* =============== BATTING TAB =============== */}
        {activeTab === 'batting' && (
          <>
            {/* Batting Stats */}
            <section className="bg-[#161616] rounded-2xl p-4 border border-[#242424]">
              <h3 className="text-xs font-black tracking-wider text-[#ffffff] uppercase mb-4">Batting Averages</h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                {[
                  { label: 'Matches', value: stats?.matches || 0 },
                  { label: 'Innings Batted', value: stats?.batting_innings || 0 },
                  { label: 'Average', value: stats?.batting_average || 0.0, color: '#22c55e' },
                  { label: 'Strike Rate', value: stats?.strike_rate || 0.0, color: '#22c55e' },
                  { label: 'Total Runs', value: stats?.runs || 0 },
                  { label: 'High Score', value: stats?.highest_score || '0' },
                  { label: '50s', value: stats?.fifties || 0 },
                  { label: '100s', value: stats?.hundreds || 0 },
                  { label: 'Fours (4s)', value: stats?.fours || 0 },
                  { label: 'Sixes (6s)', value: stats?.sixes || 0 },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between border-b border-[#242424] pb-2">
                    <span className="text-xs text-[#a3a3a3]">{stat.label}</span>
                    <span className="text-xs font-bold" style={stat.color ? { color: stat.color } : { color: '#ffffff' }}>
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Form */}
            <section>
              <h3 className="text-[9px] font-bold text-[#565555] tracking-widest uppercase mb-3">RECENT FORM (LAST 5)</h3>
              {recentFormMapped.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#565555] bg-[#161616] rounded-2xl border border-[#242424]/40">
                  No batting data available yet.
                </div>
              ) : (
                <div className="flex gap-3 justify-center">
                  {recentFormMapped.map((f, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-black ${
                        f.highlight && f.score >= 50 ? 'bg-[#22c55e] text-[#000]'
                          : f.highlight ? 'bg-[#a855f7] text-[#ffffff]'
                          : 'bg-[#161616] text-[#ffffff] border border-[#333]'
                      }`}>
                        {f.score}
                      </div>
                      <span className="text-[8px] text-[#565555]">vs {f.vs}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Performance Gauges */}
            <section className="bg-[#161616] rounded-2xl p-4 border border-[#242424]">
              <h3 className="text-xs font-black tracking-wider text-[#ffffff] uppercase mb-4">Performance Metrics</h3>
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

            {/* AI Summary Insight */}
            <section className="bg-gradient-to-br from-[#2d1b4e] to-[#161616] rounded-2xl p-5 border border-[#a855f7]/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} className="text-[#c799ff]" />
                <span className="text-[9px] font-bold text-[#c799ff] tracking-widest uppercase">CREASE AI INSIGHT</span>
              </div>
              <p className="text-xs text-[#e5e5e5] leading-relaxed">
                {stats?.runs > 0 ? (
                  `Demonstrates a healthy strike rate of ${stats.strike_rate} in match plays. Runs average stands at ${stats.batting_average} per innings. Maintain current batting acceleration in middle overs to enhance fantasy rating.`
                ) : (
                  "Telemetry gathering in progress. Continue registering matches to unlock AI-assisted batting performance and match setup recommendations."
                )}
              </p>
            </section>
          </>
        )}

        {/* =============== BOWLING TAB =============== */}
        {activeTab === 'bowling' && (
          <>
            {/* Bowling stats */}
            <section className="bg-[#161616] rounded-2xl p-4 border border-[#242424]">
              <h3 className="text-xs font-black tracking-wider text-[#ffffff] uppercase mb-4">Bowling Averages</h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                {[
                  { label: 'Matches', value: stats?.matches || 0 },
                  { label: 'Innings Bowled', value: stats?.bowling_innings || 0 },
                  { label: 'Average', value: stats?.bowling_average || 0.0, color: '#22c55e' },
                  { label: 'Economy', value: stats?.economy || 0.0, color: '#f59e0b' },
                  { label: 'Total Wickets', value: stats?.wickets || 0 },
                  { label: 'Best Bowling', value: stats?.best_bowling || '0/0' },
                  { label: 'Maidens', value: stats?.maidens || 0 },
                  { label: 'Dot Balls', value: stats?.dot_balls || 0 },
                  { label: 'Wides Conceded', value: stats?.wides || 0 },
                  { label: 'Runs Conceded', value: stats?.bowling_runs_conceded || 0 },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between border-b border-[#242424] pb-2">
                    <span className="text-xs text-[#a3a3a3]">{stat.label}</span>
                    <span className="text-xs font-bold" style={stat.color ? { color: stat.color } : { color: '#ffffff' }}>
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Bowling metrics */}
            <section className="bg-[#161616] rounded-2xl p-4 border border-[#242424]">
              <h3 className="text-xs font-black tracking-wider text-[#ffffff] uppercase mb-4">Bowling Metrics</h3>
              <div className="space-y-4">
                {[
                  { label: 'Accuracy Ratio', value: `${stats?.dot_balls || 0} dots`, pct: stats?.dot_balls ? Math.min(100, Math.round((stats.dot_balls / max(stats.balls_bowled, 1)) * 100)) : 0 },
                  { label: 'Wicket Frequency', value: `${stats?.wickets || 0} wickets`, pct: stats?.wickets ? Math.min(100, stats.wickets * 10) : 0 },
                ].map((m) => (
                  <div key={m.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-[#a3a3a3]">{m.label}</span>
                      <span className="text-xs font-bold text-[#ffffff]">{m.value}</span>
                    </div>
                    <div className="h-1.5 bg-[#111] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#a855f7]"
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
            {history.length === 0 ? (
              <div className="text-center py-16 text-xs text-[#565555] bg-[#161616] rounded-2xl border border-[#242424]">
                No match history records found.
              </div>
            ) : (
              history.map((match, idx) => (
                <div key={idx} className="bg-[#161616] rounded-2xl p-4 border border-[#242424]">
                  {/* Match Header */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black ${
                        match.won ? 'bg-[#22c55e] text-[#000]' : 'bg-[#ef4444] text-[#ffffff]'
                      }`}>
                        {match.won ? 'W' : 'L'}
                      </div>
                      <span className="text-xs font-black text-[#ffffff]">{match.team_name} vs {match.opponent_name}</span>
                    </div>
                    {match.is_mom && (
                      <Trophy size={16} className="text-[#fbbf24] fill-[#fbbf24]" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-3 pl-8">
                    <span className="text-[10px] text-[#565555]">
                      {match.date ? new Date(match.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                    </span>
                    <span className="text-[10px] text-[#565555]">|</span>
                    <span className="text-[10px] text-[#565555]">{match.format}</span>
                  </div>

                  {/* Stats Card */}
                  <div className="bg-[#111] rounded-xl px-4 py-3">
                    <div className="flex gap-6">
                      <div>
                        <span className="text-[8px] font-bold text-[#565555] tracking-widest uppercase block mb-1">BATTING</span>
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-lg font-black text-[#ffffff]">{match.batting_runs}</span>
                          <span className="text-xs text-[#a3a3a3]">({match.batting_balls})</span>
                        </div>
                      </div>
                      {(match.bowling_wickets > 0 || match.bowling_runs_conceded > 0) && (
                        <>
                          <div className="w-px bg-[#242424]"></div>
                          <div>
                            <span className="text-[8px] font-bold text-[#565555] tracking-widest uppercase block mb-1">BOWLING</span>
                            <span className="text-lg font-black text-[#ffffff]">{match.bowling_wickets}-{match.bowling_runs_conceded}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>
        )}

      </main>
    </div>
  );
}

function max(a: number, b: number) {
  return a > b ? a : b;
}
