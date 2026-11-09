import {colord} from "colord";

/** returns random int inclusive */
function randInt(low:number,high:number):number
{
    return Math.floor(Math.random() * (high - low + 1)) + low;
}

/** create random colour with custom values for rows text box */
export function randomCustomColour():string
{
    const randH:number=randInt(0,255);
    const randS:number=randInt(70,86);
    const randL:number=randInt(90,100);

    return colord({
        h:randH,
        s:randS,
        l:randL,
    }).toHex();
}