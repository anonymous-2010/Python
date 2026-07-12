import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Headphones } from 'lucide-react';

interface Props {
  src: string;
}

export default function AudioPlayer({ src }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    function update() {
      if (audio && !audio.paused && isFinite(audio.currentTime)) {
        setCurrentTime(audio.currentTime);
        rafRef.current = requestAnimationFrame(update);
      }
    }

    const onPlay = () => {
      setPlaying(true);
      rafRef.current = requestAnimationFrame(update);
    };

    const onPause = () => {
      setPlaying(false);
      cancelAnimationFrame(rafRef.current);
      if (isFinite(audio.currentTime)) setCurrentTime(audio.currentTime);
    };

    const onLoadedMetadata = () => {
      if (isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    const onDurationChange = () => {
      if (isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    const onEnded = () => {
      setPlaying(false);
      cancelAnimationFrame(rafRef.current);
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) audio.pause();
    else audio.play();
  }

  function seekTo(e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current;
    const bar = progressRef.current;
    if (!audio || !bar) return;
    const dur = audio.duration;
    if (!isFinite(dur) || dur <= 0) return;
    const rect = bar.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const time = (x / rect.width) * dur;
    audio.currentTime = time;
    setCurrentTime(time);
  }

  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    seekTo(e);
    const onMove = (ev: MouseEvent) => {
      const bar = progressRef.current;
      const audio = audioRef.current;
      if (!bar || !audio) return;
      const dur = audio.duration;
      if (!isFinite(dur) || dur <= 0) return;
      const rect = bar.getBoundingClientRect();
      const x = Math.max(0, Math.min(ev.clientX - rect.left, rect.width));
      const time = (x / rect.width) * dur;
      audio.currentTime = time;
      setCurrentTime(time);
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  function skip(seconds: number) {
    const audio = audioRef.current;
    if (!audio) return;
    const dur = audio.duration;
    if (!isFinite(dur) || dur <= 0) return;
    const newTime = Math.max(0, Math.min(dur, audio.currentTime + seconds));
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  }

  function formatTime(s: number) {
    if (!s || !isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  const progress = duration > 0 && isFinite(duration) ? (currentTime / duration) * 100 : 0;

  return (
    <div className="rounded-2xl border border-green-border bg-gradient-to-br from-green-dim via-bg-card to-bg-card p-5 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-green/[0.08] blur-[60px]" />

      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-4 relative">
        <div className="w-10 h-10 rounded-xl bg-green/15 flex items-center justify-center">
          <Headphones size={20} className="text-green" />
        </div>
        <div>
          <div className="text-sm font-bold text-text">Audio Guide</div>
          <div className="text-[11px] text-text-muted">Listen to installation instructions</div>
        </div>
      </div>

      {/* Progress bar */}
      <div
        ref={progressRef}
        className="w-full h-3 rounded-full bg-white/[0.06] cursor-pointer mb-4 group relative"
        onMouseDown={handleMouseDown}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-green to-green-bright relative"
          style={{ width: `${progress}%`, transition: 'none' }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-green shadow-lg shadow-green/30 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 relative">
        <button
          onClick={() => skip(-10)}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-text-muted hover:text-text transition-colors hover:bg-white/[0.04]"
        >
          <SkipBack size={16} />
        </button>

        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-green flex items-center justify-center text-[#021a0e] hover:bg-green-bright transition-all shadow-lg shadow-green/25"
        >
          {playing ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
        </button>

        <button
          onClick={() => skip(10)}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-text-muted hover:text-text transition-colors hover:bg-white/[0.04]"
        >
          <SkipForward size={16} />
        </button>

        <div className="flex-1 flex items-center justify-center gap-1.5">
          <span className="text-xs text-text-dim font-mono tabular-nums">{formatTime(currentTime)}</span>
          <span className="text-xs text-text-muted">/</span>
          <span className="text-xs text-text-muted font-mono tabular-nums">{formatTime(duration)}</span>
        </div>

        <button
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.muted = !muted;
              setMuted(!muted);
            }
          }}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-text-muted hover:text-text transition-colors hover:bg-white/[0.04]"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>
    </div>
  );
}
