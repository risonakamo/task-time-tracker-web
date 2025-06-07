// types for time data storage

/** a single time event entry */
interface TimeEntry
{
    id:string
    name:string

    timeStart:number // unixtime seconds
    timeEnd:number // unixtime seconds
    duration:number // seconds
}