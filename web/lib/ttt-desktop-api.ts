import {
    TaskState,
    StartTask,
    StopTask,
    EditTask,
    EditTasks2,
    OpenDataFolder,
    Close,
} from "@/wailsjs/go/main/TTTApp";

/** get ttt state */
export async function getState(): Promise<TTTState> {
    return TaskState();
}

/** start a task with the given title. returns the new state */
export async function startTask(title: string): Promise<TTTState> {
    return StartTask({ title });
}

/** stop the current task */
export async function stopTask(): Promise<TTTState> {
    return StopTask();
}

/** submit task to be edited */
export async function editTask(task: TimeEntry): Promise<TTTState> {
    return EditTask(task);
}

/** submit tasks to be edited */
export async function editTasks2(edits: TimeEntryEdit[]): Promise<TTTState> {
    return EditTasks2(edits);
}

/** send request to open the data dir */
export async function openDataDir(): Promise<void> {
    return OpenDataFolder();
}

/** send request to close */
export async function closeProgram(): Promise<void> {
    return Close();
}
