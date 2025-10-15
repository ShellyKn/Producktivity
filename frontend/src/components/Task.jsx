import {useState} from "react";
// JSON schema for a given task
// Task name - string value
// Task due date - probably just a string value again or some sort of date type
// Task notes - string value

function Task({taskData, isBlankTask, setTasks}) {
    // Need a use effect to load the data
    const [taskName, setTaskName] = useState(taskData.name);

    return (
        <div className="flex flex-col gap-4 w-full my-4">
            <div className="flex w-full gap-4 text-[#5A311F] ">
                {/* Checkbox */}
                {!isBlankTask && (
                    <button className="border-4 border-[#2F4858] rounded-xl w-[30px] h-[30px]">
                    </button>
                )}

                {isBlankTask && (
                    <button className="border-4 border-dotted border-[#2F4858] rounded-xl w-[30px] h-[30px]">
                    </button>
                )}

                {/* Actual task name */}
                {!isBlankTask && (
                    <input type="text" id="username" name="username" className="text-lg flex-1 bg-[#FAFAF0] text-[#2F4858] focus:border-none focus:outline-none" defaultValue={taskName}>
                    </input>
                )}

                {isBlankTask && (
                    <input type="text" id="username" name="username" className="text-lg flex-1 bg-[#FAFAF0] text-[#2F4858] focus:border-none focus:outline-none" placeholder="put some text here">
                    </input>
                )}
                
            </div>

            {/* Line separator */}
            <div className="w-full h-0 border-4 border-[#2F4858] rounded-lg opacity-70"></div>
        </div>

    )
}

export default Task