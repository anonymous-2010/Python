export const API = {
  schedule: '/api/schedule',
  latest: '/api/latest',
  events: '/api/events',
  history: '/api/history',
  counterReset: '/api/counter/reset',
};

export async function fetchLatest() {
  const res = await fetch(API.latest);
  return res.json();
}

export async function fetchHistory() {
  const res = await fetch(API.history);
  return res.json();
}

export async function resetCounter() {
  const res = await fetch(API.counterReset, { method: 'POST' });
  return res.json();
}
