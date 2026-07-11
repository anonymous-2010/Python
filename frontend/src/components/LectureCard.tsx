import { BookOpen, ExternalLink, User, Clock } from 'lucide-react';
import type { ScheduleData } from '../lib/types';

function fmtDate(d: string | null) {
  if (!d) return '--';
  try {
    return new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return d; }
}

function fmtTime(t: string | null) {
  if (!t) return '';
  try {
    const d = new Date(t);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch { return t; }
}

function statusBadge(status: string | null, isLive: boolean | null) {
  if (isLive) return { label: 'LIVE', cls: 'bg-red-500/15 text-red-400 border-red-500/30' };
  const s = (status || '').toUpperCase();
  switch (s) {
    case 'ACTIVE': return { label: 'ACTIVE', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
    case 'COMPLETED': return { label: 'COMPLETED', cls: 'bg-gray-500/15 text-gray-400 border-gray-500/30' };
    case 'PENDING': return { label: 'PENDING', cls: 'bg-amber-500/15 text-amber-400 border-amber-500/30' };
    case 'RECORDED': return { label: 'RECORDED', cls: 'bg-blue-500/15 text-blue-400 border-blue-500/30' };
    default: return { label: s || 'UNKNOWN', cls: 'bg-gray-500/15 text-gray-400 border-gray-500/30' };
  }
}

interface Props {
  data: ScheduleData;
}

export default function LectureCard({ data }: Props) {
  const lt = data.lectureTeacher;
  const st = statusBadge(data.lectureStatus, data.isLive);

  return (
    <div className="card-glass rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-mint" />
          <span className="text-white font-medium text-sm">Lecture</span>
        </div>
        <span className={`badge ${st.cls}`}>{st.label}</span>
      </div>

      <div className="flex items-start gap-4">
        {lt && (
          <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
            {lt.image ? (
              <img src={lt.image} alt={lt.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-mint font-bold text-lg">
                {lt.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-semibold text-base leading-snug">{data.topic || '--'}</h2>
          <div className="flex items-center gap-1.5 mt-1 text-gray-400 text-xs">
            <User className="w-3 h-3" />
            <span>{data.teacherName || '--'}</span>
          </div>
          <p className="text-gray-500 text-xs mt-0.5">{data.subject?.name || '--'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-white/3 rounded-lg px-3 py-2">
          <span className="text-gray-500 block">Date</span>
          <span className="text-gray-200">{fmtDate(data.date)}</span>
        </div>
        <div className="bg-white/3 rounded-lg px-3 py-2">
          <span className="text-gray-500 block">Time</span>
          <span className="text-gray-200">
            {fmtTime(data.startTime)}{data.endTime ? ` - ${fmtTime(data.endTime)}` : ''}
          </span>
        </div>
      </div>

      {data.url && (
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 text-xs font-medium transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          Open Lecture
        </a>
      )}
    </div>
  );
}
