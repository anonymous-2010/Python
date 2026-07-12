import { Layers, Calendar, Globe, BookOpen, Tag, Hash } from 'lucide-react';
import type { Batch } from '../lib/types';
import { formatDateTime } from '../lib/format';

interface Props { batch: Batch | null }

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-4 py-4 border-b border-border group">
      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-card border border-border text-text-muted group-hover:border-green-border group-hover:text-green/60 transition-all duration-300 flex-shrink-0">
        {icon}
      </div>
      <span className="text-base text-text-dim w-24">{label}</span>
      <span className="ml-auto text-base font-medium text-text truncate max-w-[300px] group-hover:text-green-bright/90 transition-colors duration-300">{value}</span>
    </div>
  );
}

export default function BatchCard({ batch }: Props) {
  if (!batch) return null;
  const fee = batch.fee;

  return (
    <section>
      {/* Banner */}
      {batch.previewImage && (
        <div className="relative w-full h-72 sm:h-96 lg:h-[28rem] rounded-2xl overflow-hidden border border-border mb-8">
          <img
            src={batch.previewImage}
            alt={batch.name}
            className="w-full h-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
          <div className="absolute bottom-5 left-6 right-6">
            <div className="flex items-center gap-2.5 mb-2">
              {batch.isPurchased && (
                <span className="rounded-full bg-green/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#021a0e]">Owned</span>
              )}
              {batch.status && (
                <span className="rounded-full bg-black/50 backdrop-blur-sm border border-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white/80">{batch.status}</span>
              )}
            </div>
            <h2 className="text-3xl font-black text-white leading-tight drop-shadow-lg">{batch.name || '—'}</h2>
            {batch.byName && <p className="text-base text-white/70 mt-1">{batch.byName}</p>}
          </div>
        </div>
      )}

      {/* No banner fallback */}
      {!batch.previewImage && (
        <>
          <div className="flex items-center gap-2.5 mb-2">
            <Layers size={20} className="text-green" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted">Batch Information</span>
          </div>
          <h2 className="text-3xl font-bold text-text mb-1">{batch.name || '—'}</h2>
          {batch.byName && <p className="text-base text-text-dim mb-8">{batch.byName}</p>}
          {!batch.byName && <div className="mb-8" />}
          <div className="flex items-center gap-2.5 mb-8">
            {batch.isPurchased && (
              <span className="rounded-full bg-green-dim border border-green-border px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-green">Owned</span>
            )}
            {batch.status && (
              <span className="rounded-full bg-bg-card border border-border px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-text-dim">{batch.status}</span>
            )}
            {batch.mode && (
              <span className="rounded-full bg-bg-card border border-border px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-text-dim">{batch.mode}</span>
            )}
          </div>
        </>
      )}

      {/* Core info */}
      <div className="mb-8">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted mb-4">Details</div>
        <InfoRow icon={<BookOpen size={15} />} label="Class" value={batch.class} />
        <InfoRow icon={<Tag size={15} />} label="Exam" value={batch.exam} />
        <InfoRow icon={<Globe size={15} />} label="Language" value={batch.language} />
        <InfoRow icon={<Layers size={15} />} label="Program" value={batch.program || null} />
        <InfoRow icon={<Hash size={15} />} label="Code" value={batch.batchCode || null} />
      </div>

      {/* Subjects count */}
      <div className="mb-8">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted mb-4">Subjects</div>
        <div className="text-5xl font-black text-text">{batch.subjectCount ?? '—'}</div>
        <p className="text-base text-text-dim mt-1">subjects in this batch</p>
      </div>

      <div className="glow-line" />

      {/* Price */}
      {fee && (
        <div className="py-6">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted mb-4">Pricing</div>
          <div className="flex items-center gap-4">
            <span className="text-4xl font-black text-text">
              {'\u20B9'}{Math.round(fee.total).toLocaleString('en-IN')}
            </span>
            {fee.amount && fee.amount !== fee.total && (
              <span className="text-lg text-text-muted line-through">
                {'\u20B9'}{Math.round(fee.amount).toLocaleString('en-IN')}
              </span>
            )}
            {fee.discount && (
              <span className="rounded-full bg-green-dim border border-green-border px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-green">
                {fee.discount}% off
              </span>
            )}
          </div>
        </div>
      )}

      <div className="glow-line" />

      {/* Description */}
      {batch.description && (
        <div className="py-6">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted mb-4">Description</div>
          <div className="rounded-xl border border-border bg-bg-card p-6">
            <p className="text-base leading-[1.9] text-text-dim whitespace-pre-line">{batch.description}</p>
          </div>
        </div>
      )}

      <div className="glow-line" />

      {/* Meta */}
      <div className="py-4">
        <InfoRow icon={<Hash size={15} />} label="Batch ID" value={batch.batchId} />
        {(batch.startDate || batch.endDate) && (
          <div className="flex items-center gap-4 py-4 border-b border-border group">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-card border border-border text-text-muted flex-shrink-0">
              <Calendar size={15} />
            </div>
            <span className="text-base text-text-dim w-24">Duration</span>
            <span className="ml-auto text-base font-medium text-text">
              {formatDateTime(batch.startDate || null)}  –  {formatDateTime(batch.endDate || null)}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
