function StreakDay({ day, wasActive, isFuture }) {
  // active day = green fill
  const activeClasses =
    "border-4 border-[#9cc78b] bg-[#BDECAA]";

  // future day = dashed border
  const futureClasses =
    "border-4 border-[#2F4858] border-dashed bg-[#FAFAF0]";

  // past but inactive day = solid border, no fill
  const pastMissedClasses =
    "border-4 border-[#2F4858] bg-[#FAFAF0]";

  let circleClasses;
  if (wasActive) circleClasses = activeClasses;
  else if (isFuture) circleClasses = futureClasses;
  else circleClasses = pastMissedClasses;

  return (
    <div className="flex justify-center flex-col h-full w-1/6 rounded-3xl gap-0 z-10">
      <h1 className="text-center">{day}</h1>
      <div
        className={`${circleClasses} rounded-full h-[100px] w-[100px] m-auto text-2xl text-center`}
      />
    </div>
  );
}

export default StreakDay;
