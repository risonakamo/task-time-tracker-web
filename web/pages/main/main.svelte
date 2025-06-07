<script lang="ts">
import TimeRow from "@/components/time-row/time-row.svelte";

const timeRowData1: TimeEntry[] = [
  {
    id: "a1b2c",
    name: "Design UI",
    timeStart: 1717801200, // 2024-06-07 09:00:00 UTC
    timeEnd: 1717804800,   // 2024-06-07 10:00:00 UTC
    duration: 3600,
  },
  {
    id: "d3e4f",
    name: "Code Backend",
    timeStart: 1717808400, // 2024-06-07 11:00:00 UTC
    timeEnd: 1717812000,   // 2024-06-07 12:00:00 UTC
    duration: 3600,
  },
  {
    id: "g5h6i",
    name: "Design UI",
    timeStart: 1717815600, // 2024-06-07 13:00:00 UTC
    timeEnd: 1717817400,   // 2024-06-07 13:30:00 UTC
    duration: 1800,
  },
  {
    id: "j7k8l",
    name: "Meeting",
    timeStart: 1717818000, // 2024-06-07 13:40:00 UTC
    timeEnd: 1717821600,   // 2024-06-07 14:40:00 UTC
    duration: 3600,
  },
  {
    id: "m9n0o",
    name: "Code Backend",
    timeStart: 1717822200, // 2024-06-07 14:50:00 UTC
    timeEnd: 1717824000,   // 2024-06-07 15:20:00 UTC
    duration: 1800,
  }
];

const timeRowData2: TimeEntry[] = [
  {
    id: "p1q2r",
    name: "Write Docs",
    timeStart: 1717887600, // 2024-06-08 09:00:00 UTC
    timeEnd: 1717891200,   // 2024-06-08 10:00:00 UTC
    duration: 3600,
  },
  {
    id: "s3t4u",
    name: "Team Review",
    timeStart: 1717894800, // 2024-06-08 11:00:00 UTC
    timeEnd: 1717898400,   // 2024-06-08 12:00:00 UTC
    duration: 3600,
  },
  {
    id: "v5w6x",
    name: "Code Backend",
    timeStart: 1717902000, // 2024-06-08 13:00:00 UTC
    timeEnd: 1717904700,   // 2024-06-08 13:45:00 UTC
    duration: 2700,
  }
];

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
        {/each}
    </div>
</div>