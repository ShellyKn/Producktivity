// The ToDo.jsx page is the main entry point to the application
// This page routes to the other pages "Calendar", "Dashboard", and "Profile"

import { useEffect, useState} from "react";
import Header from "./../components/Header.jsx";
import Logo from "./../components/Logo.jsx";
import TaskLoader from "./../components/TaskLoader.jsx";
import Nav from "../components/Nav.jsx";
import TaskModal from "../components/TaskModal.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Profile from "../pages/Profile.jsx";
import Calendar from "./Calendar.jsx";
import { localDateFromPicker } from "../lib/utils.js";
import {
  getTasks as apiGetTasks,
  createTask as apiCreateTask,
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask
} from "../lib/api.js";

function ToDo() {
  // -------- App-level UI state --------
  const [pageIndex, setPageIndex] = useState(0);          // 0=Profile, 1=Dashboard, 2=Calendar
  const [quote, setQuote] = useState("You're doing ducktastic!");
  const [isModalOpen, setModalOpen] = useState(false);   
  const [tasks, setTasks] = useState([]);                 // all tasks for the current user

  // -------- Initial data load (after login) --------
  useEffect(() => {
    (async () => {
      // 1) Fetch tasks from API and store locally
      try {
        const list = await apiGetTasks();
        setTasks(list);
      } catch (e) {
        console.error(e);
      }

      // 2) Fetch a quote-of-the-day for Profile panel (non-blocking)
      try {
        const res = await fetch("http://localhost:4000/api/quote");
        const data = await res.json();
        if (data.quote && data.author) {
          setQuote(`${data.quote} — ${data.author}`);
        }
      } catch (e) {
        console.error("Failed to fetch quote", e);
      }
    })();
  }, []);

  // -------- Create --------
  // Creates a new task using modal payload and prepends to local state
  async function handleCreateTask({ name, due_date, notes, priority }) {
    const payload = {
      title: name,
      dueDate: localDateFromPicker(due_date), // yyyy-mm-dd -> local noon Date
      notes,
      status: 'pending',
      priority: Number(priority) || 1,
    };
    const created = await apiCreateTask(payload);
    setTasks(prev => [created, ...prev]); // keep newest visible first
  }

  // -------- Toggle Complete --------
  // Flips task status and updates completedAt accordingly, then patches local list
  async function handleToggleComplete(task) {
    const newStatus = task.status === "completed" ? "pending" : "completed";

    const payload = { status: newStatus };
    if (newStatus === "completed") {
      payload.completedAt = new Date();   // set completion timestamp
    } else {
      payload.completedAt = null;         // clear completion timestamp
    }

    await apiUpdateTask(task._id, payload);

    // Merge the partial changes into the local task list and bump updatedAt
    setTasks(prev =>
      prev.map(t =>
        t._id === task._id
          ? { ...t, ...payload, updatedAt: new Date() }
          : t
      )
    );
  }

  // -------- Update --------
  // Partially updates a task and merges changes into local state
  async function handleUpdate(taskId, partial) {
    await apiUpdateTask(taskId, partial);
    setTasks(prev =>
      prev.map(t =>
        t._id === taskId ? { ...t, ...partial, updatedAt: new Date() } : t
      )
    );
  }

  // -------- Delete --------
  // Removes a task from backend and prunes it from local state
  async function handleDelete(taskId) {
    await apiDeleteTask(taskId);
    setTasks(prev => prev.filter(t => t._id !== taskId));
  }

  return (
    <div className="bg-[#FAFAF0] h-screen flex flex-col overflow-y-auto">
      {/* Global header with logo and navigation */}
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

      {/* Page 1: Dashboard (productivity overview) */}
      {pageIndex === 1 && (
        <Dashboard
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          setModalOpen={setModalOpen}
          onDelete={handleDelete}
          onEdit={handleUpdate}
        />
      )}

      {/* Page 0: Profile (leaderboard, follow bar, quote) */}
      {pageIndex === 0 && (
        <Profile
          tasks={tasks}
          quote={quote}
          setModalOpen={setModalOpen}
          setPageIndex={setPageIndex}
          onToggle={handleToggleComplete}
          onEdit={handleUpdate}
          onDelete={handleDelete}
        />
      )}

      {/* Page 2: Calendar (month view and day panel) */}
      {pageIndex === 2 && (
        <Calendar
          tasks={tasks}
          onCreate={handleCreateTask}
          onEdit={handleUpdate}
          onDelete={handleDelete}
          onToggle={handleToggleComplete}
        />
      )}

      {/* Modal: create a new task from anywhere */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateTask}
      />
    </div>
  );
}

export default ToDo;
