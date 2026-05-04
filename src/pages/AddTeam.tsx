import React, { useState } from 'react';
import { ArrowLeft, Camera, Pencil, MapPin, Smartphone, User, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const teamColors = [
  '#a855f7', '#ef4444', '#f59e0b', '#10b981', '#3b82f6',
  '#ec4899', '#f97316', '#14b8a6', '#8b5cf6', '#06b6d4',
];

export default function AddTeam() {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState('');
  const [city, setCity] = useState('');
  const [captainPhone, setCaptainPhone] = useState('');
  const [captainName, setCaptainName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#a855f7');
  const [captainCanAdd, setCaptainCanAdd] = useState(true);
  const [hasLogo, setHasLogo] = useState(false);

  const maxNameLength = 30;
  const initials = teamName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const canCreate = teamName.trim().length >= 2;

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-[#000000] text-[#ffffff] font-sans relative overflow-x-hidden shadow-2xl">

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center gap-3 px-4 py-4 bg-[#000000]">
        <button onClick={() => navigate(-1)} className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-[#ffffff]">Add New Team</h1>
      </header>

      <main className="px-4 py-2 space-y-8 pb-32">

        {/* Team Logo / Avatar */}
        <section className="flex flex-col items-center gap-4">
          <div className="relative">
            {hasLogo || teamName.length > 0 ? (
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center shadow-[0_0_24px_rgba(168,85,247,0.25)]"
                style={{ backgroundColor: selectedColor }}
              >
                <span className="text-3xl font-bold text-[#ffffff] font-headline">{initials || '?'}</span>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#565555] flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#a3a3a3] transition-colors">
                <Camera size={22} className="text-[#565555]" />
                <span className="text-[8px] font-bold text-[#565555] tracking-widest uppercase">ADD LOGO</span>
              </div>
            )}
            {/* Edit button overlay */}
            {teamName.length > 0 && (
              <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center hover:bg-[#2a2a2a] transition-colors">
                <Pencil size={12} className="text-[#a3a3a3]" />
              </button>
            )}
          </div>

          {/* Color Picker */}
          <div className="flex gap-2">
            {teamColors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-7 h-7 rounded-full transition-all ${
                  selectedColor === color
                    ? 'ring-2 ring-offset-2 ring-offset-[#000] ring-[#ffffff] scale-110'
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </section>

        {/* Form */}
        <section className="space-y-6">

          {/* Team Name */}
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

          {/* City / Town */}
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

          {/* Captain's Phone */}
          <div>
            <label className="text-[10px] font-bold text-[#565555] tracking-widest uppercase block mb-2">CAPTAIN'S PHONE NUMBER</label>
            <div className="flex gap-2">
              <div className="bg-[#1a1a1a] rounded-xl px-3 py-3 flex items-center gap-1 border border-transparent">
                <span className="text-sm font-bold text-[#ffffff]">+91</span>
              </div>
              <div className={`flex-1 flex items-center gap-2 bg-[#1a1a1a] rounded-xl px-4 py-3 border transition-colors ${
                captainPhone.length > 0 ? 'border-[#ffffff]/20' : 'border-transparent'
              } focus-within:border-[#a855f7]`}>
                <Smartphone size={16} className="text-[#565555] flex-shrink-0" />
                <input
                  type="tel"
                  value={captainPhone}
                  onChange={(e) => setCaptainPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-transparent text-sm text-[#ffffff] outline-none placeholder:text-[#333]"
                />
              </div>
            </div>
          </div>

          {/* Captain's Name */}
          <div>
            <label className="text-[10px] font-bold text-[#565555] tracking-widest uppercase block mb-2">CAPTAIN'S NAME</label>
            <div className={`flex items-center gap-2 bg-[#1a1a1a] rounded-xl px-4 py-3 border transition-colors ${
              captainName.length > 0 ? 'border-[#ffffff]/20' : 'border-transparent'
            } focus-within:border-[#a855f7]`}>
              <User size={16} className="text-[#565555] flex-shrink-0" />
              <input
                type="text"
                value={captainName}
                onChange={(e) => setCaptainName(e.target.value)}
                placeholder="e.g. Gokul"
                className="w-full bg-transparent text-sm text-[#ffffff] outline-none placeholder:text-[#333]"
              />
            </div>
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCaptainCanAdd(!captainCanAdd)}
              className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all ${
                captainCanAdd
                  ? 'bg-[#a855f7]'
                  : 'bg-transparent border-2 border-[#565555]'
              }`}
            >
              {captainCanAdd && <span className="text-[#ffffff] text-xs font-bold">✓</span>}
            </button>
            <span className="text-sm text-[#a3a3a3]">Let the captain add team players</span>
          </div>

        </section>

      </main>

      {/* Footer */}
      <div className="fixed bottom-0 w-full max-w-[390px] bg-gradient-to-t from-[#000000] via-[#000000] to-transparent px-4 pt-6 pb-8 z-50">
        <button
          onClick={() => canCreate && navigate(-1)}
          disabled={!canCreate}
          className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            canCreate
              ? 'bg-[#a855f7] text-[#ffffff] shadow-[0_4px_20px_rgba(168,85,247,0.35)] hover:bg-[#c799ff] active:scale-[0.98]'
              : 'bg-[#1a1a1a] text-[#565555] cursor-not-allowed'
          }`}
        >
          Create Team
          <Sparkles size={16} />
        </button>
      </div>
    </div>
  );
}
