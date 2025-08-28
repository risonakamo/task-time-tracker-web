// funcs for working with ttt state

import _ from "lodash";

/** given 2 time entries, get all time entries between them (including them again) */
export function getTasksBetween(
    allTasks:TimeEntry[],
    task1:TimeEntry,
    task2:TimeEntry,
):TimeEntry[]
{
    const task1Index:number=_.findIndex(allTasks,(task:TimeEntry):boolean=>{
        return task.id==task1.id;
    });

    if (task1Index<0)
    {
        console.error("could not find task 1");
        return [];
    }

    const task2Index:number=_.findIndex(allTasks,(task:TimeEntry):boolean=>{
        return task.id==task2.id;
    });

    if (task2Index<0)
    {
        console.error("could not find task 2");
        return [];
    }

    const startIndex:number=Math.min(task1Index,task2Index);
    const endIndex:number=Math.max(task1Index,task2Index);

    return allTasks.slice(startIndex,endIndex+1);
}