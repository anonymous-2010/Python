import { useEffect, useRef, useState } from 'react';
import { API, fetchLatest } from './lib/api';
import type { ScheduleData } from './lib/types';
import Sidebar, { TabKey } from './components/Sidebar';
import Hero from './components/Hero';
import LectureCard from './components/LectureCard';
import UserCard from './components/UserCard';
import BatchCard from './components/BatchCard';
import TeacherGrid from './components/TeacherGrid';
import IdentifiersCard from './components/IdentifiersCard';
import NoLecture from './components/NoLecture';
import Login from './components/Login';
import Maintenance from './components/Maintenance';
import InstallExtension from './components/InstallExtension';
import GuideMe from './components/GuideMe';
import Polls from './components/Polls';
import ContactUs from './components/ContactUs';

export default function App() {
  const [userId, setUserId] = useState<string | null>(() => localStorage.getItem('pw_user_id'));
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem('pw_username'));
  const [data, setData] = useState<ScheduleData | null>(null);
  const [connected, setConnected] = useState<'connecting' | 'live' | 'disconnected'>('connecting');
  const [tab, setTab] = useState<TabKey>('overview');
  const [serverActive, setServerActive] = useState<boolean | null>(null);
  const [extensionInstalled, setExtensionInstalled] = useState<boolean | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const esRef = useRef<EventSource | null>(null);

  // Check server status
  async function checkServerStatus() {
    try {
      const res = await fetch('/api/server-status');
      const d = await res.json();
      setServerActive(d.active);
    } catch {
      setServerActive(false);
    }
  }

  // Check extension status
  async function checkExtensionStatus() {
    if (!userId) return;
    try {
      const res = await fetch(`/api/extension/status/${userId}`);
      const d = await res.json();
      setExtensionInstalled(d.installed);
    } catch {
      setExtensionInstalled(false);
    }
  }

  // Heartbeat - send every 10 seconds
  async function sendHeartbeat() {
    if (!userId) return;
    try {
      const headers: Record<string, string> = { 'X-User-Id': userId };
      // Try to get token from latest data
      const latestRes = await fetch(`/api/latest?userId=${userId}`);
      const latestData = await latestRes.json();
      if (latestData?.token) {
        headers['X-Token'] = latestData.token;
      }
      await fetch('/api/heartbeat', { method: 'POST', headers });
    } catch {}
  }

  // All hooks MUST be before any conditional returns
  useEffect(() => {
    checkServerStatus();
  }, []);

  useEffect(() => {
    if (!userId) return;
    checkExtensionStatus();
    sendHeartbeat();
    const interval = setInterval(checkServerStatus, 30000);
    const extInterval = setInterval(checkExtensionStatus, 30000);
    const heartbeatInterval = setInterval(sendHeartbeat, 10000);
    const unreadInterval = setInterval(() => {
      fetch(`/api/messages/unread?userId=${userId}`)
        .then(r => r.json())
        .then(d => setUnreadCount(d.count || 0))
        .catch(() => {});
    }, 10000);
    return () => { clearInterval(interval); clearInterval(extInterval); clearInterval(heartbeatInterval); clearInterval(unreadInterval); };
  }, [userId]);

  useEffect(() => {
    if (!userId || serverActive === false || serverActive === null) return;
    setData(null);
    (async () => {
      const latest = await fetchLatest();
      if (latest && (latest.batch || latest.user || latest.scheduleId)) setData(latest);
    })();
  }, [userId, serverActive]);

  useEffect(() => {
    if (!userId || serverActive === false || serverActive === null) return;
    let reconnectTimer: ReturnType<typeof setTimeout>;
    function connect() {
      setConnected('connecting');
      const eventsUrl = `${API.events}?userId=${encodeURIComponent(userId || '')}`;
      const es = new EventSource(eventsUrl);
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
    return () => { esRef.current?.close(); clearTimeout(reconnectTimer); };
  }, [userId, serverActive]);

  // NOW conditional returns (after all hooks)
  if (serverActive === false) {
    return <Maintenance onRetry={checkServerStatus} />;
  }

  if (serverActive === null) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-green/30 border-t-green rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-text-dim">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return <Login onLogin={(id, name) => { setUserId(id); setUsername(name); }} />;
  }

  function handleLogout() {
    localStorage.removeItem('pw_user_id');
    localStorage.removeItem('pw_username');
    setUserId(null);
    setUsername(null);
  }

  // Show install extension page after login
  if (extensionInstalled === false || extensionInstalled === null) {
    return <InstallExtension onRetry={checkExtensionStatus} onLogout={handleLogout} />;
  }

  const hasData = !!(data?.batch || data?.user);
  const lectureOpen = data && data._lectureState === 'open' && !!data.scheduleId;

  return (
    <div className="flex min-h-screen bg-bg">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[400px] h-[400px] rounded-full bg-green/[0.03] blur-[140px]" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-green/[0.02] blur-[100px]" />
      </div>

      <Sidebar active={tab} onChange={setTab} connected={connected} token={data?.token || null} onLogout={handleLogout} username={username} unreadCount={unreadCount} />

      <main className="flex-1 min-w-0 ml-0 md:ml-60 relative">
        <div className="max-w-4xl mx-auto px-6 py-10 sm:px-10 md:py-14">
          {!hasData ? (
            <NoLecture />
          ) : (
            <div className="fade-in" key={tab}>
              {tab === 'overview' && (
                <>
                  <Hero batch={data.batch} teachers={data.teachers} user={data.user} />
                  {lectureOpen && <LectureCard data={data} />}
                  {!lectureOpen && (
                    <div className="mb-12 py-10 text-center">
                      <p className="text-base text-text-dim">No active lecture — open a class on PW.live to see lecture details here.</p>
                    </div>
                  )}
                  <div className="glow-line mt-4" />
                </>
              )}
              {tab === 'faculty' && <TeacherGrid teachers={data.teachers} />}
              {tab === 'batch' && <BatchCard batch={data.batch} />}
              {tab === 'student' && <UserCard user={data.user} token={data.token} />}
              {tab === 'identifiers' && <IdentifiersCard data={data} />}
              {tab === 'guide' && <GuideMe />}
              {tab === 'polls' && <Polls />}
              {tab === 'contact' && <ContactUs onMessagesViewed={() => setUnreadCount(0)} />}
            </div>
          )}
        </div>

        <div className="glow-line mx-10" />
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.25em] text-text-muted py-6">
          PW Sync · {connected === 'live' ? 'Live' : 'Reconnecting…'}
        </p>
      </main>
    </div>
  );
}
