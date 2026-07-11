import { Users } from 'lucide-react';
import type { Teacher } from '../lib/types';

interface Props {
  teachers: Teacher[];
}

export default function TeacherGrid({ teachers }: Props) {
  if (!teachers.length) return null;

  return (
    <section className="py-7">
      <div className="mb-4 flex items-center gap-2 text-zinc-500">
        <Users className="h-5 w-5 text-emerald-400" />
        <span className="text-sm font-semibold uppercase tracking-wider">Faculty</span>
        <span className="pill bg-white/[0.04] text-zinc-400 border-white/10">{teachers.length}</span>
      </div>

      <div className="divide-y divide-white/[0.06]">
        {teachers.map((t) => (
          <div key={t.id} className="flex items-center gap-4 py-4">
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
              <div className="flex items-center gap-2">
                <span className="truncate text-lg font-semibold text-white">{t.name}</span>
                {t.subjectImage && (
                  <img
                    src={t.subjectImage}
                    alt={t.subject}
                    className="h-6 w-6 shrink-0 rounded-md border border-white/10 object-cover"
                  />
                )}
              </div>
              <div className="truncate text-sm text-zinc-500">{t.subject}</div>
              {t.qualification && (
                <div className="mt-0.5 truncate text-xs text-zinc-500">{t.qualification}</div>
              )}
              {t.experience && (
                <div className="text-xs text-zinc-600">{t.experience} yrs experience</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
