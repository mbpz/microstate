import { Store, Listener, Updater, Middleware, MiddlewareAPI } from './types';

export interface StoreOptions<T> {
    name?: string;
    storage?: Storage;
}

export class MicroStore<T> implements Store<T> {
    private state: T;
    private listeners: Set<Listener<T>> = new Set();
    private options: StoreOptions<T>;
    private middlewares: Middleware<T>[] = [];

    constructor(initialState: T, options: StoreOptions<T> = {}) {
        this.options = {
            storage: typeof window !== 'undefined' ? window.localStorage : undefined,
            ...options
        };

        // 尝试从存储中恢复状态
        if (this.options.name && this.options.storage) {
            const savedState = this.options.storage.getItem(this.options.name);
            if (savedState) {
                try {
                    this.state = JSON.parse(savedState);
                } catch (e) {
                    console.warn(`Failed to parse saved state for store "${this.options.name}"`, e);
                    this.state = initialState;
                }
            } else {
                this.state = initialState;
            }
        } else {
            this.state = initialState;
        }
    }

    public getState(): T {
        return this.state;
    }

    public use(middleware: Middleware<T>): void {
        this.middlewares.push(middleware);
    }

    private async applyMiddlewares(currentState: T, nextState: T): Promise<T> {
        const api: MiddlewareAPI<T> = {
            getState: () => this.state,
            dispatch: (updater: Updater<T>) => this.update(updater)
        };

        let resultState = nextState;
        
        for (const middleware of this.middlewares) {
            resultState = await middleware(api)(currentState, resultState);
        }
        
        return resultState;
    }

    public async update(updater: Updater<T>): Promise<void> {
        const currentState = this.state;
        const nextState = await updater(currentState);
        
        if (nextState !== currentState) {
            // Apply middlewares
            const finalState = await this.applyMiddlewares(currentState, nextState);
            
            this.state = finalState;
            
            // 保存到存储
            if (this.options.name && this.options.storage) {
                try {
                    this.options.storage.setItem(this.options.name, JSON.stringify(this.state));
                } catch (e) {
                    console.warn(`Failed to save state for store "${this.options.name}"`, e);
                }
            }

            this.notify();
        }
    }

    public subscribe(listener: Listener<T>): () => void {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }

    private notify(): void {
        this.listeners.forEach(listener => listener(this.state));
    }

    // 清除持久化的数据
    public clear(): void {
        if (this.options.name && this.options.storage) {
            this.options.storage.removeItem(this.options.name);
        }
    }
}