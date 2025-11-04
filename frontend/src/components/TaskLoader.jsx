import Task from "./Task";

function TaskLoader({ tasks, onToggle, onEdit, onDelete }) {
  return (
    <>
      {tasks && tasks.map(task => (
        <Task
          key={task._id}
          task={task}
          onToggle={() => onToggle(task)}
          onEdit={(partial) => onEdit(task._id, partial)}
          onDelete={() => onDelete(task._id)}
        />
      ))}
    </>
  );
}

export default TaskLoader;
