import { useState } from 'react';
import { UserCircle, Mail, Phone, MapPin, Hash, Calendar, Shield, CreditCard, Award, BadgeCheck, BookOpen, Wallet, Hash as HashIcon, Key, Copy, Check } from 'lucide-react';
import type { User } from '../lib/types';

interface Props { user: User | null; token: string | null }

function Row({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string | null | undefined; accent?: boolean }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="flex items-center gap-4 py-4 border-b border-border group">
      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-card border border-border text-text-muted group-hover:border-green-border group-hover:text-green/60 transition-all duration-300 flex-shrink-0">
        {icon}
      </div>
      <span className="text-base text-text-dim w-28">{label}</span>
      <span className={`ml-auto text-base font-medium truncate max-w-[320px] transition-colors duration-300 ${accent ? 'text-green font-semibold' : 'text-text group-hover:text-green-bright/90'}`}>{value}</span>
    </div>
  );
}

export default function UserCard({ user, token }: Props) {
  if (!user) return null;

  const [copied, setCopied] = useState(false);

  function copyToken() {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const totalCoins = user.coins ? Object.values(user.coins).reduce((a, b) => a + b, 0) : 0;

  return (
    <section>
      <div className="flex items-center gap-2.5 mb-2">
        <UserCircle size={20} className="text-green" />
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted">Student Information</span>
      </div>
      <h2 className="text-3xl font-bold text-text mb-8">{user.name || '—'}</h2>

      <div className="flex items-center gap-5 mb-8 p-6 rounded-2xl border border-border bg-bg-card">
        {user.image ? (
          <img src={user.image} alt={user.name || ''} className="w-24 h-24 rounded-2xl border-2 border-border-light object-cover" />
        ) : (
          <div className="w-24 h-24 flex items-center justify-center rounded-2xl border-2 border-border-light bg-bg-raised">
            <UserCircle size={48} className="text-green" />
          </div>
        )}
        <div className="flex-1">
          <div className="text-2xl font-bold text-text">{user.name || '—'}</div>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted mt-1">Student Account</div>
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {user.isVerifiedEmail && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-dim border border-green-border px-2.5 py-0.5 text-xs font-bold text-green">
                <BadgeCheck size={12} /> Verified
              </span>
            )}
            {user.isScholar && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-dim border border-amber/15 px-2.5 py-0.5 text-xs font-bold text-amber">
                <Award size={12} /> Scholar
              </span>
            )}
            {(user.roles || []).map((r) => (
              <span key={r} className="rounded-full bg-bg-card border border-border px-2.5 py-0.5 text-xs font-bold text-text-dim">{r}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted mb-3">Contact Details</div>
      <Row icon={<HashIcon size={15} />} label="User ID" value={user.userId} />
      <Row icon={<Mail size={15} />} label="Email" value={user.email} />
      <Row icon={<Phone size={15} />} label="Phone" value={user.phone} />
      <Row icon={<UserCircle size={15} />} label="Username" value={user.username} />
      <Row icon={<Hash size={15} />} label="Unique Code" value={user.uniqueCode} accent />

      <div className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted mt-8 mb-3">Location</div>
      <Row icon={<MapPin size={15} />} label="City" value={user.city} />
      <Row icon={<MapPin size={15} />} label="State" value={user.state} />
      <Row icon={<MapPin size={15} />} label="Pincode" value={user.pincode} />

      <div className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted mt-8 mb-3">Academic</div>
      <Row icon={<BookOpen size={15} />} label="Class" value={user.class} />
      <Row icon={<BookOpen size={15} />} label="Board" value={user.board} />
      <Row icon={<Shield size={15} />} label="Exams" value={(user.exams || []).length ? (user.exams || []).join(', ') : null} />
      <Row icon={<Shield size={15} />} label="Organization" value={user.orgName} />

      <div className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted mt-8 mb-3">Wallet & Rewards</div>
      <Row icon={<Wallet size={15} />} label="Wallet" value={user.wallet != null ? `\u20B9${user.wallet}` : null} />
      <Row icon={<CreditCard size={15} />} label="Total Coins" value={totalCoins > 0 ? String(totalCoins) : null} />
      <Row icon={<Award size={15} />} label="Rewards" value={user.totalRewards != null ? String(user.totalRewards) : null} />

      <div className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted mt-8 mb-3">Account</div>
      <Row icon={<Calendar size={15} />} label="Created" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null} />
      <Row icon={<Shield size={15} />} label="Email Verified" value={user.isVerifiedEmail ? 'Yes' : user.isVerifiedEmail === false ? 'No' : null} />
      <Row icon={<Shield size={15} />} label="Profile Done" value={user.isProfileCompleted ? 'Yes' : user.isProfileCompleted === false ? 'No' : null} />

      {/* Token */}
      {token && (
        <>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted mt-8 mb-3">Auth Token</div>
          <div className="rounded-xl border border-border bg-bg-card p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <Key size={15} className="text-green" />
              <span className="text-sm font-semibold text-text">JWT Token</span>
              <span className="rounded-full bg-green-dim border border-green-border px-2 py-0.5 text-[10px] font-bold text-green">Active</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0 rounded-lg border border-border bg-bg-raised px-4 py-3">
                <code className="text-xs text-text-dim font-mono break-all leading-relaxed block">{token}</code>
              </div>
              <button
                onClick={copyToken}
                className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl border border-border bg-bg-card text-text-muted hover:border-green-border hover:text-green hover:bg-green-dim transition-all duration-300 cursor-pointer"
                title="Copy token"
              >
                {copied ? <Check size={16} className="text-green" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
