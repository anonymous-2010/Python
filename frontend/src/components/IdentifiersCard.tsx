import { Hash, Clock } from 'lucide-react';
import type { ScheduleData } from '../lib/types';

interface Props {
  data: ScheduleData;
}

export default function IdentifiersCard({ data }: Props) {
  return (
    <div className="card-glass rounded-2xl p-5">
      <div className="flex items-center gap-2 text-white text-sm font-medium mb-3">
        <Hash className="w-4 h-4 text-mint" />
        Identifiers
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
        <Row label="Schedule ID" value={data.scheduleId} />
        <Row label="Batch ID" value={data.batchId} />
        <Row label="Received At" value={data._receivedAt} />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="bg-white/3 rounded-lg px-3 py-2">
      <span className="text-gray-500 block text-[10px] uppercase tracking-wide mb-0.5">{label}</span>
      <span className="text-gray-300 font-mono text-xs break-all">{value || '--'}</span>
    </div>
  );
}
