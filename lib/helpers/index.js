"use strict";
var node_localstorage_1 = require("node-localstorage");
var Helpers = (function () {
    function Helpers() {
        this.ls = new node_localstorage_1.LocalStorage();
    }
    return Helpers;
}());
exports.Helpers = Helpers;
