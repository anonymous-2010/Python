import { useEffect, useRef, useState } from 'react';
import { API, fetchLatest } from './lib/api';
import type { ScheduleData } from './lib/types';
import Sidebar, { TabKey } from './components/Sidebar';
import LectureCard from './components/LectureCard';
import UserCard from './components/UserCard';
import BatchCard from './components/BatchCard';
import TeacherGrid from './components/TeacherGrid';
import IdentifiersCard from './components/IdentifiersCard';
import NoLecture from './components/NoLecture';

export default function App() {
  const [data, setData] = useState<ScheduleData | null>(null);
  const [connected, setConnected] = useState<'connecting' | 'live' | 'disconnected'>('connecting');
  const [tab, setTab] = useState<TabKey>('overview');
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
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar active={tab} onChange={setTab} connected={connected} />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-4xl px-5 py-7 sm:px-7 md:py-9">
          {noLecture ? (
            <NoLecture />
          ) : (
            <div className="space-y-6 fade-in" key={tab}>
              {tab === 'overview' && (
                <>
                  <LectureCard data={data} />
                  <div className="grid grid-cols-1 gap-x-10 gap-y-0 border-t border-white/[0.06] pt-1 lg:grid-cols-2">
                    <UserCard user={data.user} />
                    <BatchCard batch={data.batch} />
                  </div>
                </>
              )}
              {tab === 'faculty' && <TeacherGrid teachers={data.teachers} />}
              {tab === 'identifiers' && <IdentifiersCard data={data} />}
            </div>
          )}
        </div>

        <footer className="mx-auto w-full max-w-4xl px-5 pb-9 pt-2 text-center text-xs text-zinc-600 sm:px-7">
          PW Sync · {connected === 'live' ? 'Streaming live' : 'Reconnecting…'}
        </footer>
      </main>
    </div>
  );
}
