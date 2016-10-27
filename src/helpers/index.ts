import * as http from "http";
import * as fs from "fs";
import { SHA256 } from "crypto-js";
import { LocalStorage } from "node-localstorage";

import {
  IEnvironment
} from "./models";

export class Helpers {
  public static getUserHome(): string {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
  }
  public static getTelepatDir(): string {
    let dir: string = Helpers.getUserHome() + '/.telepat-cli';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir,744);
    }
    return dir;
  }

  public static ls = new LocalStorage(Helpers.getTelepatDir()+'/settings-storage');;

  public environment: IEnvironment;
  public ls: LocalStorage;

  constructor() {}

}