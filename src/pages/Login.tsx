import React, { useState } from 'react';
import { Eye, EyeOff, Phone, Lock, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
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

      navigate('/home');
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

        {/* Social Login */}
        <div className="flex gap-3 mb-8">
          <button type="button" className="flex-1 bg-[#1a1a1a] rounded-xl py-3.5 flex items-center justify-center gap-2 hover:bg-[#222] active:scale-[0.98] transition-all border border-[#2a2a2a]">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-xs font-bold text-[#a3a3a3]">Google</span>
          </button>
          <button type="button" className="flex-1 bg-[#1a1a1a] rounded-xl py-3.5 flex items-center justify-center gap-2 hover:bg-[#222] active:scale-[0.98] transition-all border border-[#2a2a2a]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            <span className="text-xs font-bold text-[#a3a3a3]">Apple</span>
          </button>
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
