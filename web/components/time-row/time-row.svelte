<script lang="ts">
import {durationFormat, toDateTime, toTimeOnly} from "@/utils/date-conv";

var {
    timeEntry,
    isSubEntry=false,
    selected,
    shiftSelectAction,
    title,
    startTime,
    endTime,

    onPlay,
    onSelect,
    onTitleChange,
    onTimeChanged,
}:{
    timeEntry:TimeEntry
    isSubEntry?:boolean
    selected:boolean
    // what should happen to this item on a shift select
    shiftSelectAction:boolean
    title:string
    startTime:string
    endTime:string

    // clicked play button. passes up the time entry that was just clicked
    onPlay(timeEntry:TimeEntry):void

    // toggled select state. gives new desired select state
    onSelect(timeEntry:TimeEntry,newSelectState:boolean,shift:boolean):void

    // title changed
    onTitleChange(timeEntry:TimeEntry,newTitle:string):void

    onTimeChanged(timeEntry:TimeEntry,newTimes:EditedTimes):void
}=$props();

var timeStartTextLong:string=$derived.by(()=>{
    return toDateTime(timeEntry.timeStart);
});

var timeEndTextLong:string=$derived.by(()=>{
    if (timeEntry.timeEnd<0)
    {
        return "...";
    }

    return toDateTime(timeEntry.timeEnd);
});

var durationText:string=$derived.by(()=>{
    if (timeEntry.duration<0)
    {
        return "...";
    }

    return durationFormat(timeEntry.duration);
});

var isOngoing:boolean=$derived(timeEntry.duration<0);

/** edited if the time entry (original title) doesn't match the 2nd title (editable) */
var edited:boolean=$derived(timeEntry.title!=title);

/** edited if the time entry's start/end time converted into time only does not match
 *  the input time */
var startTimeEdited:boolean=$derived.by(()=>{
    // if missing start time somehow, return not edited
    if (!timeEntry.timeStart)
    {
        return false;
    }

    return toTimeOnly(timeEntry.timeStart)!=startTime;
});

var endTimeEdited:boolean=$derived.by(()=>{
    if (!timeEntry.timeEnd || timeEntry.timeEnd<=0)
    {
        return false;
    }

    return toTimeOnly(timeEntry.timeEnd)!=endTime;
});

/** clicked play button. call play click event */
function onPlayClick():void
{
    onPlay(timeEntry);
}

/** clicked checkbox. trigger on select with opposite of current value */
function onSelectClick(e:MouseEvent):void
{
    // for some reason, clicking always toggles the checkbox and ignores the props value.
    // when shift selecting, if the new selection is different to the shift select action,
    // cancel the toggle, as if the toggle occurs, it will be different from the shift
    // select action afterward. if the new selection is equal to the shift select action,
    // allow the toggle, as it is about to happen to become the shift select action
    if (e.shiftKey && !selected!=shiftSelectAction)
    {
        e.preventDefault();
    }

    onSelect(timeEntry,!selected,e.shiftKey);
}

/** title input box changed. trigger event */
function onTitleChange2(e:Event):void
{
    onTitleChange(timeEntry,(e.currentTarget as HTMLInputElement).value);
}

/** start time input box changed. trigger event */
function onStartTimeChange(e:Event):void
{
    onTimeChanged(timeEntry,{
        startTime:(e.currentTarget as HTMLInputElement).value,
        endTime:endTime,
    });
}

/** end time input changed. trigger event */
function onEndTimeChange(e:Event):void
{
    onTimeChanged(timeEntry,{
        startTime:startTime,
        endTime:(e.currentTarget as HTMLInputElement).value,
    });
}

/** key handler for input fields. enter key defocuses the input */
function onKey(e:KeyboardEvent):void
{
    if (e.key=="Enter")
    {
        if (e.currentTarget)
        {
            (e.currentTarget as HTMLElement).blur();
        }
    }
}
</script>

<style lang="sass">
    @use "./time-row.sass"
</style>

<div class="time-row" class:sub-entry={isSubEntry} class:active={isOngoing}>
    <div class="selection">
        <input type="checkbox" checked={selected} onclick={onSelectClick}/>
    </div>

    <div class="title">
        <input type="text" value={title} class="hover-fade-input" onchange={onTitleChange2}
            class:edited={edited} onkeydown={onKey}/>
    </div>

    <div class="time-range">
        <input type="text" value={startTime}
            class="hover-fade-input" title={timeStartTextLong}
            onchange={onStartTimeChange} class:edited={startTimeEdited}
            onkeydown={onKey} readonly={isOngoing}/>
        -
        <input type="text" value={endTime}
            class="hover-fade-input" title={timeEndTextLong}
            onchange={onEndTimeChange} class:edited={endTimeEdited}
            onkeydown={onKey} readonly={isOngoing}/>
    </div>

    <div class="duration">
        {durationText}
    </div>

    <div class="buttons">
        <button onclick={onPlayClick}>▶</button>
        <!-- <button>🗑</button> -->
    </div>
</div>