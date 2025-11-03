import { useEffect, useMemo, useRef, useState } from "react";
import TaskColumn from "../components/TaskColumn";
import StreakDay from "../components/StreakDay";
import PaginatedTaskBox from "../components/PaginatedTaskBox";

function startOfDay(d) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
function isSameDay(a, b) { return startOfDay(a).getTime() === startOfDay(b).getTime(); }
const fmt = (d) => {
  if (!d) return "—";
  const dd = new Date(d);
  if (isNaN(dd)) return "—";
  return dd.toLocaleDateString(undefined, { month: "2-digit", day: "2-digit", year: "2-digit" });
};

// Responsive version of the Columns view
function DayColumnsResponsive({ yTasks, tTasks, tmTasks, onToggleComplete, onDelete, onEdit, yDate, tDate, tmDate }) {
  const wrapRef = useRef(null);
  const [narrow, setNarrow] = useState(false);
  const [slide, setSlide] = useState(1); // For the carousel

  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setNarrow(entry.contentRect.width < 700);
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  // Slideshow view if screen gets too small
  const slides = useMemo(() => ([
    { title: "YESTERDAY", date: yDate, tasks: yTasks },
    { title: "TODAY",     date: tDate, tasks: tTasks },
    { title: "TOMORROW",  date: tmDate, tasks: tmTasks },
  ]), [yTasks, tTasks, tmTasks, yDate, tDate, tmDate]);

  // Normal columns view if screen is large 
  if (!narrow) {
    return (
      <div ref={wrapRef} className="grid grid-cols-3 gap-6">
        <TaskColumn title="YESTERDAY" date={yDate} tasks={yTasks} onToggle={onToggleComplete} onDelete={onDelete} onEdit={onEdit} />
        <TaskColumn title="TODAY"     date={tDate} tasks={tTasks}  onToggle={onToggleComplete} onDelete={onDelete} onEdit={onEdit} />
        <TaskColumn title="TOMORROW"  date={tmDate} tasks={tmTasks} onToggle={onToggleComplete} onDelete={onDelete} onEdit={onEdit} />
      </div>
    );
  }
 
  return (
    <div ref={wrapRef} className="relative">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setSlide(s => Math.max(0, s - 1))}
          disabled={slide === 0}
          className={`border-2 rounded px-3 py-1 ${slide > 0 ? "hover:bg-[#2F4858] hover:text-white" : "opacity-40 cursor-not-allowed"}`}
        >
          ◀
        </button>
        <div className="text-lg font-jua">{slides[slide].title}</div>
        <button
          onClick={() => setSlide(s => Math.min(2, s + 1))}
          disabled={slide === 2}
          className={`border-2 rounded px-3 py-1 ${slide < 2 ? "hover:bg-[#2F4858] hover:text-white" : "opacity-40 cursor-not-allowed"}`}
        >
          ▶
        </button>
      </div>

      <div className="overflow-hidden  rounded-xl">
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
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const tomorrow  = new Date(today);  tomorrow.setDate(today.getDate() + 1);

  // Datastructures to hold the current tasks
  const yTasks = [];
  const tTasks = [];
  const tmTasks = [];
  const past = [];
  const future = [];

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

  const yDate = fmt(yesterday);
  const tDate = fmt(today);
  const tmDate = fmt(tomorrow);

  return (
    <div className="flex flex-col gap-6 px-6 py-4 h-full">
      {/* Top section */}
      <div className="flex-0">
        <div className="flex justify-between items-center font-jua text-[#2F4858]">
          <div><p className="text-[50px]">WELCOME DUCKLING!</p></div>
          <button
            className="border-4 border-[#2F4858] rounded-lg px-4 py-1 text-[24px]"
            onClick={() => setModalOpen(true)}
          >
            + add task
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-h-0 overflow-y-auto mb-20">
        <div className="flex gap-6 font-jua text-[#2F4858]">
          <div className="w-[70%] min-w-0">
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

          <div className="w-[5%]" />

          <div className="w-[25%] flex flex-col gap-4">
            <div className="border-4 border-[#2F4858] rounded-xl p-4">
              <h2 className="text-[30px] mb-2">Statistics</h2>
              <p className="text-[18px]">Tasks completed: {tasks.filter(t => t.status === 'completed').length}</p>
              <p className="text-[18px]">Streak: 10 days</p>
              <p className="text-[18px]">Productivity level: 🦆</p>
            </div>
          </div>
        </div>

        {/* Weekly streak */}
        <div className="relative w-full font-jua mt-6">
          <p className="text-3xl">WEEKLY STREAK:</p>
          <div className="border-4 border-[#2F4858] rounded-full w-full absolute top-[65%] z-0"></div>
          <div className="flex justify-between gap-4">
            <StreakDay day="Sunday" wasActive={true} />
            <StreakDay day="Monday" wasActive={true} />
            <StreakDay day="Tuesday" wasActive={true} />
            <StreakDay day="Wednesday" wasActive={false} />
            <StreakDay day="Thursday" wasActive={false} />
            <StreakDay day="Friday" wasActive={false} />
            <StreakDay day="Saturday" wasActive={false} />
          </div>
        </div>

        {/* Past & Future */}
        <div className="grid grid-cols-2 gap-6 font-jua text-[#2F4858] mt-6">
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
      </div>
    </div>
  );
}
