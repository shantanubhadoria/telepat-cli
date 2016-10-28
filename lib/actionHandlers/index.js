"use strict";
var yargs = require("yargs");
var ActionHandlers = (function () {
    function ActionHandlers() {
    }
    ActionHandlers.registerHandler = function (actionName, handler) {
        this.yargs = handler.addUsage(this.yargs);
        var handlerObject = new handler();
        ActionHandlers.handlers[actionName] = handlerObject;
    };
    ActionHandlers.dispatch = function () {
        this.yargs = this.yargs.demand(2);
        var argv = this.yargs.argv;
        var _a = argv._, handlerName = _a[0], method = _a[1];
        var handler;
        if (handlerName in ActionHandlers.handlers) {
            handler = ActionHandlers.handlers[handlerName];
        }
        else {
            console.error("Invalid <action>, see below for usage and available commands");
            this.yargs.showHelp();
            return;
        }
        if (method in handler
            && typeof handler[method] === "function") {
            handler[method].call(handler[method], yargs);
        }
        else {
            console.error("Invalid <subject>, see below for usage and available commands");
            this.yargs.showHelp();
            return;
        }
    };
    ActionHandlers.handlers = {};
    ActionHandlers.yargs = yargs.usage("Usage: \n  $0 <action> <subject> options");
    return ActionHandlers;
}());
exports.ActionHandlers = ActionHandlers;
