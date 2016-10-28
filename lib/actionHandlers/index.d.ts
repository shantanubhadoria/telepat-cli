import { IActionHandlerClass, IHandlersHash } from "../models/actionHandlers";
import * as yargs from "yargs";
export declare class ActionHandlers {
    static handlers: IHandlersHash;
    static yargs: yargs.Yargs;
    static registerHandler(actionName: string, handler: IActionHandlerClass): void;
    static dispatch(): void;
}
