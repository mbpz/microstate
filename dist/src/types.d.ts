declare global {
    class MicroState<T = any> {
        constructor(initialState: T);
        getState(): T;
        dispatch(action: Action): void;
        subscribe(listener: Listener<T>): () => void;
        use(middleware: Middleware<T>): void;
        addReducer(reducer: Reducer<T>): void;
    }
}
export type Listener<T> = (state: T) => void;
export type Middleware<T> = (state: T, action: Action) => T;
export type Reducer<T> = (state: T, action: Action) => T;
export type Action = {
    type: 'SET_LOADING';
    payload: boolean;
} | {
    type: 'SET_ERROR';
    payload: string | null;
} | {
    type: 'ADD_TODO';
    payload: string;
} | {
    type: 'TOGGLE_TODO';
    payload: number;
} | {
    type: 'DELETE_TODO';
    payload: number;
} | {
    type: 'SET_FILTER';
    payload: 'all' | 'active' | 'completed';
} | {
    type: 'CLEAR_COMPLETED';
};
export interface Store<T> {
    getState(): T;
    dispatch(action: Action): void;
    subscribe(listener: Listener<T>): () => void;
    use(middleware: Middleware<T>): void;
    addReducer(reducer: Reducer<T>): void;
}
export {};
