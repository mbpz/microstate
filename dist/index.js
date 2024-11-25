'use strict';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

class MicroStore {
    constructor(initialState, options = {}) {
        this.listeners = new Set();
        this.middlewares = [];
        this.options = Object.assign({ storage: typeof window !== 'undefined' ? window.localStorage : undefined }, options);
        // 尝试从存储中恢复状态
        if (this.options.name && this.options.storage) {
            const savedState = this.options.storage.getItem(this.options.name);
            if (savedState) {
                try {
                    this.state = JSON.parse(savedState);
                }
                catch (e) {
                    console.warn(`Failed to parse saved state for store "${this.options.name}"`, e);
                    this.state = initialState;
                }
            }
            else {
                this.state = initialState;
            }
        }
        else {
            this.state = initialState;
        }
    }
    getState() {
        return this.state;
    }
    use(middleware) {
        this.middlewares.push(middleware);
    }
    applyMiddlewares(currentState, nextState) {
        return __awaiter(this, void 0, void 0, function* () {
            const api = {
                getState: () => this.state,
                dispatch: (updater) => this.update(updater)
            };
            let resultState = nextState;
            for (const middleware of this.middlewares) {
                resultState = yield middleware(api)(currentState, resultState);
            }
            return resultState;
        });
    }
    update(updater) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentState = this.state;
            const nextState = yield updater(currentState);
            if (nextState !== currentState) {
                // Apply middlewares
                const finalState = yield this.applyMiddlewares(currentState, nextState);
                this.state = finalState;
                // 保存到存储
                if (this.options.name && this.options.storage) {
                    try {
                        this.options.storage.setItem(this.options.name, JSON.stringify(this.state));
                    }
                    catch (e) {
                        console.warn(`Failed to save state for store "${this.options.name}"`, e);
                    }
                }
                this.notify();
            }
        });
    }
    subscribe(listener) {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }
    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }
    // 清除持久化的数据
    clear() {
        if (this.options.name && this.options.storage) {
            this.options.storage.removeItem(this.options.name);
        }
    }
}

exports.MicroState = MicroStore;
//# sourceMappingURL=index.js.map
