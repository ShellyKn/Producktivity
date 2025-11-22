import { useEffect, useState } from "react";
import { toInputDateString as toInputDate, fromInputDateLocal as fromInputLocalNoon } from "../lib/utils";

/*
The foundational component for Producktivity.
This component renders all of the information for a provided task.

inputs:
task - JSON describing the details of the task
onToggle - function handler for when the task is toggled
onEdit - function handler for editing a task
onDelete - function handler for deleting a task
*/


function Task({ task, onToggle, onEdit, onDelete }) {
  const [title, setTitle] = useState(task.title || "");
  const [notes, setNotes] = useState(task.notes || "");
  const [due, setDue] = useState(toInputDate(task.dueDate));
  const [expanded, setExpanded] = useState(false);

  const completed = task.status === "completed";

  useEffect(() => {
    setTitle(task.title || "");
    setNotes(task.notes || "");
    setDue(toInputDate(task.dueDate));
  }, [task._id, task.title, task.notes, task.dueDate]);

  const save = async (partial) => {
    await onEdit(partial);
  };

  const toggleExpanded = () => setExpanded(v => !v);

  return (
    <div
      className={`p-2 my-2 font-jua text-[#2F4858] transition-all duration-200 cursor-pointer
        ${expanded ? "border-4 border-[#2F4858] rounded-xl bg-[#FAFAF0]" : ""}`}
      onClick={toggleExpanded}
    >
      {/* top row */}
      <div className="flex items-center gap-4">
        {/* checkbox */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className={`w-[30px] h-[30px] rounded-xl border-4 task-control
            ${completed ? "bg-[#2F4858] border-[#2F4858]" : "border-[#2F4858]"}`}
          title="Toggle complete"
        />

        {!expanded ? (
          <span
            className={`flex-1 text-lg select-none ${
              completed ? "line-through opacity-50" : ""
            }`}
          >
            {title || "Untitled task"}
          </span>
        ) : (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={(e) => {
              const prev = task.title || "";
              if (prev !== e.target.value) save({ title: e.target.value });
            }}
            className="flex-1 bg-[#FAFAF0] text-lg focus:outline-none focus:ring-0 task-control"
            onClick={(e) => e.stopPropagation()}
            autoFocus
          />
        )}

        {/* delete */}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="text-sm border-2 border-[#2F4858] rounded px-2 py-1 hover:bg-[#2F4858] hover:text-white task-control"
        >
          Delete
        </button>
      </div>

      {/* expanded fields */}
      {expanded && (
        <>
          <div className="mt-3 flex items-center gap-2">
            <label className="text-sm">Due:</label>
            <input
              type="date"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              onBlur={() => {
                const prev = toInputDate(task.dueDate);
                if (prev === due) return; // nothing changed → don't send
                save({ dueDate: due ? fromInputLocalNoon(due) : null });
              }}
              className="border-2 border-[#2F4858] rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-0 task-control"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <textarea
            rows="2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={() => {
              const prev = task.notes || "";
              if (prev !== notes) save({ notes });
            }}
            placeholder="Add notes..."
            className="mt-2 w-full border-2 border-[#2F4858] rounded-lg p-2 bg-white focus:outline-none focus:ring-0 task-control"
            onClick={(e) => e.stopPropagation()}
          />
        </>
      )}

      <div className="w-full h-0 border-4 border-[#2F4858] rounded-lg opacity-70 pointer-events-none mt-2"></div>
    </div>
  );
}

export default Task;
