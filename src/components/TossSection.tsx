import { RefreshCw, Star, Trophy, Play } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface TossSectionProps {
  winner: string | null;
  decision: 'batting' | 'bowling' | null;
  onSelectWinner: (team: string) => void;
  onSelectDecision: (decision: 'batting' | 'bowling') => void;
}

export default function TossSection({ winner, decision, onSelectWinner, onSelectDecision }: TossSectionProps) {
  return (
    <section className="bg-surface-container-highest/40 rounded-3xl p-8 relative overflow-hidden border border-outline-variant/10">
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px]"></div>
      
      <div className="relative z-10">
        <div className="text-center mb-10">
          <RefreshCw className="text-primary w-10 h-10 mx-auto mb-4" />
          <h2 className="text-2xl font-bold font-headline">Who won the Toss?</h2>
          <p className="text-on-surface-variant text-sm mt-1">Select the team that won the flip and their opening decision.</p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <button 
            onClick={() => onSelectWinner('Mumbai Titans')}
            className="w-full max-w-[280px] group"
          >
            <div className={cn(
              "p-6 rounded-2xl border-2 transition-all active:scale-95",
              winner === 'Mumbai Titans'
                ? "bg-surface-container-high border-primary shadow-[0_0_40px_rgba(199,153,255,0.1)]"
                : "bg-surface-container border-transparent hover:border-primary/50 group-hover:bg-surface-container-high"
            )}>
              <p className={cn(
                "text-xs uppercase tracking-widest font-bold mb-4",
                winner === 'Mumbai Titans' ? "text-primary" : "text-on-surface-variant"
              )}>
                Winner
              </p>
              <h3 className={cn(
                "text-xl font-black font-headline mb-1 transition-colors",
                winner === 'Mumbai Titans' ? "text-white" : "group-hover:text-primary"
              )}>
                Mumbai Titans
              </h3>
              {winner === 'Mumbai Titans' ? (
                <div className="flex items-center gap-2 mt-2">
                  <Star className="text-primary w-3 h-3 fill-current" />
                  <span className="text-[10px] text-primary font-bold uppercase tracking-tighter">Current Selection</span>
                </div>
              ) : (
                <p className="text-[10px] text-on-surface-variant">Click to select</p>
              )}
            </div>
          </button>

          <div className="hidden md:flex flex-col items-center gap-2">
            <div className="w-px h-12 bg-outline-variant/20"></div>
            <span className="text-on-surface-variant font-black text-xs uppercase italic">Vs</span>
            <div className="w-px h-12 bg-outline-variant/20"></div>
          </div>

          <button 
            onClick={() => onSelectWinner('Bangalore Royals')}
            className="w-full max-w-[280px] group"
          >
            <div className={cn(
              "p-6 rounded-2xl border-2 transition-all active:scale-95",
              winner === 'Bangalore Royals'
                ? "bg-surface-container-high border-primary shadow-[0_0_40px_rgba(199,153,255,0.1)]"
                : "bg-surface-container border-transparent hover:border-primary/50 group-hover:bg-surface-container-high"
            )}>
              <p className={cn(
                "text-xs uppercase tracking-widest font-bold mb-4",
                winner === 'Bangalore Royals' ? "text-primary" : "text-on-surface-variant"
              )}>
                Winner
              </p>
              <h3 className={cn(
                "text-xl font-black font-headline mb-1 transition-colors",
                winner === 'Bangalore Royals' ? "text-white" : "group-hover:text-primary"
              )}>
                Bangalore Royals
              </h3>
              {winner === 'Bangalore Royals' ? (
                <div className="flex items-center gap-2 mt-2">
                  <Star className="text-primary w-3 h-3 fill-current" />
                  <span className="text-[10px] text-primary font-bold uppercase tracking-tighter">Current Selection</span>
                </div>
              ) : (
                <p className="text-[10px] text-on-surface-variant">Click to select</p>
              )}
            </div>
          </button>
        </div>

        <div className="mt-12 flex justify-center gap-4">
          <button 
            onClick={() => onSelectDecision('batting')}
            className={cn(
              "px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 active:scale-95",
              decision === 'batting' 
                ? "bg-primary text-on-primary shadow-lg shadow-primary/30" 
                : "bg-secondary-container text-white hover:bg-secondary-container/80"
            )}
          >
            <Trophy className="w-4 h-4" />
            Batting
          </button>
          <button 
            onClick={() => onSelectDecision('bowling')}
            className={cn(
              "px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 active:scale-95",
              decision === 'bowling' 
                ? "bg-primary text-on-primary shadow-lg shadow-primary/30" 
                : "bg-secondary-container text-white hover:bg-secondary-container/80"
            )}
          >
            <Play className="w-4 h-4" />
            Bowling
          </button>
        </div>
      </div>
    </section>
  );
}
