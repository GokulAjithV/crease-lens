import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Settings, Swords, Target, RefreshCw } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface TeamData {
  id: string;
  name: string;
  initials: string;
  color: string;
}

type ScorecardTab = 'scorecard' | 'commentary' | 'wagon' | 'stats';

export default function LiveScorecard() {
  const navigate = useNavigate();
  const { matchId } = useParams<{ matchId: string }>();

  // API State
  const [matchState, setMatchState] = useState<any>(null);
  const [scorecardData, setScorecardData] = useState<any[]>([]);
  const [activeInningsIdx, setActiveInningsIdx] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isWebSocketActive, setIsWebSocketActive] = useState<boolean>(false);

  // Tab Navigation
  const [activeTab, setActiveTab] = useState<ScorecardTab>('scorecard');

  // WebSocket / Polling Refs
  const socketRef = useRef<WebSocket | null>(null);
  const pollIntervalRef = useRef<number | null>(null);

  const tabs: { id: ScorecardTab; label: string }[] = [
    { id: 'scorecard', label: 'Scorecard' },
    { id: 'commentary', label: 'Commentary' },
    { id: 'wagon', label: 'Wagon Wheel' },
    { id: 'stats', label: 'Stats' },
  ];

  // API base URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // 1. Initial State Fetch
  const fetchMatchState = async (showLoading = false) => {
    if (!matchId) return;
    if (showLoading) setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/matches/${matchId}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        throw new Error('Failed to retrieve match details');
      }

      const data = await res.json();
      const state = data.data;
      setMatchState(state);

      if (state.scorecard && state.scorecard.scorecard) {
        setScorecardData(state.scorecard.scorecard);
        // Default to latest innings
        if (state.scorecard.scorecard.length > 0) {
          setActiveInningsIdx(state.scorecard.scorecard.length - 1);
        }
      }
      setError('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // 2. Fetch Scorecard only (used for polling/WS updates)
  const fetchScorecardOnly = async () => {
    if (!matchId) return;
    try {
      const res = await fetch(`${API_URL}/api/matches/${matchId}/scorecard`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.scorecard) {
          setScorecardData(data.scorecard);
        }
      }
    } catch (err) {
      console.error('Failed to poll scorecard:', err);
    }
  };

  // 3. Setup WebSocket and Polling fallback
  useEffect(() => {
    fetchMatchState(true);

    const connectWebSocket = () => {
      if (!matchId) return;

      // Close previous connection if any
      if (socketRef.current) {
        socketRef.current.close();
      }

      const wsProto = API_URL.startsWith('https') ? 'wss://' : 'ws://';
      const host = API_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');
      const wsUrl = `${wsProto}${host}/api/matches/ws/${matchId}`;

      console.log('Connecting to WebSocket:', wsUrl);
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket Connected');
        setIsWebSocketActive(true);
        // Clear any active HTTP polling interval
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && data.scorecard) {
            setScorecardData(data.scorecard);
            // Trigger background full state fetch to get new commentary/deliveries
            fetchMatchState(false);
          }
        } catch (err) {
          console.error('Error parsing WS message:', err);
        }
      };

      ws.onerror = (err) => {
        console.warn('WebSocket error:', err);
      };

      ws.onclose = () => {
        console.log('WebSocket closed. Falling back to HTTP polling.');
        setIsWebSocketActive(false);
        startPolling();
      };
    };

    const startPolling = () => {
      if (pollIntervalRef.current) return;
      pollIntervalRef.current = window.setInterval(() => {
        fetchMatchState(false);
        fetchScorecardOnly();
      }, 5000);
    };

    connectWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [matchId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[390px] min-h-screen bg-[#000000] text-[#ffffff] flex flex-col items-center justify-center gap-3">
        <RefreshCw size={24} className="animate-spin text-[#a855f7]" />
        <span className="text-xs font-bold text-[#a3a3a3] tracking-widest uppercase">Loading Live Scorecard...</span>
      </div>
    );
  }

  if (error || !matchState) {
    return (
      <div className="mx-auto max-w-[390px] min-h-screen bg-[#000000] text-[#ffffff] flex flex-col items-center justify-center p-6 text-center gap-4">
        <span className="text-sm font-bold text-[#ef4444]">{error || 'Unable to load match details'}</span>
        <button
          onClick={() => fetchMatchState(true)}
          className="px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-xs font-bold text-[#ffffff] hover:bg-[#2a2a2a] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Active scorecard config
  const activeInnings = scorecardData[activeInningsIdx];

  // Build squads lookup map
  const playerMap: Record<string, string> = {};
  const squadOrderMap: Record<string, number> = {};

  const processSquad = (squad: any[]) => {
    (squad || []).forEach((p: any) => {
      playerMap[p.id] = p.name;
      squadOrderMap[p.id] = p.batting_order || 99;
    });
  };
  processSquad(matchState.squad_a);
  processSquad(matchState.squad_b);

  const battingTeam = matchState.team_a.id === activeInnings?.batting_team_id ? matchState.team_a : matchState.team_b;
  const bowlingTeam = matchState.team_a.id === activeInnings?.bowling_team_id ? matchState.team_a : matchState.team_b;

  // Active Innings stats
  const totalRuns = activeInnings?.total_runs ?? 0;
  const totalWickets = activeInnings?.total_wickets ?? 0;
  const oversPlayed = activeInnings?.overs ?? '0.0';

  // Calculate CRR
  const getOversBalls = (oversStr: string) => {
    const parts = String(oversStr).split('.');
    const overs = parseInt(parts[0], 10) || 0;
    const balls = parseInt(parts[1], 10) || 0;
    return overs * 6 + balls;
  };
  const totalBallsBowled = getOversBalls(oversPlayed);
  const crr = totalBallsBowled > 0 ? ((totalRuns / totalBallsBowled) * 6).toFixed(2) : '0.00';

  // Calculate target for Innings 2
  const firstInnings = scorecardData.find((s) => s.innings_number === 1);
  const target = firstInnings && activeInnings?.innings_number === 2 ? firstInnings.total_runs + 1 : null;

  // Filter deliveries for active innings
  const inningsDeliveries = (matchState.deliveries || []).filter(
    (d: any) => d.innings_id === activeInnings?.innings_id
  );

  // Get active batsmen (latest ball details if playing)
  const lastDelivery = inningsDeliveries[inningsDeliveries.length - 1];
  const currentStrikerId = lastDelivery?.batsman_id || null;
  const currentNonStrikerId = lastDelivery?.non_striker_id || null;

  // Resolve batsmen list
  const getBatsmanStatus = (playerId: string, deliveries: any[], completed: boolean) => {
    const dismissal = deliveries.find((d: any) => d.is_wicket && d.dismissed_id === playerId);
    if (dismissal) {
      const bName = playerMap[dismissal.bowler_id] || 'Bowler';
      const wType = dismissal.wicket_type || 'out';
      switch (wType) {
        case 'bowled':
          return `b ${bName}`;
        case 'caught':
          return `c field b ${bName}`;
        case 'lbw':
          return `lbw b ${bName}`;
        case 'stumped':
          return `stumped b ${bName}`;
        case 'run_out':
          return 'run out';
        case 'hit_wicket':
          return `hit wicket b ${bName}`;
        case 'retired':
          return 'retired';
        default:
          return 'out';
      }
    }
    const played = deliveries.some((d: any) => d.batsman_id === playerId || d.non_striker_id === playerId);
    if (played) {
      return 'not out';
    }
    return 'yet to bat';
  };

  const batsmenList = Object.keys(activeInnings?.batsmen || {}).map((bid) => {
    const stat = activeInnings.batsmen[bid];
    const isStriker = bid === currentStrikerId && activeInnings.status === 'playing';
    const isNonStriker = bid === currentNonStrikerId && activeInnings.status === 'playing';
    return {
      id: bid,
      name: stat.name,
      runs: stat.runs,
      balls: stat.balls,
      fours: stat.fours,
      sixes: stat.sixes,
      sr: stat.sr,
      isActive: isStriker || isNonStriker,
      status: getBatsmanStatus(bid, inningsDeliveries, activeInnings.status === 'completed'),
    };
  });
  batsmenList.sort((a, b) => (squadOrderMap[a.id] || 99) - (squadOrderMap[b.id] || 99));

  // Resolve bowlers list
  const bowlersList = Object.keys(activeInnings?.bowlers || {}).map((brid) => {
    const stat = activeInnings.bowlers[brid];
    return {
      id: brid,
      name: stat.name,
      overs: stat.overs,
      maidens: 0, // Maidens currently mock or calculate if overs completed
      runs: stat.runs,
      wickets: stat.wickets,
      econ: stat.overs > 0 ? (stat.runs / getOversBalls(stat.overs)) * 6 : 0,
      isCurrent: lastDelivery?.bowler_id === brid && activeInnings.status === 'playing',
    };
  });

  // Calculate partnership
  const getPartnershipStats = (deliveries: any[]) => {
    let pRuns = 0;
    let pBalls = 0;
    let lastWicketIdx = -1;
    for (let i = deliveries.length - 1; i >= 0; i--) {
      if (deliveries[i].is_wicket) {
        lastWicketIdx = i;
        break;
      }
    }
    const filtered = lastWicketIdx === -1 ? deliveries : deliveries.slice(lastWicketIdx + 1);
    for (const d of filtered) {
      pRuns += (d.runs_batsman || 0) + (d.runs_extras || 0);
      if (d.extra_type !== 'wide') {
        pBalls += 1;
      }
    }
    return { runs: pRuns, balls: pBalls };
  };
  const partnership = getPartnershipStats(inningsDeliveries);

  // Build commentary
  const buildCommentaryList = (deliveries: any[]) => {
    return [...deliveries].reverse().map((d: any) => {
      const batName = playerMap[d.batsman_id] || 'Batsman';
      const bowlName = playerMap[d.bowler_id] || 'Bowler';
      const overStr = `${d.over_number - 1}.${d.raw_ball_number}`;

      let text = `${bowlName} to ${batName}, `;
      let type = '0';

      if (d.is_wicket) {
        text += `OUT! [${d.wicket_type || 'Dismissed'}]`;
        type = 'wicket';
      } else if (d.extra_type) {
        const extraRuns = d.runs_extras || 0;
        text += `${d.extra_type.toUpperCase()} (${extraRuns} run${extraRuns > 1 ? 's' : ''} extra).`;
        type = d.extra_type;
      } else {
        const runs = d.runs_batsman || 0;
        if (runs === 4) {
          text += 'FOUR runs! Elegantly driven to the boundary.';
          type = '4';
        } else if (runs === 6) {
          text += 'SIX runs! Powered high over the ropes!';
          type = '6';
        } else if (runs === 0) {
          text += 'no run, defended solidly.';
          type = '0';
        } else {
          text += `${runs} run${runs > 1 ? 's' : ''}, pushed into the gap.`;
          type = String(runs);
        }
      }

      return {
        over: overStr,
        text,
        type,
      };
    });
  };
  const commentaryList = buildCommentaryList(inningsDeliveries);

  // Stats summary calculations
  const getStatsMetrics = (deliveries: any[]) => {
    let fours = 0;
    let sixes = 0;
    let dotBalls = 0;
    let totalBalls = 0;
    let ppRuns = 0, ppBalls = 0;
    let midRuns = 0, midBalls = 0;
    let deathRuns = 0, deathBalls = 0;

    for (const d of deliveries) {
      const rBatsman = d.runs_batsman || 0;
      const rExtras = d.runs_extras || 0;
      const rTotal = rBatsman + rExtras;
      const isWide = d.extra_type === 'wide';

      if (rBatsman === 4) fours += 1;
      if (rBatsman === 6) sixes += 1;
      if (rTotal === 0) dotBalls += 1;
      if (!isWide) totalBalls += 1;

      const overNum = d.over_number;
      if (overNum <= 6) {
        ppRuns += rTotal;
        if (!isWide) ppBalls += 1;
      } else if (overNum <= 15) {
        midRuns += rTotal;
        if (!isWide) midBalls += 1;
      } else {
        deathRuns += rTotal;
        if (!isWide) deathBalls += 1;
      }
    }

    const getPhaseRate = (runs: number, balls: number) => {
      return balls > 0 ? Number(((runs / balls) * 6).toFixed(1)) : 0;
    };

    return {
      fours,
      sixes,
      dotBallPct: totalBalls > 0 ? Math.round((dotBalls / totalBalls) * 100) : 0,
      phases: [
        { name: 'PP (1-6)', val: getPhaseRate(ppRuns, ppBalls) },
        { name: 'Middle (7-15)', val: getPhaseRate(midRuns, midBalls) },
        { name: 'Death (16-20)', val: getPhaseRate(deathRuns, deathBalls) },
      ],
    };
  };
  const statsMetrics = getStatsMetrics(inningsDeliveries);

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-[#000000] text-[#ffffff] font-sans relative overflow-x-hidden shadow-2xl">

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 bg-[#000000]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-sm font-black text-[#ffffff] tracking-wider uppercase">Live Scorecard</h1>
        </div>
        <div className="flex items-center gap-2">
          {isWebSocketActive ? (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
            </span>
          ) : (
            <span className="h-2 w-2 rounded-full bg-[#f59e0b]"></span>
          )}
          <span className="text-[10px] font-bold text-[#a3a3a3] uppercase">
            {isWebSocketActive ? 'Live' : 'Polling'}
          </span>
        </div>
      </header>

      {/* Scoreboard Card */}
      <div className="px-4 pb-4">
        {activeInnings ? (
          <div className="bg-gradient-to-br from-[#2d1b4e] via-[#1a1a2e] to-[#1a1a1a] rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#a855f7]/10 rounded-full blur-3xl"></div>

            {/* Score Row */}
            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: battingTeam?.color || '#a855f7' }}
                >
                  <span className="text-xs font-black text-[#000]">
                    {battingTeam?.initials || 'BAT'}
                  </span>
                </div>
                <div>
                  <span className="text-4xl font-black text-[#ffffff] tracking-tight">{totalRuns}</span>
                  <span className="text-2xl font-black text-[#a3a3a3]">/{totalWickets}</span>
                </div>
              </div>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg border border-[#333]"
                style={{ backgroundColor: bowlingTeam?.color || '#242424' }}
              >
                <span className="text-xs font-black text-[#ffffff]">
                  {bowlingTeam?.initials || 'BOWL'}
                </span>
              </div>
            </div>

            {/* Live Status + Overs */}
            <div className="flex items-center gap-2 mb-3 relative z-10">
              <span
                className={`text-[9px] font-black tracking-wide px-1.5 py-0.5 rounded ${
                  activeInnings.status === 'playing' ? 'bg-[#ef4444]/20 text-[#ef4444]' : 'bg-[#10b981]/20 text-[#10b981]'
                }`}
              >
                {activeInnings.status === 'playing' ? '● LIVE' : 'COMPLETED'}
              </span>
              <span className="text-[10px] font-bold text-[#a3a3a3]">• {oversPlayed} OV</span>
            </div>

            {/* Team Names */}
            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-[10px] font-bold text-[#ffffff]">{battingTeam?.name}</span>
              <span className="text-[10px] font-bold text-[#a3a3a3]">vs {bowlingTeam?.name}</span>
            </div>

            {/* Target + CRR */}
            <div className="flex items-center justify-between bg-[#000]/30 rounded-lg px-3 py-2 relative z-10">
              <span className="text-[10px] text-[#a3a3a3]">
                {target ? (
                  <>
                    Target: <span className="font-bold text-[#fbbf24]">{target}</span>
                  </>
                ) : (
                  <>
                    Format: <span className="font-bold text-[#fbbf24]">{matchState.match?.total_overs} Overs</span>
                  </>
                )}
              </span>
              <span className="text-[10px] text-[#a3a3a3]">
                CRR: <span className="font-bold text-[#c799ff]">{crr}</span>
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-[#111] rounded-2xl p-5 text-center text-xs font-bold text-[#565555]">
            NO INNINGS STARTED YET
          </div>
        )}
      </div>

      {/* Innings Selector Tabs */}
      {scorecardData.length > 1 && (
        <div className="px-4 pb-3 flex gap-2">
          {scorecardData.map((inn, idx) => (
            <button
              key={inn.innings_id}
              onClick={() => setActiveInningsIdx(idx)}
              className={`flex-1 py-2 rounded-xl text-xs font-black tracking-wide border transition-all ${
                activeInningsIdx === idx
                  ? 'bg-[#a855f7] border-[#a855f7] text-[#ffffff] shadow-md'
                  : 'bg-transparent border-[#333] text-[#a3a3a3] hover:text-[#ffffff]'
              }`}
            >
              Innings {inn.innings_number}
            </button>
          ))}
        </div>
      )}

      {/* Navigation Tabs */}
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
        {activeTab === 'scorecard' && activeInnings && (
          <>
            {/* BATTING */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Swords size={14} className="text-[#c799ff]" />
                  <span className="text-sm font-black text-[#ffffff] uppercase tracking-wider">Batting</span>
                </div>
                <span className="text-[10px] font-bold text-[#a855f7]">INNINGS {activeInnings.innings_number}</span>
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
              {batsmenList.length > 0 ? (
                batsmenList.map((bat, i) => (
                  <div
                    key={bat.id}
                    className={`flex items-center px-3 py-3 ${
                      bat.isActive ? 'bg-[#a855f7]/5 border-l-2 border-[#a855f7]' : 'bg-transparent border-l-2 border-transparent'
                    } ${i < batsmenList.length - 1 ? 'border-b border-[#111]' : ''}`}
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <span className={`text-xs font-bold block ${bat.isActive ? 'text-[#a855f7]' : 'text-[#ffffff]'}`}>
                        {bat.name}{bat.isActive ? '*' : ''}
                      </span>
                      <span className="text-[9px] text-[#565555] italic">{bat.status}</span>
                    </div>
                    <span className={`w-8 text-xs font-bold text-center ${bat.isActive ? 'text-[#ffffff]' : 'text-[#a3a3a3]'}`}>{bat.runs}</span>
                    <span className="w-8 text-xs text-[#a3a3a3] text-center">{bat.balls}</span>
                    <span className="w-8 text-xs text-[#a3a3a3] text-center">{bat.fours}</span>
                    <span className="w-8 text-xs text-[#a3a3a3] text-center">{bat.sixes}</span>
                    <span className={`w-10 text-xs font-bold text-right ${bat.sr >= 130 ? 'text-[#22c55e]' : bat.sr >= 100 ? 'text-[#a3a3a3]' : 'text-[#f59e0b]'}`}>
                      {bat.sr ? bat.sr.toFixed(1) : '0.0'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-xs text-[#565555] font-bold bg-[#111]/30">
                  No batting statistics recorded.
                </div>
              )}

              {/* Extras & Total */}
              <div className="flex items-center justify-between px-3 py-2.5 bg-[#111] mt-1 rounded-b-lg">
                <span className="text-[9px] text-[#565555]">
                  Extras:{' '}
                  <span className="text-[#a3a3a3]">
                    {((activeInnings.extras_wide || 0) +
                      (activeInnings.extras_noball || 0) +
                      (activeInnings.extras_bye || 0) +
                      (activeInnings.extras_legbye || 0))}{' '}
                    (wd {activeInnings.extras_wide || 0}, nb {activeInnings.extras_noball || 0}, b {activeInnings.extras_bye || 0}, lb {activeInnings.extras_legbye || 0})
                  </span>
                </span>
                <span className="text-xs font-black text-[#ffffff]">
                  {totalRuns}/{totalWickets}
                </span>
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
              {bowlersList.length > 0 ? (
                bowlersList.map((bowl, i) => (
                  <div
                    key={bowl.id}
                    className={`flex items-center px-3 py-3 ${
                      bowl.isCurrent ? 'bg-[#fbbf24]/5 border-l-2 border-[#fbbf24]' : 'bg-transparent border-l-2 border-transparent'
                    } ${i < bowlersList.length - 1 ? 'border-b border-[#111]' : ''}`}
                  >
                    <span className={`flex-1 text-xs font-bold ${bowl.isCurrent ? 'text-[#fbbf24]' : 'text-[#ffffff]'}`}>
                      {bowl.name}{bowl.isCurrent ? '*' : ''}
                    </span>
                    <span className="w-9 text-xs text-[#a3a3a3] text-center">{bowl.overs}</span>
                    <span className="w-7 text-xs text-[#a3a3a3] text-center">{bowl.maidens}</span>
                    <span className="w-9 text-xs text-[#a3a3a3] text-center">{bowl.runs}</span>
                    <span className={`w-7 text-xs font-bold text-center ${bowl.wickets > 0 ? 'text-[#22c55e]' : 'text-[#a3a3a3]'}`}>
                      {bowl.wickets}
                    </span>
                    <span className={`w-10 text-xs font-bold text-right ${bowl.econ <= 6 ? 'text-[#22c55e]' : bowl.econ <= 8 ? 'text-[#a3a3a3]' : 'text-[#f59e0b]'}`}>
                      {bowl.econ ? bowl.econ.toFixed(2) : '0.00'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-xs text-[#565555] font-bold bg-[#111]/30">
                  No bowling statistics recorded.
                </div>
              )}
            </section>

            {/* Current Partnership */}
            {activeInnings.status === 'playing' && (partnership.runs > 0 || partnership.balls > 0) && (
              <section className="bg-[#1a1a1a] rounded-2xl p-4">
                <span className="text-[8px] font-bold text-[#565555] tracking-widest uppercase block mb-2">
                  CURRENT PARTNERSHIP
                </span>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-black text-[#ffffff]">{partnership.runs}</span>
                    <span className="text-sm text-[#a3a3a3] ml-1">({partnership.balls} balls)</span>
                  </div>
                  <div className="flex -space-x-2">
                    <div className="w-9 h-9 rounded-full bg-[#a855f7] flex items-center justify-center ring-2 ring-[#000]">
                      <span className="text-[9px] font-black text-[#000]">P1</span>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-[#3b82f6] flex items-center justify-center ring-2 ring-[#000]">
                      <span className="text-[9px] font-black text-[#000]">P2</span>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        {/* =============== COMMENTARY TAB =============== */}
        {activeTab === 'commentary' && (
          <section className="space-y-1">
            {commentaryList.length > 0 ? (
              commentaryList.map((c, i) => {
                const typeColor =
                  c.type === '4'
                    ? 'bg-[#22c55e] text-[#000]'
                    : c.type === '6'
                    ? 'bg-[#6366f1] text-[#fff]'
                    : c.type === 'wicket'
                    ? 'bg-[#ef4444] text-[#fff]'
                    : c.type === 'wide' || c.type === 'noball'
                    ? 'bg-[#f59e0b] text-[#000]'
                    : c.type === '0'
                    ? 'bg-[#333] text-[#a3a3a3]'
                    : 'bg-[#444] text-[#fff]';

                const ballTypeLabel =
                  c.type === 'wicket'
                    ? 'W'
                    : c.type === 'wide'
                    ? 'Wd'
                    : c.type === 'noball'
                    ? 'Nb'
                    : c.type;

                return (
                  <div key={i} className="flex gap-3 py-3 border-b border-[#111]">
                    <div className="flex flex-col items-center gap-1 flex-shrink-0 w-12">
                      <span className="text-[9px] font-bold text-[#565555]">{c.over}</span>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${typeColor}`}>
                        <span className="text-[10px] font-bold">{ballTypeLabel}</span>
                      </div>
                    </div>
                    <p className="text-xs text-[#e5e5e5] leading-relaxed flex-1 pt-1">{c.text}</p>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-xs text-[#565555] font-bold">
                No deliveries recorded for this innings yet.
              </div>
            )}
          </section>
        )}

        {/* =============== WAGON WHEEL TAB =============== */}
        {activeTab === 'wagon' && (
          <section className="flex flex-col items-center gap-6">
            <div className="w-64 h-64 rounded-full border-2 border-[#1a1a1a] relative flex items-center justify-center">
              {/* Pitch rectangle */}
              <div className="w-6 h-20 bg-[#2d1b4e] rounded-sm absolute"></div>
              {/* Dynamic/Mock illustration lines */}
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
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#22c55e]"></div>
                <span className="text-[10px] text-[#a3a3a3]">Fours</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#6366f1]"></div>
                <span className="text-[10px] text-[#a3a3a3]">Sixes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#a3a3a3]"></div>
                <span className="text-[10px] text-[#a3a3a3]">Others</span>
              </div>
            </div>
          </section>
        )}

        {/* =============== STATS TAB =============== */}
        {activeTab === 'stats' && (
          <section className="space-y-4">
            <div className="bg-[#1a1a1a] rounded-2xl p-4">
              <span className="text-[9px] font-bold text-[#565555] tracking-widest uppercase block mb-3">
                Run Rate by Phase
              </span>
              <div className="space-y-3">
                {statsMetrics.phases.map((phase) => (
                  <div key={phase.name} className="flex items-center gap-3">
                    <span className="text-[10px] text-[#a3a3a3] w-20">{phase.name}</span>
                    <div className="flex-1 h-2 bg-[#111] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          phase.val >= 8 ? 'bg-[#22c55e]' : phase.val >= 6 ? 'bg-[#a855f7]' : 'bg-[#f59e0b]'
                        }`}
                        style={{ width: `${Math.min((phase.val / 12) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-[#ffffff] w-8 text-right">{phase.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Boundary Count */}
            <div className="bg-[#1a1a1a] rounded-2xl p-4">
              <span className="text-[9px] font-bold text-[#565555] tracking-widest uppercase block mb-3">
                Boundaries
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#111] rounded-xl p-3 text-center">
                  <span className="text-2xl font-black text-[#22c55e]">{statsMetrics.fours}</span>
                  <span className="text-[9px] text-[#a3a3a3] block mt-1">Fours</span>
                </div>
                <div className="bg-[#111] rounded-xl p-3 text-center">
                  <span className="text-2xl font-black text-[#6366f1]">{statsMetrics.sixes}</span>
                  <span className="text-[9px] text-[#a3a3a3] block mt-1">Sixes</span>
                </div>
              </div>
            </div>

            {/* Dot Ball % */}
            <div className="bg-[#1a1a1a] rounded-2xl p-4">
              <span className="text-[9px] font-bold text-[#565555] tracking-widest uppercase block mb-3">
                Dot Ball Percentage
              </span>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#111" strokeWidth="3" />
                    <circle
                      cx="18"
                      cy="18"
                      r="15"
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="3"
                      strokeDasharray="94.2"
                      strokeDashoffset={94.2 - (94.2 * statsMetrics.dotBallPct) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-[#ffffff]">
                    {statsMetrics.dotBallPct}%
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#a3a3a3]">
                    {statsMetrics.dotBallPct}% of deliveries bowled were dot balls
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}
