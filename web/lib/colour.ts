import {colord} from "colord";
import {Hashery} from "hashery";

const hashery=new Hashery();

/** returns random int inclusive */
function randInt(low:number,high:number):number
{
    return Math.floor(Math.random() * (high - low + 1)) + low;
}

/** create random colour with custom values for rows text box */
function randomCustomColour():string
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

/** hash a string into a random colour. give alpha as 0-1 */
export function randomCustomColourHash(input:string,alpha:number):string
{
    const randH: number = hashery.toNumberSync(
        input + "+hue",
        { min: 0, max: 360 },
    );

    const randS: number = hashery.toNumberSync(
        input + "+saturation",
        { min: 90, max: 100 },
    );

    const randL: number = hashery.toNumberSync(
        input + "+lightness",
        { min: 70, max: 86 },
    );

    return colord({
        h:randH,
        s:randS,
        l:randL,
        a:alpha,
    }).toHex();
}