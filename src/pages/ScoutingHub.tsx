import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Send, Loader2, Target, MapPin, Users, Brain, ShieldAlert, Copy, Check } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function ScoutingHub() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<any[]>([]);
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [venue, setVenue] = useState('');
  const [venuesList, setVenuesList] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingConfig, setFetchingConfig] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll chat to bottom when history changes
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  useEffect(() => {
    async function loadScoutingConfig() {
      try {
        setFetchingConfig(true);
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // 1. Fetch teams
        const teamsRes = await fetch(`${API_URL}/api/teams?scope=all`, { headers });
        if (teamsRes.ok) {
          const tData = await teamsRes.json();
          // Filter to active teams
          setTeams((tData.data || []).filter((t: any) => t.is_active !== false));
        }

        // 2. Fetch completed matches to extract unique venues
        const matchesRes = await fetch(`${API_URL}/api/matches/completed`, { headers });
        if (matchesRes.ok) {
          const mData = await matchesRes.json();
          const matches = mData.data || [];
          const uniqueVenues = Array.from(new Set(matches.map((m: any) => m.venue).filter(Boolean))) as string[];
          // Combine with standard fallbacks
          const mergedVenues = Array.from(new Set([...uniqueVenues, 'Chepauk Stadium', 'Mgm ground', 'Wankhede Stadium'])) as string[];
          setVenuesList(mergedVenues);
          if (mergedVenues.length > 0) {
            setVenue(mergedVenues[0]);
          }
        }
      } catch (err) {
        console.error('Error loading scouting settings:', err);
      } finally {
        setFetchingConfig(false);
      }
    }

    loadScoutingConfig();
  }, []);

  const handleSend = async (customQuery?: string) => {
    const textToSend = customQuery || query;
    if (!textToSend.trim()) return;

    const newMsg: Message = { role: 'user', content: textToSend };
    setChatHistory(prev => [...prev, newMsg]);
    if (!customQuery) setQuery('');
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('token');
      const headers: any = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}/api/chat/scout`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query: textToSend,
          team_a_id: teamA || null,
          team_b_id: teamB || null,
          venue: venue || null,
          history: chatHistory.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!res.ok) {
        throw new Error('Failed to generate scouting analysis');
      }

      const data = await res.json();
      const aiResponse: Message = { role: 'model', content: data.answer || 'No response generated.' };
      setChatHistory(prev => [...prev, aiResponse]);
    } catch (err: any) {
      setChatHistory(prev => [...prev, { role: 'model', content: `Error: ${err.message || 'Failed to connect to scouting engine.'}` }]);
    } finally {
      setLoading(false);
    }
  };

  const presets = [
    {
      title: 'Bowler Matchups',
      prompt: 'List the head-to-head bowler match-ups against the opposing opening batsman.',
      icon: Target,
      color: '#f59e0b',
    },
    {
      title: 'Venue Analytics',
      prompt: 'Analyze how spinners and fast bowlers perform at the current venue, and what tactics we should adopt.',
      icon: MapPin,
      color: '#3b82f6',
    },
    {
      title: 'Match-up Defense',
      prompt: 'Who is the best match-up bowler on our roster to defend against their top batsman based on career stats?',
      icon: ShieldAlert,
      color: '#ef4444',
    },
    {
      title: 'Full H2H Report',
      prompt: 'Generate a comprehensive, tactical scouting and head-to-head report for our match-up.',
      icon: Brain,
      color: '#a855f7',
    },
  ];

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-[#000000] text-[#ffffff] font-sans flex flex-col relative overflow-x-hidden shadow-2xl">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 bg-[#000000]/95 backdrop-blur border-b border-[#1a1a1a]">
        <button onClick={() => navigate('/home')} className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors cursor-pointer">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-1.5">
          <Brain size={16} className="text-[#fb7185] animate-pulse" />
          <span className="text-xs font-black text-[#ffffff] tracking-widest uppercase">SCOUTING HUB</span>
        </div>
        <div className="w-5"></div>
      </header>

      {/* RAG Context Selectors */}
      <section className="p-4 bg-[#0a0a0a] border-b border-[#1a1a1a] space-y-3.5">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[10px] font-black text-[#565555] tracking-widest uppercase">MATCHUP & VENUE PARAMETERS</span>
          <span className="text-[9px] bg-[#fb7185]/10 text-[#fb7185] border border-[#fb7185]/20 px-2 py-0.5 rounded font-black">AI RAG</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Team A */}
          <div>
            <label className="text-[8px] font-bold text-[#a3a3a3] tracking-widest uppercase block mb-1">My Team (A)</label>
            <select
              value={teamA}
              onChange={(e) => setTeamA(e.target.value)}
              className="w-full bg-[#161616] border border-[#242424] text-xs font-bold px-2 py-2.5 rounded-xl text-[#ffffff] focus:outline-none focus:border-[#fb7185] transition-colors cursor-pointer"
            >
              <option value="">Select Team A</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Team B */}
          <div>
            <label className="text-[8px] font-bold text-[#a3a3a3] tracking-widest uppercase block mb-1">Opponent Team (B)</label>
            <select
              value={teamB}
              onChange={(e) => setTeamB(e.target.value)}
              className="w-full bg-[#161616] border border-[#242424] text-xs font-bold px-2 py-2.5 rounded-xl text-[#ffffff] focus:outline-none focus:border-[#fb7185] transition-colors cursor-pointer"
            >
              <option value="">Select Team B</option>
              {teams.filter(t => t.id !== teamA).map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Venue Selector */}
        <div>
          <label className="text-[8px] font-bold text-[#a3a3a3] tracking-widest uppercase block mb-1">Match Venue</label>
          <select
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            className="w-full bg-[#161616] border border-[#242424] text-xs font-bold px-3 py-2.5 rounded-xl text-[#ffffff] focus:outline-none focus:border-[#fb7185] transition-colors cursor-pointer"
          >
            <option value="">Select Venue</option>
            {venuesList.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 ? (
          <div className="py-8 space-y-6">
            {/* AI Welcome */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-gradient-to-tr from-[#fb7185] to-[#a855f7] rounded-full flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(251,113,133,0.3)]">
                <Sparkles size={20} className="text-[#ffffff]" />
              </div>
              <h3 className="text-sm font-black text-[#ffffff]">Crease Strategy Assistant</h3>
              <p className="text-xs text-[#a3a3a3] max-w-[280px] mx-auto leading-relaxed">
                Configure your matchup and venue above, then tap a preset or ask a question to generate a tactical report.
              </p>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {presets.map((p) => (
                <button
                  key={p.title}
                  onClick={() => handleSend(p.prompt)}
                  className="bg-[#111] hover:bg-[#161616] border border-[#242424] hover:border-[#fb7185]/30 p-3 rounded-2xl text-left flex flex-col justify-between h-32 active:scale-[0.98] transition-all cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: p.color + '15' }}>
                    <p.icon size={15} style={{ color: p.color }} />
                  </div>
                  <div>
                    <span className="text-[11px] font-black text-[#ffffff] block mb-0.5 group-hover:text-[#fb7185] transition-colors">{p.title}</span>
                    <span className="text-[8px] text-[#565555] line-clamp-2 leading-tight">{p.prompt}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Avatar Label */}
                <span className="text-[8px] font-black text-[#565555] tracking-widest uppercase mb-1 px-1">
                  {msg.role === 'user' ? 'COACH / CAPTAIN' : 'CREASE SCOUT'}
                </span>
                
                {/* Chat Bubble Wrapper */}
                <div className="relative group/bubble max-w-[85%] w-full flex flex-col items-start">
                  <div
                    className={`w-full rounded-2xl px-4 py-3 text-xs leading-relaxed relative ${
                      msg.role === 'user'
                        ? 'bg-[#fb7185] text-black font-semibold'
                        : 'bg-[#111] border border-[#242424] text-[#e5e5e5] whitespace-pre-wrap pr-8'
                    }`}
                  >
                    {msg.content}
                    
                    {/* Copy Button */}
                    {msg.role === 'model' && (
                      <button
                        onClick={() => handleCopy(msg.content, index)}
                        className="absolute right-2 top-2 p-1 rounded-md text-[#565555] hover:text-[#ffffff] bg-[#161616]/80 hover:bg-[#222] border border-[#242424] transition-all cursor-pointer"
                        title="Copy to clipboard"
                      >
                        {copiedIndex === index ? (
                          <Check size={11} className="text-[#22c55e]" />
                        ) : (
                          <Copy size={11} />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {loading && (
              <div className="flex flex-col items-start">
                <span className="text-[8px] font-black text-[#565555] tracking-widest uppercase mb-1 px-1">CREASE SCOUT</span>
                <div className="bg-[#111] border border-[#242424] rounded-2xl px-4 py-3.5 flex items-center gap-2">
                  <Loader2 className="animate-spin text-[#fb7185]" size={14} />
                  <span className="text-xs text-[#a3a3a3] font-bold">Scanning matchup telemetry...</span>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input Message Form */}
      <footer className="sticky bottom-0 z-40 bg-[#000000] p-4 border-t border-[#1a1a1a]">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Ask match-up questions..."
            className="flex-1 bg-[#161616] border border-[#242424] rounded-2xl px-4 py-3 text-xs text-[#ffffff] focus:outline-none focus:border-[#fb7185] placeholder-[#565555] transition-colors"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !query.trim()}
            className="w-11 h-11 bg-gradient-to-tr from-[#fb7185] to-[#a855f7] text-white rounded-2xl flex items-center justify-center active:scale-[0.95] disabled:scale-100 disabled:opacity-40 transition-all cursor-pointer"
          >
            <Send size={15} />
          </button>
        </div>
      </footer>
    </div>
  );
}
