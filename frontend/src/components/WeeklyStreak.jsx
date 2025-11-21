// WeeklyStreak will contain a series of 7 StreakDays.
// It will deal with any logic changes and updates to the tasks. 

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
      <div className="flex items-center justify-between mb-2">
        <p className="text-xl md:text-3xl">WEEKLY STREAK:</p>
        <div className="flex gap-2">
          {/* Move one week back */}
          <button
            onClick={() => setWeekOffset((o) => o - 1)}
            className="border-2 rounded px-2 md:px-3 py-1 text-sm md:text-base hover:bg-[#2F4858] hover:text-white transition"
          >
            ◀
          </button>

          {/* Move one week forward, but not beyond the current week */}
          <button
            onClick={() => setWeekOffset((o) => Math.min(0, o + 1))}
            disabled={weekOffset === 0}
            className={`border-2 rounded px-2 md:px-3 py-1 text-sm md:text-base transition ${
              weekOffset === 0
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-[#2F4858] hover:text-white"
            }`}
          >
            ▶
          </button>
        </div>
      </div>

      {/* Decorative line: keep on md+, hide on small (layout changes to grid) */}
      <div className="relative w-full">
        <div className="hidden md:block border-4 border-[#2F4858] rounded-full w-full absolute top-[55%] z-0"></div>

        {/* Days:
            - md+: keep original single row
            - <md: use a compact 2-row grid (4 + 3) so all 7 fit without squishing */}
        <div className="
          relative z-10
          grid grid-cols-4 gap-2
          md:flex md:justify-between md:gap-4
        ">
          {weekDays.map((date, idx) => {
            const ts = startOfDay(date).getTime();
            const isFuture = ts > todayTs;
            const wasActive = completedSet.has(ts);

            const fullLabel = date.toLocaleDateString(undefined, { weekday: "long" });
            const shortLabel = date.toLocaleDateString(undefined, { weekday: "short" });

            // On small screens, we want 4 on the first row and 3 on the second row.
            // This places the last 3 items on the 2nd row nicely when <md.
            const smallGridPos = idx >= 4 ? "col-span-1 col-start-auto" : "col-span-1";

            return (
              <div key={ts} className={`md:flex-1 ${smallGridPos}`}>
                <StreakDay
                  day={fullLabel}
                  dayShort={shortLabel}
                  wasActive={wasActive && !isFuture}
                  isFuture={isFuture}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
