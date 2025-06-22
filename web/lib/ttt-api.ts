// api to interface with ttt

import axios, {type AxiosInstance} from "axios";

const ax:AxiosInstance=axios.create({
    baseURL:window.location.origin,
    validateStatus(status:number):boolean
    {
        return status==200;
    },
});

/** start a task with the given title. returns the new state */
export async function startTask(title:string):Promise<TTTState>
{
    const body:StartTaskReq={
        title,
    };

    return (await ax.post("/start-task",body)).data;
}

/** get ttt state */
export async function getState():Promise<TTTState>
{
    return (await ax.get("/task-state")).data;
}

/** stop the current task */
export async function stopTask():Promise<TTTState>
{
    return (await ax.post("/stop-task")).data;
}

/** submit task to be edited */
export async function editTask(task:TimeEntry):Promise<TTTState>
{
    return (await ax.post("/edit-task",task)).data;
}