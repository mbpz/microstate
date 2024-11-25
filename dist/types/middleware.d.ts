import { Middleware } from './types';
export declare const logger: Middleware<any>;
export declare const persistence: (key: string) => Middleware<any>;
