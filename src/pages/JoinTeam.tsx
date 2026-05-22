import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';

export default function JoinTeam() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [teamName, setTeamName] = useState('');

  useEffect(() => {
    async function joinTeam() {
      if (!token) {
        setError('Invalid invite token');
        setLoading(false);
        return;
      }

      const apiToken = localStorage.getItem('token');
      if (!apiToken) {
        // Not logged in. Store pending join token and redirect to register/login.
        localStorage.setItem('pendingJoinToken', token);
        navigate('/login', { state: { message: 'Please log in or register to join this team.' } });
        return;
      }

      try {
        setError('');
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        
        const response = await fetch(`${API_URL}/api/teams/join/${token}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiToken}`
          }
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.detail || 'Failed to join team');
        }

        setTeamName(data.data?.team?.name || 'the team');
        
        // Wait 2.5 seconds, then redirect to home
        setTimeout(() => {
          navigate('/home');
        }, 2500);

      } catch (err: any) {
        setError(err.message || 'An error occurred while joining the team.');
      } finally {
        setLoading(false);
      }
    }

    joinTeam();
  }, [token, navigate]);

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-[#000000] text-[#ffffff] font-sans flex flex-col justify-between p-6 shadow-2xl relative">
      
      {/* Header */}
      <header className="flex items-center gap-3 py-4">
        <button onClick={() => navigate('/home')} className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors">
          <ArrowLeft size={20} />
        </button>
        <span className="text-sm font-semibold text-[#a3a3a3]">Join Squad</span>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
        
        {loading && (
          <div className="space-y-4">
            <div className="relative flex items-center justify-center">
              <Loader2 size={48} className="text-[#a855f7] animate-spin" />
            </div>
            <h2 className="text-xl font-bold">Verifying Invite Link...</h2>
            <p className="text-sm text-[#a3a3a3] max-w-[280px] mx-auto">
              Adding you to the squad roster. Please wait a moment.
            </p>
          </div>
        )}

        {error && (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-[#ef4444]/10 border border-[#ef4444]/20 flex items-center justify-center">
              <XCircle size={32} className="text-[#ef4444]" />
            </div>
            <h2 className="text-xl font-bold text-[#ffffff]">Unable to Join</h2>
            <p className="text-sm text-[#ef4444] bg-[#ef4444]/10 px-4 py-3 rounded-xl max-w-[300px] mx-auto leading-relaxed border border-[#ef4444]/20">
              {error}
            </p>
            <div className="pt-4">
              <button
                onClick={() => navigate('/home')}
                className="px-6 py-3 bg-[#1a1a1a] border border-[#333] hover:border-[#565555] rounded-xl text-sm font-bold transition-all text-[#ffffff]"
              >
                Go to Home
              </button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-4 animate-fade-in">
            <div className="mx-auto w-16 h-16 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center">
              <CheckCircle2 size={32} className="text-[#10b981]" />
            </div>
            <h2 className="text-2xl font-black text-[#ffffff]">Welcome to the Squad! 🏏</h2>
            <p className="text-sm text-[#a3a3a3] max-w-[280px] mx-auto leading-relaxed">
              You are now registered as a player of <span className="font-bold text-[#ffffff]">{teamName}</span>.
            </p>
            <p className="text-xs text-[#565555]">
              Redirecting you to the home dashboard...
            </p>
          </div>
        )}

      </main>

      {/* Footer Branding */}
      <footer className="py-6 text-center">
        <span className="text-[10px] font-bold text-[#333] tracking-widest uppercase">CREASE SCORING PLATFORM</span>
      </footer>

    </div>
  );
}
