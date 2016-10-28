import * as yargs from "yargs";

export interface IHandlersHash {
  [action: string]: IActionHandler;
}

export interface IActionHandler {
  [actionName: string]: any;
}

export interface IActionHandlerClass {
  new(): IActionHandler;
  registerWithActionHandlers(): void;
  addUsage(yargs: any): yargs.Yargs;
}
