import * as yargs from "yargs";

import { ActionHandlers } from "./";

import { IActionHandler } from "../models/actionHandlers";
import { Helpers } from "../helpers";

export class ActionHandlerAdd implements IActionHandler {
  public static actionName = "add";
  /**
   * Register the class with the action handler
   */
  public static registerWithActionHandlers(): void {
    ActionHandlers.registerHandler(ActionHandlerAdd.actionName, ActionHandlerAdd);
  }

  /**
   * Register usage help string for this class, this method is automatically called by ActionHandler 
   * upon registration of this module
   */
  public static addUsage(yargs: yargs.Yargs): yargs.Yargs {
    return yargs
      .command(ActionHandlerAdd.actionName + " app", "Create a new app")
      .command(ActionHandlerAdd.actionName + " admin", "Add a admin user");
  }

  /**
   * cli command related to this class are dispatched to this method by the base ActionHandler class
   */
  public app(yargs: yargs.Yargs) {
    let options: any = yargs
    .alias("n", "name")
    .string("n")
    .describe("name", "name of the new app to be created")
    .alias("k", "api-key")
    .string("k")
    .describe("api-key", "api key for the new app")
    .demand(["name", "api-key"]).argv;

    let postData = {
      keys: [options.apiKey],
      name: options.name,
    };

    Helpers.login(Helpers.environment.email, Helpers.environment.password, () => {

    });
  }

  public admin(yargs: yargs.Yargs, callback: () => void) {
    let options: any = yargs
    .alias("e", "email")
    .string("e")
    .describe("email", "email of the admin user, also used for logging in")
    .alias("p", "password")
    .string("p")
    .describe("password", "password of the admin user")
    .demand(["email", "password"]).argv;

    let postData = {
      email: options.email,
      password: options.password,
    };

    Helpers.doTelepatRequest("/admin/add", postData, (parsedResponse) => {
      if(parsedResponse.status!==200) throw parsedResponse
      /* tslint:disable: no-console */
      console.log("Admin created. Trying to log in...");
      /* tslint:enable: no-console */

      Helpers.environment.email = options.email;
      Helpers.environment.password = options.password;
      Helpers.setEnvironment();

      setTimeout(() => {
        Helpers.login(options.email, options.password, () => {
          if (typeof callback !== "undefined") {
            callback();
          }
        });
      }, 1000);
    });
  }
}
