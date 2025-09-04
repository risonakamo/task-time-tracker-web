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

/** convert unix seconds to "Sat, Jun 3" */
export function toWordDate(unixSeconds:number):string
{
    const date = new Date(unixSeconds * 1000);

    const formatted = date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });

    return formatted;
}

/** given a new timestring that looks like 1204, try to set this as the time on
 *  the given original date. the time string can be dirty, will remove all non-numbers
 *  and pad to 4 digits. does nothing if bad conversion */
export function combineTimeStringWithUnixSec(
    newTimeString:string,
    originalDate:number,
):number
{
    newTimeString=newTimeString.replace(/D/g,"");
    newTimeString=newTimeString.padStart(4,"0");

    if (newTimeString.length!=4)
    {
        console.warn("bad conversion - too many digits");
        return originalDate;
    }

    const hours:number=parseInt(newTimeString.slice(0,2));
    const mins:number=parseInt(newTimeString.slice(2,4));

    if (hours>23 || mins>59 || hours<0 || mins<0)
    {
        console.error("hours or mins were invalid");
        return originalDate;
    }

    const newDate:Date=new Date(originalDate*1000);
    newDate.setHours(hours,mins,0,0);

    return newDate.getTime()/1000;
}