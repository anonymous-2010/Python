import { LayoutDashboard, Users, Fingerprint } from 'lucide-react';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

export type TabKey = 'overview' | 'faculty' | 'identifiers';

interface Props {
  active: TabKey;
  onChange: (t: TabKey) => void;
  connected: 'connecting' | 'live' | 'disconnected';
}

const nav: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'overview', label: 'Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
  { key: 'faculty', label: 'Faculty', icon: <Users className="h-4 w-4" /> },
  { key: 'identifiers', label: 'Identifiers', icon: <Fingerprint className="h-4 w-4" /> },
];

const statusMap = {
  live: { label: 'Live', dot: 'bg-emerald-400 text-emerald-400', text: 'text-emerald-300', bg: 'bg-emerald-500/10' },
  connecting: { label: 'Connecting', dot: 'bg-amber-400 text-amber-400', text: 'text-amber-300', bg: 'bg-amber-500/10' },
  disconnected: { label: 'Offline', dot: 'bg-rose-500 text-rose-500', text: 'text-rose-300', bg: 'bg-rose-500/10' },
} as const;

export default function Sidebar({ active, onChange, connected }: Props) {
  const s = statusMap[connected];
  return (
    <aside className="sticky top-0 z-40 flex flex-row items-center gap-1 overflow-x-auto border-b border-white/[0.08] bg-[#0c0c0e] p-3 md:h-screen md:w-60 md:flex-col md:items-stretch md:gap-1.5 md:border-b-0 md:border-r md:p-5">
      <div className="flex items-center gap-2.5 px-1 pb-1 md:mb-4 md:pb-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/20">
          <span className="text-sm font-extrabold text-[#06281f]">PW</span>
        </div>
        <div className="leading-tight">
          <div className="text-[15px] font-semibold tracking-tight text-white">PW Sync</div>
          <div className="text-[11px] text-zinc-500">Lecture monitor</div>
        </div>
      </div>

      <nav className="flex flex-1 flex-row gap-1 md:flex-col">
        {nav.map((n) => {
          const isActive = active === n.key;
          return (
            <button
              key={n.key}
              onClick={() => onChange(n.key)}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-300'
                  : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
              }`}
            >
              {n.icon}
              {n.label}
            </button>
          );
        })}
      </nav>

      <div className={`mt-auto hidden items-center gap-2 rounded-lg border border-white/[0.06] px-3 py-2 md:flex ${s.bg || ''}`}>
        {connected === 'live' ? (
          <span className={`h-1.5 w-1.5 rounded-full dot-pulse ${s.dot}`} />
        ) : connected === 'connecting' ? (
          <Loader2 className="h-3 w-3 animate-spin text-amber-400" />
        ) : (
          <WifiOff className="h-3 w-3 text-rose-400" />
        )}
        <span className={`text-xs font-medium ${s.text}`}>{s.label}</span>
      </div>
    </aside>
  );
}
