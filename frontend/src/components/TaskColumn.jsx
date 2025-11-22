import TaskRow from "./TaskRow";

/*
Component to render a series of tasks in a column.

inputs:
title - string describing the name of this column
date - Date time for this column
tasks - JSON array of the tasks for this column
onToggle - function handler for handling toggling a task
onDelete - function handler for handling deleting a task
onEdit - function handler for handling editing a task
*/

export default function TaskColumn({ title, date, tasks, onToggle, onDelete, onEdit}) {
  return (
    <div className="border-4 border-[#2F4858] rounded-xl  flex flex-col gap-4 bg-[#FAFAF0] font-jua text-[#2F4858] min-w-[300px]">
      <div className="flex justify-between border-b-4 border-[#2F4858] p-2">
        <h2 className="text-[28px]">{title}</h2>
        <p className="text-[16px] text-blue-500 p-1">{date}</p>
      </div>

      <ul className="flex flex-col gap-2 list-none p-2">
        {tasks.map((task) => (
          <TaskRow key={task._id} task={task} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit}/>
        ))}
      </ul>
    </div>
  );
}
