import { useEffect, useRef, useState } from 'react';
import { API, fetchLatest } from './lib/api';
import type { ScheduleData } from './lib/types';
import Header from './components/Header';
import LectureCard from './components/LectureCard';
import UserCard from './components/UserCard';
import BatchCard from './components/BatchCard';
import TeacherGrid from './components/TeacherGrid';
import IdentifiersCard from './components/IdentifiersCard';
import NoLecture from './components/NoLecture';

export default function App() {
  const [data, setData] = useState<ScheduleData | null>(null);
  const [connected, setConnected] = useState<'connecting' | 'live' | 'disconnected'>('connecting');
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    (async () => {
      const latest = await fetchLatest();
      if (latest?.scheduleId) setData(latest);
    })();
  }, []);

  useEffect(() => {
    let reconnectTimer: ReturnType<typeof setTimeout>;

    function connect() {
      setConnected('connecting');
      const es = new EventSource(API.events);
      esRef.current = es;

      es.onopen = () => setConnected('live');

      es.onmessage = (e) => {
        try {
          const d: ScheduleData = JSON.parse(e.data);
          if ((d as any)._type === 'counter_reset') return;
          setData(d);
        } catch {}
      };

      es.onerror = () => {
        setConnected('disconnected');
        es.close();
        reconnectTimer = setTimeout(connect, 3000);
      };
    }

    connect();
    return () => {
      esRef.current?.close();
      clearTimeout(reconnectTimer);
    };
  }, []);

  const noLecture = !data || data._lectureState === 'closed' || !data.scheduleId;

  return (
    <div className="min-h-screen">
      <Header connected={connected} />

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        {noLecture ? (
          <NoLecture />
        ) : (
          <div className="space-y-5 fade-in">
            <LectureCard data={data} />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <UserCard user={data.user} />
              <BatchCard batch={data.batch} />
            </div>

            <TeacherGrid teachers={data.teachers} />

            <IdentifiersCard data={data} />
          </div>
        )}
      </main>

      <footer className="mx-auto w-full max-w-5xl px-4 pb-10 pt-2 sm:px-6">
        <p className="text-center text-xs text-zinc-600">
          PW Sync · Real-time lecture monitor · {connected === 'live' ? 'Streaming live' : 'Reconnecting…'}
        </p>
      </footer>
    </div>
  );
}
