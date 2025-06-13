<script lang="ts">
import {durationFormat, toDateTime, toTimeOnly} from "@/utils/date-conv";

var {
    timeEntry,
    isSubEntry=false,
    selected,

    onPlay,
    onSelect,
}:{
    timeEntry:TimeEntry
    isSubEntry?:boolean
    selected:boolean

    // clicked play button. passes up the time entry that was just clicked
    onPlay(timeEntry:TimeEntry):void

    // toggled select state. gives new desired select state
    onSelect(timeEntry:TimeEntry,newSelectState:boolean):void
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
function onSelectClick():void
{
    onSelect(timeEntry,!selected);
}
</script>

<style lang="sass">
    @use "./time-row.sass"
</style>

<div class="time-row" class:sub-entry={isSubEntry} class:active={isOngoing}>
    <div class="selection">
        <input type="checkbox" checked={selected} onchange={onSelectClick}/>
    </div>

    <div class="sub-rows">
        <a href="javascript:;">▸1</a>
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