import React, { useEffect, useState } from 'react';
import { ArrowLeft, RotateCcw, MoreVertical, X, CheckCircle, ChevronRight, Loader2, AlertCircle, Swords, Shield, User, Trophy, Share2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface TeamData {
  id: string;
  name: string;
  initials: string;
  color: string;
}

interface Player {
  id: string;
  name: string;
  initials: string;
  role: string;
  jersey: number;
}

interface BallEntry {
  id: string | number;
  runs: number;
  type: 'normal' | 'wide' | 'noball' | 'bye' | 'legbye' | 'wicket';
}

const ballColor = (entry: BallEntry) => {
  if (entry.type === 'wicket') return 'bg-[#ef4444] text-[#fff]';
  if (entry.runs === 4 && entry.type === 'normal') return 'bg-[#22c55e] text-[#000]';
  if (entry.runs === 6 && entry.type === 'normal') return 'bg-[#6366f1] text-[#fff]';
  if (entry.type === 'wide' || entry.type === 'noball') return 'bg-[#f59e0b] text-[#000]';
  if (entry.runs === 0 && entry.type === 'normal') return 'bg-[#333] text-[#a3a3a3]';
  return 'bg-[#444] text-[#fff]';
};

const ballLabel = (entry: BallEntry) => {
  if (entry.type === 'wicket') return 'W';
  if (entry.type === 'wide') return `Wd${entry.runs > 0 ? `+${entry.runs}` : ''}`;
  if (entry.type === 'noball') return `Nb${entry.runs > 0 ? `+${entry.runs}` : ''}`;
  if (entry.type === 'bye') return `B${entry.runs}`;
  if (entry.type === 'legbye') return `Lb${entry.runs}`;
  return `${entry.runs}`;
};

export default function LiveScoring() {
  const navigate = useNavigate();
  const { matchId } = useParams<{ matchId: string }>();

  // Core Match State
  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Scoring Core State
  const [inningsId, setInningsId] = useState<string | null>(null);
  const [inningsNumber, setInningsNumber] = useState(1);
  const [totalRuns, setTotalRuns] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [overs, setOvers] = useState(0);
  const [balls, setBalls] = useState(0);
  
  // Striker / Non-Striker / Bowler
  const [striker, setStriker] = useState<any | null>(null);
  const [nonStriker, setNonStriker] = useState<any | null>(null);
  const [activeBowler, setActiveBowler] = useState<any | null>(null);
  const [activeOverId, setActiveOverId] = useState<string | null>(null);
  
  // This Over Deliveries
  const [thisOver, setThisOver] = useState<BallEntry[]>([]);

  // Selection Sheet visibility
  const [showBowlerSheet, setShowBowlerSheet] = useState(false);
  const [showBatsmanSheet, setShowBatsmanSheet] = useState(false);
  const [showWicketSheet, setShowWicketSheet] = useState(false);
  
  const [selectingRole, setSelectingRole] = useState<'striker' | 'nonStriker' | 'replacement' | null>(null);
  const [selectedWicketType, setSelectedWicketType] = useState<string | null>(null);

  // Extras configuration state
  const [extraMode, setExtraMode] = useState<'wide' | 'noball' | 'bye' | 'legbye' | null>(null);
  const [scoringBall, setScoringBall] = useState(false);

  const wicketTypes = [
    { id: 'bowled', label: 'Bowled', icon: '🏏' },
    { id: 'caught', label: 'Caught', icon: '🤲' },
    { id: 'lbw', label: 'LBW', icon: '🦵' },
    { id: 'run_out', label: 'Run Out', icon: '🏃' },
    { id: 'stumped', label: 'Stumped', icon: '🧤' },
    { id: 'hit_wicket', label: 'Hit Wicket', icon: '💥' },
    { id: 'retired', label: 'Retired Out', icon: '🚪' },
    { id: 'obstructing', label: 'Obstructing', icon: '🚫' },
  ];

  const handleShareMatch = () => {
    const shareUrl = `${window.location.origin}/match/${matchId}/scorecard`;
    if (navigator.share) {
      navigator.share({
        title: 'Crease Live Scorecard',
        text: `Watch the live scorecard for ${match?.team_a?.name || 'Team A'} vs ${match?.team_b?.name || 'Team B'} live on Crease!`,
        url: shareUrl,
      }).catch((err) => console.error(err));
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Load match state on mount
  useEffect(() => {
    fetchMatchState();
    
    // Clear match setup state from sessionStorage as setup is complete
    sessionStorage.removeItem('setup_matchType');
    sessionStorage.removeItem('setup_ballType');
    sessionStorage.removeItem('setup_pitchType');
    sessionStorage.removeItem('setup_wagonWheel');
    sessionStorage.removeItem('setup_overs');
    sessionStorage.removeItem('setup_oversPerBowler');
    sessionStorage.removeItem('setup_city');
    sessionStorage.removeItem('setup_venue');
    sessionStorage.removeItem('setup_scheduledAt');
  }, [matchId]);

  const fetchMatchState = async () => {
    if (!matchId) return;
    try {
      setLoading(true);
      setError('');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
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
      const matchState = data.data;
      setMatch(matchState);

      // Resolve innings
      if (!matchState.innings || matchState.innings.length === 0) {
        await handleStartFirstInnings(matchState);
      } else {
        const latestInnings = matchState.innings[matchState.innings.length - 1];
        setInningsId(latestInnings.id);
        setInningsNumber(latestInnings.innings_number);
        setTotalRuns(latestInnings.total_runs || 0);
        setWickets(latestInnings.total_wickets || 0);
        
        const floatOvers = latestInnings.overs_played || 0.0;
        setOvers(Math.floor(floatOvers));
        setBalls(Math.round((floatOvers - Math.floor(floatOvers)) * 10));

        // Setup active over if bowler is set
        await syncActiveOver(latestInnings.id, matchState);
        
        // Sync active batsman scores if deliveries exist
        await syncActiveBatsmen(latestInnings.id, matchState);
      }
    } catch (err: any) {
      setError(err.message || 'Error loading match state');
    } finally {
      setLoading(false);
    }
  };

  const handleStartFirstInnings = async (matchState: any) => {
    const { id: mId, toss_winner_id, toss_election, team_a_id, team_b_id } = matchState.match;
    if (!toss_winner_id || !toss_election) {
      setError('Toss result has not been recorded yet. Please complete toss first.');
      return;
    }
    
    let battingTeamId = '';
    let bowlingTeamId = '';
    
    if (toss_election === 'bat') {
      battingTeamId = toss_winner_id;
      bowlingTeamId = toss_winner_id === team_a_id ? team_b_id : team_a_id;
    } else {
      bowlingTeamId = toss_winner_id;
      battingTeamId = toss_winner_id === team_a_id ? team_b_id : team_a_id;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('token');
      
      const res = await fetch(`${API_URL}/api/matches/${mId}/innings/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          innings_number: 1,
          batting_team_id: battingTeamId,
          bowling_team_id: bowlingTeamId
        })
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to start innings');
      }
      
      const data = await res.json();
      setInningsId(data.data.id);
      setInningsNumber(1);
      
      // Reload match state
      fetchMatchState();
    } catch (err: any) {
      setError(err.message || 'Failed to start innings');
    }
  };

  const syncActiveOver = async (innId: string, matchState: any) => {
    try {
      // Find if there is an active over in the db (is_completed = false)
      const activeOver = matchState.overs?.find(
        (o: any) => o.innings_id === innId && !o.is_completed
      );

      if (activeOver) {
        setActiveOverId(activeOver.id);
        
        // Resolve bowler details from squads
        const squadList = (matchState.squad_a || []).concat(matchState.squad_b || []);
        const bowlerPlayer = squadList.find((p: any) => p.id === activeOver.bowler_id);
        
        const card = matchState.scorecard?.scorecard?.find((s: any) => s.innings_id === innId);
        const bowlerStats = card?.bowlers?.[activeOver.bowler_id];
        
        setActiveBowler({
          id: activeOver.bowler_id,
          name: bowlerPlayer?.name || 'Bowler',
          overs: bowlerStats?.overs || '0.0',
          runs: bowlerStats?.runs || 0,
          wickets: bowlerStats?.wickets || 0
        });

        // Filter and map deliveries for this over
        const overDeliveries = matchState.deliveries?.filter(
          (d: any) => d.over_id === activeOver.id
        ) || [];
        
        // Sort deliveries chronologically using raw_ball_number
        overDeliveries.sort((a: any, b: any) => (a.raw_ball_number || 0) - (b.raw_ball_number || 0));
        
        const mappedBalls: BallEntry[] = overDeliveries.map((d: any) => ({
          id: d.id,
          type: d.is_wicket ? 'wicket' : (d.extra_type || 'normal'),
          runs: d.extra_type === 'wide' || d.extra_type === 'noball'
            ? (d.runs_extras > 0 ? d.runs_extras - 1 : 0)
            : d.runs_batsman
        }));
        
        setThisOver(mappedBalls);
      } else {
        setActiveBowler(null);
        setActiveOverId(null);
        setThisOver([]);
      }
    } catch (err) {
      console.error('Error syncing active over:', err);
    }
  };

  const syncActiveBatsmen = (innId: string, matchState: any) => {
    const innDeliveries = matchState.deliveries?.filter((d: any) => d.innings_id === innId) || [];
    if (innDeliveries.length === 0) {
      return;
    }

    // Sort chronologically using raw_ball_number
    innDeliveries.sort((a: any, b: any) => (a.raw_ball_number || 0) - (b.raw_ball_number || 0));
    
    const lastBall = innDeliveries[innDeliveries.length - 1];
    const squadList = (matchState.squad_a || []).concat(matchState.squad_b || []);
    const getSquadMemberFromState = (id: string) => squadList.find((p: any) => p.id === id);
    const card = matchState.scorecard?.scorecard?.find((s: any) => s.innings_id === innId);

    if (lastBall.is_wicket) {
      const dismissedId = lastBall.dismissed_id;
      const survivorId = lastBall.batsman_id === dismissedId ? lastBall.non_striker_id : lastBall.batsman_id;
      
      const survivorPlayer = getSquadMemberFromState(survivorId);
      const survivorStats = card?.batsmen?.[survivorId] || { runs: 0, balls: 0, fours: 0, sixes: 0 };

      const survivorObj = survivorPlayer ? {
        id: survivorId,
        name: survivorPlayer.name,
        runs: survivorStats.runs,
        balls: survivorStats.balls,
        fours: survivorStats.fours,
        sixes: survivorStats.sixes
      } : null;

      if (lastBall.batsman_id === dismissedId) {
        setNonStriker(survivorObj);
        setStriker(null);
        setSelectingRole('replacement');
        setShowBatsmanSheet(true);
      } else {
        setStriker(survivorObj);
        setNonStriker(null);
        setSelectingRole('nonStriker');
        setShowBatsmanSheet(true);
      }
    } else {
      const bId = lastBall.batsman_id;
      const nsId = lastBall.non_striker_id;

      const p1 = getSquadMemberFromState(bId);
      const p2 = getSquadMemberFromState(nsId);

      const stats1 = card?.batsmen?.[bId] || { runs: 0, balls: 0, fours: 0, sixes: 0 };
      const stats2 = card?.batsmen?.[nsId] || { runs: 0, balls: 0, fours: 0, sixes: 0 };

      const obj1 = p1 ? {
        id: bId,
        name: p1.name,
        runs: stats1.runs,
        balls: stats1.balls,
        fours: stats1.fours,
        sixes: stats1.sixes
      } : null;

      const obj2 = p2 ? {
        id: nsId,
        name: p2.name,
        runs: stats2.runs,
        balls: stats2.balls,
        fours: stats2.fours,
        sixes: stats2.sixes
      } : null;

      const runsBatsman = lastBall.runs_batsman || 0;
      const floatOvers = parseFloat(card?.overs || "0.0");
      const ballsInOver = Math.round((floatOvers - Math.floor(floatOvers)) * 10);
      const overJustCompleted = (ballsInOver === 0 && floatOvers > 0);

      let shouldRotate = (runsBatsman % 2 !== 0);
      if (overJustCompleted) {
        shouldRotate = !shouldRotate;
      }

      if (shouldRotate) {
        setStriker(obj2);
        setNonStriker(obj1);
      } else {
        setStriker(obj1);
        setNonStriker(obj2);
      }
    }
  };

  const battingTeam = match?.innings?.find((i: any) => i.id === inningsId)?.batting_team_id === match?.team_a?.id ? match?.team_a : match?.team_b;
  const bowlingTeam = battingTeam?.id === match?.team_a?.id ? match?.team_b : match?.team_a;
  
  const battingSquad = battingTeam?.id === match?.team_a?.id ? match?.squad_a : match?.squad_b;
  const bowlingSquad = bowlingTeam?.id === match?.team_a?.id ? match?.squad_a : match?.squad_b;

  const getSquadMember = (id: string): Player | undefined => {
    return (match?.squad_a || []).concat(match?.squad_b || []).find((p: any) => p.id === id);
  };

  const handleStartOver = async (bowlerId: string) => {
    if (!inningsId) return;
    try {
      setError('');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('token');
      
      const nextOverNumber = overs + 1;
      
      const res = await fetch(`${API_URL}/api/matches/innings/${inningsId}/over/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          over_number: nextOverNumber,
          bowler_id: bowlerId
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to start over');
      }

      const data = await res.json();
      const b = getSquadMember(bowlerId);
      
      setActiveBowler({
        id: bowlerId,
        name: b?.name || 'Bowler',
        overs: '0.0',
        runs: 0,
        wickets: 0
      });
      setActiveOverId(data.data.id);
      setThisOver([]);
      setShowBowlerSheet(false);
    } catch (err: any) {
      setError(err.message || 'Error starting over');
    }
  };

  const handleSelectBatsman = (p: Player) => {
    if (selectingRole === 'striker') {
      setStriker({ id: p.id, name: p.name, runs: 0, balls: 0, fours: 0, sixes: 0 });
    } else if (selectingRole === 'nonStriker') {
      setNonStriker({ id: p.id, name: p.name, runs: 0, balls: 0, fours: 0, sixes: 0 });
    } else if (selectingRole === 'replacement') {
      setStriker({ id: p.id, name: p.name, runs: 0, balls: 0, fours: 0, sixes: 0 });
    }
    setShowBatsmanSheet(false);
    setSelectingRole(null);
  };

  const scoreDelivery = async (runs: number, extraType: 'wide' | 'noball' | 'bye' | 'legbye' | null = null, wicketType: string | null = null) => {
    if (!inningsId || !striker || !nonStriker || !activeBowler) {
      setError('Please ensure openers and bowler are selected.');
      return;
    }
    
    try {
      setScoringBall(true);
      setError('');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('token');

      // Calculations for backend delivery payload
      const runsBatsman = extraType === 'wide' || extraType === 'noball' ? 0 : runs;
      let runsExtras = 0;
      if (extraType === 'wide' || extraType === 'noball') {
        runsExtras = 1 + runs;
      } else if (extraType === 'bye' || extraType === 'legbye') {
        runsExtras = runs;
      }

      const body = {
        batsman_id: striker.id,
        non_striker_id: nonStriker.id,
        bowler_id: activeBowler.id,
        runs_batsman: runsBatsman,
        runs_extras: runsExtras,
        extra_type: extraType,
        is_wicket: !!wicketType,
        wicket_type: wicketType,
        dismissed_id: wicketType ? striker.id : null
      };

      const response = await fetch(`${API_URL}/api/matches/innings/${inningsId}/deliver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to score ball');
      }

      const data = await response.json();
      const card = data.data?.scorecard?.find((s: any) => s.innings_id === inningsId);

      if (card) {
        // Sync scoreboard
        setTotalRuns(card.total_runs);
        setWickets(card.total_wickets);
        
        const floatOvers = parseFloat(card.overs) || 0.0;
        const newOvers = Math.floor(floatOvers);
        const newBalls = Math.round((floatOvers - Math.floor(floatOvers)) * 10);
        
        setOvers(newOvers);
        setBalls(newBalls);

        // Update striker stats
        const strikerStats = card.batsmen[striker.id];
        if (strikerStats) {
          setStriker((prev: any) => ({
            ...prev,
            runs: strikerStats.runs,
            balls: strikerStats.balls,
            fours: strikerStats.fours,
            sixes: strikerStats.sixes
          }));
        }

        // Update non-striker stats
        const nonStrikerStats = card.batsmen[nonStriker.id];
        if (nonStrikerStats) {
          setNonStriker((prev: any) => ({
            ...prev,
            runs: nonStrikerStats.runs,
            balls: nonStrikerStats.balls,
            fours: nonStrikerStats.fours,
            sixes: nonStrikerStats.sixes
          }));
        }

        // Update bowler stats
        const bowlerStats = card.bowlers[activeBowler.id];
        if (bowlerStats) {
          setActiveBowler((prev: any) => ({
            ...prev,
            overs: bowlerStats.overs,
            runs: bowlerStats.runs,
            wickets: bowlerStats.wickets
          }));
        }

        // Add to thisOver visualization
        const labelType = extraType || (wicketType ? 'wicket' as const : 'normal' as const);
        const newBall: BallEntry = { id: Date.now(), runs, type: labelType };
        setThisOver((prev) => [...prev, newBall]);

        // Swapping batsman ends
        const isLegal = extraType !== 'wide' && extraType !== 'noball';
        
        // 1. Swap strike on odd runs (only batsman runs rotate strike)
        if (runsBatsman % 2 !== 0 && !wicketType) {
          setStriker(nonStriker);
          setNonStriker(striker);
        }

        // 2. Wicket management
        if (wicketType) {
          setStriker(null); // Striker is out, trigger replacement selection
          setSelectingRole('replacement');
          setShowBatsmanSheet(true);
        }

        // 3. Over Completed: trigger bowler selector and swap strike (since new over starts from opposite end)
        if (isLegal && newBalls === 0 && !wicketType) {
          setStriker(nonStriker);
          setNonStriker(striker);
          setActiveBowler(null); // Require new bowler
          setShowBowlerSheet(true);
        }
      }
      
      setExtraMode(null);
    } catch (err: any) {
      setError(err.message || 'Failed to record ball');
    } finally {
      setScoringBall(false);
    }
  };

  const handleConfirmWicket = () => {
    if (!selectedWicketType) return;
    scoreDelivery(0, null, selectedWicketType);
    setShowWicketSheet(false);
    setSelectedWicketType(null);
  };

  const handleStartSecondInnings = async () => {
    if (!matchId || !match) return;
    try {
      setLoading(true);
      setError('');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('token');

      const inn1 = match.innings?.find((i: any) => i.innings_number === 1);
      if (!inn1) throw new Error("Innings 1 details not found");

      // Swap teams
      const battingTeamId = inn1.bowling_team_id;
      const bowlingTeamId = inn1.batting_team_id;

      const res = await fetch(`${API_URL}/api/matches/${matchId}/innings/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          innings_number: 2,
          batting_team_id: battingTeamId,
          bowling_team_id: bowlingTeamId
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to start second innings');
      }

      // Reset local striker/non-striker/bowler state
      setStriker(null);
      setNonStriker(null);
      setActiveBowler(null);
      setActiveOverId(null);
      setThisOver([]);
      
      // Reload match state
      await fetchMatchState();
    } catch (err: any) {
      setError(err.message || 'Failed to start second innings');
      setLoading(false);
    }
  };

  const getMatchResultString = () => {
    const inn1 = match?.innings?.find((i: any) => i.innings_number === 1);
    const inn2 = match?.innings?.find((i: any) => i.innings_number === 2);
    if (!inn1 || !inn2) return "";

    const team1Name = match?.team_a?.name || "Team A";
    const team2Name = match?.team_b?.name || "Team B";

    const runs1 = inn1.total_runs || 0;
    const runs2 = inn2.total_runs || 0;
    const wickets2 = inn2.total_wickets || 0;

    const bat2TeamId = inn2.batting_team_id;
    const bat2TeamName = bat2TeamId === match?.team_a?.id ? team1Name : team2Name;
    const bat1TeamName = bat2TeamId === match?.team_a?.id ? team2Name : team1Name;

    if (runs2 > runs1) {
      const battingSquad = bat2TeamId === match?.team_a?.id ? match?.squad_a : match?.squad_b;
      const squadSize = battingSquad?.length || 11;
      const wicketsLeft = squadSize - wickets2;
      return `${bat2TeamName} won by ${wicketsLeft} wicket${wicketsLeft !== 1 ? 's' : ''} 🏆`;
    } else if (runs2 < runs1) {
      const margin = runs1 - runs2;
      return `${bat1TeamName} won by ${margin} run${margin !== 1 ? 's' : ''} 🏆`;
    } else {
      return "Match Tied! 🤝";
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-[390px] min-h-screen bg-[#000000] text-[#ffffff] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-[#a855f7]" size={28} />
        <span className="text-xs text-[#a3a3a3] font-bold">Initializing scoring engine...</span>
      </div>
    );
  }

  // Find remaining batsmen for batsman sheet
  const availableBatsmen = (battingSquad || []).filter(
    (p: any) => p.id !== striker?.id && p.id !== nonStriker?.id
  );

  // Find the last completed over in the current innings
  const lastCompletedOver = match?.overs
    ?.filter((o: any) => o.innings_id === inningsId && o.is_completed)
    ?.sort((a: any, b: any) => b.over_number - a.over_number)[0];
  const lastBowlerId = lastCompletedOver?.bowler_id || null;

  // Available bowlers (cannot bowl consecutive overs)
  const availableBowlers = (bowlingSquad || []).filter(
    (p: any) => p.id !== lastBowlerId && p.id !== activeBowler?.id
  );

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-[#000000] text-[#ffffff] font-sans relative overflow-x-hidden shadow-2xl pb-10">

      {/* Header Bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-[#000000]">
        <button onClick={() => navigate(-1)} className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold text-[#10b981] animate-pulse">● LIVE SCORING</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleShareMatch}
            className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors flex items-center gap-1.5"
            title="Share Live Scorecard Link"
          >
            <Share2 size={18} />
            {copied && <span className="text-[10px] text-[#10b981] font-bold">Copied!</span>}
          </button>
          <button className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      {error && (
        <div className="mx-4 mb-4 bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-xl p-3 text-center text-xs text-[#ef4444] flex items-center justify-center gap-2">
          <AlertCircle size={14} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Scoreboard */}
      <div className="px-4 pb-3">
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-2xl px-5 py-5 border border-[#222]">
          {/* Team Names */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: battingTeam?.color || '#a855f7' }}
              >
                <span className="text-xs font-bold text-[#000]">{battingTeam?.initials || 'T1'}</span>
              </div>
              <span className="text-base font-bold text-[#ffffff]">{battingTeam?.name || 'Village Kings'}</span>
            </div>
            <span className="text-xs text-[#a3a3a3]">vs {bowlingTeam?.name || 'Opponents'}</span>
          </div>

          {/* Main Score */}
          <div className="flex items-end justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-[#ffffff] tracking-tight">{totalRuns}</span>
              <span className="text-3xl font-black text-[#a3a3a3]">/</span>
              <span className="text-3xl font-black text-[#a3a3a3]">{wickets}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-[#a3a3a3] tracking-widest block mb-1">OVERS</span>
              <span className="text-2xl font-black text-[#ffffff]">{overs}.{balls}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Scoring Dashboard */}
      <main className="px-4 space-y-4">
        
        {/* Innings Break Card */}
        {match?.match?.status === 'innings_break' && (
          <div className="bg-gradient-to-br from-[#2d1b4e] to-[#111] border border-[#a855f7]/30 rounded-2xl p-6 text-center space-y-4 my-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-[#a855f7]/20 flex items-center justify-center mx-auto text-[#a855f7]">
              <Swords size={24} />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Innings 1 Completed</h3>
              {(() => {
                const inn1 = match.innings?.find((i: any) => i.innings_number === 1);
                if (!inn1) return null;
                const battingTeamName = inn1.batting_team_id === match.team_a?.id ? match.team_a?.name : match.team_b?.name;
                const bowlingTeamName = inn1.bowling_team_id === match.team_a?.id ? match.team_a?.name : match.team_b?.name;
                return (
                  <div className="mt-2 space-y-2">
                    <p className="text-xs text-[#a3a3a3]">
                      <strong className="text-white">{battingTeamName}</strong> scored <strong className="text-[#c799ff]">{inn1.total_runs}/{inn1.total_wickets}</strong> in <strong className="text-white">{inn1.overs_played}</strong> overs.
                    </p>
                    <div className="bg-[#000]/30 rounded-xl p-3 inline-block mt-2">
                      <p className="text-xs text-[#fbbf24] font-bold">
                        Target: {inn1.total_runs + 1} runs
                      </p>
                      <p className="text-[10px] text-[#a3a3a3] mt-0.5">
                        {bowlingTeamName} needs {inn1.total_runs + 1} runs to win.
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
            <button
              onClick={handleStartSecondInnings}
              className="w-full bg-[#a855f7] hover:bg-[#c799ff] text-black font-bold py-3.5 rounded-xl text-sm transition-colors shadow-[0_4px_16px_rgba(168,85,247,0.3)]"
            >
              Start Second Innings 🏏
            </button>
          </div>
        )}

        {/* Match Completed Card */}
        {match?.match?.status === 'completed' && (
          <div className="bg-gradient-to-br from-[#3d2c0a] to-[#111] border border-[#fbbf24]/30 rounded-2xl p-6 text-center space-y-4 my-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-[#fbbf24]/20 flex items-center justify-center mx-auto text-[#fbbf24]">
              <Trophy size={24} />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Match Completed</h3>
              <p className="text-sm font-bold text-[#fbbf24] mt-2">
                {getMatchResultString()}
              </p>
              {(() => {
                const inn1 = match.innings?.find((i: any) => i.innings_number === 1);
                const inn2 = match.innings?.find((i: any) => i.innings_number === 2);
                if (!inn1 || !inn2) return null;
                const teamAName = match.team_a?.name || "Team A";
                const teamBName = match.team_b?.name || "Team B";
                
                const inn1BatTeam = inn1.batting_team_id === match.team_a?.id ? teamAName : teamBName;
                const inn2BatTeam = inn2.batting_team_id === match.team_a?.id ? teamAName : teamBName;
                
                return (
                  <div className="text-[10px] text-[#a3a3a3] space-y-1 mt-3">
                    <p>{inn1BatTeam}: {inn1.total_runs}/{inn1.total_wickets} ({inn1.overs_played} Ov)</p>
                    <p>{inn2BatTeam}: {inn2.total_runs}/{inn2.total_wickets} ({inn2.overs_played} Ov)</p>
                  </div>
                );
              })()}
            </div>
            <button
              onClick={() => navigate(`/match/${matchId}/summary`, { state: { team1: match?.team_a, team2: match?.team_b } })}
              className="w-full bg-[#fbbf24] hover:bg-[#fcd34d] text-black font-bold py-3.5 rounded-xl text-sm transition-colors shadow-[0_4px_16px_rgba(251,191,36,0.3)]"
            >
              View Match Summary 🏆
            </button>
          </div>
        )}

        {/* Live Scoring View */}
        {match?.match?.status === 'playing' && (
          <>
            {/* Openers / Active Batsmen Setup Trigger */}
            {(!striker || !nonStriker) && (
              <div className="bg-[#1a1a1a] border border-[#a855f7]/30 rounded-2xl p-4 flex flex-col gap-3 items-center text-center">
                <Swords className="text-[#c799ff]" size={24} />
                <div>
                  <h4 className="text-xs font-bold text-white">Select Opening Batsmen</h4>
                  <p className="text-[10px] text-[#a3a3a3] mt-0.5">Assign batsman at strike and non-striker to start.</p>
                </div>
                <div className="flex gap-2 w-full">
                  {!striker && (
                    <button
                      onClick={() => { setSelectingRole('striker'); setShowBatsmanSheet(true); }}
                      className="flex-1 bg-[#a855f7] text-black font-bold py-2 rounded-xl text-xs"
                    >
                      Set Striker
                    </button>
                  )}
                  {!nonStriker && (
                    <button
                      onClick={() => { setSelectingRole('nonStriker'); setShowBatsmanSheet(true); }}
                      className="flex-1 bg-[#242424] text-white font-bold py-2 rounded-xl text-xs hover:bg-[#333]"
                    >
                      Set Non-Striker
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Bowler Setup Trigger */}
            {!activeBowler && (
              <div className="bg-[#1a1a1a] border border-[#f59e0b]/30 rounded-2xl p-4 flex flex-col gap-3 items-center text-center">
                <Shield className="text-[#fbbf24]" size={24} />
                <div>
                  <h4 className="text-xs font-bold text-white">Set Bowler for Over {overs + 1}</h4>
                  <p className="text-[10px] text-[#a3a3a3] mt-0.5">Assign bowler to begin scoring deliveries.</p>
                </div>
                <button
                  onClick={() => setShowBowlerSheet(true)}
                  className="w-full bg-[#f59e0b] text-black font-bold py-2 rounded-xl text-xs"
                >
                  Assign Bowler
                </button>
              </div>
            )}

            {/* Batsmen & Bowler Stat Cards */}
            <section className="grid grid-cols-2 gap-3">
              {/* Batsmen Stats */}
              <div className="bg-[#111] rounded-2xl p-4 border border-[#222] space-y-3">
                <span className="text-[9px] font-bold text-[#565555] tracking-widest uppercase block">Batsmen</span>
                <div className="space-y-2">
                  {striker ? (
                    <div className="flex justify-between items-center bg-[#1a1a1a] rounded-lg p-2 border border-[#a855f7]/20">
                      <span className="text-xs font-bold text-white truncate max-w-[70px]">🏏 {striker.name.split(' ')[0]}</span>
                      <span className="text-xs font-black text-[#c799ff]">{striker.runs}({striker.balls})</span>
                    </div>
                  ) : (
                    <div className="text-[10px] text-[#565555] py-2 text-center">No Striker</div>
                  )}
                  {nonStriker ? (
                    <div className="flex justify-between items-center bg-[#141414] rounded-lg p-2">
                      <span className="text-xs font-bold text-[#a3a3a3] truncate max-w-[70px]">{nonStriker.name.split(' ')[0]}</span>
                      <span className="text-xs font-bold text-[#888]">{nonStriker.runs}({nonStriker.balls})</span>
                    </div>
                  ) : (
                    <div className="text-[10px] text-[#565555] py-2 text-center">No Non-Striker</div>
                  )}
                </div>
              </div>

              {/* Bowler Stats */}
              <div className="bg-[#111] rounded-2xl p-4 border border-[#222] space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold text-[#565555] tracking-widest uppercase block mb-3">Bowler</span>
                  {activeBowler ? (
                    <div>
                      <span className="text-sm font-bold text-white block truncate">{activeBowler.name}</span>
                      <span className="text-[10px] font-bold text-[#a3a3a3] block mt-0.5">Overs: {activeBowler.overs}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-[#565555]">No Bowler assigned</span>
                  )}
                </div>
                {activeBowler && (
                  <div className="text-right border-t border-[#222] pt-2">
                    <span className="text-sm font-black text-[#f87171]">{activeBowler.wickets} <span className="text-[9px] text-[#565555]">WKTS</span></span>
                    <span className="text-sm font-black text-[#fff] ml-2">{activeBowler.runs} <span className="text-[9px] text-[#565555]">RUNS</span></span>
                  </div>
                )}
              </div>
            </section>

            {/* This Over Deliveries View */}
            <section className="bg-[#111] rounded-2xl p-4 border border-[#222]">
              <span className="text-[9px] font-bold text-[#565555] tracking-widest uppercase block mb-3">THIS OVER</span>
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                {thisOver.map((entry, idx) => (
                  <div
                    key={idx}
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${ballColor(entry)}`}
                  >
                    {ballLabel(entry)}
                  </div>
                ))}
                {thisOver.length === 0 && (
                  <span className="text-xs text-[#565555] py-1">Deliveries will show up here</span>
                )}
              </div>
            </section>

            {/* Scoring Input Pad */}
            <section className="bg-[#111] rounded-2xl p-4 border border-[#222] space-y-4">
              {/* Extras Toggle Trow */}
              <div className="flex justify-between gap-1.5">
                {(['wide', 'noball', 'bye', 'legbye'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setExtraMode(extraMode === mode ? null : mode)}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-bold tracking-wider uppercase border transition-all ${
                      extraMode === mode
                        ? 'bg-[#fbbf24] border-[#fbbf24] text-black shadow-[0_0_12px_rgba(251,191,36,0.2)]'
                        : 'bg-[#1a1a1a] border-transparent text-[#a3a3a3] hover:bg-[#222]'
                    }`}
                  >
                    {mode === 'noball' ? 'NO BALL' : mode}
                  </button>
                ))}
              </div>

              {/* Runs Buttons Grid */}
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3, 4, 6].map((run) => (
                  <button
                    key={run}
                    onClick={() => scoreDelivery(run, extraMode)}
                    disabled={scoringBall || !striker || !activeBowler}
                    className={`py-4 rounded-2xl font-black text-lg transition-all flex flex-col items-center justify-center border ${
                      run === 4
                        ? 'bg-[#22c55e]/10 border-[#22c55e]/30 text-[#22c55e] hover:bg-[#22c55e]/20'
                        : run === 6
                        ? 'bg-[#6366f1]/10 border-[#6366f1]/30 text-[#6366f1] hover:bg-[#6366f1]/20'
                        : 'bg-[#1a1a1a] border-[#242424] text-white hover:bg-[#222]'
                    } disabled:opacity-30 disabled:cursor-not-allowed`}
                  >
                    {run}
                    <span className="text-[8px] font-bold text-[#565555] tracking-widest mt-0.5">RUNS</span>
                  </button>
                ))}

                {/* Wicket Elector */}
                <button
                  onClick={() => setShowWicketSheet(true)}
                  disabled={scoringBall || !striker || !activeBowler}
                  className="col-span-2 py-4 rounded-2xl bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] font-black text-sm flex items-center justify-center hover:bg-[#ef4444]/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  WICKET 🔴
                </button>
              </div>
            </section>
          </>
        )}

        {/* Quick Routing Links */}
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/match/${matchId}/scorecard`)}
            className="flex-1 bg-[#1a1a1a] rounded-xl py-3 text-[10px] font-bold text-[#a3a3a3] text-center hover:bg-[#222] transition-colors"
          >
            DETAILED SCORECARD
          </button>
          <button
            onClick={() => setShowBowlerSheet(true)}
            disabled={!inningsId || match?.match?.status !== 'playing'}
            className="flex-1 bg-[#1a1a1a] rounded-xl py-3 text-[10px] font-bold text-[#a3a3a3] text-center hover:bg-[#222] transition-colors disabled:opacity-50"
          >
            CHANGE BOWLER
          </button>
          <button
            onClick={() => navigate(`/match/${matchId}/summary`)}
            className="flex-1 bg-[#2d1b4e] rounded-xl py-3 text-[10px] font-bold text-[#c799ff] text-center hover:bg-[#3d2c60] transition-colors"
          >
            END INNINGS
          </button>
        </div>

      </main>

      {/* Wicket Selection Bottom Sheet */}
      {showWicketSheet && (
        <>
          <div onClick={() => setShowWicketSheet(false)} className="fixed inset-0 bg-[#000]/60 z-50 backdrop-blur-sm" />
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-[#1a1a1a] rounded-t-3xl z-50 animate-slideUp">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-[#333] rounded-full"></div>
            </div>
            <div className="flex items-center justify-between px-5 pt-2 pb-4">
              <h2 className="text-xl font-black text-[#ffffff]">Select Wicket Type</h2>
              <button onClick={() => setShowWicketSheet(false)} className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors">
                <X size={22} />
              </button>
            </div>
            <div className="px-5 pb-4">
              <span className="text-[9px] font-bold text-[#565555] tracking-widest uppercase block mb-2">DISMISSED BATSMAN</span>
              {striker && (
                <div className="bg-[#111] rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#242424] flex items-center justify-center">
                      <span className="text-sm font-bold text-[#a3a3a3]">{striker.name.split(' ').map((w: any) => w[0]).join('')}</span>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-[#ffffff] block">{striker.name}</span>
                      <span className="text-[10px] text-[#a3a3a3]">Batsman · {striker.runs}({striker.balls})</span>
                    </div>
                  </div>
                  <span className="bg-[#ef4444]/20 text-[#ef4444] text-[9px] font-bold px-2.5 py-1 rounded-full">OUT</span>
                </div>
              )}
            </div>
            <div className="px-5 pb-5 grid grid-cols-2 gap-2 max-h-[40vh] overflow-y-auto">
              {wicketTypes.map((wt) => (
                <button
                  key={wt.id}
                  onClick={() => setSelectedWicketType(wt.id)}
                  className={`rounded-xl p-4 flex flex-col gap-2 text-left transition-all border ${
                    selectedWicketType === wt.id
                      ? 'bg-[#ef4444]/15 border-[#ef4444] text-[#ff8e8e]'
                      : 'bg-[#111] border-transparent hover:bg-[#1f1f1f] text-[#ffffff]'
                  }`}
                >
                  <span className="text-xl">{wt.icon}</span>
                  <span className="text-xs font-bold">{wt.label}</span>
                </button>
              ))}
            </div>
            <div className="px-5 pb-8">
              <button
                onClick={handleConfirmWicket}
                disabled={!selectedWicketType}
                className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  selectedWicketType
                    ? 'bg-[#ef4444] text-[#ffffff] hover:bg-[#dc2626] active:scale-[0.98]'
                    : 'bg-[#333] text-[#565555] cursor-not-allowed'
                }`}
              >
                CONFIRM WICKET
              </button>
            </div>
          </div>
        </>
      )}

      {/* Bowler Selection Bottom Sheet */}
      {showBowlerSheet && (
        <>
          <div onClick={() => setShowBowlerSheet(false)} className="fixed inset-0 bg-[#000]/60 z-50 backdrop-blur-sm" />
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-[#1a1a1a] rounded-t-3xl z-50 animate-slideUp max-h-[60vh] overflow-y-auto">
            <div className="flex justify-center pt-3 pb-1 sticky top-0 bg-[#1a1a1a] z-10">
              <div className="w-10 h-1 bg-[#333] rounded-full"></div>
            </div>
            <div className="text-center px-5 pt-2 pb-4 sticky top-5 bg-[#1a1a1a] z-10 border-b border-[#222]">
              <h2 className="text-xl font-black text-[#ffffff]">Select Bowler</h2>
              <p className="text-xs text-[#a3a3a3] mt-1">For Over {overs + 1} · {bowlingTeam?.name || 'Opponents'} bowling</p>
            </div>
            <div className="px-5 py-4 space-y-2">
              {availableBowlers.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#565555]">No bowlers available in Playing XI.</div>
              ) : (
                availableBowlers.map((b: any) => (
                  <button
                    key={b.id}
                    onClick={() => handleStartOver(b.id)}
                    className="w-full bg-[#111] rounded-xl p-3 flex items-center justify-between hover:bg-[#222] transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#3b82f6] flex items-center justify-center text-[#fff] font-bold text-xs">
                        {b.initials}
                      </div>
                      <span className="text-sm font-bold text-white">{b.name}</span>
                    </div>
                    <ChevronRight size={16} className="text-[#565555]" />
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* Batsman Selection Bottom Sheet */}
      {showBatsmanSheet && (
        <>
          <div onClick={() => setShowBatsmanSheet(false)} className="fixed inset-0 bg-[#000]/60 z-50 backdrop-blur-sm" />
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-[#1a1a1a] rounded-t-3xl z-50 animate-slideUp max-h-[60vh] overflow-y-auto">
            <div className="flex justify-center pt-3 pb-1 sticky top-0 bg-[#1a1a1a] z-10">
              <div className="w-10 h-1 bg-[#333] rounded-full"></div>
            </div>
            <div className="text-center px-5 pt-2 pb-4 sticky top-5 bg-[#1a1a1a] z-10 border-b border-[#222]">
              <h2 className="text-xl font-black text-[#ffffff]">Select Batsman</h2>
              <p className="text-xs text-[#a3a3a3] mt-1">
                {selectingRole === 'replacement' ? 'Select Replacement Striker' : `Select ${selectingRole === 'striker' ? 'Striker' : 'Non-Striker'}`}
              </p>
            </div>
            <div className="px-5 py-4 space-y-2">
              {availableBatsmen.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#565555]">All squad players have batted. Innings over.</div>
              ) : (
                availableBatsmen.map((p: any) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectBatsman(p)}
                    className="w-full bg-[#111] rounded-xl p-3 flex items-center justify-between hover:bg-[#222] transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#10b981] flex items-center justify-center text-[#000] font-black text-xs">
                        {p.initials}
                      </div>
                      <span className="text-sm font-bold text-white">{p.name}</span>
                    </div>
                    <ChevronRight size={16} className="text-[#565555]" />
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}

    </div>
  );
}
