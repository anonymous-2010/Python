import { UserCircle, Mail, Phone, MapPin } from 'lucide-react';
import type { User } from '../lib/types';

interface Props {
  user: User | null;
}

export default function UserCard({ user }: Props) {
  if (!user) return null;

  return (
    <div className="card-glass rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-2 text-white text-sm font-medium">
        <UserCircle className="w-4 h-4 text-mint" />
        User Info
      </div>
      <div className="space-y-2 text-xs">
        <Row icon={<UserCircle className="w-3.5 h-3.5" />} label="Name" value={user.name} />
        <Row icon={<span className="font-mono text-[10px]">ID</span>} label="User ID" value={user.userId} />
        <Row icon={<Mail className="w-3.5 h-3.5" />} label="Email" value={user.email} />
        <Row icon={<Phone className="w-3.5 h-3.5" />} label="Phone" value={user.phone} />
        <Row icon={<MapPin className="w-3.5 h-3.5" />} label="City" value={user.city} />
      </div>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-mint/60">{icon}</span>
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-300 font-mono truncate ml-auto">{value || '--'}</span>
    </div>
  );
}
