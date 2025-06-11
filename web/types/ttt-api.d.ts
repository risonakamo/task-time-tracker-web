// types from ttt backend

/** body to start a new task */
interface StartTaskReq
{
    title:string
}

/** ttt state */
interface TTTState
{
    currentTaskValid:string
    currentTask:TimeEntry
    allTasks:TimeEntry[]
}