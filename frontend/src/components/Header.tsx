import { Wifi, WifiOff, Loader2 } from 'lucide-react';

interface Props {
  connected: 'connecting' | 'live' | 'disconnected';
}

const statusMap = {
  live: {
    label: 'Live',
    dot: 'bg-emerald-400 text-emerald-400',
    text: 'text-emerald-300',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  connecting: {
    label: 'Connecting',
    dot: 'bg-amber-400 text-amber-400',
    text: 'text-amber-300',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
  disconnected: {
    label: 'Offline',
    dot: 'bg-rose-500 text-rose-500',
    text: 'text-rose-300',
    bg: 'bg-rose-500/10 border-rose-500/20',
  },
} as const;

export default function Header({ connected }: Props) {
  const s = statusMap[connected];
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#070708]/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/20">
            <span className="text-sm font-extrabold text-[#06281f]">PW</span>
          </div>
          <div className="leading-tight">
            <h1 className="text-[15px] font-semibold tracking-tight text-white">PW Sync</h1>
            <p className="text-[11px] text-zinc-500">Live lecture monitor</p>
          </div>
        </div>

        <div className={`pill border ${s.bg}`}>
          {connected === 'live' ? (
            <span className={`h-1.5 w-1.5 rounded-full dot-pulse ${s.dot}`} />
          ) : connected === 'connecting' ? (
            <Loader2 className="h-3 w-3 animate-spin text-amber-400" />
          ) : (
            <WifiOff className="h-3 w-3 text-rose-400" />
          )}
          <span className={`text-xs font-medium ${s.text}`}>{s.label}</span>
        </div>
      </div>
    </header>
  );
}
