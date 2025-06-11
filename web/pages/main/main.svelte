<script lang="ts">
import {onMount} from "svelte";

import TimeRow from "@/components/time-row/time-row.svelte";
import {getState, startTask} from "@/lib/ttt-api";

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

// on load, get the ttt state.
onMount(()=>{
    (async ()=>{
        tttState=await getState();

        console.log("got state",tttState);
    })();
});

/** clicked start button. send start task request with the contents of the task field,
 *  after cleaning it. doesn't work if empty. clears the task entry field afterward */
async function onClickStart():Promise<void>
{
    var newTaskTitle:string=newTaskTitleField.trim();

    if (newTaskTitle.length==0)
    {
        return;
    }

    tttState=await startTask(newTaskTitle);
    console.log("new state",tttState);

    newTaskTitleField="";
}

</script>

<style lang="sass">
    @use "./main.sass"
</style>

<div class="container">
    <div class="task-adder">
        <p>Start New Task</p>
        <input type="text" list="task-auto-complete" class="task-input"
            placeholder="New Task" bind:value={newTaskTitleField}/>

        <datalist id="task-auto-complete">
            <option value="Email follow-up"></option>
            <option value="Code review"></option>
            <option value="Sprint planning"></option>
            <option value="Bug fixing"></option>
            <option value="Design mockups"></option>
        </datalist>

        <button class="start-button" onclick={onClickStart}>Start</button>
    </div>

    <div class="task-timer">
        <p>current task: <span class="task-text">Doing Something</span></p>

        <div class="timer">
            <h3>00:15:13</h3>
            <button class="stop-button">Stop</button>
        </div>
    </div>

    <div class="time-table">
        {#each tttState.allTasks as task (task.id)}
            {#if task.timeEnd>0}
                <TimeRow timeEntry={task}/>
            {/if}
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