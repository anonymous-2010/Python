import { LayoutDashboard, Users, Fingerprint, WifiOff, Loader2, GraduationCap, Layers, ShieldCheck, ShieldAlert, LogOut, BookOpen, BarChart3, MessageSquare } from 'lucide-react';

export type TabKey = 'overview' | 'faculty' | 'batch' | 'student' | 'identifiers' | 'guide' | 'polls' | 'contact';

interface Props {
  active: TabKey;
  onChange: (t: TabKey) => void;
  connected: 'connecting' | 'live' | 'disconnected';
  token: string | null;
  onLogout: () => void;
  username: string | null;
  unreadCount?: number;
}

const nav: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
  { key: 'faculty', label: 'Faculty', icon: <Users size={18} /> },
  { key: 'batch', label: 'Batch Info', icon: <Layers size={18} /> },
  { key: 'student', label: 'Student', icon: <GraduationCap size={18} /> },
  { key: 'polls', label: 'Polls', icon: <BarChart3 size={18} /> },
  { key: 'identifiers', label: 'IDs', icon: <Fingerprint size={18} /> },
  { key: 'guide', label: 'Guide Me', icon: <BookOpen size={18} /> },
  { key: 'contact', label: 'Contact Us', icon: <MessageSquare size={18} /> },
];

export default function Sidebar({ active, onChange, connected, token, onLogout, username, unreadCount }: Props) {
  const isAuthorized = !!token;
  return (
    <aside className="fixed top-0 left-0 z-50 hidden md:flex flex-col w-64 h-screen bg-bg-raised border-r border-border">
      {/* Logo */}
      <div className="px-5 pt-7 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-black flex items-center justify-center border border-white/10">
            <span className="text-base font-black text-white">PW</span>
          </div>
          <div>
            <div className="text-lg font-bold text-text tracking-tight">Physics Wallah <span className="bg-gradient-to-r from-green via-emerald-400 to-teal-300 bg-clip-text text-transparent">SYNC</span></div>
            <div className="text-xs font-semibold uppercase tracking-[0.15em] text-text-muted">Dashboard</div>
          </div>
        </div>
      </div>

      <div className="mx-5 glow-line" />

      {/* Nav */}
      <nav className="flex-1 px-3 pt-5 flex flex-col gap-1">
        {nav.map((n) => {
          const isActive = active === n.key;
          const showBadge = n.key === 'contact' && typeof unreadCount === 'number' && unreadCount > 0;
          return (
            <button
              key={n.key}
              onClick={() => onChange(n.key)}
              className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-green-dim text-green border border-green-border shadow-[0_0_20px_-4px_rgba(34,197,94,0.1)]'
                  : 'text-text-dim hover:bg-bg-hover hover:text-text border border-transparent'
              }`}
            >
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-full bg-green shadow-[0_0_8px_rgba(34,197,94,0.4)]" />}
              {n.icon}
              {n.label}
              {showBadge && (
                <span className="ml-auto px-2 py-0.5 rounded-full bg-red text-white text-[10px] font-bold min-w-[18px] text-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Status */}
      <div className="px-5 pb-5">
        <div className="glow-line mb-4" />

        {/* User info */}
        {username && (
          <div className="flex items-center gap-2.5 mb-3 px-3 py-2 rounded-lg border border-border bg-bg-card">
            <div className="w-7 h-7 rounded-full bg-green/15 flex items-center justify-center text-xs font-bold text-green">
              {username.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-text truncate">{username}</span>
          </div>
        )}

        {/* Auth badge */}
        <div className={`flex items-center gap-2.5 mb-3 px-3 py-2 rounded-lg border ${
          isAuthorized
            ? 'border-green-border bg-green-dim'
            : 'border-red/20 bg-red-dim'
        }`}>
          {isAuthorized ? (
            <ShieldCheck size={14} className="text-green" />
          ) : (
            <ShieldAlert size={14} className="text-red" />
          )}
          <span className={`text-xs font-bold uppercase tracking-[0.15em] ${
            isAuthorized ? 'text-green' : 'text-red'
          }`}>
            {isAuthorized ? 'Authorized' : 'Unauthorized'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          {connected === 'live' && (
            <div className="flex items-center gap-2.5">
              <span className="relative">
                <span className="absolute inset-0 w-2 h-2 rounded-full bg-green/40 dot-pulse" />
                <span className="relative block w-2 h-2 rounded-full bg-green shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-green">Live</span>
            </div>
          )}
          {connected === 'connecting' && (
            <div className="flex items-center gap-2.5">
              <Loader2 size={14} className="text-amber animate-spin" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber">Connecting</span>
            </div>
          )}
          {connected === 'disconnected' && (
            <div className="flex items-center gap-2.5">
              <WifiOff size={14} className="text-red" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-red">Offline</span>
            </div>
          )}
          <span className="text-xs text-text-muted font-mono">v2.0</span>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border text-xs font-medium text-text-dim hover:border-red/20 hover:text-red hover:bg-red-dim transition-all cursor-pointer"
        >
          <LogOut size={13} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
