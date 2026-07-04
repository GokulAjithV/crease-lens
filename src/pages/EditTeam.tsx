import React, { useEffect, useState } from 'react';
import { ArrowLeft, Sparkles, Loader2, MapPin } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const teamColors = [
  '#a855f7', '#ef4444', '#f59e0b', '#10b981', '#3b82f6',
  '#ec4899', '#f97316', '#14b8a6', '#8b5cf6', '#06b6d4',
];

export default function EditTeam() {
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId: string }>();

  const [teamName, setTeamName] = useState('');
  const [city, setCity] = useState('');
  const [selectedColor, setSelectedColor] = useState('#a855f7');
  const [captainCanEdit, setCaptainCanEdit] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTeamDetails() {
      if (!teamId) return;
      try {
        setLoadingDetails(true);
        setError('');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_URL}/api/teams`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!response.ok) throw new Error('Failed to load teams');
        const json = await response.json();
        const myTeam = (json.data || []).find((t: any) => t.id === teamId);

        if (!myTeam) {
          throw new Error('Team not found or you are not authorized to edit it');
        }

        setTeamName(myTeam.name || '');
        setCity(myTeam.city || '');
        setSelectedColor(myTeam.avatar_color || '#a855f7');
        setCaptainCanEdit(myTeam.captain_can_edit !== false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch team details');
      } finally {
        setLoadingDetails(false);
      }
    }
    fetchTeamDetails();
  }, [teamId]);

  const canSave = teamName.trim().length >= 2;

  const handleUpdateTeam = async () => {
    if (!canSave || submitting) return;
    setSubmitting(true);
    setError('');

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
          name: teamName,
          city: city || undefined,
          avatar_color: selectedColor,
          captain_can_edit: captainCanEdit
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData?.detail || 'Failed to update team details');
      }

      navigate(-1);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const maxNameLength = 30;
  const initials = teamName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-[#000000] text-[#ffffff] font-sans relative overflow-x-hidden shadow-2xl">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center gap-3 px-4 py-4 bg-[#000000] border-b border-[#111]">
        <button onClick={() => navigate(-1)} className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors cursor-pointer">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-base font-black tracking-tight">Edit Team Details</h1>
      </header>

      {loadingDetails ? (
        <div className="flex flex-col items-center justify-center py-32 gap-2">
          <Loader2 className="animate-spin text-[#a855f7]" size={24} />
          <span className="text-[10px] text-[#565555] font-bold tracking-widest uppercase">Loading team details...</span>
        </div>
      ) : (
        <main className="px-4 py-6 space-y-8 pb-32">
          {/* Avatar Preview */}
          <section className="flex flex-col items-center gap-4">
            <div className="relative">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center shadow-[0_0_24px_rgba(168,85,247,0.25)]"
                style={{ backgroundColor: selectedColor }}
              >
                <span className="text-3xl font-bold text-[#ffffff] font-headline">{initials || '?'}</span>
              </div>
            </div>

            {/* Colors */}
            <div className="flex gap-2">
              {teamColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-7 h-7 rounded-full transition-all cursor-pointer ${
                    selectedColor === color
                      ? 'ring-2 ring-offset-2 ring-offset-[#000] ring-[#ffffff] scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </section>

          {/* Roster fields */}
          <section className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-bold text-[#565555] tracking-widest uppercase">TEAM NAME*</label>
                <span className={`text-[10px] font-bold ${teamName.length >= maxNameLength ? 'text-[#ef4444]' : 'text-[#565555]'}`}>
                  {teamName.length}/{maxNameLength}
                </span>
              </div>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value.slice(0, maxNameLength))}
                placeholder="e.g. Village Kings"
                className={`w-full bg-[#1a1a1a] rounded-xl px-4 py-3 text-sm text-[#ffffff] outline-none placeholder:text-[#333] border transition-colors ${
                  teamName.length > 0 ? 'border-[#ffffff]/20' : 'border-transparent'
                } focus:border-[#a855f7]`}
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#565555] tracking-widest uppercase block mb-2">CITY / TOWN</label>
              <div className={`flex items-center gap-2 bg-[#1a1a1a] rounded-xl px-4 py-3 border transition-colors ${
                city.length > 0 ? 'border-[#ffffff]/20' : 'border-transparent'
              } focus-within:border-[#a855f7]`}>
                <MapPin size={16} className="text-[#565555] flex-shrink-0" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className="w-full bg-transparent text-sm text-[#ffffff] outline-none placeholder:text-[#333]"
                />
              </div>
            </div>

            {error && (
              <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-xl p-3 text-xs text-[#ef4444]">
                {error}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCaptainCanEdit(!captainCanEdit)}
                className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
                  captainCanEdit ? 'bg-[#a855f7]' : 'bg-transparent border-2 border-[#565555]'
                }`}
              >
                {captainCanEdit && <span className="text-[#ffffff] text-xs font-bold">✓</span>}
              </button>
              <span className="text-sm text-[#a3a3a3]">Let the captain edit team details</span>
            </div>
          </section>
        </main>
      )}

      {/* Save Button */}
      {!loadingDetails && (
        <div className="fixed bottom-0 w-full max-w-[390px] bg-gradient-to-t from-[#000000] via-[#000000] to-transparent px-4 pt-6 pb-8 z-50">
          <button
            onClick={handleUpdateTeam}
            disabled={!canSave || submitting}
            className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              canSave && !submitting
                ? 'bg-[#a855f7] text-[#ffffff] shadow-[0_4px_20px_rgba(168,85,247,0.35)] hover:bg-[#c799ff] active:scale-[0.98]'
                : 'bg-[#1a1a1a] text-[#565555] cursor-not-allowed'
            }`}
          >
            {submitting ? 'Saving Updates...' : 'Save Updates'}
            {!submitting && <Sparkles size={16} />}
          </button>
        </div>
      )}
    </div>
  );
}
