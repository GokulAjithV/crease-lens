import React, { useEffect, useState } from 'react';
import { ArrowLeft, Smartphone, Check, Loader2, Search, UserPlus, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface Player {
  id: string;
  name: string;
  phone: string;
  is_guest: boolean;
  avatar_color?: string;
}

export default function AddViaPhone() {
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId: string }>();

  const [phone, setPhone] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null); // null = not searched, false = not found, object = player found
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch team squad on mount
  useEffect(() => {
    fetchTeamSquad();
  }, [teamId]);

  async function fetchTeamSquad() {
    if (!teamId) return;
    try {
      setLoading(true);
      setError('');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/teams/${teamId}/players`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch team squad');
      }

      const data = await response.json();
      setPlayers(data.data?.players || []);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while fetching the squad');
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = async () => {
    if (phone.length < 10) return;
    try {
      setSearching(true);
      setError('');
      setSuccessMsg('');
      setSearchResult(null);

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('token');
      
      const fullPhone = `+91${phone}`;
      const response = await fetch(`${API_URL}/api/players/search?phone=${encodeURIComponent(fullPhone)}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to search player');
      }

      const data = await response.json();
      if (data.data) {
        setSearchResult(data.data);
      } else {
        setSearchResult(false);
      }
    } catch (err: any) {
      setError(err.message || 'Error searching for player');
    } finally {
      setSearching(false);
    }
  };

  const handleAddPlayer = async (playerId: string) => {
    if (!teamId) return;
    try {
      setAdding(true);
      setError('');
      setSuccessMsg('');

      // Check if already in players list
      const isAlreadyInTeam = players.some((p) => p.id === playerId);
      if (isAlreadyInTeam) {
        setError('This player is already in your team!');
        setAdding(false);
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/teams/${teamId}/players`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          player_id: playerId,
          role: 'BAT',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add player');
      }

      setSuccessMsg('Player added successfully!');
      setPhone('');
      setPlayerName('');
      setSearchResult(null);
      await fetchTeamSquad();
    } catch (err: any) {
      setError(err.message || 'Failed to add player');
    } finally {
      setAdding(false);
    }
  };

  const handleAddGuest = async () => {
    if (!teamId) return;
    if (!playerName.trim()) {
      setError('Guest player name is required');
      return;
    }

    try {
      setAdding(true);
      setError('');
      setSuccessMsg('');

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/teams/${teamId}/players`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          guest_name: playerName.trim(),
          guest_phone: `+91${phone}`,
          role: 'BAT',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add guest player');
      }

      setSuccessMsg('Guest player added successfully!');
      setPhone('');
      setPlayerName('');
      setSearchResult(null);
      await fetchTeamSquad();
    } catch (err: any) {
      setError(err.message || 'Failed to add guest player');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-[#000000] text-[#ffffff] font-sans relative overflow-x-hidden shadow-2xl">
      {/* Toast Messages */}
      {successMsg && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-[#10b981] text-black px-4 py-2.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 z-[100] animate-bounce">
          <Check size={14} strokeWidth={3} />
          {successMsg}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center gap-3 px-4 py-4 bg-[#000000]">
        <button onClick={() => navigate(-1)} className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-[#ffffff]">Add via Phone</h1>
      </header>

      <main className="px-4 py-2 space-y-6 pb-24">
        {error && (
          <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-xl p-3 text-center text-xs text-[#ef4444] flex items-center justify-center gap-2">
            <AlertCircle size={14} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Phone Input */}
        <section className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-[#565555] tracking-widest uppercase block mb-2">PHONE NUMBER*</label>
            <div className="flex gap-2">
              <div className="bg-[#1a1a1a] rounded-xl px-3 py-3 flex items-center border border-transparent">
                <span className="text-sm font-bold text-[#ffffff]">+91</span>
              </div>
              <div className="flex-1 flex items-center gap-2 bg-[#1a1a1a] rounded-xl px-4 py-3 border border-transparent focus-within:border-[#a855f7] transition-colors">
                <Smartphone size={16} className="text-[#565555] flex-shrink-0" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
                    setSearchResult(null); // Reset search when phone changes
                  }}
                  placeholder="Enter phone number"
                  className="w-full bg-transparent text-sm text-[#ffffff] outline-none placeholder:text-[#333]"
                />
              </div>
            </div>
            <p className="text-[10px] text-[#565555] mt-2 px-1">Phone number lets this player claim their stats later</p>
          </div>

          {/* Search Button */}
          {searchResult === null && (
            <button
              onClick={handleSearch}
              disabled={phone.length < 10 || searching}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                phone.length >= 10 && !searching
                  ? 'bg-[#a855f7] text-[#ffffff] shadow-[0_4px_16px_rgba(168,85,247,0.3)] hover:bg-[#c799ff] active:scale-[0.98]'
                  : 'bg-[#1a1a1a] text-[#565555] cursor-not-allowed'
              }`}
            >
              {searching ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Searching Registry...
                </>
              ) : (
                <>
                  <Search size={16} />
                  Search Player
                </>
              )}
            </button>
          )}

          {/* Search Results */}
          {searchResult !== null && (
            <div className="bg-[#111111] border border-[#222222] rounded-2xl p-4 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-bold text-[#a855f7] tracking-wider uppercase">Search Result</h4>
                <button 
                  onClick={() => setSearchResult(null)} 
                  className="text-xs text-[#a3a3a3] hover:text-white"
                >
                  Clear
                </button>
              </div>

              {searchResult ? (
                // Registered player found
                <div className="flex items-center justify-between bg-[#1a1a1a] rounded-xl p-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[#000]"
                      style={{ backgroundColor: searchResult.avatar_color || '#a855f7' }}
                    >
                      {(searchResult.first_name?.[0] || '') + (searchResult.last_name?.[0] || '') || 'P'}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-[#ffffff] block">
                        {`${searchResult.first_name} ${searchResult.last_name || ''}`.trim()}
                      </span>
                      <span className="text-xs text-[#a3a3a3]">{searchResult.phone}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddPlayer(searchResult.id)}
                    disabled={adding}
                    className="bg-[#a855f7] text-[#ffffff] px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#c799ff] transition-colors flex items-center gap-1"
                  >
                    {adding ? <Loader2 size={12} className="animate-spin" /> : <UserPlus size={12} />}
                    Add Player
                  </button>
                </div>
              ) : (
                // Guest Creation Flow
                <div className="space-y-3">
                  <div className="text-xs text-[#a3a3a3]">
                    No registered user found with phone <span className="text-white font-bold">+91 {phone}</span>.
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-[#565555] tracking-widest uppercase block mb-1">GUEST NAME*</label>
                    <input
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-[#1a1a1a] rounded-xl px-4 py-3 text-sm text-[#ffffff] outline-none placeholder:text-[#333] border border-transparent focus:border-[#a855f7] transition-colors"
                    />
                  </div>
                  <button
                    onClick={handleAddGuest}
                    disabled={!playerName.trim() || adding}
                    className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      playerName.trim() && !adding
                        ? 'bg-[#ffffff] text-[#000000] hover:bg-[#eaeaea] active:scale-[0.98]'
                        : 'bg-[#1a1a1a] text-[#565555] cursor-not-allowed'
                    }`}
                  >
                    {adding ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
                    Add as Guest Player
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Squad List */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-[10px] font-bold text-[#565555] tracking-widest uppercase">
              SQUAD ({players.length})
            </h3>
            {loading && <Loader2 size={12} className="text-[#a855f7] animate-spin" />}
          </div>

          {players.length === 0 && !loading ? (
            <div className="text-center py-8 text-xs text-[#565555] bg-[#1a1a1a] rounded-2xl border border-dashed border-[#222]">
              No players added to the squad yet.
            </div>
          ) : (
            <div className="space-y-2">
              {players.map((player) => {
                const initials = (player.name?.[0] || 'P').toUpperCase();
                return (
                  <div key={player.id} className="bg-[#1a1a1a] rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[#000] text-sm"
                        style={{ backgroundColor: player.avatar_color || '#a855f7' }}
                      >
                        {initials}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-[#ffffff] block">{player.name}</span>
                        <span className="text-[11px] text-[#a3a3a3]">{player.phone || 'No phone'}</span>
                      </div>
                    </div>
                    {player.is_guest ? (
                      <div className="bg-[#1a1a1a] border border-[#a855f7]/30 text-[#c799ff] px-2.5 py-1 rounded-full">
                        <span className="text-[9px] font-bold tracking-wider">GUEST</span>
                      </div>
                    ) : (
                      <div className="bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Check size={10} strokeWidth={3} />
                        <span className="text-[9px] font-bold tracking-wider">JOINED</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
