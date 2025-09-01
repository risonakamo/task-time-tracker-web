// ttt types used by web page

/** container of task titles. key: id of a task. val: edited (or not) title of
 *  the task */
type TaskTitlesDict=Record<string,string>

/** tasks grouped by id. key: task id. val: the task */
type TaskDict=Record<string,TimeEntry>

/** contained of edited times. key: task id. val: edited times for that task */
type EditedTimesDict=Record<string,EditedTimes>

/** edited start/end times */
interface EditedTimes
{
    start:number
    end:number
}