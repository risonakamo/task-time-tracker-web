// ttt types used by web page

/** container of task titles. key: id of a task. val: edited (or not) title of
 *  the task */
type TaskTitlesDict=Record<string,string>

/** tasks grouped by id. key: task id. val: the task */
type TaskDict=Record<string,TimeEntry>

/** edit time values of tasks. key: task id. val: the current value of the time
 *  text boxes of the task */
type EditedTimesDict=Record<string,EditedTimes>

/** edited time input values */
interface EditedTimes
{
    startTime:string
    endTime:string
}