import { RotateCcw, Wifi, WifiOff, Loader2 } from 'lucide-react';

interface Props {
  counter: number;
  connected: 'connecting' | 'live' | 'disconnected';
  onReset: () => void;
}

export default function Header({ counter, connected, onReset }: Props) {
  return (
    <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">PW</span>
          </div>
          <div>
            <h1 className="text-white font-semibold text-sm leading-tight">PW Schedule Sync</h1>
            <p className="text-gray-500 text-xs">Real-time lecture monitor</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {connected === 'live' && <div className="status-dot bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />}
            {connected === 'connecting' && <Loader2 className="w-2.5 h-2.5 text-amber-400 animate-spin" />}
            {connected === 'disconnected' && <div className="status-dot bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />}
            <span className={`text-xs ${
              connected === 'live' ? 'text-emerald-400/80' :
              connected === 'connecting' ? 'text-amber-400/80' :
              'text-red-400/80'
            }`}>
              {connected === 'live' ? 'Live' : connected === 'connecting' ? 'Connecting...' : 'Disconnected'}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5">
            <span className="text-gray-400 text-xs">Count</span>
            <span className="text-mint font-bold text-lg font-mono leading-none">{counter}</span>
          </div>

          <button
            onClick={onReset}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            title="Reset counter"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
