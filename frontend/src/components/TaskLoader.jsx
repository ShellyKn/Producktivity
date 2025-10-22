import {useState, useEffect} from "react";
import Task from "./Task";

function TaskLoader({tasks, theTasks, setTheTasks}) {
    const [taskEx, setTaskEx] = useState(
        {
            name: "testing",
            due_date: "10/3/1015",
            notes: "no notes"
        }
    )

    // useEffect(() => {
    //     alert(tasks);
    // });

    return (
        <>
            {tasks &&
                // TODO: Needs a key for good practice
                tasks.map((task) => { 
                        return (<Task taskData={task} theTasks ={theTasks} isBlankTask={false} setTheTasks={setTheTasks}></Task>)
                    }
                )
            }

            <Task taskData={taskEx} theTasks={theTasks} isBlankTask={true} setTheTasks={setTheTasks}></Task>
        </>
    )
}

export default TaskLoader