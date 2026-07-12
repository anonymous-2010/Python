import { useState, useEffect } from 'react';
import { BarChart3, Settings, Trophy, Clock, CheckCircle, Send, Zap, X, Check, Wifi, WifiOff } from 'lucide-react';
import { API } from '../lib/api';

interface PollOption {
  optionId: string;
  optionLabel: string;
  optionDescription: string;
  voteCount: number;
  votePercentage: number;
}

interface ActivePoll {
  pollId: string;
  question: string;
  options: PollOption[];
  expiryDuration: number;
  type: string;
  seqNumber: number;
  receivedAt: string;
  status: string;
  result?: PollResult;
  leaderboard?: LeaderboardEntry[];
}

interface PollResult {
  totalVotes: number;
  correctOption: number[];
  pollOptions: PollOption[];
  correctVotes: number;
}

interface LeaderboardEntry {
  userId: string;
  name: string;
  score: number;
  correctAnswers: number;
}

interface PollHistoryItem {
  pollId: string;
  question: string;
  options: PollOption[];
  expiryDuration: number;
  receivedAt: string;
  status: string;
  result?: PollResult;
  leaderboard?: LeaderboardEntry[];
}

interface Props {}

export default function Polls(props: Props) {
  const [activePoll, setActivePoll] = useState<ActivePoll | null>(null);
  const [history, setHistory] = useState<PollHistoryItem[]>([]);
  const [autoAnswer, setAutoAnswer] = useState(false);
  const [preferredOption, setPreferredOption] = useState(1);
  const [autoAnswerDelay, setAutoAnswerDelay] = useState(0);
  const [answered, setAnswered] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');
  const [pollStatus, setPollStatus] = useState<'idle' | 'active' | 'waiting' | 'expired' | 'result'>('idle');
  const [serverData, setServerData] = useState<any>(null);

  // Connection status - fetch from server
  const userId = localStorage.getItem('pw_user_id');
  const hasToken = !!serverData?.token;
  const scheduleId = serverData?.scheduleId;
  const batchId = serverData?.batchId;

  useEffect(() => {
    if (!userId) return;
    fetch(`${API.latest}?userId=${userId}`)
      .then(r => r.json())
      .then(d => setServerData(d))
      .catch(() => {});
    const interval = setInterval(() => {
      fetch(`${API.latest}?userId=${userId}`)
        .then(r => r.json())
        .then(d => setServerData(d))
        .catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  // Load cached history from localStorage
  useEffect(() => {
    if (!userId) return;
    try {
      const cached = localStorage.getItem(`pw_poll_history_${userId}`);
      if (cached) setHistory(JSON.parse(cached));
    } catch {}
  }, [userId]);

  // Save history to localStorage
  function saveToStorage(data: PollHistoryItem[]) {
    if (!userId) return;
    try {
      localStorage.setItem(`pw_poll_history_${userId}`, JSON.stringify(data.slice(0, 50)));
    } catch {}
  }

  // Fetch poll data
  useEffect(() => {
    if (!userId) return;
    const interval = setInterval(() => {
      fetch(`${API.poll}?userId=${userId}`)
        .then(r => r.json())
        .then(d => {
          if (d.poll && d.poll.status === 'active') {
            if (activePoll?.pollId !== d.poll.pollId) {
              setAnswered(null);
              setPollStatus('active');
              setTimer(d.poll.expiryDuration || 60);
            }
            setActivePoll(d.poll);
          } else if (d.poll && d.poll.status === 'expired') {
            setPollStatus('expired');
          } else {
            setActivePoll(null);
            if (pollStatus === 'active' || pollStatus === 'waiting') {
              setPollStatus('idle');
            }
          }
        })
        .catch(() => {});

      fetch(`${API.pollHistory}?userId=${userId}`)
        .then(r => r.json())
        .then(d => {
          const h = d.history || [];
          setHistory(h);
          saveToStorage(h);
        })
        .catch(() => {});
    }, 1000);

    return () => clearInterval(interval);
  }, [userId]);

  // Fetch settings
  useEffect(() => {
    if (!userId) return;
    fetch(`${API.pollSettings}?userId=${userId}`)
      .then(r => r.json())
      .then(d => {
        setAutoAnswer(d.autoAnswer || false);
        setPreferredOption(d.preferredOption || 1);
        setAutoAnswerDelay(d.autoAnswerDelay || 0);
      })
      .catch(() => {});
  }, [userId]);

  // Timer countdown
  useEffect(() => {
    if (!activePoll || timer <= 0 || pollStatus !== 'active') return;
    const interval = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          setPollStatus('expired');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activePoll, pollStatus]);

  // Auto-answer with delay
  useEffect(() => {
    if (activePoll && autoAnswer && !answered && pollStatus === 'active') {
      const delayMs = Math.max(0, Math.min(100000, autoAnswerDelay * 1000));
      const timer = setTimeout(() => submitAnswer(preferredOption), delayMs);
      return () => clearTimeout(timer);
    }
  }, [activePoll]);

  // Toast auto-hide
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  async function submitAnswer(optionIndex: number) {
    if (!activePoll || !userId || submitting || answered) return;
    setSubmitting(true);
    setPollStatus('waiting');
    try {
      const res = await fetch(API.pollAnswer, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, pollId: activePoll.pollId, optionId: optionIndex }),
      });
      const data = await res.json();
      if (data.alreadyAnswered || !res.ok) {
        setToast('Already answered this poll');
      } else if (data.success) {
        setToast('Answer submitted!');
      } else {
        setToast(data.message || 'Failed to submit');
      }
      setAnswered(activePoll.pollId);
    } catch {
      setToast('Network error');
    }
    setSubmitting(false);
  }

  async function saveSettings() {
    if (!userId) return;
    try {
      await fetch(API.pollSettings, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, autoAnswer, preferredOption, autoAnswerDelay }),
      });
      setToast('Settings saved successfully!');
    } catch {
      setToast('Failed to save settings');
    }
  }

  const options = ['A', 'B', 'C', 'D'];
  const statuses = [
    { label: 'User ID', present: !!userId, icon: userId ? <Check size={12} /> : <X size={12} /> },
    { label: 'Token', present: hasToken, icon: hasToken ? <Check size={12} /> : <X size={12} /> },
    { label: 'Schedule ID', present: !!scheduleId, icon: scheduleId ? <Check size={12} /> : <X size={12} /> },
    { label: 'Batch ID', present: !!batchId, icon: batchId ? <Check size={12} /> : <X size={12} /> },
  ];

  return (
    <section className="py-4">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl bg-green/10 border border-green/20 text-green text-sm font-semibold shadow-lg animate-in">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-text tracking-tight">Polls</h2>
          <p className="text-sm text-text-dim mt-1">Live poll tracking and auto-answer</p>
        </div>
      </div>

      {/* Connection Status */}
      <div className="mb-8 p-4 rounded-xl border border-border bg-bg-card/30">
        <div className="flex items-center gap-2 mb-3">
          <Wifi size={14} className="text-green" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Connection Status</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {statuses.map(s => (
            <div key={s.label} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-bg-card/30">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${s.present ? 'bg-green/15 text-green' : 'bg-red-dim text-red'}`}>
                {s.icon}
              </div>
              <span className="text-xs text-text-dim">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Active Poll */}
      {activePoll && pollStatus === 'active' && (
        <div className="mb-10 animate-in">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={16} className="text-green" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-green">Active Poll</span>
            <span className="text-[10px] text-text-muted">#{activePoll.seqNumber}</span>
            {activePoll.type === 'single' && (
              <span className="px-2 py-0.5 rounded-full bg-green-dim border border-green-border text-[10px] font-bold text-green">Single Choice</span>
            )}
            {activePoll.type === 'multiple' && (
              <span className="px-2 py-0.5 rounded-full bg-blue-dim border border-blue-border text-[10px] font-bold text-blue">Multiple Choice</span>
            )}
            {activePoll.type === 'vote' && (
              <span className="px-2 py-0.5 rounded-full bg-amber-dim border border-amber/20 text-[10px] font-bold text-amber">Vote</span>
            )}
            {activePoll.type === 'integer' && (
              <span className="px-2 py-0.5 rounded-full bg-red-dim border border-red/20 text-[10px] font-bold text-red">Integer</span>
            )}
          </div>

          <div className="rounded-2xl border border-green-border bg-gradient-to-br from-green-dim via-bg-card to-bg-card p-6 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-green/[0.06] blur-[60px]" />

            {/* Timer */}
            <div className="flex items-center justify-between mb-5 relative">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-amber" />
                <span className="text-sm font-bold text-text tabular-nums">{timer}s</span>
              </div>
              <div className="h-2 w-32 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green to-green-bright transition-all duration-1000"
                  style={{ width: `${(timer / (activePoll.expiryDuration || 60)) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <h3 className="text-xl font-bold text-text mb-6 relative">{activePoll.question}</h3>

            {/* Options */}
            <div className="grid grid-cols-2 gap-3 relative">
              {activePoll.options.map((opt) => (
                <button
                  key={opt.optionId}
                  onClick={() => submitAnswer(parseInt(opt.optionId.replace('opt_', '')))}
                  disabled={answered === activePoll.pollId || submitting}
                  className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                    answered === activePoll.pollId
                      ? 'border-green-border bg-green-dim'
                      : 'border-border bg-bg-card/50 hover:border-green-border hover:bg-green-dim hover:scale-[1.02]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green/10 flex items-center justify-center text-sm font-bold text-green">
                      {opt.optionLabel}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-text">{opt.optionDescription}</div>
                      {answered === activePoll.pollId && (
                        <div className="text-xs text-text-muted mt-1">{opt.votePercentage}% · {opt.voteCount} votes</div>
                      )}
                    </div>
                    {answered === activePoll.pollId && (
                      <CheckCircle size={16} className="text-green" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Waiting for results */}
      {pollStatus === 'waiting' && (
        <div className="mb-10 animate-in">
          <div className="rounded-2xl border border-amber-border bg-amber-dim p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-amber/15 flex items-center justify-center mx-auto mb-3">
              <Send size={20} className="text-amber" />
            </div>
            <p className="text-base font-semibold text-text">Answer Submitted!</p>
            <p className="text-sm text-text-dim mt-1">Waiting for results...</p>
          </div>
        </div>
      )}

      {/* Expired */}
      {pollStatus === 'expired' && !activePoll?.result && (
        <div className="mb-10 animate-in">
          <div className="rounded-2xl border border-red-border bg-red-dim p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-red/15 flex items-center justify-center mx-auto mb-3">
              <Clock size={20} className="text-red" />
            </div>
            <p className="text-base font-semibold text-text">Time's Up!</p>
            <p className="text-sm text-text-dim mt-1">Poll expired. Waiting for results...</p>
          </div>
        </div>
      )}

      {/* No active poll */}
      {!activePoll && pollStatus === 'idle' && (
        <div className="mb-10 py-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-bg-card border border-border flex items-center justify-center mx-auto mb-4">
            <BarChart3 size={28} className="text-text-muted" />
          </div>
          <p className="text-base text-text-dim">No active poll right now</p>
          <p className="text-sm text-text-muted mt-1">Polls appear during live lectures</p>
        </div>
      )}

      {/* Auto-Answer Settings */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Settings size={16} className="text-green" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Auto-Answer Settings</span>
        </div>

        <div className="rounded-xl border border-border bg-bg-card/50 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold text-text">Enable Auto-Answer</div>
              <div className="text-xs text-text-muted mt-0.5">Automatically answer polls with your preferred option</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoAnswer}
                onChange={() => setAutoAnswer(!autoAnswer)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/[0.06] rounded-full peer peer-checked:bg-green peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all border border-border"></div>
            </label>
          </div>

          {autoAnswer && (
            <div className="mt-4">
              <div className="text-xs font-semibold text-text-dim mb-3">Preferred Option</div>
              <div className="flex gap-2 mb-4">
                {options.map((opt, i) => (
                  <button
                    key={opt}
                    onClick={() => setPreferredOption(i + 1)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                      preferredOption === i + 1
                        ? 'bg-green text-[#021a0e] border border-green shadow-lg shadow-green/20'
                        : 'bg-bg-card border border-border text-text-dim hover:border-green-border'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div className="text-xs font-semibold text-text-dim mb-2">Answer Delay (seconds)</div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={autoAnswerDelay}
                  onChange={(e) => setAutoAnswerDelay(parseFloat(e.target.value))}
                  className="flex-1 h-2 rounded-full appearance-none bg-white/[0.06] cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-green/30"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={autoAnswerDelay}
                  onChange={(e) => setAutoAnswerDelay(parseFloat(e.target.value) || 0)}
                  className="w-20 bg-bg-raised border border-border rounded-lg px-3 py-1.5 text-sm text-text font-mono text-center focus:outline-none focus:border-green-border"
                />
                <span className="text-xs text-text-muted">s</span>
              </div>
              <div className="text-[10px] text-text-muted mt-1">0 = instant, 100 = max delay</div>
            </div>
          )}

          <button
            onClick={saveSettings}
            className="mt-4 px-4 py-2 rounded-lg bg-green/10 border border-green/20 text-green text-xs font-semibold hover:bg-green/20 transition-all cursor-pointer"
          >
            Save Settings
          </button>
        </div>
      </div>

      {/* Poll History */}
      {history.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={16} className="text-green" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Poll History</span>
            <span className="text-[10px] text-text-muted">({history.length})</span>
          </div>

          <div className="space-y-3">
            {history.filter(p => p.status === 'completed' && p.result).reverse().slice(0, 10).map((poll, i) => (
              <div key={poll.pollId || i} className="rounded-xl border border-border bg-bg-card/30 p-4 hover:border-border-light transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-sm font-semibold text-text flex-1">{poll.question}</div>
                  {poll.result?.correctOption && (
                    <span className="text-[10px] font-bold text-green bg-green-dim border border-green-border px-2 py-0.5 rounded-full ml-2">
                      Correct: {poll.result.correctOption.map(o => options[o - 1]).join(', ')}
                    </span>
                  )}
                </div>
                <div className="text-xs text-text-muted">
                  {poll.result?.totalVotes || 0} votes · {poll.result?.correctVotes || 0}% correct
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
