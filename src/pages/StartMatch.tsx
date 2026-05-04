import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, MoreVertical, MapPin, Calendar, ChevronRight, Repeat, UserPlus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface TeamData {
  id: string;
  name: string;
  initials: string;
  color: string;
  players: number;
  matches: number;
  sub: string;
}

export default function StartMatch() {
  const navigate = useNavigate();
  const location = useLocation();
  const { team1, team2 } = (location.state as { team1: TeamData | null; team2: TeamData | null }) || { team1: null, team2: null };

  const [matchType, setMatchType] = useState('Limited Overs');
  const [ballType, setBallType] = useState('Leather');
  const [pitchType, setPitchType] = useState('Turf');
  const [wagonWheel, setWagonWheel] = useState(true);
  const [overs, setOvers] = useState('20');
  const [oversPerBowler, setOversPerBowler] = useState('4');
  const [showMenu, setShowMenu] = useState(false);

  const matchTypes = ['Limited Overs', 'Box/Turf Cricket', 'Pair Cricket', 'Test Match', 'The Hundred'];
  const ballTypes = [
    { id: 'Leather', icon: '🏏' },
    { id: 'Tennis', icon: '🎾' },
    { id: 'Other', icon: '⚪' },
  ];
  const pitchTypes = ['Turf', 'Rough', 'Cement', 'Astroturf', 'Matting'];

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-[#000000] text-[#ffffff] font-sans relative overflow-x-hidden shadow-2xl">
      
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 bg-[#000000]">
        <button onClick={() => navigate('/match/select-team', { state: { preselectedTeam1: team1?.id || null, preselectedTeam2: team2?.id || null } })} className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-[#ffffff] absolute left-1/2 -translate-x-1/2">Match Setup</h1>
        <div className="flex items-center gap-3 relative">
          <button className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors">
            <HelpCircle size={20} />
          </button>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors"
          >
            <MoreVertical size={20} />
          </button>
          
          {/* Context Menu */}
          {showMenu && (
            <div className="absolute top-10 right-0 bg-[#2a2a2a] rounded-xl py-2 shadow-[0_8px_32px_rgba(0,0,0,0.6)] w-52 z-50">
              {['Take photo/video', 'Match delayed', 'Match abandoned', 'Walkover', 'Match rules'].map((item) => (
                <button key={item} className="w-full text-left px-4 py-3 text-sm text-[#e5e2e1] hover:bg-[#333] transition-colors">
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>
      
      <main className="px-4 py-2 space-y-8 pb-32">
        
        {/* Teams VS Display */}
        <section className="bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            {/* Team 1 */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_16px_rgba(168,85,247,0.2)]"
                style={{ backgroundColor: team1?.color || '#a855f7' }}
              >
                <span className="text-xl font-bold text-[#000] font-headline">{team1?.initials || '??'}</span>
              </div>
              <span className="text-sm font-bold text-[#ffffff] text-center leading-tight">{team1?.name || 'Team 1'}</span>
              <span className="text-[10px] text-[#a3a3a3]">{team1 ? `${team1.players} Players` : ''}</span>
              {team1 && (
                <button
                  onClick={() => navigate(`/team/${team1.id}/players`)}
                  className="flex items-center gap-1 text-[#a855f7] hover:text-[#c799ff] transition-colors mt-1"
                >
                  <UserPlus size={10} />
                  <span className="text-[8px] font-bold tracking-wider uppercase">ADD PLAYERS</span>
                </button>
              )}
            </div>

            {/* VS Badge */}
            <div className="flex flex-col items-center gap-1 mx-2">
              <div className="w-10 h-10 rounded-full bg-[#2d1b4e] flex items-center justify-center">
                <span className="text-xs font-black text-[#c799ff]">VS</span>
              </div>
              <button
                onClick={() => navigate('/match/select-team', { state: { preselectedTeam1: team1?.id || null, preselectedTeam2: team2?.id || null } })}
                className="flex items-center gap-1 text-[#a855f7] hover:text-[#c799ff] transition-colors mt-1"
              >
                <Repeat size={10} />
                <span className="text-[8px] font-bold tracking-wider uppercase">CHANGE</span>
              </button>
            </div>

            {/* Team 2 */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_16px_rgba(168,85,247,0.2)]"
                style={{ backgroundColor: team2?.color || '#333' }}
              >
                <span className="text-xl font-bold text-[#ffffff] font-headline">{team2?.initials || '??'}</span>
              </div>
              <span className="text-sm font-bold text-[#ffffff] text-center leading-tight">{team2?.name || 'Team 2'}</span>
              <span className="text-[10px] text-[#a3a3a3]">{team2 ? `${team2.players} Players` : ''}</span>
              {team2 && (
                <button
                  onClick={() => navigate(`/team/${team2.id}/players`)}
                  className="flex items-center gap-1 text-[#a855f7] hover:text-[#c799ff] transition-colors mt-1"
                >
                  <UserPlus size={10} />
                  <span className="text-[8px] font-bold tracking-wider uppercase">ADD PLAYERS</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Match Type */}
        <section>
          <h3 className="text-[10px] font-bold text-[#565555] tracking-widest uppercase mb-3 px-1">MATCH TYPE</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {matchTypes.map((type) => (
              <button
                key={type}
                onClick={() => setMatchType(type)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-xs font-bold transition-colors ${
                  matchType === type
                    ? 'bg-[#a855f7] text-[#ffffff]'
                    : 'bg-[#1a1a1a] text-[#a3a3a3] hover:bg-[#2a2a2a]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        {/* Overs */}
        <section className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-bold text-[#565555] tracking-widest uppercase block mb-2">NO. OF OVERS*</label>
            <input
              type="number"
              value={overs}
              onChange={(e) => setOvers(e.target.value)}
              className="w-full bg-transparent border-b border-[#333] pb-2 text-xl font-bold text-[#ffffff] outline-none focus:border-[#a855f7] transition-colors"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#565555] tracking-widest uppercase block mb-2">OVERS PER BOWLER</label>
            <input
              type="number"
              value={oversPerBowler}
              onChange={(e) => setOversPerBowler(e.target.value)}
              className="w-full bg-transparent border-b border-[#333] pb-2 text-xl font-bold text-[#ffffff] outline-none focus:border-[#a855f7] transition-colors"
            />
          </div>
        </section>

        {/* Location & Date */}
        <section className="space-y-5">
          <div>
            <label className="text-[10px] font-bold text-[#565555] tracking-widest uppercase block mb-2">CITY / TOWN*</label>
            <div className="flex items-center border-b border-[#333] pb-2 gap-2">
              <MapPin size={16} className="text-[#565555] flex-shrink-0" />
              <input
                type="text"
                placeholder="Search location..."
                className="w-full bg-transparent text-sm text-[#ffffff] outline-none placeholder:text-[#333]"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#565555] tracking-widest uppercase block mb-2">DATE & TIME</label>
            <div className="flex items-center border-b border-[#333] pb-2 gap-2">
              <Calendar size={16} className="text-[#565555] flex-shrink-0" />
              <input
                type="text"
                placeholder="Select date and time..."
                className="w-full bg-transparent text-sm text-[#ffffff] outline-none placeholder:text-[#333]"
              />
            </div>
          </div>
        </section>

        {/* Ball Type */}
        <section>
          <h3 className="text-[10px] font-bold text-[#565555] tracking-widest uppercase mb-3 px-1">BALL TYPE</h3>
          <div className="grid grid-cols-3 gap-3">
            {ballTypes.map((ball) => (
              <button
                key={ball.id}
                onClick={() => setBallType(ball.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl aspect-square transition-all ${
                  ballType === ball.id
                    ? 'bg-[#1a1a1a] border-2 border-[#a855f7] shadow-[0_0_16px_rgba(168,85,247,0.15)]'
                    : 'bg-[#1a1a1a] border-2 border-transparent hover:border-[#333]'
                }`}
              >
                <span className="text-3xl mb-2">{ball.icon}</span>
                <span className={`text-xs font-bold ${ballType === ball.id ? 'text-[#ffffff]' : 'text-[#565555]'}`}>
                  {ball.id}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Pitch Type */}
        <section>
          <h3 className="text-[10px] font-bold text-[#565555] tracking-widest uppercase mb-3 px-1">PITCH TYPE</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {pitchTypes.map((type) => (
              <button
                key={type}
                onClick={() => setPitchType(type)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-xs font-bold transition-colors ${
                  pitchType === type
                    ? 'bg-[#a855f7] text-[#ffffff]'
                    : 'bg-[#1a1a1a] text-[#a3a3a3] hover:bg-[#2a2a2a]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        {/* Wagon Wheel Toggle */}
        <section className="bg-[#1a1a1a] rounded-2xl p-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#ffffff] mb-1">Wagon Wheel</h3>
            <p className="text-xs text-[#a3a3a3] m-0">Show for 1s, 2s & 3s</p>
          </div>
          <button
            onClick={() => setWagonWheel(!wagonWheel)}
            className={`relative w-12 h-7 rounded-full transition-colors ${wagonWheel ? 'bg-[#a855f7]' : 'bg-[#333]'}`}
          >
            <div className={`absolute top-0.5 w-6 h-6 bg-[#ffffff] rounded-full transition-transform shadow-md ${wagonWheel ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </section>

        {/* Match Officials */}
        <section>
          <h3 className="text-[10px] font-bold text-[#565555] tracking-widest uppercase mb-4 px-1">MATCH OFFICIALS</h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Umpires', emoji: '🧑‍⚖️' },
              { label: 'Scorers', emoji: '📝' },
              { label: 'Live Streamer', emoji: '📹' },
              { label: 'Others', emoji: '👥' },
            ].map((official) => (
              <button key={official.label} className="flex flex-col items-center gap-2 group">
                <div className="w-14 h-14 rounded-full bg-[#2d1b4e] flex items-center justify-center group-hover:bg-[#3d2c60] transition-colors">
                  <span className="text-xl">{official.emoji}</span>
                </div>
                <span className="text-[9px] font-bold text-[#a3a3a3] text-center leading-tight">{official.label}</span>
              </button>
            ))}
          </div>
        </section>

      </main>

      {/* Footer Action Buttons */}
      <div className="fixed bottom-0 w-full max-w-[390px] bg-[#000000] px-4 pt-4 pb-8 flex gap-3 z-50 border-t border-[#1a1a1a]">
        <button className="flex-1 bg-[#1a1a1a] text-[#a3a3a3] py-3.5 rounded-xl font-bold text-sm hover:bg-[#2a2a2a] transition-colors">
          Schedule Match
        </button>
        <button 
          onClick={() => navigate('/match/select-team')}
          className="flex-1 bg-[#a855f7] text-[#ffffff] py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#c799ff] transition-colors shadow-[0_4px_16px_rgba(168,85,247,0.3)]"
        >
          Next (Toss)
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
