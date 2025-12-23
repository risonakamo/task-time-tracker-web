<script lang="ts">
var {
    newTaskTitleField=$bindable(),
    uniqueTaskNames,
    currentTaskText,
    currentTaskTimer,
    currentTaskValid,

    onTitleInputKey,
    onClickStart,
    onStopClick,
}:{
    newTaskTitleField:string
    uniqueTaskNames:string[]
    currentTaskText:string
    currentTaskTimer:string
    currentTaskValid:boolean

    onTitleInputKey(e:KeyboardEvent):void
    onClickStart():void
    onStopClick():void
}=$props();
</script>

<style lang="sass">
    @use "./task-adder.sass"
</style>

<div class="task-adder">
    <div class="input-zone">
        <input type="text" list="task-auto-complete" class="task-input"
            placeholder="New Task" bind:value={newTaskTitleField}
            onkeydown={onTitleInputKey}/>

        <datalist id="task-auto-complete">
            {#each uniqueTaskNames as taskName (taskName)}
                <option value={taskName}></option>
            {/each}
        </datalist>
    </div>

    <div class="bottom">
        <div class="left">
            <p>current task -> <span class="task-text">{currentTaskText}</span></p>

            <div class="timer">
                <h3>{currentTaskTimer}</h3>
            </div>
        </div>

        <div class="right">
            <!-- <button class="start-button" onclick={onClickStart}>Start</button>
            <button class="stop-button" onclick={onStopClick}
                disabled={!currentTaskValid}
            >
                Stop
            </button> -->

            <div class="double-button">
                <div class="left2 disabled">
                    <s><h2>Start</h2></s>
                </div>
                <div class="right2">
                    <h2>Stop</h2>
                </div>
            </div>
        </div>
    </div>
</div>