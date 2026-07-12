export const API = {
  schedule: '/api/schedule',
  latest: '/api/latest',
  events: '/api/events',
  history: '/api/history',
  counterReset: '/api/counter/reset',
  poll: '/api/poll',
  pollAnswer: '/api/poll/answer',
  pollHistory: '/api/poll/history',
  pollSettings: '/api/poll/settings',
  pollConnect: '/api/poll/connect',
  pollDisconnect: '/api/poll/disconnect',
  messages: '/api/messages',
  messagesUnread: '/api/messages/unread',
  messagesRead: '/api/messages/read',
};

function getHeaders(): Record<string, string> {
  const userId = localStorage.getItem('pw_user_id');
  const headers: Record<string, string> = {};
  if (userId) headers['X-User-Id'] = userId;
  return headers;
}

export async function fetchLatest() {
  const userId = localStorage.getItem('pw_user_id');
  const url = userId ? `${API.latest}?userId=${encodeURIComponent(userId)}` : API.latest;
  const res = await fetch(url);
  return res.json();
}

export function getEventsUrl(): string {
  const userId = localStorage.getItem('pw_user_id');
  const url = new URL(API.events, window.location.origin);
  if (userId) url.searchParams.set('userId', userId);
  return url.toString();
}
