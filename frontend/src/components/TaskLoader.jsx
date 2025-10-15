import {useState, useEffect} from "react";
import Task from "./Task";

function TaskLoader({tasks, setTasks}) {
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
                        return (<Task taskData={task} isBlankTask={false}></Task>)
                    }
                )
            }

            <Task taskData={taskEx} isBlankTask={true}></Task>
        </>
    )
}

export default TaskLoader