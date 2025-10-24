import React from "react";

const TaskModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 font-jua"
      onClick={onClose}
    >
      <div
        className="bg-[#FAFAF0] border-4 border-[#464141] rounded-xl p-6 w-[400px] shadow-xl text-[#464141]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl"> TASK DETAILS </h2>
          <button className="text-3xl leading-none" onClick={onClose}>
            &times;
          </button>
        </div>

        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-lg mb-1">Task Name:</label>
            <input
              type="text"
              placeholder="Enter task name"
              className="w-full border-2 border-[#464141] rounded-lg p-2 bg-white"
            />
          </div>

          <div>
            <label className="block text-lg mb-1">Due Date (MM/DD/YY):</label>
            <input
              type="text"
              placeholder="MM/DD/YY"
              className="w-full border-2 border-[#464141] rounded-lg p-2 bg-white"
            />
          </div>

          <div>
            <label className="block text-lg mb-1">Notes:</label>
            <textarea
              rows="4"
              placeholder="Add any notes here..."
              className="w-full border-2 border-[#464141] rounded-lg p-2 bg-white"
            />
          </div>

          <button
            type="submit"
            className="mt-2 bg-[#464141] text-white text-xl py-2 rounded-lg hover:bg-[#1e3442]"
          >
            Save Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
