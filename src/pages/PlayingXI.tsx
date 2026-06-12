import React, { useEffect, useState } from 'react';
import { ArrowLeft, Search, X, Star, Shield, ChevronRight, Loader2, AlertCircle, UserPlus } from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

interface TeamData {
  id: string;
  name: string;
  initials: string;
  color: string;
  players: number;
  matches: number;
  sub: string;
}

interface Player {
  id: string;
  name: string;
  initials: string;
  role: 'Batsman' | 'Bowler' | 'All-Rounder' | 'WK-Batsman';
  jersey: number;
  isCaptain?: boolean;
  isWicketKeeper?: boolean;
}

const roleColors: Record<string, { bg: string; text: string }> = {
  Batsman: { bg: 'bg-[#1e3a5f]', text: 'text-[#60a5fa]' },
  Bowler: { bg: 'bg-[#3b1d1d]', text: 'text-[#f87171]' },
  'All-Rounder': { bg: 'bg-[#1a3329]', text: 'text-[#4ade80]' },
  'WK-Batsman': { bg: 'bg-[#3d2c0a]', text: 'text-[#fbbf24]' },
};

const mapRole = (roleStr: string) => {
  const clean = (roleStr || 'BAT').toUpperCase();
  if (clean === 'BAT') return 'Batsman';
  if (clean === 'BOWL') return 'Bowler';
  if (clean === 'ALL') return 'All-Rounder';
  if (clean === 'WK') return 'WK-Batsman';
  return 'Batsman';
};

const roleFilters = ['All', 'Batsman', 'Bowler', 'All-Rounder', 'WK-Batsman'];

export default function PlayingXI() {
  const navigate = useNavigate();
  const location = useLocation();
  const { matchId, teamId } = useParams<{ matchId: string; teamId: string }>();

  const { team1: stateTeam1, team2: stateTeam2, tossWinner: stateTossWinner, decision: stateDecision, currentTeamIndex: stateCurrentTeamIndex } = (location.state as {
    team1: TeamData | null;
    team2: TeamData | null;
    tossWinner: TeamData | null;
    decision: string | null;
    currentTeamIndex: number;
  }) || { team1: null, team2: null, tossWinner: null, decision: null, currentTeamIndex: 0 };

  const [team1, setTeam1] = useState<TeamData | null>(stateTeam1);
  const [team2, setTeam2] = useState<TeamData | null>(stateTeam2);
  const [tossWinner, setTossWinner] = useState<TeamData | null>(stateTossWinner);
  const [decision, setDecision] = useState<string | null>(stateDecision);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(stateCurrentTeamIndex);

  useEffect(() => {
    async function fetchMatchDetails() {
      if (!matchId) return;
      if (stateTeam1 && stateTeam2) {
        if (teamId === stateTeam2.id) {
          setCurrentTeamIndex(1);
        } else {
          setCurrentTeamIndex(0);
        }
        return;
      }
      
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/matches/${matchId}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error('Failed to fetch match details');
        const data = await res.json();
        const matchState = data.data;
        
        const t1 = matchState.team_a;
        const t2 = matchState.team_b;
        
        setTeam1(t1);
        setTeam2(t2);
        
        const twId = matchState.match?.toss_winner_id;
        if (twId) {
          setTossWinner(twId === t1.id ? t1 : t2);
        }
        setDecision(matchState.match?.toss_election || null);
        
        if (teamId === t2.id) {
          setCurrentTeamIndex(1);
        } else {
          setCurrentTeamIndex(0);
        }
      } catch (err: any) {
        console.error('Error fetching match details:', err);
      }
    }
    fetchMatchDetails();
  }, [matchId, teamId, stateTeam1, stateTeam2]);

  const currentTeam = currentTeamIndex === 0 ? team1 : team2;

  const [players, setPlayers] = useState<Player[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const maxPlayers = Math.min(11, players.length || 11);

  // Fetch squad on mount
  useEffect(() => {
    async function fetchPlayers() {
      if (!teamId) return;
      try {
        setLoading(true);
        setError('');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/teams/${teamId}/players`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch team players');
        }
        const data = await res.json();
        const rawPlayers = data.data?.players || [];
        
        const mapped: Player[] = rawPlayers.map((p: any, idx: number) => {
          let initials = '';
          if (p.first_name) initials += p.first_name[0].toUpperCase();
          if (p.last_name) initials += p.last_name[0].toUpperCase();
          if (!initials) initials = p.name ? p.name.slice(0, 2).toUpperCase() : '??';

          return {
            id: p.id || String(idx),
            name: p.name,
            initials,
            role: mapRole(p.role),
            jersey: p.jersey_number || (idx + 1),
            isCaptain: p.is_captain || false,
            isWicketKeeper: p.role === 'WK',
          };
        });
        
        setPlayers(mapped);
        
        // Auto select first maxPlayers
        const limit = Math.min(11, mapped.length);
        setSelected(new Set(mapped.slice(0, limit).map((p) => p.id)));
      } catch (err: any) {
        setError(err.message || 'Error fetching players');
      } finally {
        setLoading(false);
      }
    }
    fetchPlayers();
  }, [teamId]);

  const filteredPlayers = players.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' || p.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const togglePlayer = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < maxPlayers) {
        next.add(id);
      }
      return next;
    });
  };

  const handleProceed = async () => {
    if (!matchId || !teamId) return;
    try {
      setSubmitting(true);
      setError('');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('token');

      // Identify Captain & VC
      const selectedPlayersList = players.filter((p) => selected.has(p.id));
      const captain = selectedPlayersList.find((p) => p.isCaptain);
      const captainId = captain ? captain.id : (selectedPlayersList[0]?.id || null);
      const viceCaptainId = selectedPlayersList.length > 1 ? selectedPlayersList[1].id : null;

      const body = {
        team_id: teamId,
        player_ids: Array.from(selected),
        captain_id: captainId,
        vice_captain_id: viceCaptainId,
      };

      const response = await fetch(`${API_URL}/api/matches/${matchId}/squads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to submit playing XI');
      }

      if (currentTeamIndex === 0) {
        // Go to team 2 Playing XI selection
        navigate(`/match/${matchId}/playing-xi/${team2?.id || '2'}`, {
          state: { team1, team2, tossWinner, decision, currentTeamIndex: 1 },
        });
      } else {
        // Both teams done — go to live scoring
        navigate(`/match/${matchId}/scoring`, { state: { team1, team2, tossWinner, decision } });
      }
    } catch (err: any) {
      setError(err.message || 'Error saving playing XI');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-[#000000] text-[#ffffff] font-sans relative overflow-x-hidden shadow-2xl">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#000000] px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-[#ffffff] m-0">Select Playing XI</h1>
              <p className="text-xs text-[#a3a3a3] m-0">{currentTeam?.name || 'Team'}</p>
            </div>
          </div>
          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate(`/team/${teamId}/players`)}
              className="px-3 py-1.5 rounded-full bg-[#161616] border border-[#333] hover:bg-[#222] transition-colors flex items-center gap-1 text-[10px] font-bold text-[#a855f7]"
            >
              <UserPlus size={12} />
              ADD
            </button>
            <div className={`px-3 py-1.5 rounded-full flex items-center gap-1 transition-all ${
              selected.size === maxPlayers ? 'bg-[#10b981]/20 border border-[#10b981]/30' : 'bg-[#2d1b4e] border border-[#a855f7]/30'
            }`}>
              <span className={`text-sm font-black ${selected.size === maxPlayers ? 'text-[#10b981]' : 'text-[#c799ff]'}`}>
                {selected.size}
              </span>
              <span className="text-[10px] font-bold text-[#a3a3a3]">/ {maxPlayers}</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-[#1a1a1a] rounded-xl px-4 py-2.5 border border-transparent focus-within:border-[#a855f7] transition-colors mb-3">
          <Search size={14} className="text-[#565555] flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search players..."
            className="w-full bg-transparent text-sm text-[#ffffff] outline-none placeholder:text-[#565555]"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors flex-shrink-0">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Role Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {roleFilters.map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${
                roleFilter === role
                  ? 'bg-[#a855f7] text-[#ffffff]'
                  : 'bg-[#1a1a1a] text-[#a3a3a3] hover:bg-[#222]'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </header>

      {/* Player List */}
      <main className="px-4 pb-28 space-y-1.5">
        {error && (
          <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-xl p-3 text-center text-xs text-[#ef4444] flex items-center justify-center gap-2 mb-2">
            <AlertCircle size={14} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-xs text-[#a3a3a3]">
            <Loader2 size={24} className="animate-spin text-[#a855f7]" />
            <span>Loading squad roster...</span>
          </div>
        ) : players.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center gap-4 bg-[#111] rounded-2xl p-6 border border-[#222]">
            <span className="text-xs text-[#a3a3a3] leading-relaxed">No players found in this team's roster yet. Add players to build your Playing XI.</span>
            <button
              onClick={() => navigate(`/team/${teamId}/players`)}
              className="bg-[#a855f7] hover:bg-[#c799ff] text-black font-bold py-2.5 px-6 rounded-xl text-xs transition-colors flex items-center gap-1.5"
            >
              <UserPlus size={14} />
              Add Players to Team
            </button>
          </div>
        ) : filteredPlayers.length === 0 ? (
          <div className="text-center py-16 text-xs text-[#565555]">
            No players found matching current search.
          </div>
        ) : (
          filteredPlayers.map((player) => {
            const isSelected = selected.has(player.id);
            const roleStyle = roleColors[player.role] || { bg: 'bg-[#222]', text: 'text-[#aaa]' };
            return (
              <button
                key={player.id}
                onClick={() => togglePlayer(player.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                  isSelected
                    ? 'bg-[#1a1a1a] border border-[#a855f7]/30'
                    : 'bg-transparent border border-transparent hover:bg-[#0f0f0f]'
                }`}
              >
                {/* Selection Indicator */}
                <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all ${
                  isSelected ? 'bg-[#a855f7]' : 'border-2 border-[#333]'
                }`}>
                  {isSelected && <span className="text-[#ffffff] text-[10px] font-bold">✓</span>}
                </div>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-[#242424] flex items-center justify-center flex-shrink-0 relative">
                  <span className="text-sm font-bold text-[#a3a3a3]">{player.initials}</span>
                  {/* Jersey Number */}
                  <span className="absolute -bottom-0.5 -right-0.5 bg-[#333] text-[#a3a3a3] text-[7px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {player.jersey}
                  </span>
                </div>

                {/* Name & Role */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-bold text-[#ffffff] truncate">{player.name}</span>
                    {player.isCaptain && (
                      <span className="bg-[#f59e0b]/20 text-[#f59e0b] text-[7px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Star size={7} fill="currentColor" /> C
                      </span>
                    )}
                    {player.isWicketKeeper && (
                      <span className="bg-[#3b82f6]/20 text-[#60a5fa] text-[7px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Shield size={7} fill="currentColor" /> WK
                      </span>
                    )}
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${roleStyle.bg} ${roleStyle.text}`}>
                    {player.role}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </main>

      {/* Footer */}
      <div className="fixed bottom-0 w-full max-w-[390px] bg-gradient-to-t from-[#000000] via-[#000000] to-transparent px-4 pt-6 pb-8 z-50">
        <button
          onClick={handleProceed}
          disabled={selected.size !== maxPlayers || submitting}
          className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            selected.size === maxPlayers && !submitting
              ? 'bg-[#a855f7] text-[#ffffff] shadow-[0_4px_20px_rgba(168,85,247,0.35)] hover:bg-[#c799ff] active:scale-[0.98]'
              : 'bg-[#1a1a1a] text-[#565555] cursor-not-allowed'
          }`}
        >
          {submitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : selected.size === maxPlayers ? (
            currentTeamIndex === 0
              ? <>Next: {team2?.name || 'Team 2'} XI <ChevronRight size={16} /></>
              : <>Start Match 🏏</>
          ) : (
            `Select ${maxPlayers - selected.size} more player${maxPlayers - selected.size !== 1 ? 's' : ''}`
          )}
        </button>
      </div>
    </div>
  );
}
