import TaskLoader from "../components/TaskLoader.jsx";

export default function Profile({
  tasks,
  quote,
  streakDays = 10,
  setModalOpen,
  onToggle,
  onEdit,
  onDelete,    
}) {
  const numTasks = tasks.filter(t => t.status === "completed").length;

  return (
    <div className="font-jua w-full flex-1 flex text-[#2F4858]">
      {/* LEFT PANEL */}
      <div className="flex-1 py-5 px-10 flex flex-col gap-10 justify-between">
        <div className="flex-1 flex flex-col justify-between border-4 border-[#2F4858] rounded-lg items-center p-5">
          <h1 className="text-3xl">Profile</h1>
          <div className="flex flex-col items-center">
            <h1 className="text-[60px] text-[#2F4858]">{numTasks}</h1>
            <p className="text-lg">tasks done today</p>
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-[60px] text-[#2F4858]">{streakDays}-DAY</h1>
            <p className="text-lg">streak</p>
          </div>
          <button className="text-3xl" onClick={() => setModalOpen(true)}>
            See more!
          </button>
        </div>

        <div className="flex flex-col h-fit border-4 border-[#2F4858] rounded-lg items-center p-5">
          <h1 className="text-xl">{quote}</h1>
        </div>
      </div>

      {/* MIDDLE PANEL */}
      <div className="flex-none flex-col gap-4 py-5 px-10 w-1/2 overflow-y-visible">
        <div className="w-full flex justify-between items-center mb-1">
          <h1 className="text-[48px]">to-do today:</h1>
          <button
            className="border-4 border-[#2F4858] rounded-lg px-4 text-[24px]"
            onClick={() => setModalOpen(true)}
          >
            + add task
          </button>
        </div>
        <div className="overflow-scroll flex flex-col gap-2">
          <TaskLoader
            tasks={tasks}
            onToggle={(task) => onToggle(task)}
            onEdit={(taskId, partial) => onEdit(taskId, partial)}
            onDelete={(taskId) => onDelete(taskId)}
          />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-col flex-1 py-5 px-10">
        <h1 className="text-[48px]">leaderboard:</h1>
        <div className="flex-1 flex flex-col justify-between border-4 border-[#2F4858] rounded-lg items-center p-5">
          {/* placeholder list */}
          <h1 className="text-3xl underline mt-4">1st axaleaa</h1>
          <h1 className="text-3xl underline mt-4">2nd academicSam</h1>
          <h1 className="text-3xl underline mt-4">3rd prof_stur</h1>
          <h1 className="text-3xl underline mt-4">4th undrcvr_dUCK</h1>
          <h1 className="text-3xl underline mt-4">5th aChillGuy</h1>
          <h1 className="text-3xl underline mt-4">6th willy</h1>
        </div>
        <img src="art/duck.png" className="mt-4 w-1/2 m-auto" />
      </div>
    </div>
  );
}
