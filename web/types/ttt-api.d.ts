// types from ttt backend

/** body to start a new task */
interface StartTaskReq
{
    title:string
}

/** ttt state */
interface TTTState
{
    currentTaskValid:boolean
    currentTask:TimeEntry
    allTasks:TimeEntry[]
}