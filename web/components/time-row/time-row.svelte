<script lang="ts">
import {durationFormat, toDateTime, toTimeOnly} from "@/utils/date-conv";

var {
    timeEntry,
    isSubEntry=false,
}:{
    timeEntry:TimeEntry
    isSubEntry?:boolean
}=$props();
</script>

<style lang="sass">
    @use "./time-row.sass"
</style>

<div class="time-row" class:sub-entry={isSubEntry}>
    <div class="selection">
        <input type="checkbox"/>
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
        <input type="text" value={toTimeOnly(timeEntry.timeEnd)}
            class="hover-fade-input" title={toDateTime(timeEntry.timeEnd)}/>
    </div>

    <div class="duration">
        {durationFormat(timeEntry.duration)}
    </div>

    <div class="buttons">
        <button>▶</button>
        <button>🗑</button>
    </div>
</div>