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
        {timeEntry.name}
    </div>

    <div class="time-range">
        {toTimeOnly(timeEntry.timeStart)} - {toTimeOnly(timeEntry.timeEnd)}
    </div>

    <div class="duration">
        {durationFormat(timeEntry.duration)}
    </div>

    <div class="buttons">
        <button>▶</button>
        <button>🗑</button>
    </div>
</div>