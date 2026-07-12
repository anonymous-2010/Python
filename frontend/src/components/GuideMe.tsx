import { useState, useEffect } from 'react';
import { Chrome, Download, FolderOpen, Settings, Puzzle, BookOpen, Globe } from 'lucide-react';
import { t, type Lang } from '../lib/translations';
import AudioPlayer from './AudioPlayer';

interface Props {}

export default function GuideMe(props: Props) {
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
    { num: '01', icon: <Download size={22} />, title: tr.step1_title, desc: tr.step1_desc, action: 'download' },
    { num: '02', icon: <FolderOpen size={22} />, title: tr.step2_title, desc: tr.step2_desc },
    { num: '03', icon: <Settings size={22} />, title: tr.step3_title, desc: tr.step3_desc },
    { num: '04', icon: <Settings size={22} />, title: tr.step4_title, desc: tr.step4_desc },
    { num: '05', icon: <Puzzle size={22} />, title: tr.step5_title, desc: tr.step5_desc },
    { num: '06', icon: <BookOpen size={22} />, title: tr.step6_title, desc: tr.step6_desc },
  ];

  return (
    <section className="py-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-black text-text tracking-tight">Guide Me</h2>
            <p className="text-sm text-text-dim mt-1">Step-by-step instructions to install and use the extension</p>
          </div>

          {/* Language switcher with badge */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Language</span>
            <div className="flex items-center gap-1 p-1 rounded-lg border border-border bg-bg-card/50">
              {(['en', 'hi', 'hinglish'] as Lang[]).map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`relative px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    lang === l
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-text-dim hover:text-text hover:bg-white/[0.03]'
                  }`}
                >
                  {l === 'en' ? 'English' : l === 'hi' ? 'हिंदी' : 'Hinglish'}
                  {lang === l && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary border border-primary-foreground/20" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Audio Player */}
      {audioUrl && (
        <div className="mb-10">
          <AudioPlayer src="/api/audio-guide" />
        </div>
      )}

      {/* Browser compatibility */}
      <div className="mb-10 p-5 rounded-xl border border-border bg-card/50">
        <div className="flex items-center gap-2 mb-3">
          <Globe size={18} className="text-primary" />
          <span className="text-base font-bold text-foreground">{tr.browser_title}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-1">{tr.browser_desc}</p>
        <p className="text-sm text-red-400 font-semibold">{tr.browser_note}</p>
      </div>

      {/* Steps - Full width, no cards */}
      <div className="space-y-0">
        {steps.map((step, i) => (
          <div key={i}>
            <div className="flex gap-6 py-6">
              {/* Step number */}
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  {step.icon}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">Step {step.num}</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{step.desc}</p>

                {step.action === 'download' && (
                  <a href="/api/download-extension" download
                    className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-semibold hover:bg-primary/20 transition-all">
                    <Download size={14} /> {tr.download}
                  </a>
                )}
              </div>
            </div>
            {i < steps.length - 1 && <div className="h-px bg-border ml-20" />}
          </div>
        ))}
      </div>

      {/* Tip */}
      <div className="mt-10 p-4 rounded-xl border border-border bg-card/30">
        <p className="text-sm text-muted-foreground">{tr.tip}</p>
      </div>
    </section>
  );
}
