import React, { useState, useEffect } from 'react';
import { X, Search, Plus, ChevronRight, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface TeamData {
  id: string;
  name: string;
  initials: string;
  color: string;
  players: number;
  matches: number;
  sub: string;
  created_by?: string;
}

export default function SelectTeam() {
  const navigate = useNavigate();
  const location = useLocation();
  const preselected = location.state as { preselectedTeam1?: string | null; preselectedTeam2?: string | null } | null;

  const [search, setSearch] = useState('');
  const [selectedTeam1, setSelectedTeam1] = useState<string | null>(preselected?.preselectedTeam1 ?? null);
  const [selectedTeam2, setSelectedTeam2] = useState<string | null>(preselected?.preselectedTeam2 ?? null);
  const [selectingFor, setSelectingFor] = useState<1 | 2>(
    preselected?.preselectedTeam1 && preselected?.preselectedTeam2 ? 1 : preselected?.preselectedTeam1 ? 2 : 1
  );

  const [yours, setYours] = useState<TeamData[]>([]);
  const [opponents, setOpponents] = useState<TeamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTeams() {
      try {
        setError('');
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        let currentUserId = '';
        if (userStr) {
          try {
            const userObj = JSON.parse(userStr);
            currentUserId = userObj.id || '';
          } catch (e) {
            console.error('Failed to parse user from localStorage', e);
          }
        }

        const response = await fetch(`${API_URL}/api/teams?scope=all&active_only=true`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch teams');
        }

        const json = await response.json();
        const rawTeams = json.data || [];

        // Map API response to UI expected fields
        const mappedTeams = rawTeams.map((team: any) => {
          const players = team.player_count || 0;
          const isYours = currentUserId && team.created_by === currentUserId;
          return {
            id: team.id,
            name: team.name,
            initials: team.initials || team.name.slice(0, 2).toUpperCase(),
            color: team.avatar_color || '#7c3aed',
            players: players,
            matches: 0,
            sub: isYours ? `Created by you · ${players} Players` : `${players} Players`,
            created_by: team.created_by,
          };
        });

        // Split teams
        const yourTeams = mappedTeams.filter((t: any) => currentUserId && t.created_by === currentUserId);
        const opponentTeams = mappedTeams.filter((t: any) => !currentUserId || t.created_by !== currentUserId);

        setYours(yourTeams);
        setOpponents(opponentTeams);
      } catch (err: any) {
        setError(err.message || 'Something went wrong while fetching teams');
      } finally {
        setLoading(false);
      }
    }

    fetchTeams();
  }, []);

  const filterTeams = (teamsList: TeamData[]) =>
    teamsList.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  const filteredYours = filterTeams(yours);
  const filteredOpponents = filterTeams(opponents);
  const allFiltered = [...filteredYours, ...filteredOpponents];
  const noResults = !loading && search.length > 0 && allFiltered.length === 0;

  const handleSelectTeam = (teamId: string) => {
    if (selectingFor === 1) {
      setSelectedTeam1(teamId);
      setSelectingFor(2);
    } else {
      setSelectedTeam2(teamId);
    }
  };

  const getTeamById = (id: string | null) => {
    if (!id) return null;
    return [...yours, ...opponents].find((t) => t.id === id) || null;
  };

  const team1 = getTeamById(selectedTeam1);
  const team2 = getTeamById(selectedTeam2);
  const canProceed = selectedTeam1 && selectedTeam2;

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-[#0f0f0f] text-[#ffffff] font-sans relative overflow-x-hidden shadow-2xl">
      
      {/* Drag Handle */}
      <div className="flex justify-center pt-3 pb-1">
        <div className="w-10 h-1 bg-[#333] rounded-full"></div>
      </div>

      {/* Header */}
      <header className="flex items-center gap-3 px-4 pt-3 pb-4">
        <button onClick={() => navigate(-1)} className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-[#ffffff] mb-1">Select Teams</h1>
          <p className="text-xs text-[#a3a3a3] m-0">Your teams · Opponents</p>
        </div>
        <button onClick={() => navigate('/home')} className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors">
          <X size={22} />
        </button>
      </header>

      {/* Team Selection Slots */}
      <div className="px-4 pb-4">
        <div className="flex gap-3">
          {/* Team 1 Slot */}
          <button
            onClick={() => setSelectingFor(1)}
            className={`flex-1 rounded-2xl p-3 flex items-center gap-3 transition-all ${
              selectingFor === 1
                ? 'bg-[#2d1b4e] border border-[#a855f7]'
                : 'bg-[#1a1a1a] border border-transparent'
            }`}
          >
            {team1 ? (
              <>
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: team1.color }}>
                  <span className="text-sm font-bold text-[#000]">{team1.initials}</span>
                </div>
                <div className="flex flex-col items-start overflow-hidden">
                  <span className="text-sm font-bold text-[#ffffff] truncate w-full">{team1.name}</span>
                  <span className="text-[10px] text-[#a3a3a3]">Team 1</span>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-[#a855f7] flex items-center justify-center flex-shrink-0">
                  <Plus size={16} className="text-[#a855f7]" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-bold text-[#a3a3a3]">Team 1</span>
                  <span className="text-[10px] text-[#565555]">Tap to select</span>
                </div>
              </>
            )}
          </button>

          {/* VS Divider */}
          <div className="flex items-center">
            <span className="text-xs font-bold text-[#565555]">VS</span>
          </div>

          {/* Team 2 Slot */}
          <button
            onClick={() => setSelectingFor(2)}
            className={`flex-1 rounded-2xl p-3 flex items-center gap-3 transition-all ${
              selectingFor === 2
                ? 'bg-[#2d1b4e] border border-[#a855f7]'
                : 'bg-[#1a1a1a] border border-transparent'
            }`}
          >
            {team2 ? (
              <>
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: team2.color }}>
                  <span className="text-sm font-bold text-[#000]">{team2.initials}</span>
                </div>
                <div className="flex flex-col items-start overflow-hidden">
                  <span className="text-sm font-bold text-[#ffffff] truncate w-full">{team2.name}</span>
                  <span className="text-[10px] text-[#a3a3a3]">Team 2</span>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-[#565555] flex items-center justify-center flex-shrink-0">
                  <Plus size={16} className="text-[#565555]" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-bold text-[#a3a3a3]">Team 2</span>
                  <span className="text-[10px] text-[#565555]">Tap to select</span>
                </div>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 bg-[#1a1a1a] rounded-xl px-4 py-3 border border-transparent focus-within:border-[#a855f7] transition-colors">
          <Search size={16} className="text-[#565555] flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search all teams..."
            className="w-full bg-transparent text-sm text-[#ffffff] outline-none placeholder:text-[#565555]"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors flex-shrink-0">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Team Lists */}
      <main className="px-4 pb-32 space-y-6">

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 size={32} className="text-[#a855f7] animate-spin mb-3" />
            <p className="text-sm text-[#a3a3a3]">Loading teams...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-2xl p-4 text-center">
            <p className="text-sm text-[#ef4444] mb-2">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-xs text-[#ffffff] underline font-medium hover:text-[#a855f7]"
            >
              Retry
            </button>
          </div>
        )}

        {/* No Results */}
        {noResults && (
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <div className="relative mb-4">
              <Search size={40} className="text-[#333]" />
              <div className="absolute -top-1 -right-1 bg-[#ef4444] rounded-full w-4 h-4 flex items-center justify-center">
                <X size={10} className="text-[#ffffff]" />
              </div>
            </div>
            <h3 className="text-base font-bold text-[#ffffff] mb-2">No teams found</h3>
            <p className="text-xs text-[#a3a3a3] text-center mb-4 leading-relaxed">Try a different name or add a new team to the directory.</p>
            <button
              onClick={() => navigate('/team/add')}
              className="text-[#c799ff] text-sm font-bold flex items-center gap-1 hover:text-[#d8b4fe] transition-colors"
            >
              Add New Team
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* Your Teams */}
        {filteredYours.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3 px-1">
              <h3 className="text-[10px] font-bold text-[#565555] tracking-widest uppercase">YOUR TEAMS</h3>
              <span className="bg-[#2d1b4e] text-[#c799ff] text-[9px] font-bold px-2 py-0.5 rounded-full">{filteredYours.length}</span>
            </div>
            <div className="space-y-2">
              {filteredYours.map((team) => {
                const isSelected = team.id === selectedTeam1 || team.id === selectedTeam2;
                const disabled = (selectingFor === 1 && team.id === selectedTeam2) || (selectingFor === 2 && team.id === selectedTeam1);
                return (
                  <button
                    key={team.id}
                    disabled={disabled}
                    onClick={() => handleSelectTeam(team.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left ${
                      isSelected
                        ? 'bg-[#2d1b4e] border border-[#a855f7]'
                        : disabled
                          ? 'bg-[#121212] opacity-40 cursor-not-allowed border border-transparent'
                          : 'bg-[#1a1a1a] border border-transparent hover:bg-[#222]'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: team.color }}>
                      <span className="text-lg font-bold text-[#000]">{team.initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-sm text-[#ffffff] block truncate">{team.name}</span>
                      <span className="text-[11px] text-[#a3a3a3]">{team.sub}</span>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-[#a855f7] flex items-center justify-center flex-shrink-0">
                        <span className="text-[#000] text-xs font-bold">✓</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Opponents */}
        {filteredOpponents.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3 px-1">
              <h3 className="text-[10px] font-bold text-[#565555] tracking-widest uppercase">OPPONENTS</h3>
              <span className="bg-[#333] text-[#a3a3a3] text-[9px] font-bold px-2 py-0.5 rounded-full">{filteredOpponents.length}</span>
            </div>
            <div className="space-y-2">
              {filteredOpponents.map((team) => {
                const isSelected = team.id === selectedTeam1 || team.id === selectedTeam2;
                const disabled = (selectingFor === 1 && team.id === selectedTeam2) || (selectingFor === 2 && team.id === selectedTeam1);
                return (
                  <button
                    key={team.id}
                    disabled={disabled}
                    onClick={() => handleSelectTeam(team.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left ${
                      isSelected
                        ? 'bg-[#2d1b4e] border border-[#a855f7]'
                        : disabled
                          ? 'bg-[#121212] opacity-40 cursor-not-allowed border border-transparent'
                          : 'bg-[#1a1a1a] border border-transparent hover:bg-[#222]'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: team.color }}>
                      <span className="text-lg font-bold text-[#ffffff]">{team.initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-sm text-[#ffffff] block truncate">{team.name}</span>
                      <span className="text-[11px] text-[#a3a3a3]">{team.sub}</span>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-[#a855f7] flex items-center justify-center flex-shrink-0">
                        <span className="text-[#000] text-xs font-bold">✓</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Create New Team Card */}
        <button
          onClick={() => navigate('/team/add')}
          className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-[#a855f7]/40 hover:border-[#a855f7] transition-all text-left group"
        >
          <div className="w-12 h-12 rounded-full bg-[#2d1b4e] flex items-center justify-center flex-shrink-0 group-hover:bg-[#3d2c60] transition-colors">
            <Plus size={20} className="text-[#c799ff]" />
          </div>
          <div className="flex-1">
            <span className="font-bold text-sm text-[#ffffff] block">Create New Team</span>
            <span className="text-[11px] text-[#a3a3a3]">Add a team not in the directory</span>
          </div>
          <ChevronRight size={16} className="text-[#565555] group-hover:text-[#c799ff] transition-colors" />
        </button>

      </main>

      {/* Footer Action */}
      <div className="fixed bottom-0 w-full max-w-[390px] bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f] to-transparent px-4 pt-6 pb-8 z-50">
        <button
          onClick={() => canProceed && navigate('/match/new', { state: { team1, team2 } })}
          disabled={!canProceed}
          className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            canProceed
              ? 'bg-[#a855f7] text-[#ffffff] shadow-[0_4px_20px_rgba(168,85,247,0.35)] hover:bg-[#c799ff] active:scale-[0.98]'
              : 'bg-[#1a1a1a] text-[#565555] cursor-not-allowed'
          }`}
        >
          {canProceed ? (
            <>
              Continue to Match Setup
              <ChevronRight size={16} />
            </>
          ) : (
            `Select ${!selectedTeam1 ? 'Team 1' : 'Team 2'} to continue`
          )}
        </button>
      </div>
    </div>
  );
}
