// -------------------- Date Basics --------------------
export function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function isSameDay(a, b) {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

export function daysUntil(due, ref = new Date()) {
  if (!due) return Infinity;
  const ms = startOfDay(due).getTime() - startOfDay(ref).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

// -------------------- Formatting --------------------
// MM/DD/YY
export function fmtDateMDY(d) {
  if (!d) return "—";
  const dd = new Date(d);
  if (isNaN(dd)) return "—";
  return dd.toLocaleDateString(undefined, {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  });
}

// Month YYYY (e.g., "January 2025")
export function fmtMonthYear(d) {
  const x = new Date(d);
  return x.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

// Mon DD, YY (e.g., "Jan 05, 25")
export function fmtDayShort(d) {
  const x = new Date(d);
  return x.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
}

// Alias to match existing usage in some files
export const fmtDate = fmtDateMDY;

// -------------------- Input/Picker Helpers --------------------
export function toInputDateString(d) {
  if (!d) return "";
  const x = new Date(d);
  if (isNaN(x)) return "";
  const yyyy = x.getFullYear();
  const mm = String(x.getMonth() + 1).padStart(2, "0");
  const dd = String(x.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Local “YYYY-MM-DD” to a Date at local noon (stable for display)
export function fromInputDateLocal(yyyymmdd) {
  if (!yyyymmdd) return null;
  const [y, m, d] = yyyymmdd.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

export const localDateFromPicker = fromInputDateLocal;

// -------------------- Calendar Helpers --------------------
export function monthGrid(date) {
  const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const startWeekday = firstOfMonth.getDay();
  const start = new Date(firstOfMonth);
  start.setDate(firstOfMonth.getDate() - startWeekday);

  const boxes = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    boxes.push({ date: d, inMonth: d.getMonth() === date.getMonth() });
  }
  return boxes;
}

// -------------------- Weekly Streak Helpers --------------------
export function getWeekStart(baseDate = new Date(), weekOffset = 0) {
  const today = startOfDay(baseDate);
  const dayIdx = today.getDay(); // 0=Sun
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayIdx + weekOffset * 7);
  return sunday;
}

export function getWeekDays(weekOffset = 0, baseDate = new Date()) {
  const start = getWeekStart(baseDate, weekOffset);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export function buildCompletedDaySet(tasks) {
  const set = new Set();
  for (const t of tasks) {
    if (t.status === "completed" && t.completedAt) {
      const ts = startOfDay(new Date(t.completedAt)).getTime();
      set.add(ts);
    }
  }
  return set;
}

// -------------------- Priority / Due Metadata --------------------
export function priorityDot(p) {
  const n = Number(p) || 1;
  if (n === 3) return "bg-red-500";
  if (n === 2) return "bg-amber-500";
  return "bg-emerald-500";
}

export function priorityMeta(p) {
  switch (Number(p)) {
    case 3:
      return { label: "High", chipClass: "bg-red-500" };
    case 2:
      return { label: "Medium", chipClass: "bg-amber-500" };
    default:
      return { label: "Low", chipClass: "bg-emerald-500" };
  }
}

export function dueMeta(due) {
  if (!due) return { label: "No due", className: "text-slate-600 border-slate-400" };
  const today = new Date();
  if (startOfDay(due) < startOfDay(today)) {
    return { label: fmtDateMDY(due), className: "text-red-600 border-red-500" }; // past due
  }
  if (isSameDay(due, today)) {
    return { label: "Today", className: "text-pink-600 border-pink-500" }; // today
  }
  const du = daysUntil(due, today);
  if (du <= 3) {
    return { label: fmtDateMDY(due), className: "text-orange-600 border-orange-500" }; // soon
  }
  return { label: fmtDateMDY(due), className: "text-slate-700 border-slate-400" }; // normal
}
