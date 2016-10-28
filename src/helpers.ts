import { SHA256 } from "crypto-js";
import * as fs from "fs";
import * as http from "http";
import { LocalStorage } from "node-localstorage";

import {
  IEnvironment,
  IPostOptions,
} from "./models/helpers";

export class Helpers {
  /**
   * Local storage object set inside telepat folder.
   */
  public static ls = new LocalStorage(Helpers.getTelepatDir() + "/settings-storage");
  /**
   * Environment object with environment variables for telepat, use getEnvironment to set it 
   * afresh from local storage. 
   */
  public static environment: IEnvironment;

  /**
   * Gets environment variables from the local storage
   */
  public static getEnvironment(): IEnvironment {
    let environmentString: string = this.ls.getItem("env_vars");

    if (environmentString === null) {
      environmentString = "{}";
    }
    Helpers.environment = JSON.parse(environmentString);
    return Helpers.environment;
  }
  public static setEnvironment() {
    Helpers.ls.setItem("env_vars", JSON.stringify(Helpers.environment));
  }
  /**
   * Gets the user's home folder
   */
  public static getUserHome(): string {
    return process.env[(process.platform === "win32") ? "USERPROFILE" : "HOME"];
  }
  /**
   * Get Telepat configuration folder e.g. ~/.telepat-cli
   */
  public static getTelepatDir(): string {
    let dir: string = Helpers.getUserHome() + "/.telepat-cli";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, 744);
    }
    return dir;
  }

  /**
   * Logs in and calls the optional callback
   */
  public static login(email: string, password: string, callback: () => void) {
    let environment = Helpers.environment;
    let ls = Helpers.ls;
    let postData = JSON.stringify({
      email,
      password,
    });

    Helpers.doTelepatRequest("/admin/login", postData, (parsedResponse) => {
      if (parsedResponse.status === 200) {
        environment.jwt = parsedResponse.content.token;
        ls.setItem("env_vars", JSON.stringify(environment));
        /* tslint:disable: no-console */
        console.log("Admin login OK.");
        /* tslint:enable: no-console */
        if (typeof callback !== "undefined") {
          callback();
        }
      } else {
        /* tslint:disable: no-console */
        console.log("Admin login failed.");
        /* tslint:enable: no-console */
      }
    });
  }

  public static doTelepatRequest(
    path: string,
    postData: any,
    callback: (jsonObject: any) => void,
    method: string = "POST",
    appId?: string,
  ) {
    let environment = Helpers.environment;
    if (typeof environment === "undefined") {
      console.error("Unable to make a request. Environment not defined");
      return;
    }

    // An object of options to indicate where to post to
    let postOptions: IPostOptions = {
      headers: {
          "Content-Type": "application/json",
      },
      host: environment.telepat_host,
      method,
      path,
      port: environment.telepat_port,
    };

    if (typeof environment.jwt !== "undefined") {
      postOptions.headers.Authorization = "Bearer " + environment.jwt;
    }

    if (typeof appId !== "undefined") {
      postOptions.headers["X-BLGREQ-APPID"] = appId;
    }

    Helpers.doRequest(postOptions, postData, callback);
  }

  public static doRequest(postOptions: IPostOptions, postData?: any, callback?: (jsonObject: any) => void) {
    let postRequest = http.request(postOptions, (res) => {
      res.setEncoding("utf8");
      if (typeof callback !== "undefined") {
        res.on("data", (chunk: string) => {
          callback(JSON.parse(chunk));
        });
      } else {
        res.on("data", (chunk: string) => {
          /* tslint:disable: no-console */
          console.log("Response: " + chunk);
          /* tslint:enable: no-console */
        });
      }
    });

    postRequest.on("error", () => {
      /* tslint:disable: no-console */
      console.log("Unable to complete HTTP request");
      /* tslint:enable: no-console */
    });

    // post the data
    if (typeof postData !== "undefined") {
      postRequest.write(postData);
    }

    postRequest.end();
  }
}
