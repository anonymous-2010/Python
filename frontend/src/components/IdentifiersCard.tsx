import { Fingerprint } from 'lucide-react';
import type { ScheduleData } from '../lib/types';
import { formatDateTime } from '../lib/format';

interface Props {
  data: ScheduleData;
}

export default function IdentifiersCard({ data }: Props) {
  return (
    <section className="py-7">
      <div className="mb-4 flex items-center gap-2 text-zinc-500">
        <Fingerprint className="h-4 w-4 text-emerald-400" />
        <span className="text-xs font-medium uppercase tracking-wider">Identifiers</span>
      </div>
      <div className="divide-y divide-white/[0.06]">
        <div className="flex items-center justify-between py-3 text-sm">
          <span className="text-zinc-500">Schedule ID</span>
          <span className="break-all text-right font-mono text-zinc-300">{data.scheduleId || '--'}</span>
        </div>
        <div className="flex items-center justify-between py-3 text-sm">
          <span className="text-zinc-500">Batch ID</span>
          <span className="break-all text-right font-mono text-zinc-300">{data.batchId || '--'}</span>
        </div>
        <div className="flex items-center justify-between py-3 text-sm">
          <span className="text-zinc-500">Received</span>
          <span className="text-zinc-300">{formatDateTime(data._receivedAt)}</span>
        </div>
      </div>
    </section>
  );
}
