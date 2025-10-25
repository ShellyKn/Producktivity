import { useState } from "react";

function Task({ taskData, isBlankTask, theTasks, setTheTasks }) {
  const [taskName, setTaskName] = useState(taskData.name || "");
  const [dueDate, setDueDate] = useState(taskData.due_date || "");
  const [notes, setNotes] = useState(taskData.notes || "");
  const [completed, setCompleted] = useState(taskData.completed || false);
  const [isExpanded, setExpanded] = useState(false);

  const handleNewTask = (e) => {
    if (e.key === "Enter") {
      const value = e.target.value.trim();
      if (value !== "") {
        setTheTasks([
          ...theTasks,
          {
            name: value,
            due_date: "",
            notes: "",
            completed: false,
          }
        ]);
        setTaskName("");
      }
    }
  };

  const toggleComplete = () => {
    setCompleted(!completed);
  };

  const toggleExpand = () => {
    if (!isBlankTask) setExpanded((prev) => !prev);
  };

  return (
    <div
    className={`p-2 my-2 font-jua text-[#2F4858] transition-all duration-200 ${
        isExpanded ? "border-4 border-[#2F4858] rounded-xl bg-[#FAFAF0]" : ""
    }`}
    onClick={toggleExpand}
    >

      <div className="flex flex-col gap-4">
        {/* Top row: checkbox + title */}
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent toggle
              toggleComplete();
            }}
            className={`w-[30px] h-[30px] rounded-xl border-4 ${
              isBlankTask
                ? "border-dotted border-[#2F4858]"
                : completed
                ? "bg-green-500 border-[#2F4858]"
                : "border-[#2F4858]"
            }`}
          ></button>

          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            // onKeyDown={isBlankTask ? handleNewTask : undefined}
            onKeyDown={isBlankTask ? (e) => handleNewTask(e) : ""}
            placeholder={isBlankTask ? "Add a new task..." : ""}
            className="flex-1 bg-[#FAFAF0] text-lg focus:outline-none"
            onClick={(e) => e.stopPropagation()} // prevent toggle
          />
        </div>

        {/* Expanded section: deadline + notes */}
        {isExpanded && !isBlankTask && (
          <>
            <div className="flex items-center gap-2">
              <label className="text-sm">Due:</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="border-2 border-[#2F4858] rounded-lg px-2 py-1 bg-white"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes..."
              className="w-full border-2 border-[#2F4858] rounded-lg p-2 bg-white"
              onClick={(e) => e.stopPropagation()}
            />
          </>
        )}

        {/* Divider (always visible, not interactive) */}
        <div className="w-full h-0 border-4 border-[#2F4858] rounded-lg opacity-70 pointer-events-none"></div>
      </div>
    </div>
  );
}

export default Task;
