// types from ttt backend

/** time entry edits keyed by id. key: entry edit id */
type TimeEntryEditDict=Record<string,TimeEntryEdit>

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
    dayContainers:DayContainer[]
}

/** container of time entries */
interface DayContainer
{
    dateKey:string // 2023/01/05
    date:number // unix seconds
    entries:TimeEntry[]
    totalDuration:number // seconds
}

/** a single time event entry */
interface TimeEntry
{
    id:string
    title:string

    timeStart:number // unixtime seconds
    timeEnd:number // unixtime seconds
    duration:number // seconds
}

/** edit to a time entry */
interface TimeEntryEdit
{
    id:string

    // empty to unset
    title:string
    // -1 to unset. unixtime seconds
    timeStart:number
    // -1 to unset. unixtime seconds
    timeEnd:number
}