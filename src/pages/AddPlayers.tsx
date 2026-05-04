import React from 'react';
import { ArrowLeft, Search, Link2, Phone, BookUser, ChevronRight, UserPlus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const existingPlayers = [
  { id: '1', initials: 'VK', name: 'V. Kohli', color: '#a855f7' },
  { id: '2', initials: 'RS', name: 'R. Sharma', color: '#f59e0b' },
  { id: '3', initials: 'HP', name: 'H. Pandya', color: '#10b981' },
];

export default function AddPlayers() {
  const navigate = useNavigate();
  const { teamId } = useParams();

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-[#000000] text-[#ffffff] font-sans relative overflow-x-hidden shadow-2xl">

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 bg-[#000000]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-[#ffffff] m-0">Add Players</h1>
            <p className="text-xs text-[#a3a3a3] m-0">Village Kings · {existingPlayers.length} players added</p>
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
            <h3 className="text-[10px] font-bold text-[#565555] tracking-widest uppercase">SQUAD ({existingPlayers.length})</h3>
            <button className="text-[#a855f7] text-xs font-bold tracking-wider">View All</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {/* Add New Player Button */}
            <button className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#a855f7] flex items-center justify-center">
                <UserPlus size={18} className="text-[#a855f7]" />
              </div>
              <span className="text-[9px] font-bold text-[#a855f7]">ADD</span>
            </button>
            {/* Existing Players */}
            {existingPlayers.map((p) => (
              <div key={p.id} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: p.color }}
                >
                  <span className="text-lg font-bold text-[#000]">{p.initials}</span>
                </div>
                <span className="text-[9px] font-bold text-[#a3a3a3]">{p.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="flex items-center gap-3 px-1">
          <div className="flex-1 h-px bg-[#1a1a1a]"></div>
          <span className="text-[9px] font-bold text-[#565555] tracking-widest uppercase">ADD MORE PLAYERS VIA</span>
          <div className="flex-1 h-px bg-[#1a1a1a]"></div>
        </div>

        {/* Team Link */}
        <section className="bg-[#1a1a1a] rounded-2xl p-4 space-y-4">
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
            <button className="flex-1 border border-[#a855f7] text-[#c799ff] py-2.5 rounded-xl text-xs font-bold hover:bg-[#a855f7]/10 transition-colors">
              Share Link
            </button>
            <button className="flex-1 bg-[#25D366] text-[#000] py-2.5 rounded-xl text-xs font-bold hover:bg-[#20bd5a] transition-colors">
              WhatsApp
            </button>
          </div>
        </section>

        {/* Phone Number */}
        <button
          onClick={() => navigate(`/team/${teamId || '1'}/players/phone`)}
          className="w-full bg-[#1a1a1a] rounded-2xl p-4 flex items-center gap-3 text-left hover:bg-[#222] transition-colors group"
        >
          <div className="w-10 h-10 rounded-full bg-[#242424] flex items-center justify-center flex-shrink-0">
            <Phone size={18} className="text-[#a3a3a3]" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-[#ffffff] mb-0.5">Phone Number</h4>
            <p className="text-xs text-[#a3a3a3] m-0">Add 1 or 2 players manually via their mobile number.</p>
          </div>
          <ChevronRight size={16} className="text-[#565555] group-hover:text-[#a3a3a3] transition-colors" />
        </button>

        {/* From Contacts */}
        <button
          onClick={() => navigate(`/team/${teamId || '1'}/players/contacts`)}
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
