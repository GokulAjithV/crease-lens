import { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import TeamCard from './components/TeamCard';
import TossSection from './components/TossSection';
import { Play } from 'lucide-react';
import { motion } from 'motion/react';

const INITIAL_TEAM_1 = [
  { id: 'm1', name: 'Rohit Sharma', role: 'Batsman / Captain', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANcamRoIbXjOeoZCR_cStWP52iPnrOJGSri9gQK6rjgRa90Vo0dPlxY05zyhrE9nt0VpT9k32TaSjEj2amPkwL1dmwbLECVIy6Dwh8PBcLw05qYJU1Voh-Jej6suJ30WkZGATDW1GC36P1CakojreEHuP9GPBWLSG4ZsBJoBfYe_hEpmXKzUNskHQ1kUUnWSdBc4CfzLK7RrxNi26AAKe9DR0luuregD04EQsJpNqJCuRoS1k3t90pbtbpSf56y3DhNNmEKhMmDDs', selected: true },
  { id: 'm2', name: 'Ishan Kishan', role: 'Wicket Keeper', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqxX_TpraBiOPaOEuz-HP2MN3Gky6_Rx-eZHifEPxcrsTvDE4wIjkKjGtQxN2y5zo2Ju4kpzx8cCJrQZApAHyVAi8EFWHh2Z23OisDrFnTyfnhshFMR5WYDvhPQNRBz0X4jOBTjm_p3mNJXLxPhtqXGBsuDS9OZeRFZSpuA6COYg1aN3bpq2lR_ESM3b_vpaXk_BJyFylYvoKNit9HK3n3WfGgbmBoRsqHCSigRAMeM6dIn1-kSYF2W-jvdDDJS-wMCNiD_K1XqVA', selected: false },
  { id: 'm3', name: 'Jasprit Bumrah', role: 'Bowler (Fast)', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcK_QMNlpUXTISTr7QNzRMidz6QxjCuYeJrWwAkCHx7UGFy85C_vlXskHETETadbsVzgAKOMuRLuIIdSTp5iNnR9MIrbqDXWw4DfYZADLZrLACiCUfaVp_5G4xsfPaLLJ1JEcGPiOusPfCOQ1w4UvbI6OCDPVlbanQdB7LV0XNsxX3MXsCQTYivNftQgCSA4TC_AM0N9qH1wgNbWn9uYnaA5PSuYNydWKt0-aNKgp2-vBQBa-1U47iNJmlIX7JEvowAPusSK9190g', selected: true },
  { id: 'm4', name: 'Suryakumar Yadav', role: 'Batsman', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXdsQHG2LfgULXPeSr7Ef4MZ_8WCHY9jyLM7hgcdeKImqgTuTbPNvKHnMg8591KAPHLB3rAhNHnMZlyVnGLUIWD8s0ox2aVf8TB3ZoMxpSwRUEZNzCAfzUuv6Z3cZcW1wzHcK4nURgFiOTcgf8LBvQhohju0sZm1L1JE6dCy2Y1HIdS26pz0p0jd18RrzWl75qmUtLYwLAFpB45rLQ7pSGTAcgw5xrxfHBeoPAeouqvoJd_MYCy8PLAw2GEkD3DZ-BU6pzVZmi5Vs', selected: false },
];

const INITIAL_TEAM_2 = [
  { id: 'b1', name: 'Virat Kohli', role: 'Batsman / Captain', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDm7j0uLGZOscHgtpQdaGPEAyDH1RSLy4KiCWNrrLIe5TWUfXpeXKA7C2zuDqDK9mUmYnyIyjiBzJDaK96KWigfE7xZZZZkTVN3zkkiPcfEVyYhJcjggL5kmjezIS5_gAr6bgPcIZHFjoAZ37XNR7qGC5J2pCk2l49fV9QuvPGb6TEbtIczfVgWm-D9dla3HL9WezNzJaGEgOxtxbq-YH6k2nnYcIJHXgrVWEYTy6dYRpTLk8ufB6iGs7jAP826RmZgZElfIJlzKgo', selected: true },
  { id: 'b2', name: 'Faf du Plessis', role: 'Batsman', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmepvpPUMme0Er3VvxSlHyZNxRPUAFpqUVLH2TXK5wEebFxbcVYITZ4ICriPMLQ6dye6T6AB07IPnbMJbrEJVKs9bvpZCfC34v5a5ee0WYYe43Q11t0PdbXNuC5xUN9Xd6E8ndSgAdLkK7ANxl45h--GEA2kGcwpERcmDi4kJa_E1AwKJwZ9TX3GvZZrJ-jYI2FvEZDL1XcVDxxglJpJIqcGo9LpkZWH5cS8qY_HaThtF_-32FTPs3nWjP8A-JBGf6sA2-5viSYDo', selected: true },
  { id: 'b3', name: 'Glenn Maxwell', role: 'All-Rounder', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-pDlN_rIptPHvAoa7EqvfvjMLTMt-tX1ziKQC690v_JcqvzwA4UHmKpP988JrP8YjThU2Z-d8TmQDYkgq8prCQ7mvGNUojSkl2c0yi7InF9TYWkMe_Y1nth4lyxPkc1Z1QczG74Mef-qspnu_knYpm3DyIw4zo05hsuekLEWYUUNpoyFTNrMn-mESWgogAyQnJqH0pjBAUAsqMBiR7lbubmzaUK7UsKnWqyQO-653x7NeRxD60bGUoj3vdZ-C3HjRK_WbAt_w_7s', selected: false },
  { id: 'b4', name: 'Mohammed Siraj', role: 'Bowler (Fast)', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0OxOqpS-V3HqZQxOzlPSdXQcE0H-11YBS6kpx0RWY9TX9EaveZcy9BK6uhr4AjB-vrKc6D0ojMIpEAEQ5v1-6SL8Z95cyGg7TTye6aF5HrzzfHo8PkLFkAU1nX01Nr4pZWWNJkOitWx41AYfMhn-eantTB1TSS_L8uECPYvMQXq4Ot-k1Uz76dtOgMRQX22nvl487Y8k2lfopZGaC3BInCkmwpxi9n9fx8a6SgoO9HfVgaidv436S5xPJq2tsHHsPkdc63LF06iQ', selected: false },
];

export default function App() {
  const [team1Players, setTeam1Players] = useState(INITIAL_TEAM_1);
  const [team2Players, setTeam2Players] = useState(INITIAL_TEAM_2);
  const [tossWinner, setTossWinner] = useState<string | null>('Bangalore Royals');
  const [decision, setDecision] = useState<'batting' | 'bowling' | null>('bowling');

  const togglePlayer = (team: 1 | 2, id: string) => {
    if (team === 1) {
      setTeam1Players(prev => prev.map(p => p.id === id ? { ...p, selected: !p.selected } : p));
    } else {
      setTeam2Players(prev => prev.map(p => p.id === id ? { ...p, selected: !p.selected } : p));
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-on-background">
      <Sidebar />
      
      <main className="ml-64 flex-1 flex flex-col">
        <TopBar />
        
        <div className="p-8 pb-32 max-w-7xl mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-4xl font-extrabold tracking-tight font-headline mb-2">Match Setup</h1>
            <p className="text-on-surface-variant font-label">Finalize the playing 11 and conduct the toss to begin the session.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <TeamCard 
              name="Mumbai Titans"
              teamId="Team 01"
              logo="https://lh3.googleusercontent.com/aida-public/AB6AXuC-SKUNoFNs1NIShcQqnkh9f8EjmewJQJ64mrchWc2iLnKbxaKL6kWs6EM7KEBGJ25CPrmcYcJvD1r1eoi4OkdJ-HcTZMqL-02Il-CXoZRyf_tkZ126nIBi4eDa7X_xraquJPdY80-aT8Xw9t9EIGt87mqZaNSJcQJUXaoB01ELld03bmbcHuZPtlh1po4soXEHn2ZnnQllBkl3rLBDb14ew1aAQj2OIiq7rSuXTgVCIB0z4c6seT_MTHyDaW91uR9gZsyJYvzR2jo"
              players={team1Players}
              accentColor="primary"
              onTogglePlayer={(id) => togglePlayer(1, id)}
            />
            <TeamCard 
              name="Bangalore Royals"
              teamId="Team 02"
              logo="https://lh3.googleusercontent.com/aida-public/AB6AXuBOgOUK4SakhIfE-fZYH0qQXkgvModMVBf6NTeTCOjMoWsY3awHU42filT8UTADfpIBXQt3tmLzj_ruJk7YuP7i9MLyabW5gXgtiSiqOnMigY4vEKthxLkguE14DuAzG-ltww-dkY1AliAgyL7cnxxUQvRKM9-znTKHw2gkL2wOWj5pNkucIk9zYNPbk9MCZp2lH9ld65-HZl_KW4tyRdNFhb59yota9-PlgwpVatAB2RbTw6aHCwMpxyUNk2mUyVDNB--3ofMr2Ow"
              players={team2Players}
              accentColor="tertiary"
              onTogglePlayer={(id) => togglePlayer(2, id)}
            />
          </div>

          <TossSection 
            winner={tossWinner}
            decision={decision}
            onSelectWinner={setTossWinner}
            onSelectDecision={setDecision}
          />
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-12 right-12 z-50">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="h-16 px-8 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold shadow-2xl flex items-center gap-3 group"
          >
            <span className="font-headline tracking-tight uppercase">Start Live Match</span>
            <Play className="w-5 h-5 fill-current" />
          </motion.button>
        </div>
      </main>
    </div>
  );
}
