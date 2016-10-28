"use strict";
var _1 = require("./");
var ActionHandlerAdd = (function () {
    function ActionHandlerAdd() {
    }
    ActionHandlerAdd.registerWithActionHandlers = function () {
        _1.ActionHandlers.registerHandler(ActionHandlerAdd.actionName, ActionHandlerAdd);
    };
    ActionHandlerAdd.addUsage = function (yargs) {
        return yargs
            .command(ActionHandlerAdd.actionName + " app", "Create a new app")
            .command(ActionHandlerAdd.actionName + " admin", "Add a admin user");
    };
    ActionHandlerAdd.prototype.app = function (yargs) {
        var options = yargs
            .alias("n", "name")
            .string("n")
            .describe("name", "name of the new app to be created")
            .alias("k", "api-key")
            .string("k")
            .describe("api-key", "api key for the new app")
            .demand(["name", "api-key"]).argv;
        var postData = {
            keys: [options.apiKey],
            name: options.name
        };
    };
    ActionHandlerAdd.actionName = "add";
    return ActionHandlerAdd;
}());
exports.ActionHandlerAdd = ActionHandlerAdd;
