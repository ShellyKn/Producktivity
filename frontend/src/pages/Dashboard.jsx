import TaskColumn from "../components/TaskColumn";

export default function Dashboard({
  theTasks,
  setTheTasks,
  modalOpen,
  setModalOpen,
  }) 

  {
    const toggleTask = (column, index) => {
      const updated = { ...theTasks };
      updated[column] = [...updated[column]];
      updated[column][index].completed = !updated[column][index].completed;
      setTheTasks(updated);
    };
  
  return (
    
    <div className="flex flex-col gap-6 px-6 py-4">
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

      <div className="flex gap-6 font-jua text-[#2F4858]">
        <div className="w-[60%]">
          <div className="grid grid-cols-3 gap-6">
            <TaskColumn title="YESTERDAY" date="09/29/25" tasks={theTasks.yesterday} onToggle={(i) => toggleTask("yesterday", i)} />
            <TaskColumn title="TODAY" date="09/30/25" tasks={theTasks.today} onToggle={(i) => toggleTask("today", i)} />
            <TaskColumn title="TOMORROW" date="10/01/25" tasks={theTasks.tomorrow} onToggle={(i) => toggleTask("tomorrow", i)} />
          </div>
        </div>

        <div className="w-[5%] flex flex-col gap-4">
          </div>

        <div className="w-[35%] flex flex-col gap-4">
          <div className="border-4 border-[#2F4858] rounded-xl p-4">
            <h2 className="text-[30px] mb-2">Statistics</h2>
            <p className="text-[18px]">Tasks completed: 3</p>
            <p className="text-[18px]">Streak: 10 days</p>
            <p className="text-[18px]">Productivity level: 🦆</p>
          </div>
        </div>
      </div>
    </div>
  );
}
