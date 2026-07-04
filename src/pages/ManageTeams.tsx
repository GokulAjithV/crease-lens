import React, { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Pencil, Archive, Loader2, ArchiveRestore, UserPlus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ManageTeams() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  // Load user
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError('');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('token');

      // fetch user's teams
      const res = await fetch(`${API_URL}/api/teams`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        }
      });

      if (!res.ok) {
        throw new Error('Failed to load teams list');
      }

      const json = await res.json();
      setTeams(json.data || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleToggleArchive = async (teamId: string, currentActive: boolean) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/teams/${teamId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          is_active: !currentActive
        })
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.detail || 'Failed to update team status');
      }

      // Reload
      fetchTeams();
    } catch (err: any) {
      alert(err.message || 'An error occurred');
    }
  };

  const filteredTeams = teams.filter((t: any) => {
    return t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.city || '').toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-[#000000] text-[#ffffff] font-sans relative pb-24 overflow-x-hidden shadow-2xl flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-[#000000]/85 backdrop-blur-md z-40 px-4 py-4 flex items-center justify-between border-b border-[#111]">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/home')} 
            className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors p-1 cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-base font-black tracking-tight">Manage Teams</h1>
        </div>
        <button
          onClick={() => navigate('/team/add')}
          className="bg-[#a855f7] hover:bg-[#c799ff] text-black font-bold p-2 rounded-full transition-colors flex items-center justify-center cursor-pointer"
        >
          <Plus size={16} />
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 px-4 py-4 space-y-4">
        {/* Search */}
        <div className="bg-[#161616] rounded-xl flex items-center px-3.5 py-2.5 gap-2 border border-transparent focus-within:border-[#a855f7]/30 transition-colors">
          <Search size={16} className="text-[#565555]" />
          <input
            type="text"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs text-[#ffffff] placeholder-[#565555] outline-none"
          />
        </div>

        {/* Content list */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="text-[#a855f7] animate-spin" size={24} />
            <span className="text-[10px] text-[#565555] font-bold tracking-widest uppercase">Loading teams...</span>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-xs px-4 py-3 rounded-xl text-center">
            {error}
          </div>
                ) : (
          (() => {
            const activeTeams = filteredTeams.filter((t: any) => t.is_active !== false);
            const archivedTeams = filteredTeams.filter((t: any) => t.is_active === false);

            const renderTeamCard = (team: any) => {
              const isCreator = team.created_by === user?.id;
              const isActive = team.is_active !== false;
              
              return (
                <div 
                  key={team.id}
                  className={`bg-[#161616] rounded-2xl p-4 border transition-all ${
                    isActive ? 'border-[#242424]' : 'border-red-950/40 opacity-70'
                  } space-y-3`}
                >
                  {/* Status header */}
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-[#565555] font-bold uppercase">{team.city || 'No Location'}</span>
                    
                    {isActive ? (
                      <span className="bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full text-emerald-500 text-[8px] font-black tracking-wider uppercase">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded-full text-red-500 text-[8px] font-black tracking-wider uppercase">
                        ARCHIVED
                      </span>
                    )}
                  </div>

                  {/* Team Info Layout */}
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-black text-black"
                      style={{ backgroundColor: team.avatar_color || '#a855f7' }}
                    >
                      {team.initials || '??'}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-black text-white truncate">{team.name}</h3>
                      <p className="text-[10px] text-[#a3a3a3]">{team.player_count || 0} players rostered</p>
                    </div>
                  </div>

                  {/* Creator Actions panel */}
                  {isCreator ? (
                    <div className="bg-[#111] rounded-xl px-2.5 py-2 flex items-center justify-between border border-[#242424] gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => navigate(`/team/${team.id}/edit`)}
                          className="p-2 hover:bg-[#222] rounded-lg transition-colors flex items-center gap-1.5 text-[10px] font-black text-[#a3a3a3] hover:text-white cursor-pointer"
                          title="Edit details"
                        >
                          <Pencil size={12} />
                          EDIT
                        </button>
                        
                        <button
                          onClick={() => navigate(`/team/${team.id}/players`)}
                          className="p-2 hover:bg-[#222] rounded-lg transition-colors flex items-center gap-1.5 text-[10px] font-black text-[#a855f7] hover:text-[#c799ff] cursor-pointer"
                          title="Manage players"
                        >
                          <UserPlus size={12} />
                          PLAYERS
                        </button>
                      </div>

                      <button
                        onClick={() => handleToggleArchive(team.id, isActive)}
                        className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 text-[10px] font-black cursor-pointer ${
                          isActive 
                            ? 'text-red-400 hover:bg-red-500/10' 
                            : 'text-emerald-400 hover:bg-emerald-500/10'
                        }`}
                      >
                        {isActive ? (
                          <>
                            <Archive size={12} />
                            ARCHIVE
                          </>
                        ) : (
                          <>
                            <ArchiveRestore size={12} />
                            ACTIVATE
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="text-[9px] text-[#565555] font-bold uppercase tracking-wider pl-1 pt-1">
                      Read-Only (Created by another user)
                    </div>
                  )}
                </div>
              );
            };

            return (
              <div className="space-y-6">
                {/* Active Teams */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-bold text-[#565555] tracking-widest uppercase">ACTIVE TEAMS</span>
                    <span className="bg-[#2d1b4e] text-[#c799ff] text-[9px] font-bold px-2 py-0.5 rounded-full">{activeTeams.length}</span>
                  </div>
                  {activeTeams.length === 0 ? (
                    <div className="text-center py-8 text-xs text-[#565555] bg-[#111] rounded-2xl border border-[#222]/40">
                      No active teams found. Click + to create a new team.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activeTeams.map((team) => renderTeamCard(team))}
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px bg-[#161616] my-4"></div>

                {/* Archived Teams Tab/Collapsible */}
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowArchived(!showArchived)}
                    className="w-full flex items-center justify-between px-1 hover:text-white transition-colors cursor-pointer group text-left border-0 bg-transparent py-1 w-full"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#565555] group-hover:text-[#a3a3a3] tracking-widest uppercase">ARCHIVED TEAMS</span>
                      <span className="bg-[#222] text-[#a3a3a3] text-[9px] font-bold px-2 py-0.5 rounded-full">{archivedTeams.length}</span>
                    </div>
                    <span className="text-xs text-[#565555] group-hover:text-[#a3a3a3] font-bold">
                      {showArchived ? 'Hide' : 'Show'}
                    </span>
                  </button>
                  
                  {showArchived && (
                    archivedTeams.length === 0 ? (
                      <div className="text-center py-8 text-xs text-[#565555] bg-[#111] rounded-2xl border border-[#222]/40">
                        No archived teams.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {archivedTeams.map((team) => renderTeamCard(team))}
                      </div>
                    )
                  )}
                </div>
              </div>
            );
          })()
        )}
      </main>
    </div>
  );
}
