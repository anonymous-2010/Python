import { Monitor, Laptop, Smartphone, Tablet, Shield, CheckCircle, XCircle, ArrowRight, Wifi } from 'lucide-react';

interface Props {
  platform: string;
}

export default function PlatformBlock({ platform }: Props) {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(239,68,68,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.015) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-red/[0.03] blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-amber/[0.02] blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo */}
        <div className="flex items-center gap-3 justify-center mb-10">
          <div className="w-11 h-11 rounded-xl bg-black flex items-center justify-center border border-white/10">
            <span className="text-sm font-black text-white">PW</span>
          </div>
          <span className="text-xl font-black text-text tracking-tight">Physics Wallah <span className="bg-gradient-to-r from-green via-emerald-400 to-teal-300 bg-clip-text text-transparent">SYNC</span></span>
        </div>

        {/* Alert icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-dim border border-red/20 mb-5">
            <Smartphone size={36} className="text-red" />
          </div>
          <h1 className="text-3xl font-black text-text tracking-tight mb-2">Desktop Browser Required</h1>
          <p className="text-base text-text-dim max-w-md mx-auto">
            PW Sync needs a browser extension that isn't available on mobile devices. You're currently on <span className="text-red font-semibold">{platform}</span>.
          </p>
        </div>

        {/* How it works */}
        <div className="p-6 rounded-2xl border border-border bg-bg-card/50 mb-6">
          <div className="text-sm font-bold text-text mb-5 flex items-center gap-2">
            <Wifi size={15} className="text-green" />
            How PW Sync Works
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-green">1</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-text">Install the Chrome Extension</div>
                <div className="text-xs text-text-muted mt-1">Download and install the PW Sync extension on your desktop browser</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-green">2</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-text">Open PW.live on Desktop</div>
                <div className="text-xs text-text-muted mt-1">Login to PW.live and open a live class on your computer</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-green">3</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-text">Sync Happens Automatically</div>
                <div className="text-xs text-text-muted mt-1">The extension captures your lecture data and syncs it to the dashboard</div>
              </div>
            </div>
          </div>
        </div>

        {/* Platform support */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Supported */}
          <div className="p-5 rounded-2xl border border-green-border bg-green-dim/30">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={16} className="text-green" />
              <span className="text-sm font-bold text-green">Supported</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Monitor size={16} className="text-green" />
                <div>
                  <div className="text-sm font-semibold text-text">Windows</div>
                  <div className="text-[11px] text-text-muted">Any Chromium browser</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Laptop size={16} className="text-green" />
                <div>
                  <div className="text-sm font-semibold text-text">macOS</div>
                  <div className="text-[11px] text-text-muted">Chrome, Edge, or Brave</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Monitor size={16} className="text-green" />
                <div>
                  <div className="text-sm font-semibold text-text">Linux</div>
                  <div className="text-[11px] text-text-muted">Chrome, Edge, or Brave</div>
                </div>
              </div>
            </div>
          </div>

          {/* Not supported */}
          <div className="p-5 rounded-2xl border border-red/15 bg-red-dim/30">
            <div className="flex items-center gap-2 mb-4">
              <XCircle size={16} className="text-red" />
              <span className="text-sm font-bold text-red">Not Supported</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Smartphone size={16} className="text-red" />
                <div>
                  <div className="text-sm font-semibold text-text">Android</div>
                  <div className="text-[11px] text-text-muted">No extension support</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Tablet size={16} className="text-red" />
                <div>
                  <div className="text-sm font-semibold text-text">iOS / iPad</div>
                  <div className="text-[11px] text-text-muted">No extension support</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Smartphone size={16} className="text-red" />
                <div>
                  <div className="text-sm font-semibold text-text">Other Mobile</div>
                  <div className="text-[11px] text-text-muted">Extensions not available</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="p-5 rounded-2xl border border-green-border bg-green-dim/30 text-center">
          <div className="flex items-center gap-2 justify-center mb-3">
            <Shield size={16} className="text-green" />
            <span className="text-sm font-bold text-green">What Should You Do?</span>
          </div>
          <p className="text-sm text-text-dim leading-relaxed mb-4">
            Open this link on a <span className="text-green font-semibold">Windows, Mac, or Linux</span> computer using <span className="text-green font-semibold">Chrome, Edge, or Brave</span> browser. Then install the extension to start using PW Sync.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-text-muted">
            <span>Detected: {platform}</span>
            <span>·</span>
            <span>Switch to a desktop browser to continue</span>
          </div>
        </div>
      </div>
    </div>
  );
}
