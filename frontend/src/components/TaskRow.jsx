import { useEffect, useMemo, useRef, useState } from "react";

// Helper functions for dates
function fmtDate(d) {
  if (!d) return "—";
  const dd = new Date(d);
  if (isNaN(dd)) return "—";
  return dd.toLocaleDateString(undefined, { month: "2-digit", day: "2-digit", year: "2-digit" });
}

function toInputDateString(d) {
  if (!d) return "";
  const x = new Date(d);
  if (isNaN(x)) return "";
  const yyyy = x.getFullYear();
  const mm = String(x.getMonth() + 1).padStart(2, "0");
  const dd = String(x.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function fromInputDateLocal(yyyymmdd) {
  if (!yyyymmdd) return null;
  const [y, m, d] = yyyymmdd.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

// Priority Metadata
function priorityMeta(p) {
  switch (Number(p)) {
    case 3: return { label: "High",   chipClass: "bg-red-500"     };
    case 2: return { label: "Medium", chipClass: "bg-amber-500"   };
    default:return { label: "Low",    chipClass: "bg-emerald-500" };
  }
}
//Date helpers for status coloring
function startOfDay(d) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
function isSameDay(a, b) { return startOfDay(a).getTime() === startOfDay(b).getTime(); }
function daysUntil(due, ref = new Date()) {
  if (!due) return Infinity;
  const ms = startOfDay(due).getTime() - startOfDay(ref).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

// Due date metadata 
function dueMeta(due) {
  if (!due) return { label: "No due", className: "text-slate-600 border-slate-400" };
  const today = new Date();
  if (startOfDay(due) < startOfDay(today)) {
    return { label: fmtDate(due), className: "text-red-600 border-red-500" };     // past due
  }
  if (isSameDay(due, today)) {
    return { label: "Today", className: "text-pink-600 border-pink-500" };        // today
  }
  const du = daysUntil(due, today);
  if (du <= 3) {
    return { label: fmtDate(due), className: "text-orange-600 border-orange-500"}; // soon (less than 3 days)
  }
  return { label: fmtDate(due), className: "text-slate-700 border-slate-400" };   // Normal/default
}

export default function TaskRow({ task, onToggle, onDelete, onEdit, stackAt = 560 }) {
  const ref = useRef(null);
  const [stacked, setStacked] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [title, setTitle] = useState(task.title || "");
  const [notes, setNotes] = useState(task.notes || "");
  const [dueStr, setDueStr] = useState(toInputDateString(task.dueDate));
  const [prio, setPrio] = useState(Number(task.priority) || 1);
  const [optimistic, setOptimistic] = useState(null);

  // reset drafts when a new task object arrives
  useEffect(() => {
    setTitle(task.title || "");
    setNotes(task.notes || "");
    setDueStr(toInputDateString(task.dueDate));
    setPrio(Number(task.priority) || 1);
    setOptimistic(null);
  }, [task._id, task.title, task.notes, task.dueDate, task.priority]);

  const t = useMemo(() => {
    if (!optimistic) return task;
    const merged = { ...task };
    for (const [k, v] of Object.entries(optimistic)) {
      if (v !== undefined) merged[k] = v;
    }
    return merged;
  }, [task, optimistic]);

  const completed = t.status === "completed";
  const pr = priorityMeta(t.priority);
  const dueInfo = dueMeta(t.dueDate ? new Date(t.dueDate) : null);

  // responsive resizing
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setStacked(entry.contentRect.width < stackAt);
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [stackAt]);

  // Close actions buttons on outside
  useEffect(() => {
    function onDocClick(e) {
      if (!menuOpen) return;
      if (ref.current && !ref.current.contains(e.target)) setMenuOpen(false);
    }
    function onEsc(e) { if (e.key === "Escape") setMenuOpen(false); }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [menuOpen]);

  // Editing Helper
  async function saveEdits() {
    const partial = {
      title,
      notes,
      priority: Number(prio) || 1,
      dueDate: dueStr ? fromInputDateLocal(dueStr) : null,
    };
    setOptimistic(prev => ({ ...(prev || {}), ...partial }));
    await onEdit?.(task._id, partial);
    setEditOpen(false);
  }

  const statusClasses = completed
    ? "text-emerald-700 border-emerald-500"
    : "text-amber-700 border-amber-500";

  // notes preview logic
  const notesPreview = (t.notes || "").trim();
  const notesSnippet = notesPreview ? (notesPreview.length > 40 ? notesPreview.slice(0, 37) + "…" : notesPreview) : "";

  return (
    <li
      ref={ref}
      className="list-none relative rounded-lg border-2 border-[#2F4858]/40 hover:border-[#2F4858]
                 bg-[#FAFAF0] px-3 py-2 overflow-hidden transition-colors duration-200 min-w-[150px]"
    >
      {/* HEADER */}
      <div className="flex items-center gap-3 min-w-0">
        <input
          type="checkbox"
          checked={completed}
          onChange={() => {
            const next = completed ? "pending" : "completed";
            setOptimistic(prev => ({ ...(prev || {}), status: next }));
            onToggle?.(task);
          }}
          className="w-[20px] h-[20px] accent-[#2F4858] flex-shrink-0 focus:outline-none focus:ring-0"
          aria-label="Toggle complete"
        />

        {/* small priority indicator */}
        <span
          className={`inline-block w-4 h-2 rounded-full ${pr.chipClass}`}
          title={`Priority: ${pr.label}`}
        />

        {/* Title and small preview of the notes*/}
        <div className={`min-w-0 flex-1 ${!stacked && !detailsOpen ? "truncate" : "break-words"}`}>
          <div
            className={`text-lg font-jua text-[#2F4858] ${completed ? "line-through opacity-50" : ""}`}
            title={t.title}
          >
            {t.title}
          </div>
          {notesSnippet && (
            <div
              className={`text-xs text-[#2F4858]/70 ${!stacked && !detailsOpen ? "truncate" : ""}`}
              title={notesPreview}
            >
              {notesSnippet}
            </div>
          )}
        </div>

        {/* due date indicator */}
        <span
          className={`text-xs border rounded-full px-2 py-0.5 whitespace-nowrap ${dueInfo.className}`}
          title={t.dueDate ? fmtDate(t.dueDate) : "No due date"}
        >
          {dueInfo.label}
        </span>

        {/* More details down arrow button */}
        <button
          onClick={() => setDetailsOpen(v => !v)}
          className="p-1 rounded border border-[#2F4858]/40 hover:bg-[#2F4858] hover:text-white
                     focus:outline-none focus:ring-0 transition-colors duration-200"
          aria-expanded={detailsOpen}
          title="Toggle details"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`transition-transform duration-200 ${detailsOpen ? "rotate-180" : ""}`}
          >
            <path d="M7 10l5 5 5-5H7z" />
          </svg>
        </button>

        {/* WIDE: Normal action buttons */}
        {!stacked && (
          <div className="ml-2 flex items-center gap-2 text-xs opacity-90 flex-shrink-0">
            <button
              onClick={() => setEditOpen(v => !v)}
              className="border-2 border-[#2F4858] rounded px-2 py-0.5 hover:bg-[#2F4858] hover:text-white focus:outline-none focus:ring-0 transition-colors duration-200"
            >
              edit
            </button>
            <button
              onClick={() => onDelete?.(task._id)}
              className="border-2 border-[#2F4858] rounded px-2 py-0.5 hover:bg-[#2F4858] hover:text-white focus:outline-none focus:ring-0 transition-colors duration-200"
            >
              delete
            </button>
          </div>
        )}

        {/* NARROW: hamburger */}
        {stacked && (
          <button
            aria-haspopup="true"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(v => !v)}
            className="p-1 rounded border border-[#2F4858]/40 hover:bg-[#2F4858] hover:text-white focus:outline-none focus:ring-0 transition-colors duration-200"
            title="Actions"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <rect x="4" y="7" width="16" height="2" rx="1" />
              <rect x="4" y="11" width="16" height="2" rx="1" />
              <rect x="4" y="15" width="16" height="2" rx="1" />
            </svg>
          </button>
        )}
      </div>

      {/* NARROW: Actions Dropdown */}
      {stacked && (
        <div className={`mt-2 pl-7 overflow-hidden transition-all duration-300 ease-out ${menuOpen ? "max-h-32 opacity-100" : "max-h-0 opacity-0 pointer-events-none"}`}>
          <div
            className="rounded-lg p-2 text-xs border border-[#2F4858]/40 text-[#2F4858] flex gap-2 justify-between items-center bg-white/60"
            onClick={(e) => e.stopPropagation()}
          >
            <div>Settings:</div>
            <div className="flex gap-2">
              <button
                onClick={() => { setMenuOpen(false); setEditOpen(true); }}
                className="border-2 border-[#2F4858] rounded px-2 py-1 hover:bg-[#2F4858] hover:text-white focus:outline-none focus:ring-0 transition-colors duration-200"
              >
                edit
              </button>
              <button
                onClick={() => { setMenuOpen(false); onDelete?.(task._id); }}
                className="border-2 border-[#2F4858] rounded px-2 py-1 hover:bg-[#2F4858] hover:text-white focus:outline-none focus:ring-0 transition-colors duration-200"
              >
                delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PANEL */}
      <div
        className={`transition-all duration-300 ease-out ${
          editOpen ? "max-h-[1000px] opacity-100 mt-3" : "max-h-0 opacity-0"
        } overflow-hidden pl-7`}
      >
        <div className="w-full overflow-x-auto">
          <div className="min-w-[420px] rounded-xl border border-[#2F4858]/20 bg-[#F7FAF7] shadow-sm p-4 text-sm text-[#2F4858] space-y-4">
            <div className="flex flex-col lg:flex-row gap-3">
              <label className="flex flex-col gap-1 flex-1 min-w-0">
                <span className="font-semibold">Title:</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full min-w-0 border-2 border-[#2F4858]/40 rounded-lg px-3 py-2 bg-white
                             focus:outline-none focus:ring-0 focus:border-[#2F4858]"
                />
              </label>

              <label className="flex flex-col gap-1 lg:w-60">
                <span className="font-semibold">Due:</span>
                <input
                  type="date"
                  value={dueStr}
                  onChange={(e) => setDueStr(e.target.value)}
                  className="w-full border-2 border-[#2F4858]/40 rounded-lg px-3 py-2 bg-white
                             focus:outline-none focus:ring-0 focus:border-[#2F4858]"
                />
              </label>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <span className="font-semibold">Priority:</span>
              <select
                value={prio}
                onChange={(e) => setPrio(Number(e.target.value))}
                className="border-2 border-[#2F4858]/40 rounded-full px-3 py-1.5 bg-white
                           focus:outline-none focus:ring-0 focus:border-[#2F4858]"
              >
                <option value={1}>Low</option>
                <option value={2}>Medium</option>
                <option value={3}>High</option>
              </select>
            </div>

            <div>
              <div className="font-semibold mb-1">Notes</div>
              <textarea
                rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
                className="w-full border-2 border-[#2F4858]/40 rounded-lg p-3 bg-white
                           focus:outline-none focus:ring-0 focus:border-[#2F4858]"/>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={saveEdits}
                className="inline-flex items-center justify-center gap-2
                           bg-[#2F4858] text-white border-2 border-[#2F4858]
                           rounded-lg px-4 py-2 shadow-sm transition
                           hover:bg-[#223845] active:scale-[0.98] focus:outline-none focus:ring-0"
              >
                ✓ Save
              </button>
              <button
                onClick={() => {
                  setEditOpen(false);
                  setTitle(t.title || "");
                  setNotes(t.notes || "");
                  setDueStr(toInputDateString(t.dueDate));
                  setPrio(Number(t.priority) || 1);
                }}
                className="inline-flex items-center justify-center gap-2  bg-white/80 text-[#2F4858] border-2 border-[#2F4858]
                             rounded-lg px-4 py-2 shadow-sm transition hover:bg-[#2F4858] hover:text-white active:scale-[0.98]
                             focus:outline-none focus:ring-0">
                ✕ Cancel
              </button>
            </div>
          </div>
        </div>

        <div className="w-full h-0 border-4 border-[#2F4858] rounded-lg opacity-70 pointer-events-none mt-3"></div>
      </div>

      {/* DETAILS PANEL */}
      <div className={`transition-all duration-300 ease-out ${detailsOpen && !editOpen ? "max-h-[1000px] opacity-100 mt-3" : "max-h-0 opacity-0"} overflow-hidden pl-7 text-sm text-[#2F4858]`}>
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs border ${statusClasses}`}>
              {t.status}
            </span>
            <span className="inline-flex items-center gap-2 text-xs bg-white/70 border border-[#2F4858]/20 rounded-full px-2 py-0.5">
              <span className={`inline-block w-3 h-2 rounded-full ${pr.chipClass}`} />
              {pr.label}
            </span>
          </div>

          <div className="text-xs opacity-80 flex flex-wrap gap-x-4 gap-y-1">
            <span>Due: {fmtDate(t.dueDate)}</span>
            <span>Created: {fmtDate(t.createdAt)}</span>
            {t.completedAt && <span>Completed: {fmtDate(t.completedAt)}</span>}
          </div>

          <div className="rounded-xl border border-[#2F4858]/20 bg-white/60 p-3">
            <div className="font-semibold mb-1">Notes:</div>
            <div className="whitespace-pre-wrap break-words">{t.notes?.trim() || "—"}</div>
          </div>

          {!!t.checklist?.length && (
            <div className="rounded-xl border border-[#2F4858]/20 bg-white/60 p-3">
              <div className="font-semibold mb-1">Checklist</div>
              <ul className="list-none space-y-1">
                {t.checklist.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 inline-block w-2 h-2 rounded-full bg-[#2F4858]" />
                    <span>{typeof c === "string" ? c : JSON.stringify(c)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="w-full h-0 border-4 border-[#2F4858] rounded-lg opacity-70 pointer-events-none"></div>
        </div>
      </div>
    </li>
  );
}
