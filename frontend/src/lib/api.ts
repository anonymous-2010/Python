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
