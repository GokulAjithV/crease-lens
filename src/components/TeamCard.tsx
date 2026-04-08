import { CheckCircle2, Plus } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface Player {
  id: string;
  name: string;
  role: string;
  image: string;
  selected: boolean;
}

interface TeamProps {
  name: string;
  teamId: string;
  logo: string;
  players: Player[];
  accentColor: 'primary' | 'tertiary';
  onTogglePlayer: (id: string) => void;
}

export default function TeamCard({ name, teamId, logo, players, accentColor, onTogglePlayer }: TeamProps) {
  const selectedCount = players.filter(p => p.selected).length;
  
  return (
    <section className="space-y-4">
      <div className={cn(
        "flex items-center justify-between bg-surface-container rounded-xl p-4 border-l-4",
        accentColor === 'primary' ? "border-primary" : "border-tertiary"
      )}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-surface-container-lowest flex items-center justify-center">
            <img 
              src={logo} 
              alt={name} 
              className="w-8 h-8 object-contain opacity-80" 
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold font-headline">{name}</h2>
            <p className={cn(
              "text-xs font-bold uppercase tracking-widest",
              accentColor === 'primary' ? "text-primary" : "text-tertiary"
            )}>
              {teamId}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black font-headline">
            {selectedCount.toString().padStart(2, '0')}
            <span className="text-on-surface-variant text-sm font-medium">/15</span>
          </p>
          <p className="text-[10px] text-on-surface-variant uppercase">Selected</p>
        </div>
      </div>

      <div className="bg-surface-container-low rounded-2xl overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto no-scrollbar">
          <div className="divide-y divide-outline-variant/10">
            {players.map((player) => (
              <div 
                key={player.id}
                className="flex items-center justify-between p-4 hover:bg-surface-container transition-colors group"
              >
                <div className={cn(
                  "flex items-center gap-3 transition-opacity",
                  !player.selected && "opacity-60"
                )}>
                  <div className={cn(
                    "w-10 h-10 rounded-full bg-surface-container-high p-0.5 border",
                    player.selected 
                      ? (accentColor === 'primary' ? "border-primary/20" : "border-tertiary/20")
                      : "border-outline-variant/30"
                  )}>
                    <img 
                      src={player.image} 
                      alt={player.name} 
                      className="w-full h-full object-cover rounded-full" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-secondary">{player.name}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase font-label">{player.role}</p>
                  </div>
                </div>
                <button 
                  onClick={() => onTogglePlayer(player.id)}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95",
                    player.selected 
                      ? (accentColor === 'primary' 
                          ? "bg-primary text-on-primary shadow-lg shadow-primary/20" 
                          : "bg-tertiary text-on-tertiary-fixed shadow-lg shadow-tertiary/20")
                      : "bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80"
                  )}
                >
                  {player.selected ? (
                    <CheckCircle2 className="w-5 h-5 fill-current" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
