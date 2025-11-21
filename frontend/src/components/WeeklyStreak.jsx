import { useMemo, useState } from "react";
import StreakDay from "./StreakDay";
import { startOfDay, getWeekDays, buildCompletedDaySet } from "../lib/utils";

export default function WeeklyStreak({ tasks }) {
  const [weekOffset, setWeekOffset] = useState(0); // 0 = this week, -1 = prev
  const todayTs = startOfDay(new Date()).getTime();

  const completedSet = useMemo(() => buildCompletedDaySet(tasks), [tasks]);
  const weekDays = useMemo(() => getWeekDays(weekOffset), [weekOffset]);

  return (
    <div className="relative w-full font-jua my-6">
      {/* Week Header and navigation buttons */}
      <div className="flex justify-between items-center mb-2">
        <p className="text-3xl">WEEKLY STREAK:</p>
        <div className="flex gap-2">
          <button
            onClick={() => setWeekOffset((o) => o - 1)}
            className="border-2 rounded px-3 py-1 hover:bg-[#2F4858] hover:text-white transition"
          >
            ◀
          </button>
          <button
            onClick={() => setWeekOffset((o) => Math.min(0, o + 1))}
            disabled={weekOffset === 0}
            className={`border-2 rounded px-3 py-1 transition ${
              weekOffset === 0
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-[#2F4858] hover:text-white"
            }`}
          >
            ▶
          </button>
        </div>
      </div>

      {/* line behind the circles */}
      <div className="relative w-full">
        <div className="border-4 border-[#2F4858] rounded-full w-full absolute top-[55%] z-0"></div>

        {/* streak days row */}
        <div className="flex justify-between gap-4 relative z-10">
          {weekDays.map((date) => {
            const ts = startOfDay(date).getTime();
            const isFuture = ts > todayTs;
            const wasActive = completedSet.has(ts);
            const label = date.toLocaleDateString(undefined, {
              weekday: "long",
            });

            return (
              <StreakDay
                key={ts}
                day={label}
                wasActive={wasActive && !isFuture}
                isFuture={isFuture}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
