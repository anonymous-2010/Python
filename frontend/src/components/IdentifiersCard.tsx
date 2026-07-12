import { Fingerprint } from 'lucide-react';
import type { ScheduleData } from '../lib/types';
import { formatDateTime } from '../lib/format';

interface Props { data: ScheduleData }

export default function IdentifiersCard({ data }: Props) {
  return (
    <section className="py-4">
      <div className="flex items-center gap-2.5 mb-7">
        <Fingerprint size={18} className="text-green" />
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted">Identifiers</span>
      </div>

      <div className="flex items-center justify-between py-4 border-b border-border group">
        <span className="text-base text-text-dim group-hover:text-green/50 transition-colors">Schedule ID</span>
        <span className="break-all text-right font-mono text-base text-text group-hover:text-green-bright/80 transition-colors">{data.scheduleId || '—'}</span>
      </div>
      <div className="flex items-center justify-between py-4 border-b border-border group">
        <span className="text-base text-text-dim group-hover:text-green/50 transition-colors">Batch ID</span>
        <span className="break-all text-right font-mono text-base text-text group-hover:text-green-bright/80 transition-colors">{data.batchId || '—'}</span>
      </div>
      <div className="flex items-center justify-between py-4 border-b border-border group">
        <span className="text-base text-text-dim group-hover:text-green/50 transition-colors">Received</span>
        <span className="text-base text-text group-hover:text-green-bright/80 transition-colors">{formatDateTime(data._receivedAt)}</span>
      </div>
    </section>
  );
}
