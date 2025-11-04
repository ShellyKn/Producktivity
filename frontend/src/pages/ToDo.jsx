import { useEffect, useState, useMemo } from "react";
import Header from "./../components/Header.jsx";
import Logo from "./../components/Logo.jsx";
import TaskLoader from "./../components/TaskLoader.jsx";
import Nav from "../components/Nav.jsx";
import TaskModal from "../components/TaskModal.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Profile from "../pages/Profile.jsx";
import Calendar from "./Calendar.jsx";

import { getTasks as apiGetTasks, createTask as apiCreateTask, updateTask as apiUpdateTask, deleteTask as apiDeleteTask } from "../lib/api.js";

function localDateFromPicker(yyyymmdd) {
  if (!yyyymmdd) return null;
  const [y, m, d] = yyyymmdd.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

function ToDo() {
  const [pageIndex, setPageIndex] = useState(0); //used for switching pages
  const [quote, setQuote] = useState("You're doing ducktastic!");
  const [isModalOpen, setModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);

  // Fetch on mount (after login)
  useEffect(() => {
    (async () => {
      try {
        const list = await apiGetTasks();
        setTasks(list);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // Potential stats that we can derrive from the backend later 
  // const numTasks = 
  //   () => tasks.filter(t => t.status === 'completed').length,
  //   [tasks]
  // 
  // const streakDays = .....

  // Creates a task
  async function handleCreateTask({ name, due_date, notes, priority }) {
    const payload = {
      title: name,
      dueDate: localDateFromPicker(due_date),
      notes,
      status: 'pending',
      priority: Number(priority) || 1,
    };
    const created = await apiCreateTask(payload);
    setTasks(prev => [created, ...prev]);
  }

  // Update tasks completion status
  async function handleToggleComplete(task) {
    const newStatus = task.status === "completed" ? "pending" : "completed";

    const payload = { status: newStatus };
    if (newStatus === "completed") {
      payload.completedAt = new Date();
    } else {
      payload.completedAt = null; 
    }

    await apiUpdateTask(task._id, payload);

    setTasks(prev =>
      prev.map(t =>
        t._id === task._id
          ? { ...t, ...payload, updatedAt: new Date() }
          : t
      )
    );
  }


  // Updates task
  async function handleUpdate(taskId, partial) {
    await apiUpdateTask(taskId, partial);
    setTasks(prev => prev.map(t => t._id === taskId ? { ...t, ...partial, updatedAt: new Date() } : t));
  }

  // Delete task
  async function handleDelete(taskId) {
    await apiDeleteTask(taskId);
    setTasks(prev => prev.filter(t => t._id !== taskId));
  }

  return (
    <div className="bg-[#FAFAF0] h-screen flex flex-col overflow-hidden">
      <Header
        left_side={<Logo />}
        right_side={
          <Nav
            pages={["HOME", "DASHBOARD", "CALENDAR"]}  
            setIndex={setPageIndex}
            index={pageIndex}
          />
        }
      />

      {/* Goes to the dashboard tab: This order can be changed in the future */}
      {pageIndex === 1 && (
         <Dashboard
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          setModalOpen={setModalOpen}
          onDelete={handleDelete}
          onEdit={handleUpdate}
         />
      )}

      {/* Goes to the profile tab */}
      {pageIndex === 0 && (
        <Profile
          tasks={tasks}
          quote={quote}
          setModalOpen={setModalOpen}
          onToggle={handleToggleComplete}
          onEdit={handleUpdate}
          onDelete={handleDelete}
        />
      )}


      {/* Goes to the calendar tab */}
      {pageIndex === 2 && (
      <Calendar
        tasks={tasks}
        onCreate={handleCreateTask} 
        onEdit={handleUpdate}
        onDelete={handleDelete}
        onToggle={handleToggleComplete}
      />
    )}

      {/* MODAL: Create new task */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateTask}
      />
    </div>
  );
}

export default ToDo;
