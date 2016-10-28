import { LocalStorage } from "node-localstorage";
import { IEnvironment, IPostOptions } from "./models/helpers";
export declare class Helpers {
    static ls: LocalStorage;
    static environment: IEnvironment;
    static getEnvironment(): IEnvironment;
    static getUserHome(): string;
    static getTelepatDir(): string;
    static login(email: string, password: string, callback: () => void): void;
    static doTelepatRequest(path: string, postData: any, callback: (jsonObject: any) => void, method?: string, appId?: string): void;
    static doRequest(postOptions: IPostOptions, postData?: any, callback?: (jsonObject: any) => void): void;
}
