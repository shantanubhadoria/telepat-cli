import { ActionHandlers } from "./actionHandlers";
import { ActionHandlerAdd } from "./actionHandlers/add";
import { Helpers } from "./helpers";

export class TelepatCli {
  public static execute() {
    ActionHandlerAdd.registerWithActionHandlers();

    ActionHandlers.dispatch();
  }
}
