export default function TaskColumn({ title, date, tasks }) {
  return (
    <div className="border-4 border-[#2F4858] rounded-xl p-4 flex flex-col gap-4 bg-[#FAFAF0] font-jua text-[#2F4858]">
      <div>
        <h2 className="text-[28px]">{title}</h2>
        <p className="text-[16px]">{date}</p>
      </div>

      <ul className="flex flex-col gap-2">
        {tasks.map((task, index) => (
          <li key={index} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => {
              }}
              className="w-[20px] h-[20px] accent-[#2F4858]"
            />
            <span
              className={`text-lg ${
                task.completed ? "line-through opacity-50" : ""
              }`}
            >
              {task.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
