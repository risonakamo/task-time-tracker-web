<script lang="ts">
import {onMount} from "svelte";
import _ from "lodash";
import {SvelteSet} from "svelte/reactivity";

import TimeRow from "@/components/time-row/time-row.svelte";
import {getState, startTask, stopTask} from "@/lib/ttt-api";
import {durationFormat, toDateTime, toWordDate} from "@/utils/date-conv";
import {getTasksBetween} from "@/lib/ttt-state";

/** container of task titles */
type TaskTitlesDict=Record<string,string>

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

// on load, get the ttt state.
// also, deploy the current task timer interval
onMount(()=>{
    (async ()=>{
        tttState=await getState();
        genTaskTitlesDict();
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
</script>

<style lang="sass">
    @use "./main.sass"
</style>

<div class="controls">
    <div class="task-adder">
        <input type="text" list="task-auto-complete" class="task-input"
            placeholder="New Task" bind:value={newTaskTitleField} onkeydown={onTitleInputKey}/>

        <datalist id="task-auto-complete">
            {#each uniqueTaskNames as taskName (taskName)}
                <option value={taskName}></option>
            {/each}
        </datalist>

        <button class="start-button" onclick={onClickStart}>Start</button>
    </div>

    <div class="task-timer">
        <div class="left">
            <p>current task: <span class="task-text">{currentTaskText}</span></p>
        </div>

        <div class="right">
            <div class="timer">
                <h3>{currentTaskTimer}</h3>
                <button class="stop-button" onclick={onStopClick}
                    disabled={!tttState.currentTaskValid}
                >
                    Stop
                </button>
            </div>
        </div>
    </div>

    <div class="selection-info">
        <span>Selected: {selectedEntrys.size}, Total Time: {totalSelectedTimeText}</span>
        <a href="javascript:;" onclick={onClearSelectionsClick}>clear selection</a>
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
                            title={taskTitles[task.id]} onTitleChange={onRowTitleChange}/>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</div>

<svelte:head>
    <title>{documentTitle}</title>
</svelte:head>