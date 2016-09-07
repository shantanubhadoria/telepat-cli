var http = require('http');
var fs = require('fs');
var SHA256 = require('crypto-js/sha256');

var environment={
	telepat_host: undefined,
	telepat_port: undefined,
	elasticsearch_host: undefined,
	elasticsearch_port: undefined,
    jwt: undefined,
    email: undefined,
    password: undefined,
    telepat_user: undefined,
    telepat_user_password: undefined,
	appId: undefined,
	apiKey: undefined,
	contextId: undefined
};
var ls;

if (typeof ls === "undefined" || ls === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  ls = new LocalStorage(getTelepatDir()+'/settings-storage');
}

function doTelepatRequest(path, post_data, callback, app_id, method) {
	if(environment===undefined) return;
	if(method===undefined) method = 'POST';
	// An object of options to indicate where to post to
	var post_options = {
	  host: environment.telepat_host,
	  port: environment.telepat_port,
	  path: path,
	  method: method,
	  headers: {
	      'Content-Type': 'application/json'
	      //'Content-Length': post_data.length
	  }
	};

	if(environment.jwt !== undefined) {
		post_options.headers["Authorization"] = "Bearer "+environment.jwt;
	}

	if(app_id !== undefined) {
		post_options.headers["X-BLGREQ-APPID"] = app_id;
	}

	doRequest(post_options, post_data, callback);
}

function doRequest(post_options, post_data, callback) {
	// Set up the request
	if(post_options.host===undefined) {
		console.log("No hostname was set");
		return;
	}
	var post_req = http.request(post_options, function(res) {
		res.setEncoding('utf8');
		if(callback!==undefined && callback!==null) {
			res.on('data', function (chunk) {
				//console.log(chunk);
				callback(JSON.parse(chunk));
			});
		}
		else {
			res.on('data', function (chunk) {
				console.log('Response: ' + chunk);
			});
		}
	});

	post_req.on('error', function () {
		console.log('Unable to complete HTTP request');
	});
	// post the data
	if(post_data!==null)
		post_req.write(post_data);
	post_req.end();
}

function setEnv(env) {
	environment = env;
}

function setEnvKey(key, value) {
	environment[key] = value;
	ls.setItem("env_vars", JSON.stringify(environment));
}

function retrieveEnv() {
	var env_vars = ls.getItem('env_vars');
	if(env_vars === null) env_vars = "{}";
	environment = JSON.parse(env_vars);
	return environment;
}

function login(email, password, callback) {
	var post_data = JSON.stringify({
	  'email' : email,
	  'password': password
	});
	doTelepatRequest("/admin/login", post_data, function(parsedResponse) {
		if(parsedResponse.status==200) {
			environment.jwt = parsedResponse.content.token;
			ls.setItem('env_vars', JSON.stringify(environment));
            console.log("Admin login OK.");
			if(callback!==undefined) callback();
		}
		else 
			console.log("Admin login failed.");
	});
}

function retrieveArgument(needle, haystack) {
	var value = haystack[needle];
	if(value === undefined && environment[needle]!==undefined) {
		value = environment[needle];
	}
	return value;
}

function getUserHome() {
	return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

function getTelepatDir() {
	var dir = getUserHome() + '/.telepat-cli';
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir,0744);
	}
	return getUserHome()+'/.telepat-cli';
}

exports.doTelepatRequest=doTelepatRequest;
exports.doRequest=doRequest;
exports.setEnv=setEnv;
exports.setEnvKey=setEnvKey;
exports.retrieveEnv=retrieveEnv;
exports.login=login;
exports.retrieveArgument=retrieveArgument;