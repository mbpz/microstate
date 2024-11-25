import { Store, Action, Listener, Middleware, Reducer } from './types';
export declare class MicroStore<T> implements Store<T> {
    private state;
    private listeners;
    private middlewares;
    private reducers;
    constructor(initialState: T);
    getState(): T;
    dispatch(action: Action): void;
    subscribe(listener: Listener<T>): () => void;
    use(middleware: Middleware<T>): void;
    addReducer(reducer: Reducer<T>): void;
    private notify;
}
