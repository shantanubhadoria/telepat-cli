export interface IEnvironment {
    telepat_host: string;
    telepat_port: number;
    elasticsearch_host: string;
    elasticsearch_port: number;
    jwt: string;
    email: string;
    password: string;
    telepat_user: string;
    telepat_user_password: string;
    appId: string;
    apiKey: string;
    contextId: string;
}
export interface IPostOptions {
    host: string;
    headers: any;
    [key: string]: any;
}
