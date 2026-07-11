import { Layers } from 'lucide-react';
import type { Batch } from '../lib/types';

interface Props {
  batch: Batch | null;
}

export default function BatchCard({ batch }: Props) {
  if (!batch) return null;

  const badges = [
    batch.class && { label: batch.class, cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    batch.exam && { label: batch.exam, cls: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    batch.language && { label: batch.language, cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    batch.mode && { label: batch.mode, cls: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
    batch.status && { label: batch.status, cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  ].filter(Boolean) as { label: string; cls: string }[];

  return (
    <div className="card-glass rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-2 text-white text-sm font-medium">
        <Layers className="w-4 h-4 text-mint" />
        Batch Info
      </div>
      <h3 className="text-white font-semibold">{batch.name || '--'}</h3>
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {badges.map((b, i) => (
            <span key={i} className={`badge ${b.cls}`}>{b.label}</span>
          ))}
        </div>
      )}
      <div className="text-xs text-gray-500 space-y-0.5">
        <div>Batch ID: <span className="text-gray-400 font-mono">{batch.batchId || '--'}</span></div>
        {(batch.startDate || batch.endDate) && (
          <div>
            Duration: <span className="text-gray-400">{batch.startDate || '?'} &mdash; {batch.endDate || '?'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
