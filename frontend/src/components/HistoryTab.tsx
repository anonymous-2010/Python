import { ChevronRight } from 'lucide-react';
import type { ScheduleData } from '../lib/types';

interface Props {
  history: ScheduleData[];
  onSelect: (d: ScheduleData) => void;
}

export default function HistoryTab({ history, onSelect }: Props) {
  return (
    <div className="card-glass rounded-2xl p-5">
      <div className="text-white text-sm font-medium mb-3">
        History
        <span className="badge bg-white/5 text-gray-400 border-white/10 ml-2">{history.length}</span>
      </div>
      {history.length === 0 ? (
        <p className="text-gray-600 text-xs text-center py-8">No history yet</p>
      ) : (
        <div className="space-y-1.5 max-h-[400px] overflow-y-auto scroll-thin">
          {history.map((d, i) => (
            <button
              key={`${d.scheduleId}-${i}`}
              onClick={() => onSelect(d)}
              className="w-full flex items-center gap-4 bg-white/3 hover:bg-white/6 border border-white/5 rounded-xl px-4 py-3 text-left transition-all"
            >
              <span className="text-xl font-bold font-mono text-mint/60 min-w-[40px] text-right">
                #{d._dataNumber || history.length - i}
              </span>
              <div className="w-px h-8 bg-white/5" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{d.topic || '?'}</p>
                <p className="text-gray-500 text-xs truncate">
                  {d.teacherName || ''} {d.batch?.name ? `\u00b7 ${d.batch.name}` : ''} {d._receivedAt ? `\u00b7 ${d._receivedAt}` : ''}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
