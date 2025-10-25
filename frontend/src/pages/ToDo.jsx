import { useEffect, useState } from "react";
import Header from "./../components/Header.jsx";
import Logo from "./../components/Logo.jsx";
import TaskLoader from "./../components/TaskLoader.jsx";
import Nav from "../components/Nav.jsx";
import TaskModal from "../components/TaskModal.jsx";
import Dashboard from "../pages/Dashboard.jsx"

function ToDo() {
  // Used for keeping track of what "page" we are on in the navigation menu 
  const [pageIndex, setPageIndex] = useState(0);
  const [numTasks, setNumTasks] = useState(3);
  const [streakDays, setStreakDays] = useState(10);
  const [quote, setQuote] = useState("You're doing ducktastic!");
  const [isModalOpen, setModalOpen] = useState(false);

  // Empty array on load (needs to be filled in with a fetch to the db)
  const [theTasks, setTheTasks] = useState({
    yesterday: [
      { name: "finish mockups", due_date: "09/29/25", notes: "done", completed: true },
      { name: "lab 1", due_date: "09/29/25", notes: "crossed out", completed: false },
    ],
    today: [
      { name: "finish mockups", due_date: "09/30/25", notes: "", completed: false },
      { name: "finish deliverables for Sprint 1", due_date: "09/30/25", notes: "", completed: false },
      { name: "meeting at 5pm for S8D4", due_date: "09/30/25", notes: "", completed: false },
    ],
    tomorrow: [
      { name: "wireframes", due_date: "10/01/25", notes: "", completed: false },
      { name: "hw2", due_date: "10/01/25", notes: "", completed: false },
    ],
  });

//   TODO: This is a VERY quick fix bc of the deadline tn. The tasks can't be set up the way they are above bc then
// it's no longer an array of tasks, which is what the Task components assume. We'll fix this later, but for now this works:
  const [theActualTasks, setTheActualTasks] = useState(
    [
      { name: "finish mockups", due_date: "09/30/25", notes: "", completed: false },
      { name: "finish deliverables for Sprint 1", due_date: "09/30/25", notes: "", completed: false },
      { name: "meeting at 5pm for S8D4", due_date: "09/30/25", notes: "", completed: false },
    ]
  );


  useEffect(() => {
    // alert(pageIndex);
  });

  useEffect(() => {
  console.log("Current page index:", pageIndex);
}, [pageIndex]);

  return (
    <div className="bg-[#FAFAF0] h-screen flex flex-col">
      <Header
        left_side={<Logo />}
        right_side={
          <Nav
            pages={["PROFILE", "DASHBOARD"]}
            setIndex={setPageIndex}
            index={pageIndex}
          />
        }
      />

      {pageIndex === 1 && (
        <Dashboard
          theTasks={theTasks}
          setTheTasks={setTheTasks}
          modalOpen={isModalOpen}
          setModalOpen={setModalOpen}
        />
      )}

      {pageIndex === 0 && (
        // {/* Main div for the three sections */}
        <div className="font-jua w-full flex-1 flex text-[#2F4858]">
          {/* LEFT PANEL */}
          <div className="flex-1 py-5 px-10 flex flex-col gap-10 justify-between">
            {/* Profile section */}
            <div className="flex-1 flex flex-col justify-between border-4 border-[#2F4858] rounded-lg items-center p-5">
              <h1 className="text-3xl">Profile</h1>
              <div className="flex flex-col items-center">
                <h1 className="text-[60px] text-[#2F4858]">{numTasks}</h1>
                <p className="text-lg">tasks done today</p>
              </div>
              <div className="flex flex-col items-center">
                <h1 className="text-[60px] text-[#2F4858]">{streakDays}-DAY</h1>
                <p className="text-lg">streak</p>
              </div>
              <button className="text-3xl">See more!</button>
            </div>

            {/*TODO: Quote API here */}
            <div className="flex flex-col h-fit border-4 border-[#2F4858] rounded-lg items-center p-5">
              <h1 className="text-xl">{quote}</h1>
            </div>
          </div>

          {/* MIDDLE PANEL (todo list part) */}
          <div className="flex-none flex-col gap-4 py-5 px-10 w-1/2 overflow-y-visible">
            <div className="w-full flex justify-between items-center mb-1">
              <h1 className="text-[48px]">to-do today:</h1>
              <button
                className="border-4 border-[#2F4858] rounded-lg px-4 text-[24px]"
                onClick={() => setModalOpen(true)}
              >
                + add task
              </button>
            </div>
            <div className="overflow-scroll">
                <TaskLoader tasks={theActualTasks} theTasks={theActualTasks} setTheTasks={setTheActualTasks} />
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="flex-col flex-1 py-5 px-10">
            <h1 className="text-[48px]">leaderboard:</h1>
            <div className="flex-1 flex flex-col justify-between border-4 border-[#2F4858] rounded-lg items-center p-5">
              <h1 className="text-3xl underline mt-4">1st axaleaa</h1>
              <h1 className="text-3xl underline mt-4">2nd academicSam</h1>
              <h1 className="text-3xl underline mt-4">3rd prof_stur</h1>
              <h1 className="text-3xl underline mt-4">4th undrcvr_dUCK</h1>
              <h1 className="text-3xl underline mt-4">5th aChillGuy</h1>
              <h1 className="text-3xl underline mt-4">6th willy</h1>
            </div>
          </div>
        </div>
      )}

      {/* MODAL */}
      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        theTasks={theActualTasks} 
        setTheTasks={setTheActualTasks} 
      />
    </div>
  );
}

export default ToDo;
