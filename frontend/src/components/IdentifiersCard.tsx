import { Fingerprint, Clock } from 'lucide-react';
import type { ScheduleData } from '../lib/types';

interface Props {
  data: ScheduleData;
}

function Item({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
      <div className="field-label">{label}</div>
      <div className="field-value mt-1 break-all">{value || '--'}</div>
    </div>
  );
}

export default function IdentifiersCard({ data }: Props) {
  return (
    <section className="card p-5">
      <div className="mb-4 flex items-center gap-2 text-zinc-400">
        <Fingerprint className="h-4 w-4 text-emerald-400" />
        <span className="text-sm font-medium">Identifiers</span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Item label="Schedule ID" value={data.scheduleId} />
        <Item label="Batch ID" value={data.batchId} />
        <Item label="Received" value={data._receivedAt} />
      </div>
    </section>
  );
}
