'use strict';

class MicroStore {
    constructor(initialState) {
        this.listeners = new Set();
        this.middlewares = [];
        this.reducers = [];
        this.state = initialState;
    }
    getState() {
        return this.state;
    }
    dispatch(action) {
        let newState = this.state;
        // 应用所有reducers
        for (const reducer of this.reducers) {
            newState = reducer(newState, action);
        }
        // 应用所有中间件
        for (const middleware of this.middlewares) {
            newState = middleware(newState, action);
        }
        if (newState !== this.state) {
            this.state = newState;
            this.notify();
        }
    }
    subscribe(listener) {
        this.listeners.add(listener);
        // 返回取消订阅函数
        return () => {
            this.listeners.delete(listener);
        };
    }
    use(middleware) {
        this.middlewares.push(middleware);
    }
    addReducer(reducer) {
        this.reducers.push(reducer);
    }
    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }
}

exports.MicroState = MicroStore;
//# sourceMappingURL=index.js.map
