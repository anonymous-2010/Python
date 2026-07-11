import { UserCircle, Mail, Phone, MapPin, Hash } from 'lucide-react';
import type { User } from '../lib/types';

interface Props {
  user: User | null;
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | null }) {
  return (
    <div className="flex items-center gap-3 border-t border-white/[0.06] py-3 first:border-t-0">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.03] text-emerald-400/80">
        {icon}
      </span>
      <span className="text-sm text-zinc-500">{label}</span>
      <span className="ml-auto truncate text-sm font-medium text-zinc-200">{value || '--'}</span>
    </div>
  );
}

export default function UserCard({ user }: Props) {
  if (!user) return null;

  return (
    <section className="py-7">
      <div className="mb-4 flex items-center gap-3.5">
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || ''}
            className="h-14 w-14 rounded-2xl border border-white/10 object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <UserCircle className="h-7 w-7 text-emerald-400" />
          </div>
        )}
        <div className="min-w-0">
          <div className="truncate text-lg font-semibold text-white">{user.name || '--'}</div>
          <div className="text-xs uppercase tracking-wider text-zinc-500">Student</div>
        </div>
      </div>

      <div>
        <Row icon={<Hash className="h-3.5 w-3.5" />} label="User ID" value={user.userId} />
        <Row icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={user.email} />
        <Row icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={user.phone} />
        <Row icon={<MapPin className="h-3.5 w-3.5" />} label="City" value={user.city} />
      </div>
    </section>
  );
}
