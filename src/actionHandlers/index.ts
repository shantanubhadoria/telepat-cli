import {
  IActionHandler,
  IActionHandlerClass,
  IHandlersHash,
} from "../models/actionHandlers";
import * as yargs from "yargs";

export class ActionHandlers {
  public static handlers: IHandlersHash = {};
  public static yargs = yargs.usage("Usage: \n  $0 <action> <subject> options");

  /**
   * Called by other Action handlers to register themselves with the ActionHandler.
   */
  public static registerHandler(actionName: string, handler: IActionHandlerClass): void {
    this.yargs = handler.addUsage(this.yargs);
    let handlerObject = new handler();

    ActionHandlers.handlers[actionName] = handlerObject;
  }

  /**
   * dispatches command to the provided subject of action handler registered for the provided action
   * in case action handler isn't registered, throws a console warning with usage information.
   */
  public static dispatch() {
    this.yargs = this.yargs.demand(2);
    let argv = this.yargs.argv;
    let [handlerName, method] = argv._;

    let handler: IActionHandler;
    if (handlerName in ActionHandlers.handlers) {
      handler = ActionHandlers.handlers[handlerName];
    } else {
      console.error("Invalid <action>, see below for usage and available commands");
      this.yargs.showHelp();
      return;
    }

    if (
      method in handler
      && typeof handler[method] === "function"
    ) {
      handler[method].call(handler[method], yargs);
    } else {
      console.error("Invalid <subject>, see below for usage and available commands");
      this.yargs.showHelp();
      return;
    }
  }

}
