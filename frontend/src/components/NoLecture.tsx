import { Radio } from 'lucide-react';

export default function NoLecture() {
  return (
    <section className="flex flex-col items-center justify-center px-6 py-28 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-[28px] bg-green/5 blur-xl dot-pulse" />
        <div className="relative w-20 h-20 flex items-center justify-center rounded-[28px] border border-border bg-bg-card">
          <Radio size={32} className="text-text-muted" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-text">No lecture in progress</h2>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-text-dim">
        Waiting for a live lecture on PW.live. Open a class in your browser and the details will appear here instantly.
      </p>
    </section>
  );
}
