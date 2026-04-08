import { Search, Bell, UserCircle } from 'lucide-react';

export default function TopBar() {
  return (
    <header className="flex items-center justify-between px-8 py-4 sticky top-0 bg-neutral-950/60 backdrop-blur-xl z-40">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
          <input
            type="text"
            placeholder="Search players or venues..."
            className="w-full bg-surface-container-lowest border-none text-sm pl-10 pr-4 py-2 rounded-full focus:ring-1 focus:ring-primary/50 placeholder:text-on-surface-variant text-white"
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button className="text-neutral-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <button className="text-neutral-400 hover:text-white transition-colors">
          <UserCircle className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
