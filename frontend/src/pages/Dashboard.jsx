// Dashboard: main page showing task columns, statistics, weekly streak, and past/future lists.
// Uses responsive columns (3-up on wide screens, swipeable/steppable on narrow).

import { useEffect, useMemo, useRef, useState } from "react";
import TaskColumn from "../components/TaskColumn";
import PaginatedTaskBox from "../components/PaginatedTaskBox";
import WeeklyStreak from "../components/WeeklyStreak";
import { deriveStreakStats } from "../lib/streakUtils";
import { startOfDay, isSameDay, fmtDateMDY } from "../lib/utils";

// -------------------------------------------------------------
// DayColumnsResponsive
// - Renders YESTERDAY / TODAY / TOMORROW task columns.
// - Wide viewport: a 3-column grid.
// - Narrow viewport: a single column with left/right navigation.
// -------------------------------------------------------------
function DayColumnsResponsive({
  yTasks,
  tTasks,
  tmTasks,
  onToggleComplete,
  onDelete,
  onEdit,
  yDate,
  tDate,
  tmDate,
}) {
  // DOM ref used to observe container width for responsive layout switching.
  const wrapRef = useRef(null);

  // If true, use the single-column slider UI; otherwise use 3-column grid.
  const [narrow, setNarrow] = useState(false);

  // Current slide index for the narrow mode (0=YESTERDAY, 1=TODAY, 2=TOMORROW).
  const [slide, setSlide] = useState(1);

  // Observe container width and toggle narrow mode when < 700px.
  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setNarrow(entry.contentRect.width < 700);
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  // Memoized slide definitions to avoid re-allocations on re-render.
  const slides = useMemo(
    () => [
      { title: "YESTERDAY", date: yDate, tasks: yTasks },
      { title: "TODAY", date: tDate, tasks: tTasks },
      { title: "TOMORROW", date: tmDate, tasks: tmTasks },
    ],
    [yTasks, tTasks, tmTasks, yDate, tDate, tmDate]
  );

  // Wide layout: render all three columns side-by-side.
  if (!narrow) {
    return (
      <div ref={wrapRef} className="w-full grid grid-cols-3 gap-6">
        <TaskColumn
          title="YESTERDAY"
          date={yDate}
          tasks={yTasks}
          onToggle={onToggleComplete}
          onDelete={onDelete}
          onEdit={onEdit}
        />
        <TaskColumn
          title="TODAY"
          date={tDate}
          tasks={tTasks}
          onToggle={onToggleComplete}
          onDelete={onDelete}
          onEdit={onEdit}
        />
        <TaskColumn
          title="TOMORROW"
          date={tmDate}
          tasks={tmTasks}
          onToggle={onToggleComplete}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      </div>
    );
  }

  // Narrow layout: single-column carousel with prev/next buttons.
  return (
    <div ref={wrapRef} className="relative">
      {/* Narrow-mode header with navigation */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setSlide((s) => Math.max(0, s - 1))}
          disabled={slide === 0}
          className={`border-2 rounded px-3 py-1 ${
            slide > 0 ? "hover:bg-[#2F4858] hover:text-white" : "opacity-40 cursor-not-allowed"
          }`}
        >
          ◀
        </button>
        <div className="text-lg font-jua">{slides[slide].title}</div>
        <button
          onClick={() => setSlide((s) => Math.min(2, s + 1))}
          disabled={slide === 2}
          className={`border-2 rounded px-3 py-1 ${
            slide < 2 ? "hover:bg-[#2F4858] hover:text-white" : "opacity-40 cursor-not-allowed"
          }`}
        >
          ▶
        </button>
      </div>

      {/* Sliding track (translateX by 0%, 100%, 200% depending on slide) */}
      <div className="overflow-hidden rounded-xl">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${slide * 100}%)` }}
        >
          {slides.map((s) => (
            <div key={s.title} className="w-full flex-shrink-0 pr-0">
              <TaskColumn
                title={s.title}
                date={s.date}
                tasks={s.tasks}
                onToggle={onToggleComplete}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Dashboard (default export)
// - Splits tasks by day bucket (yesterday/today/tomorrow/past/future).
// - Shows a statistics card (completion rate, streak, overdue, etc.).
// - Renders WeeklyStreak and paginated Past/Future lists.
// ------------------------------------------------------------------
export default function Dashboard({ tasks, onToggleComplete, setModalOpen, onDelete, onEdit }) {
  const today = startOfDay(new Date());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Buckets for display
  const yTasks = [];
  const tTasks = [];
  const tmTasks = [];
  const past = [];
  const future = [];

  // Compute current and best streaks from task completion data.
  const { current, best } = deriveStreakStats(tasks);

  // Partition each task into yesterday/today/tomorrow/past/future buckets.
  for (const t of tasks) {
    const due = t.dueDate ? new Date(t.dueDate) : null;

    // No due date -> treat as today for main columns.
    if (!due || isSameDay(due, today)) {
      tTasks.push(t);
    } else if (isSameDay(due, yesterday)) {
      yTasks.push(t);
    } else if (isSameDay(due, tomorrow)) {
      tmTasks.push(t);
    } else if (due < yesterday) {
      past.push(t);
    } else if (due > tomorrow) {
      future.push(t);
    }
  }

  // Sort past (newest first) and future (soonest first) for readability.
  past.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
  future.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  // Preformatted dates for column headers.
  const yDate = fmtDateMDY(yesterday);
  const tDate = fmtDateMDY(today);
  const tmDate = fmtDateMDY(tomorrow);

  // Simple stats for the right-hand panel.
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Overdue = not completed and due date strictly before today.
  const overdueTasks = tasks.filter(t =>
    t.status !== "completed" &&
    t.dueDate &&
    new Date(t.dueDate) < today
  ).length;

  return (
    <div className="flex flex-col gap-6 px-4 md:px-6 py-4 h-full">
      {/* Top section: page title + quick add button */}
      <div className="flex-0">
        <div className="flex justify-between items-center font-jua text-[#2F4858]">
          <div>
            <p className="text-[50px]">WELCOME DUCKLING!</p>
          </div>
          <button
            className="border-4 border-[#2F4858] rounded-lg px-4 py-1 text-[24px]"
            onClick={() => setModalOpen(true)}
          >
            + add task
          </button>
        </div>
      </div>

      {/* Main content row: responsive columns + stats card */}
      <div className="flex-1 min-h-0 pb-24">
        <div className="flex flex-col md:flex-row gap-6 font-jua text-[#2F4858]">
          {/* Columns (Y / T / Tm) */}
          <div className="w-full md:w-[73%] min-w-0 order-1">
            <DayColumnsResponsive
              yTasks={yTasks}
              tTasks={tTasks}
              tmTasks={tmTasks}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onEdit={onEdit}
              yDate={yDate}
              tDate={tDate}
              tmDate={tmDate}
            />
          </div>

          <div className="hidden md:block w-[2%]" />

          {/* Right: Statistics card */}
          <div className="w-full md:w-[25%] min-w-0 flex flex-col gap-4 order-2">
            <div className="border-4 border-[#2F4858] rounded-2xl p-4 bg-gradient-to-br from-[#FFF9E6] via-[#FAFAF0] to-[#F3F7FB] shadow-sm flex flex-col gap-4">
              {/* Stats header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[26px] leading-tight">Statistics</h2>
                  <p className="text-xs uppercase tracking-widest opacity-60">
                    getting it duck duck done
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-[#2F4858] flex items-center justify-center text-xl text-white">
                  📊
                </div>
              </div>

              {/* Completion rate */}
              <div>
                <p className="text-xs uppercase tracking-widest opacity-60 mb-1">
                  completion rate
                </p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-semibold">{completionRate}%</span>
                  <span className="text-xs opacity-70 mb-1">
                    {completedTasks} of {totalTasks || 0} tasks
                  </span>
                </div>

                {/* Progress bar (visual indicator of completionRate) */}
                <div className="mt-2 w-full h-3 rounded-full bg-[#2F4858]/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#2F4858] transition-all"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>

              {/* Streak + productivity "mood" */}
              <div className="grid grid-cols-2 gap-3 mt-1">
                <div className="rounded-xl border border-[#2F4858]/30 bg-white/80 px-3 py-2 flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-widest opacity-60">
                    current streak
                  </span>
                  <span className="text-2xl leading-none">
                    {current}
                    <span className="text-xs ml-1">days</span>
                  </span>
                  <span className="text-[10px] opacity-70">
                    best: {best} day{best === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="rounded-xl border border-[#2F4858]/30 bg-white/80 px-3 py-2 flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-widest opacity-60">
                    duck energy
                  </span>
                  <span className="text-2xl leading-none">
                    {completionRate >= 80 ? "🔥" : completionRate >= 40 ? "😌" : "😖"}
                  </span>
                  <span className="text-[10px] opacity-70">
                    {completionRate >= 80
                      ? "ducktastic!"
                      : completionRate >= 40
                      ? "solid paddling"
                      : "oh duck"}
                  </span>
                </div>
              </div>

              {/* Overdue + pending summary */}
              <div className="mt-1 rounded-xl border border-[#2F4858]/20 bg-white/70 px-3 py-2 flex items-center justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-widest opacity-60">
                    overdue
                  </span>
                  <span className="text-lg">
                    {overdueTasks}
                    <span className="text-xs ml-1 opacity-70">tasks</span>
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs uppercase tracking-widest opacity-60">
                    still to do
                  </span>
                  <span className="text-lg">
                    {pendingTasks}
                    <span className="text-xs ml-1 opacity-70">open</span>
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Weekly streak timeline (7-day view with nav between weeks) */}
        <div className="origin-top-left scale-[0.97] md:scale-100">
          <WeeklyStreak tasks={tasks} />
        </div>

        {/* Past & Future lists (paginated for long sets) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 font-jua text-[#2F4858] mt-8 md:mt-10">
          <PaginatedTaskBox
            title="PAST"
            tasks={past}
            onToggle={onToggleComplete}
            onDelete={onDelete}
            onEdit={onEdit}
          />
          <PaginatedTaskBox
            title="FUTURE"
            tasks={future}
            onToggle={onToggleComplete}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </div>

        {/* Spacer so content doesn't collide with page footer */}
        <div className="pb-14"> </div>
      </div>
    </div>
  );
}
