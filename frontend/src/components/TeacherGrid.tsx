import { Users } from 'lucide-react';
import type { Teacher } from '../lib/types';

interface Props {
  teachers: Teacher[];
}

export default function TeacherGrid({ teachers }: Props) {
  if (!teachers.length) return null;

  return (
    <div className="card-glass rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-2 text-white text-sm font-medium">
        <Users className="w-4 h-4 text-mint" />
        All Teachers
        <span className="badge bg-white/5 text-gray-400 border-white/10 ml-1">{teachers.length}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {teachers.map((t) => (
          <div key={t.id} className="flex items-center gap-3 bg-white/3 rounded-xl px-3 py-2.5 border border-white/5">
            <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
              {t.image ? (
                <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-mint text-xs font-bold">
                  {t.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">{t.name}</p>
              <p className="text-gray-500 text-[10px] truncate">{t.subject}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
