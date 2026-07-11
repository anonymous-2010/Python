import { Radio } from 'lucide-react';

export default function NoLecture() {
  return (
    <div className="card-glass rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-3">
      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
        <Radio className="w-7 h-7 text-gray-600" />
      </div>
      <h2 className="text-white font-semibold">No Lecture Open</h2>
      <p className="text-gray-500 text-sm max-w-sm">
        Waiting for a lecture to start on PW.live. Open a lecture in your browser and the data will appear here automatically.
      </p>
    </div>
  );
}
