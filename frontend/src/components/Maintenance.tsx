import { Settings, RefreshCw } from 'lucide-react';

interface Props {
  onRetry: () => void;
}

export default function Maintenance({ onRetry }: Props) {
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
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-amber/[0.04] blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-orange-500/[0.03] blur-[120px]" />
      </div>

      {/* Floating squares */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute border border-amber/[0.06] rounded-lg"
            style={{
              width: `${80 + i * 50}px`,
              height: `${80 + i * 50}px`,
              top: `${15 + i * 20}%`,
              left: `${10 + i * 22}%`,
              transform: `rotate(${i * 20}deg)`,
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
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="relative z-10 text-center max-w-md">
        {/* Animated icon */}
        <div className="relative mb-8 inline-flex">
          <div className="absolute inset-0 rounded-3xl bg-amber/10 blur-xl" />
          <div className="relative w-24 h-24 rounded-3xl border border-amber/20 bg-bg-card flex items-center justify-center">
            <Settings size={40} className="text-amber" style={{ animation: 'spin-slow 8s linear infinite' }} />
          </div>
        </div>

        {/* Logo */}
        <div className="flex items-center gap-3 justify-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center border border-white/10">
            <span className="text-sm font-black text-white">PW</span>
          </div>
          <span className="text-xl font-black text-text tracking-tight">Physics Wallah</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-black text-text tracking-tight mb-3">
          Under Maintenance
        </h1>

        <p className="text-base text-text-dim mb-8 leading-relaxed">
          We're currently performing scheduled maintenance. The server will be back online shortly. Please check again in a few minutes.
        </p>

        {/* Status cards */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="p-4 rounded-xl border border-border bg-bg-card/50">
            <div className="text-2xl font-black text-amber mb-1">~5min</div>
            <div className="text-xs text-text-muted uppercase tracking-wider">Est. Wait</div>
          </div>
          <div className="p-4 rounded-xl border border-border bg-bg-card/50">
            <div className="text-2xl font-black text-green mb-1">Auto</div>
            <div className="text-xs text-text-muted uppercase tracking-wider">Retrying</div>
          </div>
        </div>

        {/* Retry button */}
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber/10 border border-amber/20 text-amber font-semibold hover:bg-amber/20 transition-all cursor-pointer"
        >
          <RefreshCw size={16} />
          Check Now
        </button>

        <p className="text-xs text-text-muted mt-6">
          Auto-checking every 30 seconds...
        </p>
      </div>
    </div>
  );
}
