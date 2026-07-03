import React, { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Trophy, Sparkles, Loader2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MatchHistory() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'my'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load user from local storage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        setError('');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const token = localStorage.getItem('token');

        const res = await fetch(`${API_URL}/api/matches?limit=50`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          }
        });

        if (!res.ok) {
          throw new Error('Failed to load matches list');
        }

        const json = await res.json();
        setMatches(json.data || []);
      } catch (err: any) {
        setError(err.message || 'An error occurred while loading matches');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const getInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Filter and search logic
  const filteredMatches = matches.filter((m: any) => {
    const teamA = m.team_a?.name || 'Team A';
    const teamB = m.team_b?.name || 'Team B';
    const venue = m.venue || '';
    const city = m.city || '';
    
    // Status/Ownership filter
    if (filter === 'my' && m.created_by !== user?.id) {
      return false;
    }

    // Text search filter
    const matchesSearch = 
      teamA.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teamB.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesSearch;
  });

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-[#000000] text-[#ffffff] font-sans relative overflow-x-hidden shadow-2xl flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-[#000000]/80 backdrop-blur-md z-40 px-4 py-4 flex items-center border-b border-[#111]">
        <button 
          onClick={() => navigate('/home')} 
          className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors p-1"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-base font-black tracking-tight ml-3">Match History</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 space-y-4">
        {/* Search Input */}
        <div className="bg-[#161616] rounded-xl flex items-center px-3.5 py-2.5 gap-2 border border-transparent focus-within:border-[#a855f7]/30 transition-colors">
          <Search size={16} className="text-[#565555]" />
          <input
            type="text"
            placeholder="Search teams, venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs text-[#ffffff] placeholder-[#565555] outline-none"
          />
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-colors ${
              filter === 'all' 
                ? 'bg-[#a855f7] text-[#000000]' 
                : 'bg-[#161616] text-[#a3a3a3] hover:text-white'
            }`}
          >
            All Matches
          </button>
          <button
            onClick={() => setFilter('my')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-colors ${
              filter === 'my' 
                ? 'bg-[#a855f7] text-[#000000]' 
                : 'bg-[#161616] text-[#a3a3a3] hover:text-white'
            }`}
          >
            My Scored
          </button>
        </div>

        {/* Match List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="text-[#a855f7] animate-spin" size={24} />
            <span className="text-[10px] text-[#565555] font-bold tracking-widest uppercase">Loading matches...</span>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-xs px-4 py-3 rounded-xl text-center">
            {error}
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="text-center py-16 text-xs text-[#565555]">
            No matches found.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMatches.map((m: any) => {
              const teamA = m.team_a?.name || 'Team A';
              const teamB = m.team_b?.name || 'Team B';
              const colorA = m.team_a?.avatar_color || '#333';
              const colorB = m.team_b?.avatar_color || '#111';
              
              const isLive = ['toss', 'playing', 'innings_break'].includes(m.status);
              const isCompleted = m.status === 'completed';
              
              const dateStr = m.scheduled_at 
                ? new Date(m.scheduled_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                : 'Date Unknown';
                
              return (
                <div 
                  key={m.id}
                  onClick={() => navigate(`/match/${m.id}/summary`)}
                  className="bg-[#161616] rounded-2xl p-4 border border-[#242424] hover:border-[#a855f7]/30 transition-all cursor-pointer space-y-3 relative overflow-hidden"
                >
                  {/* Card Header Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="text-[#565555]" />
                      <span className="text-[9px] text-[#a3a3a3] font-bold uppercase">{dateStr}</span>
                    </div>
                    {isLive && (
                      <span className="flex items-center gap-1 bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                        <span className="text-[8px] font-black text-red-500 tracking-wider uppercase">LIVE</span>
                      </span>
                    )}
                    {isCompleted && (
                      <span className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full text-emerald-500 text-[8px] font-black tracking-wider uppercase">
                        COMPLETED
                      </span>
                    )}
                    {m.status === 'setup' && (
                      <span className="bg-[#242424] px-2 py-0.5 rounded-full text-[#a3a3a3] text-[8px] font-black tracking-wider uppercase">
                        SETUP
                      </span>
                    )}
                  </div>

                  {/* Team Details Layout */}
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      <div 
                        className="w-8 h-8 rounded-full border border-black flex items-center justify-center text-[10px] font-black"
                        style={{ backgroundColor: colorA, color: '#ffffff' }}
                      >
                        {getInitials(teamA)}
                      </div>
                      <div 
                        className="w-8 h-8 rounded-full border border-black flex items-center justify-center text-[10px] font-black"
                        style={{ backgroundColor: colorB, color: '#ffffff' }}
                      >
                        {getInitials(teamB)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs font-black text-white truncate">{teamA} vs {teamB}</h3>
                      </div>
                      <p className="text-[10px] text-[#565555] truncate">{m.venue || 'Unknown Venue'}{m.city ? `, ${m.city}` : ''}</p>
                    </div>
                  </div>

                  {/* Result margins */}
                  {isCompleted && m.win_margin !== null && (
                    <div className="bg-[#111] rounded-xl px-3 py-2 flex items-center gap-2 border border-[#242424]">
                      <Trophy size={12} className="text-[#fbbf24]" />
                      <span className="text-[10px] font-bold text-[#e5e5e5]">
                        {m.winner_id === m.team_a_id ? teamA : teamB} won by {m.win_margin} {m.win_type}
                      </span>
                    </div>
                  )}
                  
                  {/* Status subtitle */}
                  {!isCompleted && (
                    <div className="text-[10px] text-[#565555] font-semibold">
                      {m.status === 'setup' ? 'Click to configure and start match' : 'Click to view scorecard / details'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
