import { useState, useEffect } from 'react';
import { Chrome, Shield, RefreshCw, LogOut, Download, FolderOpen, MousePointer, Settings, Puzzle, BookOpen, Globe } from 'lucide-react';
import { t, type Lang } from '../lib/translations';
import AudioPlayer from './AudioPlayer';

interface Props {
  onRetry: () => void;
  onLogout: () => void;
}

export default function InstallExtension({ onRetry, onLogout }: Props) {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('pw_lang') as Lang) || 'en');
  const [audioUrl, setAudioUrl] = useState('');

  useEffect(() => {
    localStorage.setItem('pw_lang', lang);
    fetch('/api/audio-guide-url')
      .then(r => r.json())
      .then(d => setAudioUrl(d.url || ''))
      .catch(() => {});
  }, [lang]);

  const tr = t[lang];

  const steps = [
    { icon: <Download size={18} />, title: tr.step1_title, desc: tr.step1_desc, action: 'download' },
    { icon: <FolderOpen size={18} />, title: tr.step2_title, desc: tr.step2_desc, action: null },
    { icon: <Settings size={18} />, title: tr.step3_title, desc: tr.step3_desc, action: null },
    { icon: <MousePointer size={18} />, title: tr.step4_title, desc: tr.step4_desc, action: null },
    { icon: <Puzzle size={18} />, title: tr.step5_title, desc: tr.step5_desc, action: null },
    { icon: <BookOpen size={18} />, title: tr.step6_title, desc: tr.step6_desc, action: null },
  ];

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Grid background */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(34,197,94,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-amber/[0.04] blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-orange-500/[0.03] blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Language switcher */}
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Language</span>
            <div className="flex items-center gap-1 p-1 rounded-lg border border-border bg-bg-card/50">
              {(['en', 'hi', 'hinglish'] as Lang[]).map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`relative px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    lang === l
                      ? 'bg-green/10 text-green border border-green/20 shadow-sm'
                      : 'text-text-muted hover:text-text-dim hover:bg-white/[0.03]'
                  }`}
                >
                  {l === 'en' ? 'English' : l === 'hi' ? 'हिंदी' : 'Hinglish'}
                  {lang === l && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green border border-green/20" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative mb-6 inline-flex">
            <div className="absolute inset-0 rounded-3xl bg-amber/10 blur-xl" />
            <div className="relative w-20 h-20 rounded-3xl border border-amber/20 bg-bg-card flex items-center justify-center">
              <Chrome size={36} className="text-amber" />
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center mb-4">
            <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center border border-white/10">
              <span className="text-xs font-black text-white">PW</span>
            </div>
            <span className="text-lg font-black text-text tracking-tight">Physics Wallah</span>
          </div>

          <h1 className="text-3xl font-black text-text tracking-tight mb-2">{tr.title}</h1>
          <p className="text-base text-text-dim leading-relaxed max-w-lg mx-auto">{tr.subtitle}</p>
        </div>

        {/* Audio Guide - Top */}
        {audioUrl && (
          <div className="mb-6">
            <AudioPlayer src="/api/audio-guide" />
          </div>
        )}

        {/* Browser compatibility */}
        <div className="mb-6 p-4 rounded-xl border border-blue-border bg-blue-dim">
          <div className="flex items-center gap-2 mb-2">
            <Globe size={16} className="text-blue" />
            <span className="text-sm font-bold text-text">{tr.browser_title}</span>
          </div>
          <p className="text-sm text-text-dim mb-1">{tr.browser_desc}</p>
          <p className="text-xs text-red font-semibold">{tr.browser_note}</p>
        </div>

        {/* Steps */}
        <div className="space-y-3 mb-6">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-xl border border-border bg-bg-card/50">
              <div className="w-10 h-10 rounded-xl bg-green/10 flex items-center justify-center text-green flex-shrink-0">
                {step.icon}
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-text mb-1">{step.title}</div>
                <div className="text-sm text-text-dim leading-relaxed">{step.desc}</div>
                {step.action === 'download' && (
                  <a href="/api/download-extension" download
                    className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg bg-green/10 border border-green/20 text-green text-xs font-semibold hover:bg-green/20 transition-all">
                    <Download size={12} /> {tr.download}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tip */}
        <div className="mb-6 p-3 rounded-xl border border-border bg-bg-card/30 text-center">
          <p className="text-xs text-text-muted">{tr.tip}</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button onClick={onRetry}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green/10 border border-green/20 text-green font-semibold hover:bg-green/20 transition-all cursor-pointer">
            <RefreshCw size={16} /> {tr.check}
          </button>
          <button onClick={onLogout}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border bg-bg-card/50 text-text-dim font-semibold hover:border-red/20 hover:text-red transition-all cursor-pointer">
            <LogOut size={16} />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mt-6">
          <Shield size={12} className="text-text-muted" />
          <span className="text-[11px] text-text-muted">Powered by Physics Wallah</span>
        </div>
      </div>
    </div>
  );
}
