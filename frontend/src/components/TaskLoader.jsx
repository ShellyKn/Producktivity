import TaskRow from "./TaskRow";

function TaskLoader({ tasks, onToggle, onEdit, onDelete }) {
  if (!tasks || tasks.length === 0) {
    return (
      <p className="text-sm italic opacity-60">
        No tasks yet. Add one to get quacking 🦆
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2"> 
      {tasks.map((task) => (
        <TaskRow
          key={task._id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          stackAt={600}
        />
      ))}
    </ul>
  );
}

export default TaskLoader;
