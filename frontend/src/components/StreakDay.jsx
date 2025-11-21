// StreakDay component refers to a singular day of a week for that streak cycle.
// In the UI, it will appear as a "circle", with either a green color for 
// a streak active, otherwise it will be uncolored. 
export default function StreakDay({ day, dayShort, wasActive, isFuture }) {
  // active day = green fill
  const activeClasses = "border-4 border-[#9cc78b] bg-[#BDECAA]";
  // future day = dashed border
  const futureClasses = "border-4 border-[#2F4858] border-dashed bg-[#FAFAF0]";
  // past but inactive day = solid border, no fill
  const pastMissedClasses = "border-4 border-[#2F4858] bg-[#FAFAF0]";

  const circleClasses = wasActive
    ? activeClasses
    : isFuture
    ? futureClasses
    : pastMissedClasses;

  return (
    <div className="flex flex-col items-center gap-1 md:gap-0">
      {/* Full weekday on md+, short label on small */}
      <h1 className="hidden md:block text-center">{day}</h1>
      <h1 className="md:hidden text-center text-xs uppercase tracking-wide">{dayShort}</h1>

      <div
        className={`${circleClasses} rounded-full
                    h-16 w-16 md:h-[100px] md:w-[100px]
                    m-auto md:m-0 text-2xl text-center`}
      />
    </div>
  );
}
