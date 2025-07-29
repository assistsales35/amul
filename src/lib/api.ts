// Temporary mock API utilities for dashboard data
// Replace with real HTTP calls once backend endpoints are ready.

export async function fetchOperationalKPIs(timeRange: string) {
  try {
    const res = await fetch(`http://localhost:5000/api/operational-kpis?range=${encodeURIComponent(timeRange)}`);
    if (!res.ok) throw new Error('Network');
    const data = await res.json();
    return data;
  } catch (e) {
    console.error('fetchOperationalKPIs failed', e);
    return [];
  }
}
