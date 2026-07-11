import { Users } from 'lucide-react';
import type { Teacher } from '../lib/types';

interface Props {
  teachers: Teacher[];
}

export default function TeacherGrid({ teachers }: Props) {
  if (!teachers.length) return null;

  return (
    <section className="card p-5">
      <div className="mb-4 flex items-center gap-2 text-zinc-400">
        <Users className="h-4 w-4 text-emerald-400" />
        <span className="text-sm font-medium">Faculty</span>
        <span className="pill bg-white/[0.04] text-zinc-400 border-white/10">{teachers.length}</span>
      </div>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {teachers.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 transition-colors hover:bg-white/[0.04]"
          >
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">
              {t.image ? (
                <img src={t.image} alt={t.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-bold text-emerald-300">
                  {t.name
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-white">{t.name}</div>
              <div className="truncate text-xs text-zinc-500">{t.subject}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
