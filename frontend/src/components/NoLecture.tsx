import { Radio } from 'lucide-react';

export default function NoLecture() {
  return (
    <section className="flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="relative mb-5">
        <div className="absolute inset-0 animate-ping rounded-3xl bg-emerald-500/10" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03]">
          <Radio className="h-7 w-7 text-zinc-500" />
        </div>
      </div>
      <h2 className="text-xl font-semibold text-white">No lecture in progress</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-500">
        Waiting for a live lecture on PW.live. Open a class in your browser and the details will appear here instantly.
      </p>
    </section>
  );
}
