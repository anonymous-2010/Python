import { Users } from 'lucide-react';
import type { Teacher } from '../lib/types';

interface Props {
  teachers: Teacher[];
}

export default function TeacherGrid({ teachers }: Props) {
  if (!teachers.length) return null;

  return (
    <section className="card p-6">
      <div className="mb-5 flex items-center gap-2 text-zinc-400">
        <Users className="h-5 w-5 text-emerald-400" />
        <span className="text-base font-semibold">Faculty</span>
        <span className="pill bg-white/[0.04] text-zinc-400 border-white/10">{teachers.length}</span>
      </div>

      <div className="space-y-2.5">
        {teachers.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5 transition-colors hover:bg-white/[0.04]"
          >
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              {t.image ? (
                <img src={t.image} alt={t.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl font-bold text-emerald-300">
                  {t.name
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-lg font-semibold text-white">{t.name}</div>
              <div className="truncate text-sm text-zinc-500">{t.subject}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
