import React from 'react';
import { Settings } from 'lucide-react';

export default function PageHeader({ title, showActions = true }: { title: string, showActions?: boolean }) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 bg-[#0e0e0e]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-[#a855f7] overflow-hidden flex items-center justify-center bg-[#1a1a1a]">
          <img src="https://ui-avatars.com/api/?name=User&background=1a1a1a&color=fff" alt="User" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-2xl font-black text-[#c799ff] italic tracking-wider uppercase">{title}</h1>
      </div>
      {showActions && (
        <div className="flex items-center gap-4">
          <button className="text-[#d2d0cf] hover:text-[#ffffff] transition-colors">
            <Settings size={22} />
          </button>
        </div>
      )}
    </header>
  );
}
