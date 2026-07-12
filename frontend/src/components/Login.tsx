import { useState, useEffect } from 'react';
import { User, Lock, ArrowRight, Loader2, Shield, Eye, EyeOff, UserPlus, Settings, BarChart3, Users } from 'lucide-react';
import AudioPlayer from './AudioPlayer';

interface Props {
  onLogin: (userId: string, username: string) => void;
}

const API_BASE = '';

export default function Login({ onLogin }: Props) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [introAudioUrl, setIntroAudioUrl] = useState('');

  useEffect(() => {
    fetch('/api/intro-audio-url')
      .then(r => r.json())
      .then(d => setIntroAudioUrl(d.url || ''))
      .catch(() => {});
  }, []);

  async function handleSubmit() {
    if (!username || !password) {
      setError('Enter username and password');
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        if (mode === 'signup') {
          setSuccess('Account created! You can now login.');
          setMode('login');
        } else {
          localStorage.setItem('pw_user_id', data.userId);
          localStorage.setItem('pw_username', data.username);
          onLogin(data.userId, data.username);
        }
      } else {
        setError(data.message || 'Failed');
      }
    } catch {
      setError('Server unreachable');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Grid background */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(rgba(34,197,94,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(34,197,94,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      {/* Gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-green/[0.04] blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/[0.03] blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-teal-500/[0.02] blur-[180px]" />
      </div>

      {/* Floating grid squares */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute border border-green/[0.06] rounded-lg"
            style={{
              width: `${80 + i * 40}px`,
              height: `${80 + i * 40}px`,
              top: `${10 + i * 15}%`,
              left: `${5 + i * 18}%`,
              transform: `rotate(${i * 15}deg)`,
              animation: `float ${6 + i * 2}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(var(--r, 0deg)); opacity: 0.3; }
          100% { transform: translateY(-20px) rotate(var(--r, 0deg)); opacity: 0.6; }
        }
      `}</style>

      <div className="relative z-10 w-full max-w-5xl flex flex-col lg:flex-row items-center gap-12">
        {/* Left side - Features */}
        <div className="flex-1 text-center lg:text-left">
          {/* Logo */}
          <div className="flex items-center gap-3 justify-center lg:justify-start mb-6">
            <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center border border-white/10">
              <span className="text-lg font-black text-white">PW</span>
            </div>
            <span className="text-2xl font-black text-text tracking-tight">Physics Wallah </span>
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-green via-emerald-400 to-teal-300 bg-clip-text text-transparent">SYNC</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-text tracking-tight leading-tight mb-4">
            India's Most Trusted
            <br />
            <span className="bg-gradient-to-r from-green to-emerald-400 bg-clip-text text-transparent">Education Platform</span>
          </h1>

          <p className="text-base text-text-dim mb-8 max-w-md mx-auto lg:mx-0">
            Manage your account, track lectures, and ace polls with our intelligent auto-answer system.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
            <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-bg-card/50">
              <div className="w-10 h-10 rounded-lg bg-green/10 flex items-center justify-center flex-shrink-0">
                <Settings size={18} className="text-green" />
              </div>
              <div>
                <div className="text-sm font-semibold text-text">Account</div>
                <div className="text-[11px] text-text-muted">Manage status</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-bg-card/50">
              <div className="w-10 h-10 rounded-lg bg-green/10 flex items-center justify-center flex-shrink-0">
                <BarChart3 size={18} className="text-green" />
              </div>
              <div>
                <div className="text-sm font-semibold text-text">Polls</div>
                <div className="text-[11px] text-text-muted">Auto-answer</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-bg-card/50">
              <div className="w-10 h-10 rounded-lg bg-green/10 flex items-center justify-center flex-shrink-0">
                <Users size={18} className="text-green" />
              </div>
              <div>
                <div className="text-sm font-semibold text-text">Lectures</div>
                <div className="text-[11px] text-text-muted">Live tracking</div>
              </div>
            </div>
          </div>

          {/* Audio Introduction */}
          {introAudioUrl && (
            <div className="mt-6 max-w-lg mx-auto lg:mx-0">
              <AudioPlayer src="/api/intro-audio" />
            </div>
          )}
        </div>

        {/* Right side - Login card */}
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-bg-card/80 backdrop-blur-sm p-8 shadow-2xl shadow-black/20">
            <div className="flex items-center gap-2.5 mb-6">
              {mode === 'login' ? <User size={18} className="text-green" /> : <UserPlus size={18} className="text-green" />}
              <span className="text-sm font-semibold text-text">{mode === 'login' ? 'Sign In' : 'Sign Up'}</span>
            </div>

            <div className="mb-4">
              <label className="text-xs font-bold uppercase tracking-[0.15em] text-text-muted mb-2 block">Username</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(''); }}
                  placeholder="Enter username"
                  className="w-full bg-bg-raised border border-border rounded-xl px-4 pl-11 py-3.5 text-base font-medium text-text placeholder:text-text-muted focus:outline-none focus:border-green-border focus:ring-1 focus:ring-green/20 transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="text-xs font-bold uppercase tracking-[0.15em] text-text-muted mb-2 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter password"
                  className="w-full bg-bg-raised border border-border rounded-xl px-4 pl-11 pr-11 py-3.5 text-base font-medium text-text placeholder:text-text-muted focus:outline-none focus:border-green-border focus:ring-1 focus:ring-green/20 transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-dim transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-dim border border-red/20">
                <p className="text-sm text-red">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 rounded-lg bg-green-dim border border-green-border">
                <p className="text-sm text-green">{success}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !username || !password}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-base font-semibold bg-green text-[#021a0e] hover:bg-green-bright disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer mb-3"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <><ArrowRight size={18} /> {mode === 'login' ? 'Sign In' : 'Create Account'}</>}
            </button>

            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccess(''); }}
              className="w-full text-sm text-text-dim hover:text-text transition-colors cursor-pointer"
            >
              {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-6">
            <Shield size={12} className="text-text-muted" />
            <span className="text-[11px] text-text-muted">Powered by Physics Wallah</span>
          </div>
        </div>
      </div>
    </div>
  );
}
