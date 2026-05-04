import React, { useState } from 'react';
import { ArrowLeft, Smartphone, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Invite {
  id: string;
  name: string;
  phone: string;
  status: 'invited' | 'joined';
}

export default function AddViaPhone() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [invites, setInvites] = useState<Invite[]>([
    { id: '1', name: 'Rahul M.', phone: '+91 98765 43210', status: 'joined' },
    { id: '2', name: 'Arjun S.', phone: '+91 87654 32109', status: 'invited' },
  ]);

  const handleSendInvite = () => {
    if (phone.length < 10) return;
    setInvites([
      { id: Date.now().toString(), name: playerName || `Player`, phone: `+91 ${phone}`, status: 'invited' },
      ...invites,
    ]);
    setPhone('');
    setPlayerName('');
  };

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-[#000000] text-[#ffffff] font-sans relative overflow-x-hidden shadow-2xl">

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center gap-3 px-4 py-4 bg-[#000000]">
        <button onClick={() => navigate(-1)} className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-[#ffffff]">Add via Phone</h1>
      </header>

      <main className="px-4 py-2 space-y-6 pb-8">

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
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter phone number"
                  className="w-full bg-transparent text-sm text-[#ffffff] outline-none placeholder:text-[#333]"
                />
              </div>
            </div>
            <p className="text-[10px] text-[#565555] mt-2 px-1">We'll send them an SMS invite</p>
          </div>

          {/* Player Name */}
          <div>
            <label className="text-[10px] font-bold text-[#565555] tracking-widest uppercase block mb-2">PLAYER NAME (OPTIONAL)</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="e.g. Rahul"
              className="w-full bg-[#1a1a1a] rounded-xl px-4 py-3 text-sm text-[#ffffff] outline-none placeholder:text-[#333] border border-transparent focus:border-[#a855f7] transition-colors"
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendInvite}
            disabled={phone.length < 10}
            className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${
              phone.length >= 10
                ? 'bg-[#a855f7] text-[#ffffff] shadow-[0_4px_16px_rgba(168,85,247,0.3)] hover:bg-[#c799ff] active:scale-[0.98]'
                : 'bg-[#1a1a1a] text-[#565555] cursor-not-allowed'
            }`}
          >
            Send Invite
          </button>
        </section>

        {/* Invited List */}
        {invites.length > 0 && (
          <section>
            <h3 className="text-[10px] font-bold text-[#565555] tracking-widest uppercase mb-3 px-1">INVITED ({invites.length})</h3>
            <div className="space-y-2">
              {invites.map((invite) => (
                <div key={invite.id} className="bg-[#1a1a1a] rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#242424] flex items-center justify-center">
                      <span className="text-sm font-bold text-[#a3a3a3]">{invite.name[0]}</span>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-[#ffffff] block">{invite.name}</span>
                      <span className="text-[11px] text-[#a3a3a3]">{invite.phone}</span>
                    </div>
                  </div>
                  {invite.status === 'joined' ? (
                    <div className="bg-[#a855f7] px-3 py-1 rounded-full flex items-center gap-1">
                      <Check size={10} className="text-[#ffffff]" />
                      <span className="text-[9px] font-bold text-[#ffffff]">JOINED</span>
                    </div>
                  ) : (
                    <div className="border border-[#10b981] px-3 py-1 rounded-full">
                      <span className="text-[9px] font-bold text-[#10b981]">INVITED</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  );
}
