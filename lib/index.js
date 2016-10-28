"use strict";
var actionHandlers_1 = require("./actionHandlers");
var add_1 = require("./actionHandlers/add");
var TelepatCli = (function () {
    function TelepatCli() {
    }
    TelepatCli.execute = function () {
        add_1.ActionHandlerAdd.registerWithActionHandlers();
        actionHandlers_1.ActionHandlers.dispatch();
    };
    return TelepatCli;
}());
exports.TelepatCli = TelepatCli;
