import { Layers } from 'lucide-react';
import type { Batch } from '../lib/types';

interface Props {
  batch: Batch | null;
}

export default function BatchCard({ batch }: Props) {
  if (!batch) return null;

  const badges = [
    batch.class && { label: batch.class, cls: 'bg-blue-500/10 text-blue-300 border-blue-500/20' },
    batch.exam && { label: batch.exam, cls: 'bg-purple-500/10 text-purple-300 border-purple-500/20' },
    batch.language && { label: batch.language, cls: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
    batch.mode && { label: batch.mode, cls: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20' },
    batch.status && { label: batch.status, cls: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
  ].filter(Boolean) as { label: string; cls: string }[];

  const fee = batch.fee;

  return (
    <section className="py-7">
      {batch.previewImage && (
        <div className="mb-5 h-44 w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-white/5">
          <img src={batch.previewImage} alt={batch.name} className="h-full w-full object-cover" />
        </div>
      )}

      <div className="mb-1 flex items-center gap-2 text-zinc-500">
        <Layers className="h-4 w-4 text-emerald-400" />
        <span className="text-xs font-medium uppercase tracking-wider">Batch</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-lg font-semibold text-white">{batch.name || '--'}</h3>
        {batch.isPurchased && (
          <span className="pill border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">Owned</span>
        )}
      </div>

      {batch.byName && <p className="mt-1 text-sm text-zinc-400">{batch.byName}</p>}

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {badges.map((b, i) => (
          <span key={i} className={`pill border ${b.cls}`}>
            {b.label}
          </span>
        ))}
        {batch.batchCode && (
          <span className="pill border border-white/10 bg-white/[0.04] text-zinc-400">{batch.batchCode}</span>
        )}
        {batch.subjectCount != null && (
          <span className="pill border border-white/10 bg-white/[0.04] text-zinc-400">
            {batch.subjectCount} subjects
          </span>
        )}
        {batch.program && (
          <span className="pill border border-white/10 bg-white/[0.04] text-zinc-400">{batch.program}</span>
        )}
      </div>

      {fee && (
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="text-lg font-semibold text-white">
            ₹{Math.round(fee.total).toLocaleString('en-IN')}
          </span>
          {fee.amount && fee.amount !== fee.total && (
            <span className="text-zinc-500 line-through">
              ₹{Math.round(fee.amount).toLocaleString('en-IN')}
            </span>
          )}
          {fee.discount ? (
            <span className="pill border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
              {fee.discount}% off
            </span>
          ) : null}
        </div>
      )}

      {batch.description && (
        <p className="mt-4 line-clamp-4 max-w-2xl text-sm leading-relaxed text-zinc-500">
          {batch.description}
        </p>
      )}

      <div className="mt-4">
        <div className="flex items-center justify-between border-t border-white/[0.06] py-2.5 text-sm">
          <span className="text-zinc-500">Batch ID</span>
          <span className="font-mono text-zinc-300">{batch.batchId || '--'}</span>
        </div>
        {(batch.startDate || batch.endDate) && (
          <div className="flex items-center justify-between border-t border-white/[0.06] py-2.5 text-sm">
            <span className="text-zinc-500">Duration</span>
            <span className="text-zinc-300">
              {batch.startDate || '?'} – {batch.endDate || '?'}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
