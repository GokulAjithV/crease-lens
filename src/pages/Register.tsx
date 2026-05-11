import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Phone, Lock, Mail, User, Camera, ChevronDown, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type CricketRole = 'batsman' | 'bowler' | 'allrounder' | 'keeper';
type BatHand = 'right' | 'left';

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<CricketRole | null>(null);
  const [batHand, setBatHand] = useState<BatHand>('right');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roles: { id: CricketRole; label: string }[] = [
    { id: 'batsman', label: 'Batsman' },
    { id: 'bowler', label: 'Bowler' },
    { id: 'allrounder', label: 'All-Rounder' },
    { id: 'keeper', label: 'Wicket Keeper' },
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError('');
    setLoading(true);

    try {
      const payload = {
        full_name: fullName,
        phone: phone || undefined,
        email: email || undefined,
        password: password,
      };

      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
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
    <div className="mx-auto max-w-[390px] min-h-screen bg-[#000000] text-[#ffffff] font-sans relative overflow-x-hidden shadow-2xl">

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 bg-[#000000]">
        <button onClick={() => navigate('/login')} className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors">
          <ArrowLeft size={20} />
        </button>
        <span className="text-sm font-bold text-[#ffffff]">Create Account</span>
        <div className="w-5"></div>
      </header>

      <form onSubmit={handleRegister} className="px-6 pb-10">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs px-4 py-3 rounded-xl mb-4 mt-2">
            {error}
          </div>
        )}

        {/* Avatar Upload */}
        <section className="flex flex-col items-center py-6">
          <div className="relative mb-2">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a855f7] flex items-center justify-center shadow-[0_0_25px_rgba(124,58,237,0.25)]">
              <User size={30} className="text-[#ffffff]/60" />
            </div>
            <button
              type="button"
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#a855f7] flex items-center justify-center ring-3 ring-[#000]"
            >
              <Camera size={12} className="text-[#ffffff]" />
            </button>
          </div>
          <span className="text-[10px] text-[#a3a3a3]">Add Photo</span>
        </section>

        {/* Input Fields */}
        <div className="space-y-3 mb-6">
          {/* Full Name */}
          <div className="bg-[#1a1a1a] rounded-xl flex items-center px-4 py-3.5 gap-3 border border-transparent focus-within:border-[#a855f7]/40 transition-colors">
            <User size={16} className="text-[#565555] flex-shrink-0" />
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="flex-1 bg-transparent text-sm text-[#ffffff] placeholder-[#565555] outline-none"
            />
          </div>

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

          {/* Email */}
          <div className="bg-[#1a1a1a] rounded-xl flex items-center px-4 py-3.5 gap-3 border border-transparent focus-within:border-[#a855f7]/40 transition-colors">
            <Mail size={16} className="text-[#565555] flex-shrink-0" />
            <input
              type="email"
              placeholder="Email (Optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          {/* Confirm Password */}
          <div className="bg-[#1a1a1a] rounded-xl flex items-center px-4 py-3.5 gap-3 border border-transparent focus-within:border-[#a855f7]/40 transition-colors">
            <Lock size={16} className="text-[#565555] flex-shrink-0" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="flex-1 bg-transparent text-sm text-[#ffffff] placeholder-[#565555] outline-none"
            />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-[#565555] hover:text-[#a3a3a3] transition-colors flex-shrink-0">
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Playing Role */}
        <section className="mb-6">
          <span className="text-[9px] font-bold text-[#565555] tracking-widest uppercase block mb-3">PLAYING ROLE</span>
          <div className="flex gap-2 flex-wrap">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedRole === role.id
                    ? 'bg-[#a855f7] text-[#ffffff] shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                    : 'bg-transparent text-[#a3a3a3] border border-[#2a2a2a] hover:border-[#565555]'
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </section>

        {/* Batting Style */}
        <section className="mb-6">
          <span className="text-[9px] font-bold text-[#565555] tracking-widest uppercase block mb-3">BATTING STYLE</span>
          <div className="flex gap-2">
            {[
              { id: 'right' as BatHand, label: 'Right Hand' },
              { id: 'left' as BatHand, label: 'Left Hand' },
            ].map((hand) => (
              <button
                key={hand.id}
                type="button"
                onClick={() => setBatHand(hand.id)}
                className={`flex-1 py-2.5 rounded-full text-xs font-bold text-center transition-all ${
                  batHand === hand.id
                    ? 'bg-[#a855f7] text-[#ffffff]'
                    : 'bg-[#1a1a1a] text-[#a3a3a3] border border-[#2a2a2a]'
                }`}
              >
                {hand.label}
              </button>
            ))}
          </div>
        </section>

        {/* Terms */}
        <div className="flex items-start gap-3 mb-8">
          <button
            type="button"
            onClick={() => setAgreedToTerms(!agreedToTerms)}
            className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center mt-0.5 transition-all ${
              agreedToTerms
                ? 'bg-[#a855f7] border-0'
                : 'bg-transparent border-2 border-[#2a2a2a]'
            }`}
          >
            {agreedToTerms && <Check size={12} className="text-[#ffffff]" strokeWidth={3} />}
          </button>
          <p className="text-[11px] text-[#a3a3a3] leading-relaxed">
            I agree to the <span className="text-[#a855f7] font-bold">Terms of Service</span> and <span className="text-[#a855f7] font-bold">Privacy Policy</span>
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !agreedToTerms || !fullName || !phone || !password}
          className={`w-full py-4 rounded-2xl font-bold text-sm transition-all ${
            agreedToTerms && fullName && phone && password && !loading
              ? 'bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-[#ffffff] shadow-[0_4px_25px_rgba(124,58,237,0.4)] hover:shadow-[0_4px_30px_rgba(124,58,237,0.6)] active:scale-[0.98]'
              : 'bg-[#2a2a2a] text-[#565555] cursor-not-allowed'
          }`}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        {/* Footer */}
        <div className="mt-6 text-center">
          <span className="text-xs text-[#a3a3a3]">Already have an account? </span>
          <button type="button" onClick={() => navigate('/login')} className="text-xs font-bold text-[#a855f7] hover:text-[#c799ff] transition-colors">
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
}
