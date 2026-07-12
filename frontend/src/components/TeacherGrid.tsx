import { Users, Star, BookOpen } from 'lucide-react';
import type { Teacher } from '../lib/types';

interface Props { teachers: Teacher[] }

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function TeacherGrid({ teachers }: Props) {
  if (!teachers.length) return null;

  return (
    <section className="py-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Users size={20} className="text-green" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted">Faculty</span>
          </div>
          <h2 className="text-3xl font-bold text-text mt-2">Teaching Team</h2>
          <p className="text-base text-text-dim mt-1">{teachers.length} faculty members across all subjects</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-bg-card">
          <BookOpen size={15} className="text-green" />
          <span className="text-sm font-semibold text-text-dim">{teachers.length} Members</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {teachers.map((t, i) => (
          <div
            key={t.id}
            className="group p-6 rounded-2xl border border-border bg-bg-card hover-glow transition-all duration-300"
          >
            <div className="flex items-center gap-6">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 rounded-2xl bg-green/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-border-light bg-bg-raised">
                  {t.image ? (
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-black text-green">
                      {initials(t.name)}
                    </div>
                  )}
                </div>
                {i === 0 && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-green flex items-center justify-center shadow-lg shadow-green/30">
                    <Star size={12} className="text-[#021a0e]" fill="#021a0e" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-text group-hover:text-green-bright transition-colors duration-300">{t.name}</h3>
                  {t.subjectImage && (
                    <img src={t.subjectImage} alt={t.subject} className="w-10 h-10 rounded-xl border border-border-light bg-bg-raised object-cover" />
                  )}
                </div>
                <p className="text-base text-green font-medium mt-1">{t.subject}</p>
                <div className="flex items-center gap-4 mt-3 flex-wrap">
                  {t.qualification && (
                    <div className="flex items-center gap-1.5 text-sm text-text-dim">
                      <div className="w-1.5 h-1.5 rounded-full bg-green/50" />
                      {t.qualification}
                    </div>
                  )}
                  {t.experience && (
                    <div className="flex items-center gap-1.5 text-sm text-text-dim">
                      <div className="w-1.5 h-1.5 rounded-full bg-green/50" />
                      {t.experience} yrs experience
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
