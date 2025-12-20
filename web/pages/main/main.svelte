<script lang="ts">
import {onMount} from "svelte";
import _, {uniq} from "lodash";
import {SvelteSet} from "svelte/reactivity";

import TimeRow from "@/components/time-row/time-row.svelte";
import {editTasks2, getState, startTask, stopTask} from "@/lib/ttt-api";
import {durationFormat, toDateTime, toTimeOnly, toWordDate} from "@/utils/date-conv";
import {createChangeRequest, getTasksBetween, getTitlesEdits} from "@/lib/ttt-state";
    import TaskAdder from "@/components/task-adder/task-adder.svelte";

/** the main backend state */
var tttState:TTTState=$state({
    currentTaskValid:false,
    currentTask:{
        id:"",
        title:"",
        timeStart:-1,
        timeEnd:-1,
        duration:-1,
    },
    allTasks:[],
    dayContainers:[],
});

/** contains the current task titles. key: id of a task. val: the value of the title.
 *  set initially when data loaded, changed by user editing */
var taskTitles:TaskTitlesDict=$state({});

/** the new task input field */
var newTaskTitleField:string=$state("");

/** text showing the duration of the current task */
var currentTaskTimer:string=$state("00:00:00");

/** the current time input values of the rows */
var rowTimes:EditedTimesDict=$state({});

/** text of the current running task */
var currentTaskText:string=$derived.by(()=>{
    if (tttState.currentTaskValid)
    {
        return tttState.currentTask.title;
    }

    return "None";
});

/** ids of selected tasks */
var selectedEntrys:Set<string>=$state(new SvelteSet());

/** last task item that selection event occured on */
var lastSelectedTask:TimeEntry|null=$state(null);

/** if the last select operation was a select (true) or deselect (false).
 *  only valid if last selected item is not null */
var lastSelectedWasSelection:boolean=$state(false);

/** list of unique task names */
var uniqueTaskNames:string[]=$derived.by(()=>{
    return _(tttState.allTasks)
        .map((task:TimeEntry):string=>{
            return task.title;
        })
        .uniq()
        .value();
});

var totalSelectedTimeText:string=$derived.by(()=>{
    // sum duration of all entrys that are selected and are not in progress
    const selectedTimeNum:number=_.sumBy(tttState.allTasks,(task:TimeEntry):number=>{
        if (!selectedEntrys.has(task.id) || task.duration<0)
        {
            return 0;
        }

        return task.duration;
    });

    return durationFormat(selectedTimeNum);
});

var documentTitle:string=$derived.by(()=>{
    if (tttState.currentTaskValid)
    {
        return `▷ Task Time Tracker: ${tttState.currentTask.title}`;
    }

    return "⏹ Task Time Tracker";
});

/** task titles, but only the edited ones */
var editedTaskTitles:TaskTitlesDict=$derived(getTitlesEdits(
    tttState.allTasks,
    taskTitles,
));

/** if there is at least 1 edited task title */
var editedTitlesNum:number=$derived(Object.keys(editedTaskTitles).length);

// on load, get the ttt state.
// also, deploy the current task timer interval
onMount(()=>{
    (async ()=>{
        tttState=await getState();
        genTaskTitlesDict();
        genEditedTimesDict();
    })();

    setInterval(()=>{
        if (!tttState.currentTaskValid)
        {
            currentTaskTimer="00:00:00";
            return;
        }

        const nowUnix:number=new Date().getTime()/1000;

        currentTaskTimer=durationFormat(
            nowUnix-tttState.currentTask.timeStart,
        );
    },1000);
});

/** start a task. sets the state, and clears the new task title field */
async function startTask2(title:string):Promise<void>
{
    var newTaskTitle:string=title.trim();

    if (newTaskTitle.length==0)
    {
        return;
    }

    tttState=await startTask(newTaskTitle);
    genTaskTitlesDict();

    newTaskTitleField="";
}

/** do shift select with the given items, selecting or deselecting all in between
 *  the 2 target tasks */
function doShiftSelect(task1:TimeEntry,task2:TimeEntry,select:boolean):void
{
    const targetTasks:TimeEntry[]=getTasksBetween(
        tttState.allTasks,
        task1,
        task2,
    );

    for (const task of targetTasks)
    {
        if (select)
        {
            selectedEntrys.add(task.id);
        }

        else
        {
            selectedEntrys.delete(task.id);
        }
    }

    selectedEntrys=selectedEntrys;
}

/** create task titles dict from the current state */
function genTaskTitlesDict():void
{
    const newDict:TaskTitlesDict={};

    for (const task of tttState.allTasks)
    {
        newDict[task.id]=task.title;
    }

    taskTitles=newDict;
}

/** set the row time input fields to the values from the state */
function genEditedTimesDict():void
{
    const newDict:EditedTimesDict={};

    for (const task of tttState.allTasks)
    {
        newDict[task.id]={
            startTime:toTimeOnly(task.timeStart),
            endTime:toTimeOnly(task.timeEnd),
        };
    }

    rowTimes=newDict;
}

/** clicked start button. send start task request with the contents of the task field,
 *  after cleaning it. doesn't work if empty. clears the task entry field afterward */
function onClickStart():void
{
    startTask2(newTaskTitleField)
}

/** clicked on an entry's play button. start task with that entry's title */
function onEntryPlayClick(task:TimeEntry):void
{
    startTask2(task.title);
}

/** title input keypress. if enter, do same thing as pressing start button */
function onTitleInputKey(e:KeyboardEvent):void
{
    if (e.key=="Enter")
    {
        onClickStart();
    }
}

/** clicked stop task. send stop task request. update state */
async function onStopClick():Promise<void>
{
    tttState=await stopTask();
    genTaskTitlesDict();
}

/** time entry changed select state. update the selected entrys state.
 *  if shift was held, do the shift select operation instead of the normal operation,
 *  but only if there was a last selected item. shift select does not set the last
 *  select item
 */
function onEntrySelectChange(task:TimeEntry,newSelect:boolean,shift:boolean):void
{
    if (shift && lastSelectedTask!=null)
    {
        doShiftSelect(lastSelectedTask,task,lastSelectedWasSelection);
        return;
    }

    lastSelectedTask=task;
    lastSelectedWasSelection=newSelect;

    if (newSelect)
    {
        selectedEntrys.add(task.id);
    }

    else
    {
        selectedEntrys.delete(task.id);
    }
}

/** clicked clear selections button */
function onClearSelectionsClick():void
{
    selectedEntrys.clear();
}

/** row title changed. update the dict */
function onRowTitleChange(task:TimeEntry,newTitle:string):void
{
    taskTitles[task.id]=newTitle;
}

/** clicked apply edits. send in the edits, get new state back. override the state */
async function onApplyEdits():Promise<void>
{
    const newState:TTTState=await editTasks2(
        createChangeRequest(editedTaskTitles)
    );

    tttState=newState;
    genTaskTitlesDict();
}

/** clicked cancel edits. regen the title edits obj to match original state */
function onCancelEdits():void
{
    genTaskTitlesDict();
    genEditedTimesDict();
}

/** edited time row. change the value in the time row values dict */
function onTimeEdit(timeEntry:TimeEntry,newTimes:EditedTimes):void
{
    rowTimes[timeEntry.id]=newTimes;
}
</script>

<style lang="sass">
    @use "./main.sass"
</style>

<div class="controls">
    <TaskAdder bind:newTaskTitleField={newTaskTitleField} uniqueTaskNames={uniqueTaskNames}
        onTitleInputKey={onTitleInputKey} onClickStart={onClickStart}
        currentTaskText={currentTaskText} currentTaskTimer={currentTaskTimer}
        onStopClick={onStopClick} currentTaskValid={tttState.currentTaskValid}/>

    <div class="selection-info">
        <span>Selected: {selectedEntrys.size}, Total Time: {totalSelectedTimeText}</span>
        {#if selectedEntrys.size>0}
            <a href="javascript:;" onclick={onClearSelectionsClick}>clear selection</a>
        {/if}
        {#if editedTitlesNum>0}
            <a href="javascript:;" onclick={onApplyEdits}>
                apply edits ({editedTitlesNum})
            </a>
            <a href="javascript:;" onclick={onCancelEdits}>
                cancel edits
            </a>
        {/if}
    </div>
</div>

<div class="time-table">
    <div class="inner">
        {#each tttState.dayContainers as dayContainer (dayContainer.dateKey)}
            <div class="day-box">
                <div class="day-header">
                    <div class="title" title={toDateTime(dayContainer.date)}>
                        <!-- Sat, Jun 5 (Today) -->
                        {toWordDate(dayContainer.date)}
                    </div>

                    <div class="duration">
                        {durationFormat(dayContainer.totalDuration)}
                    </div>
                </div>

                <div class="entries">
                    {#each dayContainer.entries as task (task.id)}
                        <TimeRow timeEntry={task} onPlay={onEntryPlayClick}
                            selected={selectedEntrys.has(task.id)} onSelect={onEntrySelectChange}
                            shiftSelectAction={lastSelectedWasSelection}
                            title={taskTitles[task.id]} onTitleChange={onRowTitleChange}
                            startTime={rowTimes[task.id].startTime}
                            onTimeChanged={onTimeEdit}/>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</div>

<svelte:head>
    <title>{documentTitle}</title>
</svelte:head>