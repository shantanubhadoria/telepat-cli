"use strict";
var fs = require("fs");
var http = require("http");
var node_localstorage_1 = require("node-localstorage");
var Helpers = (function () {
    function Helpers() {
    }
    Helpers.getEnvironment = function () {
        var environmentString = this.ls.getItem("env_vars");
        if (environmentString === null) {
            environmentString = "{}";
        }
        Helpers.environment = JSON.parse(environmentString);
        return Helpers.environment;
    };
    Helpers.getUserHome = function () {
        return process.env[(process.platform === "win32") ? "USERPROFILE" : "HOME"];
    };
    Helpers.getTelepatDir = function () {
        var dir = Helpers.getUserHome() + "/.telepat-cli";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, 744);
        }
        return dir;
    };
    Helpers.login = function (email, password, callback) {
        var environment = Helpers.environment;
        var ls = Helpers.ls;
        var postData = JSON.stringify({
            email: email,
            password: password
        });
        Helpers.doTelepatRequest("/admin/login", postData, function (parsedResponse) {
            if (parsedResponse.status === 200) {
                environment.jwt = parsedResponse.content.token;
                ls.setItem("env_vars", JSON.stringify(environment));
                console.info("Admin logged in OK.");
                if (typeof callback !== "undefined") {
                    callback();
                }
            }
            else {
                console.info("Admin login failed.");
            }
        });
    };
    Helpers.doTelepatRequest = function (path, postData, callback, method, appId) {
        if (method === void 0) { method = "POST"; }
        var environment = Helpers.environment;
        if (typeof environment === "undefined") {
            console.error("Unable to make a request. Environment not defined");
            return;
        }
        var postOptions = {
            headers: {
                "Content-Type": "application/json"
            },
            host: environment.telepat_host,
            method: method,
            path: path,
            port: environment.telepat_port
        };
        if (typeof environment.jwt !== "undefined") {
            postOptions.headers.Authorization = "Bearer " + environment.jwt;
        }
        if (typeof appId !== "undefined") {
            postOptions.headers["X-BLGREQ-APPID"] = appId;
        }
        Helpers.doRequest(postOptions, postData, callback);
    };
    Helpers.doRequest = function (postOptions, postData, callback) {
        var postRequest = http.request(postOptions, function (res) {
            res.setEncoding("utf8");
            if (typeof callback !== "undefined") {
                res.on("data", function (chunk) {
                    callback(JSON.parse(chunk));
                });
            }
            else {
                res.on("data", function (chunk) {
                    console.log("Response: " + chunk);
                });
            }
        });
        postRequest.on("error", function () {
            console.log("Unable to complete HTTP request");
        });
        if (typeof postData !== "undefined") {
            postRequest.write(postData);
        }
        postRequest.end();
    };
    Helpers.ls = new node_localstorage_1.LocalStorage(Helpers.getTelepatDir() + "/settings-storage");
    return Helpers;
}());
exports.Helpers = Helpers;
