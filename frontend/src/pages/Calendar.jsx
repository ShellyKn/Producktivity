import { useMemo, useState } from "react";
import TaskRow from "../components/TaskRow";

// Takes in Date() object and creates a copy of it, strips it of the time to just get the day
function startOfDay(d) { 
    const x = new Date(d); 
    x.setHours(0,0,0,0); 
    return x; 
}

// Returns its two dates are the same regardless of the time
function isSameDay(a, b) { 
    return startOfDay(a).getTime() === startOfDay(b).getTime(); 
}

// Helper for formatting dates. Takes in d to make it a Date() object 
function fmt(d) {
  const x = new Date(d);
  return x.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

// Helper for formatting dates but for days
function fmtDay(d) {
  const x = new Date(d);
  return x.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "2-digit" });
}

// Conversion helper
function toInputDateString(d) {
  const x = new Date(d);
  const yyyy = x.getFullYear();
  const mm = String(x.getMonth() + 1).padStart(2, "0");
  const dd = String(x.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// returns 42 day boxes (6 weeks) with {date, inMonth}
function monthGrid(date) {
  const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const startWeekday = (firstOfMonth.getDay() + 6) % 7;
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

// Design for the priority 
function priorityDot(p) {
  const n = Number(p) || 1;
  if (n === 3) return "bg-red-500";
  if (n === 2) return "bg-amber-500";
  return "bg-emerald-500";
}


export default function Calendar({ tasks, onCreate, onEdit, onDelete, onToggle }) {
  const [cursor, setCursor] = useState(startOfDay(new Date())); //month we view
  const [selected, setSelected] = useState(startOfDay(new Date())); //day the panel shows
  const [newTitle, setNewTitle] = useState("");
  const [newPrio, setNewPrio] = useState(1);
  const [newNotes, setNewNotes] = useState("");
  const grid = useMemo(() => monthGrid(cursor), [cursor]);

  // Tasks that are displayed in the day list with high priority first
  const dayTasks = useMemo(() =>
    tasks
      .filter(t => t.dueDate && isSameDay(new Date(t.dueDate), selected))
      .sort((a,b) => (Number(b.priority)||1) - (Number(a.priority)||1)),
    [tasks, selected]
  );

  // Jump to this particular month
  function gotoMonth(delta) {
    const n = new Date(cursor);
    n.setMonth(n.getMonth() + delta);
    setCursor(startOfDay(n));
  }

  // Jump to this particular Day
  function gotoToday() {
    const t = startOfDay(new Date());
    setCursor(t);
    setSelected(t);
  }

// Function to handle creating a task -> (onCreate from ToDo)
  async function handleQuickAdd() {
    const title = newTitle.trim();
    if (!title) return;
    await onCreate({
      name: title,
      due_date: toInputDateString(selected),
      notes: newNotes.trim(),
      priority: newPrio
    });
    setNewTitle("");
    setNewNotes("");
    setNewPrio(1);
  }

  return (
    <div className="flex h-full gap-6 px-6 py-4 font-jua text-[#2F4858]">
      {/* LEFTSIDE: Month grid */}
      <div className="w-[65%] min-w-[640px] flex flex-col gap-3">
        {/* toolbar */}
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
              onClick={() => gotoToday()}
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
          <div className="text-2xl">{fmt(cursor)}</div>
          <div />
        </div>

        {/* weekday header */}
        <div className="grid grid-cols-7 text-xs uppercase tracking-wide opacity-70 text-[#5A311F]">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
            <div key={d} className="px-2 py-1">{d}</div>
          ))}
        </div>

        {/* grid -> created above, below will populate each one */}
        <div className="grid grid-cols-7 grid-rows-6 gap-2">
          {grid.map(({ date, inMonth }) => {
            const isSelected = isSameDay(date, selected);
            const dateStr = date.getDate();

            // Show up to 3 tasks in each box
            const dTasks = tasks
              .filter(t => t.dueDate && isSameDay(new Date(t.dueDate), date))
              .slice(0, 3);

            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelected(startOfDay(date))}
                className={[
                  "relative rounded-lg border p-2 text-left transition-colors min-h-[90px] bg-[#FAFAF0]",
                  inMonth ? "border-[#2F4858]/30" : "border-[#2F4858]/10 opacity-70",
                  isSelected ? "ring-2 ring-[#2F4858]" : "hover:border-[#2F4858]"
                ].join(" ")}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{dateStr}</span>
                  {/* Highlight the “today” label*/}
                  {isSameDay(date, new Date()) && (
                    <span className="text-[10px] px-1 rounded bg-blue-500 text-white">today</span>
                  )}
                </div>

                <div className="mt-1 space-y-1">
                  {dTasks.map(t => (
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
      </div>

      {/* RIGHT SIDE: Day panel */}
      <div className="w-[35%] min-w-[320px] border-4 border-[#2F4858] rounded-xl p-4 bg-[#FAFAF0] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl">Tasks on {fmtDay(selected)}</h2>
        </div>

        {/* Form: Add a task through the calendar */}
        <div className="rounded-lg border border-[#2F4858]/20 bg-white/70 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Task title"
              className="flex-1 border-2 border-[#2F4858]/30 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-0 focus:border-[#2F4858]"
            />
            <button onClick={handleQuickAdd} className="border-2 border-[#2F4858] rounded-lg px-3 py-2 bg-[#2F4858] text-white hover:bg-[#223845]">
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

        {/* day list: -> displays "No tasks" or the list of tasks due that day */}
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
