import React, { useState } from 'react';
import { ArrowLeft, UserPlus, Loader2, Check, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function AddGuestPlayer() {
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId: string }>();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'BAT' | 'BOWL' | 'ALL' | 'WK'>('BAT');
  const [battingStyle, setBattingStyle] = useState<'RHB' | 'LHB'>('RHB');
  const [bowlingStyle, setBowlingStyle] = useState<string>('NONE');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const roles = [
    { label: 'Batter', value: 'BAT' },
    { label: 'Bowler', value: 'BOWL' },
    { label: 'All-Rounder', value: 'ALL' },
    { label: 'Wicket-Keeper', value: 'WK' },
  ];

  const battingStyles = [
    { label: 'Right Hand Bat', value: 'RHB' },
    { label: 'Left Hand Bat', value: 'LHB' },
  ];

  const bowlingStyles = [
    { label: 'None', value: 'NONE' },
    { label: 'Right-arm Fast', value: 'RAF' },
    { label: 'Right-arm Medium', value: 'RAM' },
    { label: 'Right-arm Spin', value: 'RAS' },
    { label: 'Left-arm Fast', value: 'LAF' },
    { label: 'Left-arm Medium', value: 'LAM' },
    { label: 'Left-arm Spin', value: 'LAS' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Guest player name is required.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess(false);

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/teams/${teamId}/players`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          guest_name: name.trim(),
          guest_phone: phone.trim() ? `+91${phone.trim()}` : null,
          role,
          batting_style: battingStyle,
          bowling_style: bowlingStyle === 'NONE' ? null : bowlingStyle,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add guest player');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate(`/team/${teamId}/players`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-[#000000] text-[#ffffff] font-sans relative overflow-x-hidden shadow-2xl flex flex-col">
      {/* Toast Notification */}
      {success && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-[#10b981] text-black px-4 py-2.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 z-[100] animate-bounce">
          <Check size={14} strokeWidth={3} />
          Guest player added successfully!
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center gap-3 px-4 py-4 bg-[#000000]">
        <button onClick={() => navigate(-1)} className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-[#ffffff]">Add Guest Player</h1>
      </header>

      <main className="flex-1 px-4 py-2 overflow-y-auto pb-32">
        {error && (
          <div className="mb-4 bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-xl p-3 text-center text-xs text-[#ef4444] flex items-center justify-center gap-2">
            <AlertCircle size={14} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Guest Name */}
          <div>
            <label className="text-[10px] font-bold text-[#565555] tracking-widest uppercase block mb-2">
              PLAYER NAME*
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              required
              className="w-full bg-[#1a1a1a] rounded-xl px-4 py-3 text-sm text-[#ffffff] outline-none placeholder:text-[#333] border border-transparent focus:border-[#a855f7] transition-colors"
            />
          </div>

          {/* Guest Phone (Optional) */}
          <div>
            <label className="text-[10px] font-bold text-[#565555] tracking-widest uppercase block mb-2">
              PHONE NUMBER (OPTIONAL)
            </label>
            <div className="flex gap-2">
              <div className="bg-[#1a1a1a] rounded-xl px-3 py-3 flex items-center border border-transparent">
                <span className="text-sm font-bold text-[#ffffff]">+91</span>
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Enter phone number"
                className="flex-1 bg-[#1a1a1a] rounded-xl px-4 py-3 text-sm text-[#ffffff] outline-none placeholder:text-[#333] border border-transparent focus:border-[#a855f7] transition-colors"
              />
            </div>
            <p className="text-[10px] text-[#565555] mt-2 px-1">
              Adding phone number allows this guest to claim their profile statistics later.
            </p>
          </div>

          {/* Playing Role */}
          <div>
            <label className="text-[10px] font-bold text-[#565555] tracking-widest uppercase block mb-2">
              PLAYING ROLE
            </label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value as any)}
                  className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border ${
                    role === r.value
                      ? 'bg-[#a855f7]/15 border-[#a855f7] text-[#c799ff]'
                      : 'bg-[#1a1a1a] border-transparent text-[#a3a3a3] hover:bg-[#222]'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Batting Style */}
          <div>
            <label className="text-[10px] font-bold text-[#565555] tracking-widest uppercase block mb-2">
              BATTING STYLE
            </label>
            <div className="grid grid-cols-2 gap-2">
              {battingStyles.map((b) => (
                <button
                  key={b.value}
                  type="button"
                  onClick={() => setBattingStyle(b.value as any)}
                  className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border ${
                    battingStyle === b.value
                      ? 'bg-[#a855f7]/15 border-[#a855f7] text-[#c799ff]'
                      : 'bg-[#1a1a1a] border-transparent text-[#a3a3a3] hover:bg-[#222]'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bowling Style */}
          <div>
            <label className="text-[10px] font-bold text-[#565555] tracking-widest uppercase block mb-2">
              BOWLING STYLE
            </label>
            <div className="flex flex-wrap gap-2">
              {bowlingStyles.map((b) => (
                <button
                  key={b.value}
                  type="button"
                  onClick={() => setBowlingStyle(b.value)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    bowlingStyle === b.value
                      ? 'bg-[#a855f7]/15 border-[#a855f7] text-[#c799ff]'
                      : 'bg-[#1a1a1a] border-transparent text-[#a3a3a3] hover:bg-[#222]'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={!name.trim() || loading}
              className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                name.trim() && !loading
                  ? 'bg-[#a855f7] text-[#ffffff] shadow-[0_4px_20px_rgba(168,85,247,0.35)] hover:bg-[#c799ff] active:scale-[0.98]'
                  : 'bg-[#1a1a1a] text-[#565555] cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating Guest...
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Add Guest Player
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
