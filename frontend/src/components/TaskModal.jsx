import { useState } from "react";

const TaskModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState(1);

  if (!isOpen) return null;

  async function save() {
    if (!name.trim()) return;
    await onCreate({
      name: name.trim(),
      due_date: date || "",
      notes: notes || "",
      priority,
    });
    setName(""); setDate(""); setNotes(""); setPriority(1);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 font-jua" onClick={onClose}>
      <div className="bg-[#FAFAF0] border-4 border-[#464141] rounded-xl p-6 w-[400px] shadow-xl text-[#464141]" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl"> TASK DETAILS </h2>
          <button className="text-3xl leading-none" onClick={onClose}>&times;</button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-lg mb-1">Task Name:</label>
            <input className="w-full border-2 border-[#464141] rounded-lg p-2 bg-white"
              value={name} onChange={(e)=>setName(e.target.value)} placeholder="Enter task name" />
          </div>

          <div>
            <label className="block text-lg mb-1">Due Date:</label>
            <input type="date" className="w-full border-2 border-[#464141] rounded-lg p-2 bg-white"
              value={date} onChange={(e)=>setDate(e.target.value)} />
          </div>

          <div>
            <label className="block text-lg mb-1">Notes:</label>
            <textarea rows="4" className="w-full border-2 border-[#464141] rounded-lg p-2 bg-white"
              value={notes} onChange={(e)=>setNotes(e.target.value)} />
          </div>
          <div>
              <label className="block text-lg mb-1">Priority:</label>
              <select
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                className="w-full border-2 border-[#464141] rounded-lg p-2 bg-white"
              >
                <option value={1}>Low</option>
                <option value={2}>Medium</option>
                <option value={3}>High</option>
              </select>
          </div>
        </div>

        <button onClick={save}
          className="w-full mt-3 bg-[#464141] text-white text-xl px-2 py-2 rounded-lg hover:bg-[#1e3442]">
          Save Task
        </button>
      </div>
    </div>
  );
};

export default TaskModal;
