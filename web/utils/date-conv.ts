// date conversion functions

/** converts to HH:MM */
export function toTimeOnly(unixSeconds:number):string
{
    const date:Date = new Date(unixSeconds * 1000);
    const hours:string = date.getHours().toString().padStart(2, '0');
    const minutes:string = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

/** convert seconds duration into hh:mm:ss */
export function durationFormat(durationSeconds:number):string
{
    const hrs = Math.floor(durationSeconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((durationSeconds % 3600) / 60).toString().padStart(2, '0');
    const secs = Math.floor(durationSeconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
}

/** convert to yyyy/mm/dd hh:mm */
export function toDateTime(unixSeconds: number): string
{
    const date = new Date(unixSeconds * 1000);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${year}/${month}/${day} ${hours}:${minutes}`;
}