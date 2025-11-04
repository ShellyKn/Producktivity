import Task from "./Task";
import TaskRow from "./TaskRow";

function TaskLoader({ tasks, onToggle, onEdit, onDelete }) {
  return (
    <>
      {tasks &&
        tasks.map((task) => (
          <TaskRow
            key={task._id}
            task={task}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            stackAt={600}
          />
        ))}
    </>
  );
}

export default TaskLoader;
