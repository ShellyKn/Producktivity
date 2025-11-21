import { useMemo, useState } from "react";
import StreakDay from "./StreakDay";
import { startOfDay, getWeekDays, buildCompletedDaySet } from "../lib/utils";

export default function WeeklyStreak({ tasks }) {
  // 0 = current week, -1 = previous week, +1 = next week
  const [weekOffset, setWeekOffset] = useState(0);
  // Cache "today at 00:00" for quick comparisons
  const todayTs = startOfDay(new Date()).getTime();

  // Build a Set of day-start timestamps that had at least one completed task
  const completedSet = useMemo(() => buildCompletedDaySet(tasks), [tasks]);

  // 7 Date objects representing the visible week, derived from offset
  const weekDays = useMemo(() => getWeekDays(weekOffset), [weekOffset]);

  return (
    <div className="relative w-full font-jua my-6">
      {/* Header with prev/next week navigation */}
      <div className="flex justify-between items-center mb-2">
        <p className="text-3xl">WEEKLY STREAK:</p>
        <div className="flex gap-2">
          {/* Move one week back */}
          <button
            onClick={() => setWeekOffset((o) => o - 1)}
            className="border-2 rounded px-3 py-1 hover:bg-[#2F4858] hover:text-white transition"
          >
            ◀
          </button>

          {/* Move one week forward, but not beyond the current week */}
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

      {/* Decorative line running behind the day circles */}
      <div className="relative w-full">
        <div className="border-4 border-[#2F4858] rounded-full w-full absolute top-[55%] z-0"></div>

        {/* 7-day row of streak indicators */}
        <div className="flex justify-between gap-4 relative z-10">
          {weekDays.map((date) => {
            const ts = startOfDay(date).getTime();
            const isFuture = ts > todayTs;               // do not mark completed in the future
            const wasActive = completedSet.has(ts);      // completed at least one task that day

            // Weekday label
            const label = date.toLocaleDateString(undefined, {
              weekday: "long",
            });

            return (
              <StreakDay
                key={ts}
                day={label}
                // Only show active if day is not in the future
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
