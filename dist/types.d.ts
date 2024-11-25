declare global {
    class MicroState<T = any> {
        constructor(initialState: T, options?: StoreOptions<T>);
        getState(): T;
        update(updater: Updater<T>): void;
        subscribe(listener: Listener<T>): () => void;
        clear(): void;
    }
}
export interface StoreOptions<T> {
    name?: string;
    storage?: Storage;
}
export type Listener<T> = (state: T) => void;
export type Updater<T> = (state: T) => T | Promise<T>;
export interface MiddlewareAPI<T> {
    getState(): T;
    dispatch(updater: Updater<T>): Promise<void>;
}
export type NextMiddleware<T> = (currentState: T, nextState: T) => Promise<T>;
export type Middleware<T> = (api: MiddlewareAPI<T>) => (currentState: T, nextState: T) => Promise<T>;
export interface Store<T> {
    getState(): T;
    update(updater: Updater<T>): Promise<void>;
    subscribe(listener: Listener<T>): () => void;
    clear(): void;
    use(middleware: Middleware<T>): void;
}
export {};
