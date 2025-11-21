import { useMemo, useState } from "react";
import TaskRow from "../components/TaskRow";
import WeeklyStreak from "../components/WeeklyStreak";
import { deriveStreakStats } from "../lib/streakUtils";
import {
  startOfDay,
  isSameDay,
  fmtMonthYear,
  fmtDayShort,
  toInputDateString,
  monthGrid,
  priorityDot,
} from "../lib/utils";

export default function Calendar({ tasks, onCreate, onEdit, onDelete, onToggle }) {
  // Month cursor (what month the grid shows) and day selection (what the right panel shows)
  const [cursor, setCursor] = useState(startOfDay(new Date()));
  const [selected, setSelected] = useState(startOfDay(new Date()));

  // Quick-add form state
  const [newTitle, setNewTitle] = useState("");
  const [newPrio, setNewPrio] = useState(1);
  const [newNotes, setNewNotes] = useState("");

  // Month grid
  const grid = useMemo(() => monthGrid(cursor), [cursor]);

  // Day panel list (due on the selected date) sorted by priority (high first)
  const dayTasks = useMemo(
    () =>
      tasks
        .filter((t) => t.dueDate && isSameDay(new Date(t.dueDate), selected))
        .sort((a, b) => (Number(b.priority) || 1) - (Number(a.priority) || 1)),
    [tasks, selected]
  );

  // Jump to previous/next month
  function gotoMonth(delta) {
    const n = new Date(cursor);
    n.setMonth(n.getMonth() + delta);
    setCursor(startOfDay(n));
  }

  // Jump back to today (resets both month cursor and selected day)
  function gotoToday() {
    const t = startOfDay(new Date());
    setCursor(t);
    setSelected(t);
  }

  // Quick add handler (delegates to parent onCreate)
  async function handleQuickAdd() {
    const title = newTitle.trim();
    if (!title) return;
    await onCreate({
      name: title,
      due_date: toInputDateString(selected),
      notes: newNotes.trim(),
      priority: newPrio,
    });
    setNewTitle("");
    setNewNotes("");
    setNewPrio(1);
  }

  return (
    <div className="flex h-full gap-6 px-6 py-4 font-jua text-[#2F4858]">
      {/* LEFT SIDE: Month grid */}
      <div className="w-[65%] min-w-[640px] flex flex-col gap-3">
        {/* Toolbar (month navigation + title) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => gotoMonth(-1)}
              className="border-2 border-[#2F4858]/40 rounded px-3 py-1 hover:bg-[#2F4858] hover:text-white"
              aria-label="Previous month"
            >
              ◀
            </button>
            <button
              onClick={gotoToday}
              className="border-2 border-[#2F4858]/40 rounded px-3 py-1 hover:bg-[#2F4858] hover:text-white"
            >
              Today
            </button>
            <button
              onClick={() => gotoMonth(1)}
              className="border-2 border-[#2F4858]/40 rounded px-3 py-1 hover:bg-[#2F4858] hover:text-white"
              aria-label="Next month"
            >
              ▶
            </button>
          </div>
          <div className="text-2xl">{fmtMonthYear(cursor)}</div>
          <div />
        </div>

        {/* Weekday header */}
        <div className="grid grid-cols-7 text-xs uppercase tracking-wide opacity-70 text-[#5A311F]">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="px-2 py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Month grid */}
        <div className="grid grid-cols-7 grid-rows-6 gap-2">
          {grid.map(({ date, inMonth }) => {
            const isSelected = isSameDay(date, selected);
            const dateStr = date.getDate();

            // Up to 3 tasks previewed inside each day box
            const dTasks = tasks
              .filter((t) => t.dueDate && isSameDay(new Date(t.dueDate), date))
              .slice(0, 3);

            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelected(startOfDay(date))}
                className={[
                  "relative rounded-lg border p-2 text-left transition-colors min-h-[90px] bg-[#FAFAF0]",
                  inMonth ? "border-[#2F4858]/30" : "border-[#2F4858]/10 opacity-70",
                  isSelected ? "ring-2 ring-[#2F4858]" : "hover:border-[#2F4858]",
                ].join(" ")}
              >
                {/* Date header (plus 'today' chip) */}
                <div className="flex items-center justify-between">
                  <span className="text-sm">{dateStr}</span>
                  {isSameDay(date, new Date()) && (
                    <span className="text-[10px] px-1 rounded bg-blue-500 text-white">today</span>
                  )}
                </div>

                {/* Task bullets */}
                <div className="mt-1 space-y-1">
                  {dTasks.map((t) => (
                    <div key={t._id} className="flex items-center gap-2 text-[11px] truncate">
                      <span className={`inline-block w-2 h-2 rounded-full ${priorityDot(t.priority)}`} />
                      <span className="truncate">{t.title || "Untitled"}</span>
                    </div>
                  ))}
                  {dTasks.length === 0 && (
                    <div className="text-[11px] opacity-50 italic">no tasks</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        <WeeklyStreak tasks={tasks} />
      </div>

      {/* RIGHT SIDE: Day panel*/}
      <div className="w-[35%] min-w-[320px] border-4 border-[#2F4858] rounded-xl p-4 bg-[#FAFAF0] flex flex-col gap-3">
        {/* Day heading */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl">Tasks on {fmtDayShort(selected)}</h2>
        </div>

        {/* Quick add form */}
        <div className="rounded-lg border border-[#2F4858]/20 bg-white/70 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Task title"
              className="flex-1 border-2 border-[#2F4858]/30 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-0 focus:border-[#2F4858]"
            />
            <button
              onClick={handleQuickAdd}
              className="border-2 border-[#2F4858] rounded-lg px-3 py-2 bg-[#2F4858] text-white hover:bg-[#223845]"
            >
              + Add
            </button>
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-sm opacity-80">Priority:</label>
            <select
              value={newPrio}
              onChange={(e) => setNewPrio(Number(e.target.value))}
              className="border-2 border-[#2F4858]/30 rounded-full px-2 py-1 bg-white focus:outline-none focus:ring-0 focus:border-[#2F4858]"
            >
              <option value={1}>Low</option>
              <option value={2}>Medium</option>
              <option value={3}>High</option>
            </select>

            <input
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="Notes"
              className="flex-1 border-2 border-[#2F4858]/30 rounded-lg px-3 py-1 bg-white focus:outline-none focus:ring-0 focus:border-[#2F4858]"
            />
          </div>
        </div>

        {/* Day list */}
        {dayTasks.length === 0 && (
          <div className="text-sm italic opacity-60">No tasks for this day yet.</div>
        )}
        {dayTasks.map((task) => (
          <div key={task._id} className="">
            <TaskRow
              task={task}
              onToggle={onToggle}
              onDelete={(id) => onDelete?.(id)}
              onEdit={(id, partial) => onEdit?.(id, partial)}
              stackAt={420}
            />
          </div>
        ))}

      </div>
    </div>
  );
}
