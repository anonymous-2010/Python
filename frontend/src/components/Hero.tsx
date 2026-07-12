import type { Batch, Teacher, User } from '../lib/types';

interface Props {
  batch: Batch | null;
  teachers: Teacher[];
  user: User | null;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 21) return 'Good Evening';
  return 'Good Night';
}

function getFirstName(fullName: string | null): string {
  if (!fullName) return '';
  return fullName.split(' ')[0];
}

export default function Hero({ batch, teachers, user }: Props) {
  if (!batch) return null;
  const fee = batch.fee;
  const firstName = getFirstName(user?.name || null);

  return (
    <section className="mb-14">
      <div className="relative">
        {/* Greeting */}
        {firstName && (
          <div className="inline-flex items-center gap-2 rounded-full border border-green-border bg-green-dim px-4 py-1.5 mb-5">
            <span className="text-base text-text-dim">{getGreeting()},</span>
            <span className="text-base text-green font-semibold">{firstName}</span>
          </div>
        )}

        <div className="flex items-center gap-2.5 mb-5">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted">Batch</span>
          {batch.isPurchased && (
            <span className="rounded-full bg-green-dim border border-green-border px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-green">
              Owned
            </span>
          )}
          {batch.status && (
            <span className="rounded-full bg-bg-card border border-border px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-text-dim">
              {batch.status}
            </span>
          )}
        </div>

        <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-[1.05]">
          <span className="bg-gradient-to-r from-text via-green-bright/80 to-text bg-clip-text text-transparent">
            {batch.name || '--'}
          </span>
        </h1>
        {batch.byName && (
          <p className="mt-2.5 text-base text-text-dim font-medium">{batch.byName}</p>
        )}

        <div className="flex gap-10 mt-10 flex-wrap">
          {[
            ['Subjects', batch.subjectCount != null ? String(batch.subjectCount) : '--'],
            ['Faculty', String(teachers.length)],
            ['Price', fee ? `\u20B9${Math.round(fee.total).toLocaleString('en-IN')}` : '--'],
            ['Code', batch.batchCode || '--'],
          ].map(([label, value]) => (
            <div key={label} className="group">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted mb-1.5 group-hover:text-green/60 transition-colors">{label}</div>
              <div className="text-3xl font-black text-text group-hover:text-green-bright transition-colors duration-300">{value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="glow-line mt-12" />
    </section>
  );
}
