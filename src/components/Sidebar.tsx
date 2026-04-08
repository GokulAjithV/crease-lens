import { Home, Trophy, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const navItems = [
  { icon: Home, label: 'Home', active: false },
  { icon: Trophy, label: 'Matches', active: true },
  { icon: BarChart3, label: 'Live Score', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

export default function Sidebar() {
  return (
    <aside className="h-full w-64 fixed left-0 top-0 flex flex-col p-6 bg-neutral-950 border-r border-neutral-800/20 shadow-[48px_0_48px_rgba(199,153,255,0.06)] z-50">
      <div className="mb-12">
        <span className="text-2xl font-bold tracking-tighter text-white uppercase font-headline">Stadium Noir</span>
        <p className="text-on-surface-variant text-xs mt-1 font-label">Premium Cricket</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={cn(
              "flex items-center gap-3 p-3 transition-all duration-250 ease-out rounded-lg active:scale-95 transition-transform group",
              item.active 
                ? "text-purple-400 font-bold bg-neutral-900/50" 
                : "text-neutral-500 hover:text-neutral-200 hover:bg-neutral-900/80"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-label">{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="mt-auto pt-6 flex items-center gap-3 border-t border-neutral-800/20">
        <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant/15">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgm5eqcqpoAxjU4rsdyTVFCgw66TJMYlOxBiSrxDQmBhSLae48DTdshF-ls2ozA5d4gE2fkkOTMnCDB1T9vXVwgL-0QMRLfTgnv8Ca7MySB60YuMXJIRauyuO9pazBUl5upQC-mlyDIOTZyR_COo1BxTrLzIKstNc626me0FTnDc2RONeiKsKR19YZrErXNvgVWcFcLNFFIpt403i5R_djWse07OBziqthe86uPTF9kCSDe3vHoteohlLVwpJ0jhFMPOkGR0x816A"
            alt="Alex Carter"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div>
          <p className="text-sm font-bold">Alex Carter</p>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Lead Umpire</p>
        </div>
      </div>
    </aside>
  );
}
