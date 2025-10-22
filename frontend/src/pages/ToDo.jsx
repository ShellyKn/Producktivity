import {useEffect, useState} from "react";
import Header from "./../components/Header.jsx";
import Logo from "./../components/Logo.jsx";
// import Task from "./../components/Task.jsx";
import TaskLoader from "./../components/TaskLoader.jsx";
import Nav from "../components/Nav.jsx";

function ToDo() {

    // Used for keeping track of what "page" we are on in the navigation menu 
    const [pageIndex, setPageIndex] = useState(0);
    
    const [numTasks, setNumTasks] = useState(3);
    const [streakDays, setStreakDays] = useState(10);
    const [quote, setQuote] = useState("You're doing ducktastic!");
    const [taskEx, setTaskEx] = useState(
        {
            name: "testing",
            due_date: "10/3/1015",
            notes: "no notes"
        }
    );
    const [tasks, setTasks] = useState(
        [
            // Empty array on load (needs to be filled in with a fetch to the db)
            {
                name: "testing",
                due_date: "10/3/1015",
                notes: "no notes"
            },
            {
                name: "testing",
                due_date: "10/3/1015",
                notes: "no notes"
            },
        ]
    );

    useEffect(() => {
        // alert(pageIndex);
    });

    return (
        // Page div 
        <div className="bg-[#FAFAF0] h-screen flex flex-col">
            <Header left_side={<Logo></Logo>} 
                right_side={<Nav pages={["PROFILE", "DASHBOARD"]} setIndex={setPageIndex} index={pageIndex}></Nav>}>
            </Header>
            {(pageIndex == 1) && (
                <p>Dashboard stuff goes here</p>
            )}
            
            {(pageIndex == 0) && (
                // {/* Main div for the three sections */}
                <div className="font-jua w-full flex-1 flex text-[#2F4858]">
                    {/* LEFT PANEL */}
                    <div className="flex-1 py-5 px-10 flex flex-col gap-10 justify-between">
                        {/* Profile section */}
                        <div className="flex-1 flex flex-col justify-between border-4 border-[#2F4858] rounded-lg items-center p-5">
                            <h1 className="text-3xl">Profile</h1>

                            <div className="flex flex-col items-center">
                                <h1 className="text-[60px] text-[#2F4858]">{numTasks}</h1>
                                <p className="text-[#2F4858] text-lg"> tasks done today </p>
                            </div>
                            
                            <div className="flex flex-col items-center">
                                <h1 className="text-[60px] text-[#2F4858]">{streakDays}-DAY</h1>
                                <p className="text-[#2F4858] text-lg"> streak </p>
                            </div>

                            <button className="text-3xl">
                                See more!
                            </button>
                        </div>

                        {/*TODO: Quote API here */}
                        <div className="flex flex-col h-fit border-4 border-[#2F4858] rounded-lg items-center p-5">
                            <h1 className="text-xl">{quote}</h1>
                        </div>
                    </div>

                    {/* MIDDLE PANEL (the todo list part) */}
                    <div className="flex-none flex-col gap-4 py-5 px-10 w-1/2 overflow-y-visible">
                        <div className="w-full h-10 flex justify-between items-center">
                            <h1 className="text-[48px]">to-do today:</h1>
                            <button className="border-4 border-[#2F4858] rounded-lg px-4 text-[24px]">+ add task</button>
                        </div>
                        <div className="overflow-scroll">
                            <TaskLoader tasks={tasks} theTasks = {tasks} setTheTasks={setTasks}></TaskLoader>    
                        </div>
                    </div>

                    {/* RIGHT PANEL */}
                    <div className="flex-col flex-1 py-5 px-10">
                        <h1 className="text-[48px] text-[#2F4858]">leaderboard:</h1>
                        <div className="flex-1 flex flex-col justify-between border-4 border-[#2F4858] rounded-lg items-center p-5">
                            <h1 className="text-3xl">User 1</h1>
                            <h1 className="text-3xl">User 2</h1>
                            <h1 className="text-3xl">User 3</h1>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ToDo