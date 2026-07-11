import { BookOpen, ExternalLink, Calendar, Clock } from 'lucide-react';
import type { ScheduleData } from '../lib/types';

function fmtDate(d: string | null) {
  if (!d) return '--';
  try {
    return new Date(d).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return d;
  }
}

function fmtTime(t: string | null) {
  if (!t) return '';
  try {
    return new Date(t).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch {
    return t;
  }
}

function statusStyle(status: string | null, isLive: boolean | null) {
  if (isLive) return { label: 'LIVE', cls: 'bg-rose-500/15 text-rose-300 border-rose-500/30' };
  const s = (status || '').toUpperCase();
  switch (s) {
    case 'ACTIVE':
      return { label: 'ACTIVE', cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
    case 'COMPLETED':
      return { label: 'COMPLETED', cls: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/30' };
    case 'PENDING':
      return { label: 'PENDING', cls: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
    case 'RECORDED':
      return { label: 'RECORDED', cls: 'bg-blue-500/15 text-blue-300 border-blue-500/30' };
    default:
      return { label: s || 'UNKNOWN', cls: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/30' };
  }
}

interface Props {
  data: ScheduleData;
}

export default function LectureCard({ data }: Props) {
  const lt = data.lectureTeacher;
  const st = statusStyle(data.lectureStatus, data.isLive);

  return (
    <section className="card overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-emerald-400/70 via-teal-400/40 to-transparent" />
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <BookOpen className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-medium">Current Lecture</span>
          </div>
          <span className={`pill border ${st.cls}`}>
            {data.isLive && <span className="h-1.5 w-1.5 rounded-full bg-rose-400 dot-pulse" />}
            {st.label}
          </span>
        </div>

        <div className="mt-5 flex items-start gap-4">
          {lt && (
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              {lt.image ? (
                <img src={lt.image} alt={lt.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg font-bold text-emerald-300">
                  {lt.name
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
              )}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold leading-snug text-white">{data.topic || '--'}</h2>
            <p className="mt-1 text-sm text-zinc-400">
              {data.teacherName || 'Unknown teacher'}
              {data.subject?.name ? ` · ${data.subject.name}` : ''}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
            <div className="field-label flex items-center gap-1.5">
              <Calendar className="h-3 w-3" /> Date
            </div>
            <div className="field-value mt-1">{fmtDate(data.date)}</div>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
            <div className="field-label flex items-center gap-1.5">
              <Clock className="h-3 w-3" /> Time
            </div>
            <div className="field-value mt-1">
              {fmtTime(data.startTime)}
              {data.endTime ? ` – ${fmtTime(data.endTime)}` : ''}
            </div>
          </div>
        </div>

        {data.url && (
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open Lecture
          </a>
        )}
      </div>
    </section>
  );
}
