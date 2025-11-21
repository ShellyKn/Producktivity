import { useEffect, useMemo, useRef, useState } from "react";
import TaskColumn from "../components/TaskColumn";
import PaginatedTaskBox from "../components/PaginatedTaskBox";
import WeeklyStreak from "../components/WeeklyStreak";
import { deriveStreakStats } from "../lib/streakUtils";
import { startOfDay, isSameDay, fmtDateMDY } from "../lib/utils";

// Responsive version of the Columns view
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
  const wrapRef = useRef(null);
  const [narrow, setNarrow] = useState(false);
  const [slide, setSlide] = useState(1);

  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setNarrow(entry.contentRect.width < 700);
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const slides = useMemo(
    () => [
      { title: "YESTERDAY", date: yDate, tasks: yTasks },
      { title: "TODAY", date: tDate, tasks: tTasks },
      { title: "TOMORROW", date: tmDate, tasks: tmTasks },
    ],
    [yTasks, tTasks, tmTasks, yDate, tDate, tmDate]
  );

  if (!narrow) {
    return (
      <div ref={wrapRef} className="grid grid-cols-3 gap-6">
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

  return (
    <div ref={wrapRef} className="relative">
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

// Main Dashboard page layout
export default function Dashboard({ tasks, onToggleComplete, setModalOpen, onDelete, onEdit }) {
  const today = startOfDay(new Date());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const yTasks = [];
  const tTasks = [];
  const tmTasks = [];
  const past = [];
  const future = [];

  const { current, best } = deriveStreakStats(tasks);

  for (const t of tasks) {
    const due = t.dueDate ? new Date(t.dueDate) : null;
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

  past.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
  future.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const yDate = fmtDateMDY(yesterday);
  const tDate = fmtDateMDY(today);
  const tmDate = fmtDateMDY(tomorrow);
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const overdueTasks = tasks.filter(t =>
    t.status !== "completed" &&
    t.dueDate &&
    new Date(t.dueDate) < today
  ).length;

  return (
    <div className="flex flex-col gap-6 px-6 py-4 h-full">
      {/* Top section */}
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

      {/* Main content */}
      <div className="flex-1 min-h-0 pb-24">
        <div className="flex gap-6 font-jua text-[#2F4858]">
          <div className="w-[73%] min-w-0">
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

          <div className="w-[2%]" />

          {/* Statistics card */}
              <div className="w-[25%] flex flex-col gap-4">
              <div className="border-4 border-[#2F4858] rounded-2xl p-4 bg-gradient-to-br from-[#FFF9E6] via-[#FAFAF0] to-[#F3F7FB] shadow-sm flex flex-col gap-4">
                {/* Header */}
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

                {/* Completion rate big number */}
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

                  {/* Progress bar */}
                  <div className="mt-2 w-full h-3 rounded-full bg-[#2F4858]/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#2F4858] transition-all"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>

                {/* Streak & productivity Indicators */}
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

                {/* Bottom row: overdue & pending */}
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


        {/* Weekly streak */}
        <WeeklyStreak tasks={tasks} />

        {/* Past & Future */}
        <div className="grid grid-cols-2 gap-6 font-jua text-[#2F4858] mt-10">
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
        <div className="pb-14"> </div>
      </div>
    </div>
  );
}
