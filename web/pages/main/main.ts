import {mount} from "svelte";
import MainApp from "./main.svelte";

function main():void
{
    mount(MainApp,{target:document.body});
}

window.onload=main;
