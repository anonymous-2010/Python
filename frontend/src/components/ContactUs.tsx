import { useState, useEffect } from 'react';
import { Mail, MessageSquare, Send, Reply, ArrowLeft, User, Shield } from 'lucide-react';
import { API } from '../lib/api';

interface Message {
  id: string;
  user_id: string;
  username: string;
  subject: string;
  message: string;
  sender: string;
  read: boolean;
  created_at: string;
}

interface Props {
  onMessagesViewed?: () => void;
}

export default function ContactUs({ onMessagesViewed }: Props) {
  const [view, setView] = useState<'menu' | 'email' | 'message' | 'history'>('menu');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');

  const userId = localStorage.getItem('pw_user_id');

  useEffect(() => {
    if (userId && view === 'history') {
      fetch(`${API.messages}?userId=${userId}`)
        .then(r => r.json())
        .then(d => {
          setMessages(d.messages || []);
          // Mark all messages as read
          fetch(API.messagesRead, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
          }).then(() => onMessagesViewed?.()).catch(() => {});
        })
        .catch(() => {});
    }
  }, [userId, view]);

  async function sendMessage() {
    if (!userId || !message.trim()) return;
    setSending(true);
    try {
      await fetch(API.messages, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, subject, message }),
      });
      setSent(true);
      setSubject('');
      setMessage('');
      setTimeout(() => setSent(false), 3000);
    } catch {}
    setSending(false);
  }

  async function sendReply(parentId: string) {
    if (!userId || !replyText.trim()) return;
    setSending(true);
    try {
      await fetch(API.messages, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, subject: 'Reply', message: replyText }),
      });
      setReplyText('');
      setReplyTo(null);
      // Refresh messages
      const res = await fetch(`${API.messages}?userId=${userId}`);
      const d = await res.json();
      setMessages(d.messages || []);
    } catch {}
    setSending(false);
  }

  if (view === 'menu') {
    return (
      <section className="py-4">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-text tracking-tight">Contact Us</h2>
          <p className="text-sm text-text-dim mt-1">Get in touch with our support team</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
          {/* Email */}
          <button
            onClick={() => setView('email')}
            className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-bg-card/50 hover:border-green-border hover:bg-green-dim transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-green/10 flex items-center justify-center group-hover:bg-green/15 transition-colors">
              <Mail size={22} className="text-green" />
            </div>
            <div>
              <div className="text-base font-bold text-text">Email Us</div>
              <div className="text-xs text-text-muted mt-0.5">Send us an email directly</div>
            </div>
          </button>

          {/* Message */}
          <button
            onClick={() => setView('message')}
            className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-bg-card/50 hover:border-green-border hover:bg-green-dim transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-dim flex items-center justify-center group-hover:bg-blue/15 transition-colors">
              <MessageSquare size={22} className="text-blue" />
            </div>
            <div>
              <div className="text-base font-bold text-text">Send Message</div>
              <div className="text-xs text-text-muted mt-0.5">Type your message here</div>
            </div>
          </button>

          {/* History */}
          <button
            onClick={() => setView('history')}
            className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-bg-card/50 hover:border-green-border hover:bg-green-dim transition-all text-left group sm:col-span-2"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-dim flex items-center justify-center group-hover:bg-amber/15 transition-colors">
              <MessageSquare size={22} className="text-amber" />
            </div>
            <div>
              <div className="text-base font-bold text-text">Message History</div>
              <div className="text-xs text-text-muted mt-0.5">View past conversations with support</div>
            </div>
          </button>
        </div>
      </section>
    );
  }

  if (view === 'email') {
    return (
      <section className="py-4">
        <button onClick={() => setView('menu')} className="flex items-center gap-2 text-sm text-text-dim hover:text-text mb-6 transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
        <h2 className="text-2xl font-bold text-text mb-2">Email Support</h2>
        <p className="text-sm text-text-dim mb-6">Send us an email and we'll get back to you.</p>

        <div className="max-w-lg p-6 rounded-2xl border border-border bg-bg-card/50">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-green/10 flex items-center justify-center">
              <Mail size={24} className="text-green" />
            </div>
            <div>
              <div className="text-lg font-bold text-text">Support Email</div>
              <a href="mailto:support.physics.wallah@atomicmail.io" className="text-sm text-green hover:text-green-bright transition-colors">
                support.physics.wallah@atomicmail.io
              </a>
            </div>
          </div>

          <a
            href="mailto:support.physics.wallah@atomicmail.io?subject=PW%20Sync%20Support"
            target="_blank"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-green text-[#021a0e] font-semibold hover:bg-green-bright transition-all"
          >
            <Mail size={16} /> Open Email Client
          </a>
        </div>
      </section>
    );
  }

  if (view === 'message') {
    return (
      <section className="py-4">
        <button onClick={() => setView('menu')} className="flex items-center gap-2 text-sm text-text-dim hover:text-text mb-6 transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
        <h2 className="text-2xl font-bold text-text mb-2">Send Message</h2>
        <p className="text-sm text-text-dim mb-6">Type your message and our team will respond.</p>

        <div className="max-w-lg space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2 block">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What's this about?"
              className="w-full bg-bg-raised border border-border rounded-xl px-4 py-3 text-base font-medium text-text placeholder:text-text-muted focus:outline-none focus:border-green-border transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2 block">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={6}
              className="w-full bg-bg-raised border border-border rounded-xl px-4 py-3 text-base font-medium text-text placeholder:text-text-muted focus:outline-none focus:border-green-border transition-all resize-none"
            />
          </div>

          {sent && (
            <div className="p-3 rounded-lg bg-green-dim border border-green-border text-green text-sm font-semibold">
              Message sent successfully!
            </div>
          )}

          <button
            onClick={sendMessage}
            disabled={sending || !message.trim()}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green text-[#021a0e] font-semibold hover:bg-green-bright disabled:opacity-40 transition-all cursor-pointer"
          >
            {sending ? 'Sending...' : <><Send size={16} /> Send Message</>}
          </button>
        </div>
      </section>
    );
  }

  if (view === 'history') {
    return (
      <section className="py-4">
        <button onClick={() => setView('menu')} className="flex items-center gap-2 text-sm text-text-dim hover:text-text mb-6 transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
        <h2 className="text-2xl font-bold text-text mb-6">Message History</h2>

        {messages.length === 0 ? (
          <div className="py-12 text-center text-text-muted">No messages yet</div>
        ) : (
          <div className="space-y-3 max-w-2xl">
            {messages.map((msg) => (
              <div key={msg.id} className={`p-4 rounded-xl border ${msg.sender === 'admin' ? 'border-green-border bg-green-dim/30' : 'border-border bg-bg-card/50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {msg.sender === 'admin' ? (
                    <div className="w-6 h-6 rounded-full bg-green/15 flex items-center justify-center">
                      <Shield size={12} className="text-green" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-blue-dim flex items-center justify-center">
                      <User size={12} className="text-blue" />
                    </div>
                  )}
                  <span className="text-xs font-bold text-text">{msg.sender === 'admin' ? 'Support' : msg.username}</span>
                  <span className="text-[10px] text-text-muted">{new Date(msg.created_at).toLocaleString()}</span>
                </div>
                {msg.subject && msg.subject !== 'Reply' && (
                  <div className="text-sm font-semibold text-text mb-1">{msg.subject}</div>
                )}
                <div className="text-sm text-text-dim">{msg.message}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  }

  return null;
}
