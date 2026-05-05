import React, { useState } from 'react';
import { ArrowLeft, Search, X, Star, Shield, ChevronRight } from 'lucide-react';
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

const mockPlayers: Player[] = [
  { id: '1', name: 'Virat Kohli', initials: 'VK', role: 'Batsman', jersey: 18, isCaptain: true },
  { id: '2', name: 'Rohit Sharma', initials: 'RS', role: 'Batsman', jersey: 45 },
  { id: '3', name: 'KL Rahul', initials: 'KR', role: 'WK-Batsman', jersey: 1, isWicketKeeper: true },
  { id: '4', name: 'Hardik Pandya', initials: 'HP', role: 'All-Rounder', jersey: 33 },
  { id: '5', name: 'Ravindra Jadeja', initials: 'RJ', role: 'All-Rounder', jersey: 8 },
  { id: '6', name: 'Jasprit Bumrah', initials: 'JB', role: 'Bowler', jersey: 93 },
  { id: '7', name: 'Mohammed Shami', initials: 'MS', role: 'Bowler', jersey: 11 },
  { id: '8', name: 'Yuzvendra Chahal', initials: 'YC', role: 'Bowler', jersey: 3 },
  { id: '9', name: 'Shreyas Iyer', initials: 'SI', role: 'Batsman', jersey: 41 },
  { id: '10', name: 'Rishabh Pant', initials: 'RP', role: 'WK-Batsman', jersey: 17 },
  { id: '11', name: 'Axar Patel', initials: 'AP', role: 'All-Rounder', jersey: 20 },
  { id: '12', name: 'Shardul Thakur', initials: 'ST', role: 'All-Rounder', jersey: 54 },
  { id: '13', name: 'Kuldeep Yadav', initials: 'KY', role: 'Bowler', jersey: 23 },
  { id: '14', name: 'Shubman Gill', initials: 'SG', role: 'Batsman', jersey: 77 },
];

const roleColors: Record<string, { bg: string; text: string }> = {
  Batsman: { bg: 'bg-[#1e3a5f]', text: 'text-[#60a5fa]' },
  Bowler: { bg: 'bg-[#3b1d1d]', text: 'text-[#f87171]' },
  'All-Rounder': { bg: 'bg-[#1a3329]', text: 'text-[#4ade80]' },
  'WK-Batsman': { bg: 'bg-[#3d2c0a]', text: 'text-[#fbbf24]' },
};

const roleFilters = ['All', 'Batsman', 'Bowler', 'All-Rounder', 'WK-Batsman'];

export default function PlayingXI() {
  const navigate = useNavigate();
  const location = useLocation();
  const { teamId } = useParams();
  const { team1, team2, tossWinner, decision, currentTeamIndex } = (location.state as {
    team1: TeamData | null;
    team2: TeamData | null;
    tossWinner: TeamData | null;
    decision: string | null;
    currentTeamIndex: number;
  }) || { team1: null, team2: null, tossWinner: null, decision: null, currentTeamIndex: 0 };

  const currentTeam = currentTeamIndex === 0 ? team1 : team2;

  const [selected, setSelected] = useState<Set<string>>(new Set(mockPlayers.slice(0, 11).map((p) => p.id)));
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const maxPlayers = 11;

  const filteredPlayers = mockPlayers.filter((p) => {
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

  const handleProceed = () => {
    if (currentTeamIndex === 0) {
      // Go to team 2 Playing XI selection
      navigate(`/match/1/playing-xi/${team2?.id || '2'}`, {
        state: { team1, team2, tossWinner, decision, currentTeamIndex: 1 },
      });
    } else {
      // Both teams done — go to live scoring
      navigate(`/match/1/scoring`, { state: { team1, team2, tossWinner, decision } });
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
          {/* Player Count Badge */}
          <div className={`px-3 py-1.5 rounded-full flex items-center gap-1 ${
            selected.size === maxPlayers ? 'bg-[#10b981]/20 border border-[#10b981]/30' : 'bg-[#2d1b4e] border border-[#a855f7]/30'
          }`}>
            <span className={`text-sm font-black ${selected.size === maxPlayers ? 'text-[#10b981]' : 'text-[#c799ff]'}`}>
              {selected.size}
            </span>
            <span className="text-[10px] font-bold text-[#a3a3a3]">/ {maxPlayers}</span>
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
        {filteredPlayers.map((player) => {
          const isSelected = selected.has(player.id);
          const roleStyle = roleColors[player.role];
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
        })}
      </main>

      {/* Footer */}
      <div className="fixed bottom-0 w-full max-w-[390px] bg-gradient-to-t from-[#000000] via-[#000000] to-transparent px-4 pt-6 pb-8 z-50">
        <button
          onClick={handleProceed}
          disabled={selected.size !== maxPlayers}
          className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            selected.size === maxPlayers
              ? 'bg-[#a855f7] text-[#ffffff] shadow-[0_4px_20px_rgba(168,85,247,0.35)] hover:bg-[#c799ff] active:scale-[0.98]'
              : 'bg-[#1a1a1a] text-[#565555] cursor-not-allowed'
          }`}
        >
          {selected.size === maxPlayers
            ? currentTeamIndex === 0
              ? <>Next: {team2?.name || 'Team 2'} XI <ChevronRight size={16} /></>
              : <>Start Match 🏏</>
            : `Select ${maxPlayers - selected.size} more player${maxPlayers - selected.size !== 1 ? 's' : ''}`
          }
        </button>
      </div>
    </div>
  );
}
