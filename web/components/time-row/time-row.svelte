<script lang="ts">
import {durationFormat, toDateTime, toTimeOnly} from "@/utils/date-conv";

var {
    timeEntry,
    isSubEntry=false,
    selected,
    shiftSelectAction,

    onPlay,
    onSelect,
}:{
    timeEntry:TimeEntry
    isSubEntry?:boolean
    selected:boolean
    // what should happen to this item on a shift select
    shiftSelectAction:boolean

    // clicked play button. passes up the time entry that was just clicked
    onPlay(timeEntry:TimeEntry):void

    // toggled select state. gives new desired select state
    onSelect(timeEntry:TimeEntry,newSelectState:boolean,shift:boolean):void
}=$props();

var timeEndTextShort:string=$derived.by(()=>{
    if (timeEntry.timeEnd<0)
    {
        return "...";
    }

    return toTimeOnly(timeEntry.timeEnd);
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
</script>

<style lang="sass">
    @use "./time-row.sass"
</style>

<div class="time-row" class:sub-entry={isSubEntry} class:active={isOngoing}>
    <div class="selection">
        <input type="checkbox" checked={selected} onclick={onSelectClick}/>
    </div>

    <div class="title">
        <input type="text" bind:value={timeEntry.title} class="hover-fade-input"/>
    </div>

    <div class="time-range">
        <input type="text" value={toTimeOnly(timeEntry.timeStart)}
            class="hover-fade-input" title={toDateTime(timeEntry.timeStart)}/>
        -
        <input type="text" value={timeEndTextShort}
            class="hover-fade-input" title={timeEndTextLong}/>
    </div>

    <div class="duration">
        {durationText}
    </div>

    <div class="buttons">
        <button onclick={onPlayClick}>▶</button>
        <button>🗑</button>
    </div>
</div>