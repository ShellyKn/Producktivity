import {useEffect, useState} from "react";
import Header from "./../components/Header.jsx";
import Logo from "./../components/Logo.jsx";

function ToDo() {
    const [numTasks, setNumTasks] = useState(3);
    const [streakDays, setStreakDays] = useState(10);
    const [quote, setQuote] = useState("You're doing ducktastic!");

    return (
        // Page div
        <div className="bg-[#FAFAF0] h-screen flex flex-col">
            <Header left_side={<Logo></Logo>} right_side="PROFILE   DASHBOARD"></Header>

            {/* Main div for the three sections */}
            <div className="w-full flex-1 flex">
                {/* Left most panel */}
                <div className="flex-1 py-5 px-10 flex flex-col gap-10 justify-between">
                    {/* Profile section */}
                    <div className="flex-1 flex flex-col justify-between border-4 border-[#2F4858] rounded-lg items-center p-5">
                        <h1 className="text-3xl">Profile</h1>

                        <div className="flex flex-col items-center">
                            <h1 className="text-[60px] text-[#2F4858]">{numTasks}</h1>
                            <p className="text-[#2F4858]"> tasks done today </p>
                        </div>
                        
                        <div className="flex flex-col items-center">
                            <h1 className="text-[60px] text-[#2F4858]">{streakDays}-DAY</h1>
                            <p className="text-[#2F4858]"> streak </p>
                        </div>

                        <button className="text-3xl">
                            See more!
                        </button>
                    </div>

                    {/*TODO: Quote API here */}
                    <div className="flex flex-col h-fit border-4 border-[#2F4858] rounded-lg items-center p-5">
                        <h1>{quote}</h1>
                    </div>
                </div>

                {/* Middle panel (todo list part) */}
                <div className="flex-none py-5 px-10 w-1/2">
                    <div className="w-full h-10 flex justify-between items-center">
                        <h1 className="text-[48px]">to-do:</h1>
                        <button className="border-4 border-[#2F4858] rounded-lg px-4 text-[24px]">+ add task</button>
                    </div>
                </div>

                {/* Right panel*/}
                <div className="flex-1 py-5 px-10">
                    right
                </div>
            </div>
        </div>
    )
}

export default ToDo