var BaseController = function(helpers, arguments, environment) {
    //console.log(helpers);
    //console.log(arguments);
    this.helpers = helpers;
    this.arguments = arguments;
    this.environment = environment;
    return this;
};
BaseController.prototype.helpers = undefined;
BaseController.prototype.arguments = undefined;
BaseController.prototype.environment = undefined;
BaseController.prototype.mainController = undefined;
BaseController.prototype.registeredControllers = [];
BaseController.prototype.route = 'none';

BaseController.prototype.canRespondTo = function (route) {
    if(route===this.route) return true;
    return false;
};

BaseController.prototype.respond = function (action, callback) {
    if(this.__proto__.hasOwnProperty(action)) {
        this[action].call(this, callback);
    } else {
        this.unknownAction.call(this, this.route, action);
        if(callback!==undefined) callback();
    }
};

BaseController.prototype.unknownAction = function(route, action) {
    console.log(action+" is an unknown action for "+route);
};

BaseController.prototype.perform = function (mainAction, secondaryAction, arguments, callback) {
    var controllerFound = false;
    var args = arguments;
    this.registeredControllers.forEach(function (controller) {
        if (controller.canRespondTo(mainAction)) {
            controller.respond(secondaryAction, callback);
            controllerFound = true;
        }
    });

    if (!controllerFound) {
        console.log("Unknown command. Valid actions are: add, set, configure, subscribe, list");
        if(callback!==undefined) callback();
    }
};

exports.BaseController = BaseController;