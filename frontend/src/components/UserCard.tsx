import { UserCircle, Mail, Phone, MapPin, Hash } from 'lucide-react';
import type { User } from '../lib/types';

interface Props {
  user: User | null;
}

function Field({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | null }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-emerald-400/80">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="field-label">{label}</div>
        <div className="field-value mt-0.5 truncate">{value || '--'}</div>
      </div>
    </div>
  );
}

export default function UserCard({ user }: Props) {
  if (!user) return null;

  return (
    <section className="card p-5">
      <div className="flex items-center gap-3.5 border-b border-white/[0.06] pb-4">
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || ''}
            className="h-12 w-12 rounded-2xl border border-white/10 object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <UserCircle className="h-6 w-6 text-emerald-400" />
          </div>
        )}
        <div className="min-w-0">
          <div className="truncate text-base font-semibold text-white">{user.name || '--'}</div>
          <div className="text-xs text-zinc-500">Student</div>
        </div>
      </div>

      <div className="divide-y divide-white/[0.04] pt-1">
        <Field icon={<Hash className="h-3.5 w-3.5" />} label="User ID" value={user.userId} />
        <Field icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={user.email} />
        <Field icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={user.phone} />
        <Field icon={<MapPin className="h-3.5 w-3.5" />} label="City" value={user.city} />
      </div>
    </section>
  );
}
