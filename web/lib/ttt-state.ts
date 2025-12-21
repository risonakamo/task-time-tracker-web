// funcs for working with ttt state

import _ from "lodash";
import {combineTimeStringWithUnixSec, toTimeOnly} from "@/utils/date-conv";

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

/** generate dict of rows that have edited titles */
export function getTitlesEdits(
    allTasks:TimeEntry[],
    editedTitles:TaskTitlesDict,
):TaskTitlesDict
{
    const keyedTasks:TaskDict=keyTasks(allTasks);

    // filter edited titles dict to only ones where it doesn't match the original
    return _.pickBy(editedTitles,(title:string,id:string):boolean=>{
        if (keyedTasks[id].title!=title)
        {
            return true;
        }

        return false;
    });
}

/** determine which items in edited times dict is edited */
export function getEditedTimes(
    allTasks:TimeEntry[],
    editedTimes:EditedTimesDict,
):EditedTimesDict
{
    const keyedTasks:TaskDict=keyTasks(allTasks);

    // filter down to only the ones which are considered edited
    return _.pickBy(editedTimes,(times:EditedTimes,id:string):boolean=>{
        const origTask:TimeEntry=keyedTasks[id];

        // if task is active, can't count as edited time
        if (origTask.timeEnd<=0)
        {
            return false;
        }

        // if both of the edit time item matches the original, it's not edited
        if (
            toTimeOnly(origTask.timeStart)==times.startTime &&
            toTimeOnly(origTask.timeEnd)==times.endTime
        )
        {
            return false;
        }

        return true;
    });
}

/** convert various change data structs into time entry edits
 *  for backend */
export function createChangeRequest(
    taskTitlesDict:TaskTitlesDict,
    editedTimes:EditedTimesDict,
    allTasks:TimeEntry[],
):TimeEntryEdit[]
{
    const edits:TimeEntryEditDict={};
    const keyedTasks:TaskDict=keyTasks(allTasks);

    // for all titles to be edited, create edit entry for it.
    for (const id in taskTitlesDict)
    {
        // if doesn't exist yet, initialise
        if (!(id in edits))
        {
            edits[id]={
                id,
                title:"",
                timeStart:-1,
                timeEnd:-1,
            };
        }

        edits[id].title=taskTitlesDict[id];
    }

    for (const id in editedTimes)
    {
        const timeEdit:EditedTimes=editedTimes[id];

        if (!(id in edits))
        {
            edits[id]={
                id,
                title:"",
                timeStart:-1,
                timeEnd:-1,
            };
        }

        edits[id].timeStart=combineTimeStringWithUnixSec(
            timeEdit.startTime,
            keyedTasks[id].timeStart,
        );

        edits[id].timeEnd=combineTimeStringWithUnixSec(
            timeEdit.endTime,
            keyedTasks[id].timeEnd,
        );
    }

    return _.map(edits);
}

/** convert task list into dict */
function keyTasks(tasks:TimeEntry[]):TaskDict
{
    return _.keyBy(tasks,(task:TimeEntry):string=>{
        return task.id;
    });
}