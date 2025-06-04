<script lang="ts">

</script>

<style lang="sass">
    @use "./main.sass"
</style>

<div class="container">
    <div class="task-timer">
        <p>current task: <span class="task-text">Doing Something</span></p>
        <h3>00:15:13</h3>
        <button class="stop-button">Stop</button>
    </div>

    <div class="task-adder">
        <p>Start New Task</p>
        <input type="text" list="task-auto-complete" class="task-input"/>

        <datalist id="task-auto-complete">
            <option value="Email follow-up">
            <option value="Code review">
            <option value="Sprint planning">
            <option value="Bug fixing">
            <option value="Design mockups">
        </datalist>

        <button class="start-button">Start</button>
    </div>

    <div class="time-table">
        <div class="time-row">

        </div>
    </div>
</div>