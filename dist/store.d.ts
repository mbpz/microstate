import { Store, Listener, Updater, Middleware } from './types';
export interface StoreOptions<T> {
    name?: string;
    storage?: Storage;
}
export declare class MicroStore<T> implements Store<T> {
    private state;
    private listeners;
    private options;
    private middlewares;
    constructor(initialState: T, options?: StoreOptions<T>);
    getState(): T;
    use(middleware: Middleware<T>): void;
    private applyMiddlewares;
    update(updater: Updater<T>): Promise<void>;
    subscribe(listener: Listener<T>): () => void;
    private notify;
    clear(): void;
}
