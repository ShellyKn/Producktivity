import { useState } from "react";
import TaskLoader from "../components/TaskLoader.jsx";

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function isSameDay(a, b) {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

const today = startOfDay(new Date());

const filters = Object.freeze({
    PRIORITY: "Priority",
    DATE: "Date",
});

export default function Profile({
  tasks,
  quote,
  streakDays = 10,
  setModalOpen,
  onToggle,
  onEdit,
  onDelete,
}) {
  const numTasks = tasks.filter((t) => t.status === "completed").length;

  // const [todaysTasks, setTodaysTasks] = useState(tasks);

  const [todaysTasks, setTodaysTasks] = useState(tasks);

  const [filter, setFilter] = useState(filters.PRIORITY);

  function toggleFilter() {
    if (filter == filters.PRIORITY) {
      setFilter(filters.DATE)
      setTodaysTasks(tasks.toSorted(function(taskA, taskB){return new Date(taskA.dueDate) - new Date(taskB.dueDate)}))
    } else {
      setFilter(filters.PRIORITY)
      setTodaysTasks(tasks.toSorted(function(taskA, taskB){return taskB.priority - taskA.priority}))
    }
  }

  // FILTER LOGIC HERE TO CHANGE: Currently filters by just the day which can be one filter
  // Go to the bottom where it uses "TaskLoader", and change which array of tasks is being sent in

  return (
    <div className="font-jua w-full flex-1 flex text-[#2F4858] bg-[#FAFAF0] px-8 py-6 gap-8">
      {/* LEFT PANEL */}
      <div className="w-[28%] flex flex-col gap-6">
        {/* Profile card */}
        <div className="relative border-4 border-[#2F4858] rounded-2xl p-5 bg-gradient-to-br from-[#FFF9E6] via-[#FAFAF0] to-[#F3F7FB] overflow-hidden">
          {/* content */}
          <div className="relative flex flex-col gap-5">
            {/* User and basic info */}
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-[#2F4858] flex items-center justify-center text-3xl shadow-lg">
                🦆
              </div>
              <div>
                <p className="text-sm uppercase tracking-widest opacity-70">
                  Duckling profile
                </p>
                <h1 className="text-3xl leading-tight">You, the overachiever</h1>
              </div>
            </div>

            {/* stats chips */}
            <div className="grid grid-cols-2 gap-3 mt-1">
              <div className="rounded-xl border-2 border-[#2F4858]/40 bg-white/70 px-3 py-2 flex flex-col items-center">
                <span className="text-xs uppercase opacity-70">Tasks done</span>
                <span className="text-3xl leading-none mt-1">{numTasks}</span>
                <span className="text-xs opacity-70 mt-1">today</span>
              </div>
              <div className="rounded-xl border-2 border-[#2F4858]/40 bg-white/70 px-3 py-2 flex flex-col items-center">
                <span className="text-xs uppercase opacity-70">Streak</span>
                <span className="text-3xl leading-none mt-1">
                  {streakDays}
                  <span className="text-base ml-1">days</span>
                </span>
                <span className="text-xs opacity-70 mt-1">keep it going!</span>
              </div>
            </div>

            {/* streak “progress” dots */}
            <div className="mt-1">
              <p className="text-xs uppercase opacity-70 mb-1">
                Weekly quack streak
              </p>
              <div className="flex gap-1.5">
                {Array.from({ length: 7 }).map((_, i) => {
                  const active = i < Math.min(streakDays, 7);
                  return (
                    <div
                      key={i}
                      className={[
                        "flex-1 h-2 rounded-full",
                        active ? "bg-[#2F4858]" : "bg-[#2F4858]/15",
                      ].join(" ")}
                    />
                  );
                })}
              </div>
            </div>

            <button
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#2F4858] px-4 py-2 text-lg bg-white/80 hover:bg-[#2F4858] hover:text-white transition-colors"
              onClick={() => setModalOpen(true)}
            >
              See more stats
              <span className="inline-block">↗</span>
            </button>
          </div>
        </div>

        {/* quote card */}
        <div className="border-4 border-[#2F4858] rounded-2xl p-4 bg-white/80 relative overflow-hidden">
          <div className="absolute -top-3 -left-3 text-5xl opacity-10 select-none">
            “
          </div>
          <p className="text-sm uppercase tracking-widest opacity-70 mb-1">
            Daily quack
          </p>
          <p className="text-xl leading-snug">{quote}</p>
        </div>
      </div>

      {/* MIDDLE PANEL*/}
      <div className="w-[44%] flex flex-col gap-4 py-2">
        <div className="w-full flex justify-between items-center mb-1">
          {/* Title of middle panel */}
          <div>
            <h1 className="text-[38px] leading-none">To-do:</h1>
            <p className="text-sm opacity-70 mt-1">
              Tackle your ducklist one task at a time.
            </p>
          </div>

          {/* Filtering button */}
          <button 
            className="border-4 border-[#2F4858] rounded-xl px-4 py-1.5 text-[20px]
             hover:bg-[#2F4858] hover:text-white transition-colors"
            onClick={() => toggleFilter()}
          >
            Filtered by: {filter}
          </button>

          {/* Adding a task button */}
          <button
            className="border-4 border-[#2F4858] rounded-xl px-4 py-1.5 text-[20px] 
            hover:bg-[#2F4858] hover:text-white transition-colors"
            onClick={() => setModalOpen(true)}
          >
            + add task
          </button>
        </div>

        <div className="flex-1 gap-1 overflow-y-auto ">
          <TaskLoader className="mb-1"
            tasks={todaysTasks}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-[28%] flex flex-col gap-4 py-2">
        <div className="border-4 border-[#2F4858] rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[32px] leading-none">leaderboard</h1>
              <p className="text-xs uppercase tracking-widest opacity-70 mt-1">
                this week&apos;s most productive ducks
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-[#2F4858] flex items-center justify-center text-xl text-white">
              🏆
            </div>
          </div>

          <div className="mt-2 space-y-2">
            {/* Ranks: fake data at the moment*/}
            <LeaderboardRow rank={1} name="axaleaa" points={96} accent="gold" />
            <LeaderboardRow rank={2} name="academicSam" points={88} accent="silver" />
            <LeaderboardRow rank={3} name="prof_stur" points={82} accent="bronze" />
            <LeaderboardRow rank={4} name="undrcvr_dUCK" points={70} />
            <LeaderboardRow rank={5} name="aChillGuy" points={64} />
            <LeaderboardRow rank={6} name="willy" points={58} />
          </div>

          <p className="text-xs opacity-70 mt-2">
            Finish more tasks to climb the pond rankings 🦆
          </p>
        </div>

        <div className="flex justify-center">
          <img src="art/duck.png" className="w-1/2 max-w-[140px]" />
        </div>
      </div>
    </div>
  );
}

// Small sub-component for leaderboard rows
function LeaderboardRow({ rank, name, points, accent }) {
  let badgeBg = "bg-[#2F4858]";
  if (accent === "gold") badgeBg = "bg-yellow-200";
  if (accent === "silver") badgeBg = "bg-slate-200";
  if (accent === "bronze") badgeBg = "bg-amber-500";

  // Fake data, use points for now (0–100)
  const width = Math.max(10, Math.min(points, 100));

  return (
    <div className="rounded-xl border border-[#2F4858]/20 bg-[#FAFAF0] px-3 py-2 flex flex-col gap-1">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`h-7 w-7 rounded-full flex items-center justify-center text-xs text-white ${badgeBg}`}
          >
            {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`}
          </div>
          <span className="truncate text-sm">{name}</span>
        </div>
        <span className="text-xs opacity-70">{points} pts</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-[#2F4858]/10 overflow-hidden">
        <div
          className="h-full bg-[#2F4858] rounded-full"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
