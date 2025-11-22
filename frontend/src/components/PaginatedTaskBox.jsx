import { useMemo, useState } from "react";
import TaskRow from "./TaskRow";

/*
Carousel for a task box.

inputs:
title - string of the title for the component to render
tasks - JSON array of the tasks for this task box
onToggle - function handler for toggling the task box
onDelete - function handler for deleting a task
onEdit - function handler for editing a task
pageSize - integer for the number of allowed pages (5 by default)
*/
export default function PaginatedTaskBox({
  title,
  tasks,
  onToggle, 
  onDelete, 
  onEdit,
  pageSize = 5,
}) {
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(tasks.length / pageSize));
  const pageTasks = useMemo(() => {
    const start = page * pageSize;
    return tasks.slice(start, start + pageSize);
  }, [tasks, page, pageSize]);

  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  return (
    <div className="border-4 border-[#2F4858] rounded-xl p-4 bg-[#FAFAF0] font-jua text-[#2F4858]">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[28px]">{title}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => canPrev && setPage(p => p - 1)}
            disabled={!canPrev}
            className={`border-2 rounded px-3 py-1 ${canPrev ? "hover:bg-[#2F4858] hover:text-white" : "opacity-40 cursor-not-allowed"}`}
          >
            ◀
          </button>
          <span className="text-sm">{page + 1} / {totalPages}</span>
          <button
            onClick={() => canNext && setPage(p => p + 1)}
            disabled={!canNext}
            className={`border-2 rounded px-3 py-1 ${canNext ? "hover:bg-[#2F4858] hover:text-white" : "opacity-40 cursor-not-allowed"}`}
          >
            ▶
          </button>
        </div>
      </div>

    <ul className="list-none m-0 p-0 flex flex-col gap-2">
    {pageTasks.map((t) => (
        <TaskRow key={t._id} task={t} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
    ))}
    </ul>
    </div>
  );
}
