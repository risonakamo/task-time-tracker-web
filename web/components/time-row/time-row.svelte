<script lang="ts">
import {durationFormat, toTimeOnly} from "@/utils/date-conv";

var {
    timeEntry,
}:{
    timeEntry:TimeEntry
}=$props();
</script>

<style lang="sass">
    @use "./time-row.sass"
</style>

<div class="time-row">
    <div class="selection">
        <input type="checkbox"/>
    </div>

    <div class="sub-rows">
        1
    </div>

    <div class="title">
        <input type="text" bind:value={timeEntry.name} class="hover-fade-input"/>
    </div>

    <div class="time-range">
        <input type="text" value={toTimeOnly(timeEntry.timeStart)}
            class="hover-fade-input"/>
        -
        <input type="text" value={toTimeOnly(timeEntry.timeEnd)}
            class="hover-fade-input"/>
    </div>

    <div class="duration">
        {durationFormat(timeEntry.duration)}
    </div>

    <div class="buttons">
        <button>▶</button>
        <button>🗑</button>
    </div>
</div>