import { BookOpen, ExternalLink, Calendar, Clock } from 'lucide-react';
import type { ScheduleData } from '../lib/types';
import { formatDate, formatTime } from '../lib/format';

function statusStyle(status: string | null, isLive: boolean | null) {
  if (isLive) return { label: 'LIVE', cls: 'bg-red-dim text-red border-red/20', dot: 'bg-red shadow-[0_0_8px_rgba(239,68,68,0.5)]' };
  const s = (status || '').toUpperCase();
  switch (s) {
    case 'ACTIVE': return { label: 'ACTIVE', cls: 'bg-green-dim text-green border-green-border', dot: 'bg-green shadow-[0_0_8px_rgba(34,197,94,0.5)]' };
    case 'COMPLETED': return { label: 'DONE', cls: 'bg-bg-card text-text-dim border-border', dot: 'bg-text-muted' };
    case 'PENDING': return { label: 'PENDING', cls: 'bg-amber-dim text-amber border-amber/15', dot: 'bg-amber' };
    default: return { label: s || '—', cls: 'bg-bg-card text-text-dim border-border', dot: 'bg-text-muted' };
  }
}

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

interface Props { data: ScheduleData }

export default function LectureCard({ data }: Props) {
  const lt = data.lectureTeacher;
  const st = statusStyle(data.lectureStatus, data.isLive);

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-7">
        <div className="flex items-center gap-2.5">
          <BookOpen size={16} className="text-green" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted">Current Lecture</span>
        </div>
        <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] ${st.cls}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${st.dot} ${data.isLive ? 'dot-pulse' : ''}`} />
          {st.label}
        </span>
      </div>

      <div className="flex items-start gap-6">
        {lt && (
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-border-light bg-bg-card">
              {lt.image ? (
                <img src={lt.image} alt={lt.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-black text-green">
                  {initials(lt.name)}
                </div>
              )}
            </div>
          </div>
        )}
        <div className="flex-1 min-w-0 pt-0.5">
          <h2 className="text-3xl font-bold text-text leading-snug">{data.topic || '--'}</h2>
          <p className="mt-2 text-base text-text-dim">
            {data.teacherName || 'Unknown teacher'}
            {data.subject?.name && (
              <>
                <span className="mx-2 text-border-light">·</span>
                <span className="text-text-dim">{data.subject.name}</span>
              </>
            )}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-12 gap-y-4 mt-8">
        <div className="group">
          <div className="flex items-center gap-1.5 mb-2">
            <Calendar size={12} className="text-text-muted group-hover:text-green/50 transition-colors" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted group-hover:text-green/50 transition-colors">Date</span>
          </div>
          <div className="text-base font-semibold text-text">{formatDate(data.date)}</div>
        </div>
        <div className="group">
          <div className="flex items-center gap-1.5 mb-2">
            <Clock size={12} className="text-text-muted group-hover:text-green/50 transition-colors" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted group-hover:text-green/50 transition-colors">Time</span>
          </div>
          <div className="text-base font-semibold text-text">
            {formatTime(data.startTime)}
            {data.endTime && (
              <>
                <span className="mx-1.5 text-border-light">–</span>
                {formatTime(data.endTime)}
              </>
            )}
          </div>
        </div>
      </div>

      {data.url && (
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2.5 mt-7 px-5 py-3 rounded-xl text-base font-semibold bg-green-dim text-green border border-green-border hover:bg-green/10 hover:shadow-[0_0_30px_-5px_rgba(34,197,94,0.12)] transition-all duration-300"
        >
          <ExternalLink size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          Open Lecture
        </a>
      )}

      <div className="glow-line mt-12" />
    </section>
  );
}
