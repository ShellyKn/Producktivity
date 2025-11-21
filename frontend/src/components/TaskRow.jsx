import { useEffect, useMemo, useRef, useState } from "react";
import { fmtDate, toInputDateString, fromInputDateLocal, priorityMeta, dueMeta } from "../lib/utils";

export default function TaskRow({ task, onToggle, onDelete, onEdit, stackAt = 560 }) {
  const ref = useRef(null);

  // Responsive/UI state
  const [stacked, setStacked] = useState(false);         // switches to compact actions on narrow widths
  const [detailsOpen, setDetailsOpen] = useState(false); // expands read-only details panel
  const [menuOpen, setMenuOpen] = useState(false);       // mobile hamburger menu open/close
  const [editOpen, setEditOpen] = useState(false);       // edit form panel open/close

  // Draft fields for edit mode
  const [title, setTitle] = useState(task.title || "");
  const [notes, setNotes] = useState(task.notes || "");
  const [dueStr, setDueStr] = useState(toInputDateString(task.dueDate)); // yyyy-mm-dd input
  const [prio, setPrio] = useState(Number(task.priority) || 1);

  // Optimistic edits tracked here before server roundtrip
  const [optimistic, setOptimistic] = useState(null);

  // Reset local drafts whenever a different task instance arrives
  useEffect(() => {
    setTitle(task.title || "");
    setNotes(task.notes || "");
    setDueStr(toInputDateString(task.dueDate));
    setPrio(Number(task.priority) || 1);
    setOptimistic(null);
  }, [task._id, task.title, task.notes, task.dueDate, task.priority]);

  // Merge optimistic fields over the authoritative task object
  const t = useMemo(() => {
    if (!optimistic) return task;
    const merged = { ...task };
    for (const [k, v] of Object.entries(optimistic)) {
      if (v !== undefined) merged[k] = v;
    }
    return merged;
  }, [task, optimistic]);

  // Derived presentation metadata
  const completed = t.status === "completed";
  const pr = priorityMeta(t.priority);                              // {label, chipClass}
  const dueInfo = dueMeta(t.dueDate ? new Date(t.dueDate) : null);  // {label, className}

  // Track width and flip into "stacked" mode under a threshold
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setStacked(entry.contentRect.width < stackAt);
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [stackAt]);

  // Close action menu when clicking outside or pressing Escape
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

  // Persist edits to parent; apply optimistic UI first
  async function saveEdits() {
    const partial = {
      title,
      notes,
      priority: Number(prio) || 1,
      dueDate: dueStr ? fromInputDateLocal(dueStr) : null, // yyyy-mm-dd -> local noon Date
    };
    setOptimistic(prev => ({ ...(prev || {}), ...partial }));
    await onEdit?.(task._id, partial);
    setEditOpen(false);
  }

  // Badge color for status (completed vs pending)
  const statusClasses = completed
    ? "text-emerald-700 border-emerald-500"
    : "text-amber-700 border-amber-500";

  // Notes preview (single-line)
  const notesPreview = (t.notes || "").trim();
  const notesSnippet = notesPreview
    ? (notesPreview.length > 40 ? notesPreview.slice(0, 37) + "…" : notesPreview)
    : "";

  return (
    <li
      ref={ref}
      className="list-none relative rounded-lg border-2 border-[#2F4858]/40 hover:border-[#2F4858]
                 bg-[#FAFAF0] px-3 py-2 overflow-hidden transition-colors duration-200 min-w-[150px]"
    >
      {/* HEADER ROW */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Completion checkbox (optimistic flip of status) */}
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

        {/* Priority indicator chip */}
        <span
          className={`inline-block w-4 h-2 rounded-full ${pr.chipClass}`}
          title={`Priority: ${pr.label}`}
        />

        {/* Title + (optional) one-line notes snippet */}
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

        {/* Due date badge */}
        <span
          className={`text-xs border rounded-full px-2 py-0.5 whitespace-nowrap ${dueInfo.className}`}
          title={t.dueDate ? fmtDate(t.dueDate) : "No due date"}
        >
          {dueInfo.label}
        </span>

        {/* Expand/collapse details */}
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

        {/* WIDE ACTIONS (edit/delete) */}
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

        {/* NARROW ACTIONS (hamburger) */}
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

      {/* NARROW: dropdown actions */}
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
            {/* Title + Due inputs */}
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

            {/* Priority select */}
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

            {/* Notes textarea */}
            <div>
              <div className="font-semibold mb-1">Notes</div>
              <textarea
                rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
                className="w-full border-2 border-[#2F4858]/40 rounded-lg p-3 bg-white
                           focus:outline-none focus:ring-0 focus:border-[#2F4858]"/>
            </div>

            {/* Save / Cancel */}
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
                className="inline-flex items-center justify-center gap-2  bg:white/80 text-[#2F4858] border-2 border-[#2F4858]
                             rounded-lg px-4 py-2 shadow-sm transition hover:bg-[#2F4858] hover:text-white active:scale-[0.98]
                             focus:outline-none focus:ring-0">
                ✕ Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-0 border-4 border-[#2F4858] rounded-lg opacity-70 pointer-events-none mt-3"></div>
      </div>

      {/* DETAILS */}
      <div className={`transition-all duration-300 ease-out ${detailsOpen && !editOpen ? "max-h-[1000px] opacity-100 mt-3" : "max-h-0 opacity-0"} overflow-hidden pl-7 text-sm text-[#2F4858]`}>
        <div className="space-y-3">
          {/* Status + Priority badges */}
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs border ${statusClasses}`}>
              {t.status}
            </span>
            <span className="inline-flex items-center gap-2 text-xs bg:white/70 border border-[#2F4858]/20 rounded-full px-2 py-0.5">
              <span className={`inline-block w-3 h-2 rounded-full ${pr.chipClass}`} />
              {pr.label}
            </span>
          </div>

          {/* Timestamps */}
          <div className="text-xs opacity-80 flex flex-wrap gap-x-4 gap-y-1">
            <span>Due: {fmtDate(t.dueDate)}</span>
            <span>Created: {fmtDate(t.createdAt)}</span>
            {t.completedAt && <span>Completed: {fmtDate(t.completedAt)}</span>}
          </div>

          {/* Notes block */}
          <div className="rounded-xl border border-[#2F4858]/20 bg-white/60 p-3">
            <div className="font-semibold mb-1">Notes:</div>
            <div className="whitespace-pre-wrap break-words">{t.notes?.trim() || "—"}</div>
          </div>

          {/* Optional checklist */}
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

          {/* Divider */}
          <div className="w-full h-0 border-4 border-[#2F4858] rounded-lg opacity-70 pointer-events-none"></div>
        </div>
      </div>
    </li>
  );
}
