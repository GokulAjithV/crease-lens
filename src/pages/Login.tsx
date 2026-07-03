import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Phone, Lock, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleCredentialResponse = async (response: any) => {
    setError('');
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: response.credential }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Google authentication failed');
      }
      
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Google SSO login failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if ((window as any).google) {
        (window as any).google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '1074747715426-30s0c0n80kml0aeq59d99723l5j50hcb.apps.googleusercontent.com',
          callback: handleGoogleCredentialResponse,
        });
        
        (window as any).google.accounts.id.renderButton(
          document.getElementById('google-signin-btn-container'),
          { theme: 'filled_black', size: 'large', width: 342, shape: 'pill' }
        );
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_or_phone: phone, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      // Save token and user data
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      const pendingJoinToken = localStorage.getItem('pendingJoinToken');
      if (pendingJoinToken) {
        localStorage.removeItem('pendingJoinToken');
        navigate(`/join/${pendingJoinToken}`);
      } else {
        navigate('/home');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-[#000000] text-[#ffffff] font-sans relative overflow-x-hidden shadow-2xl flex flex-col">

      {/* Hero / Brand */}
      <section className="flex flex-col items-center pt-16 pb-10">
        {/* Logo Mark */}
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#a855f7] flex items-center justify-center shadow-[0_0_40px_rgba(124,58,237,0.3)]">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10" />
              <path d="M2 12h20" />
            </svg>
          </div>
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-2xl border border-[#a855f7]/20 scale-125"></div>
        </div>
        <h1 className="text-2xl font-black text-[#ffffff] tracking-tight">CREASE</h1>
        <p className="text-[11px] text-[#565555] tracking-[0.2em] uppercase mt-1">Score. Analyze. Dominate.</p>
      </section>

      {/* Welcome */}
      <div className="px-6 mb-8">
        <h2 className="text-2xl font-black text-[#ffffff] mb-1">Welcome Back</h2>
        <p className="text-sm text-[#a3a3a3]">Sign in to continue</p>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="px-6 flex-1 flex flex-col">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}
        <div className="space-y-4 mb-3">
          {/* Phone */}
          <div className="bg-[#1a1a1a] rounded-xl flex items-center px-4 py-3.5 gap-3 border border-transparent focus-within:border-[#a855f7]/40 transition-colors">
            <div className="flex items-center gap-1.5 flex-shrink-0 pr-3 border-r border-[#2a2a2a]">
              <span className="text-sm">🇮🇳</span>
              <span className="text-xs font-bold text-[#a3a3a3]">+91</span>
              <ChevronDown size={12} className="text-[#565555]" />
            </div>
            <Phone size={16} className="text-[#565555] flex-shrink-0" />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 bg-transparent text-sm text-[#ffffff] placeholder-[#565555] outline-none"
            />
          </div>

          {/* Password */}
          <div className="bg-[#1a1a1a] rounded-xl flex items-center px-4 py-3.5 gap-3 border border-transparent focus-within:border-[#a855f7]/40 transition-colors">
            <Lock size={16} className="text-[#565555] flex-shrink-0" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent text-sm text-[#ffffff] placeholder-[#565555] outline-none"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#565555] hover:text-[#a3a3a3] transition-colors flex-shrink-0">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Forgot Password */}
        <div className="text-right mb-6">
          <button type="button" className="text-xs font-bold text-[#a855f7] hover:text-[#c799ff] transition-colors">
            Forgot Password?
          </button>
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={loading || !phone || !password}
          className={`w-full py-4 rounded-2xl font-bold text-sm transition-all ${
            loading || !phone || !password
              ? 'bg-[#2a2a2a] text-[#565555] cursor-not-allowed'
              : 'bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-[#ffffff] shadow-[0_4px_25px_rgba(124,58,237,0.4)] hover:shadow-[0_4px_30px_rgba(124,58,237,0.6)] active:scale-[0.98]'
          }`}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-7">
          <div className="flex-1 h-px bg-[#2a2a2a]"></div>
          <span className="text-[10px] text-[#565555] tracking-wider uppercase">or continue with</span>
          <div className="flex-1 h-px bg-[#2a2a2a]"></div>
        </div>

        {/* Google SSO Container */}
        <div className="mb-8 flex justify-center">
          <div id="google-signin-btn-container" className="w-full"></div>
        </div>

        {/* Footer */}
        <div className="mt-auto pb-10 text-center">
          <span className="text-xs text-[#a3a3a3]">Don't have an account? </span>
          <button type="button" onClick={() => navigate('/register')} className="text-xs font-bold text-[#a855f7] hover:text-[#c799ff] transition-colors">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}
