function startOfDay(d) { const x = new Date(d); x.setHours(0,0,0,0); return x; }

export function deriveStreakStats(tasks) {
  const daySet = new Set();

  for (const t of tasks) {
    if (t.status === "completed" && t.completedAt) {
      const ts = startOfDay(new Date(t.completedAt)).getTime();
      daySet.add(ts);
    }
  }

  const days = Array.from(daySet).sort((a, b) => a - b);

  // best streak ever
  let best = 0;
  let streak = 0;
  let prev = null;
  const ONE_DAY = 24 * 60 * 60 * 1000;

  for (const ts of days) {
    if (prev !== null && ts === prev + ONE_DAY) {
      streak++;
    } else {
      streak = 1;
    }
    prev = ts;
    if (streak > best) best = streak;
  }

  const todayTs = startOfDay(new Date()).getTime();
  let current = 0;
  let cursor = todayTs;
  while (daySet.has(cursor)) {
    current++;
    cursor -= ONE_DAY;
  }

  return { current, best };
}
