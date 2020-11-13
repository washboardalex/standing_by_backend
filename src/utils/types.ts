export declare type fEmptyVoid = () => void;
export declare type fEmptyReturn = () => any;
export declare type fArgVoid = (...args: any[]) => void;
export declare type fArgReturn = (...args: any[]) => any;

export interface AppHeaders {
    'Content-Type': string,
    'Accept-Encoding': string,
    'X-Access-Token'?: string
}

