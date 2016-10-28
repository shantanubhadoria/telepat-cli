import * as yargs from "yargs";
import { IActionHandler } from "../models/actionHandlers";
export declare class ActionHandlerAdd implements IActionHandler {
    static actionName: string;
    static registerWithActionHandlers(): void;
    static addUsage(yargs: yargs.Yargs): yargs.Yargs;
    app(yargs: yargs.Yargs): void;
}
