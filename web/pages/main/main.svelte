<script lang="ts">
import TimeRow from "@/components/time-row/time-row.svelte";

</script>

<style lang="sass">
    @use "./main.sass"
</style>

<div class="container">
    <div class="task-adder">
        <p>Start New Task</p>
        <input type="text" list="task-auto-complete" class="task-input"/>

        <datalist id="task-auto-complete">
            <option value="Email follow-up"></option>
            <option value="Code review"></option>
            <option value="Sprint planning"></option>
            <option value="Bug fixing"></option>
            <option value="Design mockups"></option>
        </datalist>

        <button class="start-button">Start</button>
    </div>

    <div class="task-timer">
        <p>current task: <span class="task-text">Doing Something</span></p>

        <div class="timer">
            <h3>00:15:13</h3>
            <button class="stop-button">Stop</button>
        </div>
    </div>

    <div class="time-table">
        <div class="day-header">
            <div class="title">
                Sat, Jun 5 (Today)
            </div>

            <div class="duration">
                02:04:19
            </div>
        </div>

        <TimeRow/>
        <TimeRow/>
        <TimeRow/>

        <div class="day-header">
            <div class="title">
                Friday, Jun 4 (Yesterday)
            </div>

            <div class="duration">
                01:19:12
            </div>
        </div>

        <TimeRow/>
    </div>
</div>