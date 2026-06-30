import { TaskState } from "@/wailsjs/go/main/TTTApp";

/** get ttt state */
export async function getState(): Promise<TTTState> {
    return TaskState();
}
