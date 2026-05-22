import React, { useEffect, useState } from 'react';
import { ArrowLeft, Search, Link2, Phone, BookUser, ChevronRight, UserPlus, Loader2, Check } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface Player {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export default function AddPlayers() {
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId: string }>();

  const [teamName, setTeamName] = useState('Loading Team...');
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    async function fetchTeamSquad() {
      if (!teamId) return;
      try {
        setError('');
        setLoading(true);
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
        
        // Populate squad
        const rawPlayers = data.data?.players || [];
        setTeamName(data.data?.team_name || 'Team');
        
        const mapped: Player[] = rawPlayers.map((p: any) => {
          let initials = '';
          if (p.first_name) initials += p.first_name[0].toUpperCase();
          if (p.last_name) initials += p.last_name[0].toUpperCase();
          if (!initials) initials = p.name ? p.name.slice(0, 2).toUpperCase() : '??';

          let shortName = p.name;
          if (p.first_name && p.last_name) {
            shortName = `${p.first_name[0]}. ${p.last_name}`;
          }

          return {
            id: p.id || Math.random().toString(),
            initials,
            name: shortName,
            color: p.avatar_color || '#7c3aed',
          };
        });

        setPlayers(mapped);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    fetchTeamSquad();
  }, [teamId]);

  const generateInviteLink = async (): Promise<string> => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/api/teams/${teamId}/invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to generate invite token');
    }

    const data = await response.json();
    const inviteToken = data.data?.invite_token;
    return `${window.location.origin}/join/${inviteToken}`;
  };

  const handleShareLink = async () => {
    try {
      setSharing(true);
      const inviteLink = await generateInviteLink();
      const shareData = {
        title: `Join ${teamName} on CREASE`,
        text: `Hey! Join our cricket squad "${teamName}" on CREASE to track stats, matches, and career rankings.`,
        url: inviteLink,
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err: any) {
      console.error('Sharing failed', err);
      setError('Failed to share invite link. Please try again.');
    } finally {
      setSharing(false);
    }
  };

  const handleWhatsAppShare = async () => {
    try {
      setSharing(true);
      const inviteLink = await generateInviteLink();
      const text = `Hey! Join our cricket squad "${teamName}" on CREASE to track stats, matches, and career rankings: ${inviteLink}`;
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
    } catch (err: any) {
      console.error('WhatsApp sharing failed', err);
      setError('Failed to open WhatsApp. Please try again.');
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-[#000000] text-[#ffffff] font-sans relative overflow-x-hidden shadow-2xl">

      {copied && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-[#10b981] text-black px-4 py-2.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 z-[100] animate-bounce">
          <Check size={14} strokeWidth={3} />
          Invite link copied to clipboard!
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 bg-[#000000]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-[#ffffff] m-0">{teamName}</h1>
            <p className="text-xs text-[#a3a3a3] m-0">
              {loading ? 'Loading squad...' : `${players.length} players added`}
            </p>
          </div>
        </div>
        <button className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors">
          <Search size={20} />
        </button>
      </header>

      <main className="px-4 py-2 space-y-6 pb-32">

        {/* Current Squad */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[10px] font-bold text-[#565555] tracking-widest uppercase">
              SQUAD ({players.length})
            </h3>
            <button className="text-[#a855f7] text-xs font-bold tracking-wider">View All</button>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar items-center">
            <button 
              onClick={() => navigate(`/team/${teamId}/players/phone`)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0"
            >
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#a855f7] flex items-center justify-center">
                <UserPlus size={18} className="text-[#a855f7]" />
              </div>
              <span className="text-[9px] font-bold text-[#a855f7]">ADD</span>
            </button>

            {loading && (
              <div className="flex items-center justify-center px-4">
                <Loader2 size={24} className="text-[#a855f7] animate-spin" />
              </div>
            )}

            {!loading && players.map((p) => (
              <div key={p.id} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center shadow-inner"
                  style={{ backgroundColor: p.color }}
                >
                  <span className="text-base font-bold text-[#000]">{p.initials}</span>
                </div>
                <span className="text-[9px] font-bold text-[#a3a3a3] truncate max-w-[56px]">{p.name}</span>
              </div>
            ))}
          </div>
        </section>

        {error && (
          <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-xl p-3 text-center text-xs text-[#ef4444]">
            {error}
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3 px-1">
          <div className="flex-1 h-px bg-[#1a1a1a]"></div>
          <span className="text-[9px] font-bold text-[#565555] tracking-widest uppercase">ADD MORE PLAYERS VIA</span>
          <div className="flex-1 h-px bg-[#1a1a1a]"></div>
        </div>

        {/* Team Link */}
        <section className="bg-[#1a1a1a] rounded-2xl p-4 space-y-4 relative overflow-hidden">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2d1b4e] flex items-center justify-center flex-shrink-0">
              <Link2 size={18} className="text-[#c799ff]" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-[#ffffff] mb-1">Team Link</h4>
              <p className="text-xs text-[#a3a3a3] m-0 leading-relaxed">Easiest way. Anyone with the link can join your squad.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleShareLink}
              disabled={sharing}
              className="flex-1 border border-[#a855f7] text-[#c799ff] py-2.5 rounded-xl text-xs font-bold hover:bg-[#a855f7]/10 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {sharing ? <Loader2 size={12} className="animate-spin" /> : null}
              Share Link
            </button>
            <button 
              onClick={handleWhatsAppShare}
              disabled={sharing}
              className="flex-1 bg-[#25D366] text-[#000] py-2.5 rounded-xl text-xs font-bold hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {sharing ? <Loader2 size={12} className="animate-spin" /> : null}
              WhatsApp
            </button>
          </div>
        </section>

        {/* Phone Number */}
        <button
          onClick={() => navigate(`/team/${teamId}/players/phone`)}
          className="w-full bg-[#1a1a1a] rounded-2xl p-4 flex items-center gap-3 text-left hover:bg-[#222] transition-colors group"
        >
          <div className="w-10 h-10 rounded-full bg-[#242424] flex items-center justify-center flex-shrink-0">
            <Phone size={18} className="text-[#a3a3a3]" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-[#ffffff] mb-0.5">Phone Number</h4>
            <p className="text-xs text-[#a3a3a3] m-0">Add players manually via their mobile number.</p>
          </div>
          <ChevronRight size={16} className="text-[#565555] group-hover:text-[#a3a3a3] transition-colors" />
        </button>

        {/* From Contacts */}
        <button
          onClick={() => navigate(`/team/${teamId}/players/contacts`)}
          className="w-full bg-[#1a1a1a] rounded-2xl p-4 flex items-center gap-3 text-left hover:bg-[#222] transition-colors group"
        >
          <div className="w-10 h-10 rounded-full bg-[#242424] flex items-center justify-center flex-shrink-0">
            <BookUser size={18} className="text-[#a3a3a3]" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-[#ffffff] mb-0.5">From Contacts</h4>
            <p className="text-xs text-[#a3a3a3] m-0">Pick directly from your phone's address book.</p>
          </div>
          <ChevronRight size={16} className="text-[#565555] group-hover:text-[#a3a3a3] transition-colors" />
        </button>

        {/* Add Guest Player */}
        <button
          onClick={() => navigate(`/team/${teamId}/players/guest`)}
          className="w-full bg-[#1a1a1a] rounded-2xl p-4 flex items-center gap-3 text-left hover:bg-[#222] transition-colors group"
        >
          <div className="w-10 h-10 rounded-full bg-[#242424] flex items-center justify-center flex-shrink-0">
            <UserPlus size={18} className="text-[#a3a3a3]" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-[#ffffff] mb-0.5">Add Guest Player</h4>
            <p className="text-xs text-[#a3a3a3] m-0">Create guest players with name and styles.</p>
          </div>
          <ChevronRight size={16} className="text-[#565555] group-hover:text-[#a3a3a3] transition-colors" />
        </button>

      </main>

      {/* Footer */}
      <div className="fixed bottom-0 w-full max-w-[390px] bg-gradient-to-t from-[#000000] via-[#000000] to-transparent px-4 pt-6 pb-8 z-50">
        <button
          onClick={() => navigate(-1)}
          className="w-full bg-[#a855f7] text-[#ffffff] py-4 rounded-2xl font-bold text-sm shadow-[0_4px_20px_rgba(168,85,247,0.35)] hover:bg-[#c799ff] active:scale-[0.98] transition-all"
        >
          Done
        </button>
        <p className="text-center text-[10px] text-[#565555] mt-2 font-bold">You can always add more players later</p>
      </div>
    </div>
  );
}
