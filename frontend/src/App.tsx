import { useEffect, useRef, useState } from 'react';
import { API, fetchLatest, fetchHistory, resetCounter } from './lib/api';
import type { ScheduleData } from './lib/types';
import Header from './components/Header';
import LectureCard from './components/LectureCard';
import UserCard from './components/UserCard';
import BatchCard from './components/BatchCard';
import TeacherGrid from './components/TeacherGrid';
import IdentifiersCard from './components/IdentifiersCard';
import HistoryTab from './components/HistoryTab';
import NoLecture from './components/NoLecture';

export default function App() {
  const [data, setData] = useState<ScheduleData | null>(null);
  const [history, setHistory] = useState<ScheduleData[]>([]);
  const [counter, setCounter] = useState(0);
  const [connected, setConnected] = useState<'connecting' | 'live' | 'disconnected'>('connecting');
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    (async () => {
      const latest = await fetchLatest();
      if (latest?.scheduleId) {
        setData(latest);
        setCounter(latest._dataNumber || 0);
      }
      const hist = await fetchHistory();
      if (Array.isArray(hist)) setHistory(hist);
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
          const d: ScheduleData & { _type?: string } = JSON.parse(e.data);
          if (d._type === 'counter_reset') {
            setCounter(0);
            return;
          }
          setData(d);
          if (d._dataNumber) setCounter(d._dataNumber);
          setHistory((prev) => [d, ...prev].slice(0, 50));
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

  const handleReset = async () => {
    await resetCounter();
    setCounter(0);
  };

  const noLecture = !data || data._lectureState === 'closed' || !data.scheduleId;

  return (
    <div className="min-h-screen">
      <Header counter={counter} connected={connected} onReset={handleReset} />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        {noLecture ? (
          <NoLecture />
        ) : (
          <>
            <LectureCard data={data} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <UserCard user={data.user} />
              <BatchCard batch={data.batch} />
            </div>

            <TeacherGrid teachers={data.teachers} />

            <IdentifiersCard data={data} />
          </>
        )}

        <HistoryTab history={history} onSelect={setData} />
      </main>
    </div>
  );
}
