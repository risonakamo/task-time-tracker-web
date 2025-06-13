<script lang="ts">
import {onMount} from "svelte";
import _ from "lodash";

import TimeRow from "@/components/time-row/time-row.svelte";
import {getState, startTask} from "@/lib/ttt-api";
import {durationFormat} from "@/utils/date-conv";

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
});

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

/** list of unique task names */
var uniqueTaskNames:string[]=$derived.by(()=>{
    return _(tttState.allTasks)
        .map((task:TimeEntry):string=>{
            return task.title;
        })
        .uniq()
        .value();
});

// on load, get the ttt state.
// also, deploy the current task timer interval
onMount(()=>{
    (async ()=>{
        tttState=await getState();
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
                <button class="stop-button">Stop</button>
            </div>
        </div>
    </div>
</div>

<div class="time-table">
    <div class="inner">
        {#each tttState.allTasks as task (task.id)}
            <TimeRow timeEntry={task} onPlay={onEntryPlayClick}/>
        {/each}

        <!-- <div class="day-header">
            <div class="title">
                Sat, Jun 5 (Today)
            </div>

            <div class="duration">
                02:04:19
            </div>
        </div>

        {#each timeRowData1 as timedata (timedata.id)}
            <TimeRow timeEntry={timedata}/>
        {/each}

        <div class="day-header">
            <div class="title">
                Friday, Jun 4 (Yesterday)
            </div>

            <div class="duration">
                01:19:12
            </div>
        </div>

        {#each timeRowData2 as timedata (timedata.id)}
            <TimeRow timeEntry={timedata}/>
        {/each} -->
    </div>
</div>