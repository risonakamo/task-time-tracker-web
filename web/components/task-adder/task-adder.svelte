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

var stopButtonDisabled:boolean=$derived(!currentTaskValid);
var startButtonDisabled:boolean=$derived(newTaskTitleField.length<=0);

var taskInputElement:HTMLInputElement;

/** defocus the text input */
export function defocusInput():void
{
    taskInputElement.blur();
}

/** check if is focused */
export function inputIsFocused():boolean
{
    return taskInputElement==document.activeElement;
}

/** focus the input */
export function focusInput():void
{
    taskInputElement.focus();
}

/** passthrough to on stop click. disabled if stop button disabled */
function onStopClick2():void
{
    if (stopButtonDisabled)
    {
        return;
    }

    onStopClick();
}

/** passthrough to on start click. disable if start button disabled */
function onStartClick2():void
{
    if (startButtonDisabled)
    {
        return;
    }

    onClickStart();
}
</script>

<style lang="sass">
    @use "./task-adder.sass"
</style>

<div class="task-adder">
    <div class="input-zone">
        <input type="text" list="task-auto-complete" class="task-input"
            placeholder="New Task" bind:value={newTaskTitleField}
            onkeydown={onTitleInputKey} bind:this={taskInputElement}/>

        <datalist id="task-auto-complete">
            {#each uniqueTaskNames as taskName (taskName)}
                <option value={taskName}></option>
            {/each}
        </datalist>
    </div>

    <div class="bottom">
        <div class="left">
            <p>
                current task ->
                <span class="task-text" class:active={currentTaskValid}>
                    {currentTaskText}
                </span>
            </p>

            <div class="timer" class:active={currentTaskValid}>
                <h3>{currentTaskTimer}</h3>
            </div>
        </div>

        <div class="right">
            <div class="double-button">
                <div class="left2" onclick={onStartClick2} class:disabled={startButtonDisabled}>
                    <h2>Start</h2>
                </div>
                <div class="right2" onclick={onStopClick2} class:disabled={stopButtonDisabled}>
                    <h2>Stop</h2>
                </div>
            </div>
        </div>
    </div>
</div>