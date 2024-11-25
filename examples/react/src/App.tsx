import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { MicroState, Store } from '@microstate';

// React Hook for using MicroState
function useMicroState<T>(store: Store<T>) {
    const [state, setState] = useState<T>(store.getState());

    useEffect(() => {
        return store.subscribe(setState);
    }, [store]);

    return state;
}

// Example usage
interface CounterState {
    count: number;
    loading: boolean;
    history: number[];
    error: string | null;
}

// 创建 store 实例，启用持久化
const counterStore = new MicroState<CounterState>(
    {
        count: 0,
        loading: false,
        history: [],
        error: null
    },
    {
        name: 'counter-app',
        storage: localStorage
    }
);

// Counter component
export default function App() {
    const state = useMicroState<CounterState>(counterStore);

    const increment = useCallback(async () => {
        try {
            await counterStore.update(state => ({
                ...state,
                count: state.count + 1,
                history: [...state.history, state.count],
                error: null
            }));
        } catch (error) {
            await counterStore.update(state => ({
                ...state,
                error: 'Failed to increment counter'
            }));
        }
    }, []);

    const decrement = useCallback(async () => {
        try {
            await counterStore.update(state => ({
                ...state,
                count: state.count - 1,
                history: [...state.history, state.count],
                error: null
            }));
        } catch (error) {
            await counterStore.update(state => ({
                ...state,
                error: 'Failed to decrement counter'
            }));
        }
    }, []);

    const incrementAsync = useCallback(async () => {
        try {
            await counterStore.update(state => ({
                ...state,
                loading: true,
                error: null
            }));

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            await counterStore.update(state => ({
                ...state,
                count: state.count + 1,
                history: [...state.history, state.count],
                loading: false
            }));
        } catch (error) {
            await counterStore.update(state => ({
                ...state,
                loading: false,
                error: 'Failed to increment counter asynchronously'
            }));
        }
    }, []);

    const undo = useCallback(async () => {
        if (state.history.length === 0) return;

        try {
            await counterStore.update(state => ({
                ...state,
                count: state.history[state.history.length - 1],
                history: state.history.slice(0, -1),
                error: null
            }));
        } catch (error) {
            await counterStore.update(state => ({
                ...state,
                error: 'Failed to undo'
            }));
        }
    }, [state.history.length]);

    const reset = useCallback(() => {
        counterStore.clear();
        window.location.reload();
    }, []);

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center' }}>Counter: {state.count}</h1>
            
            {state.error && (
                <div style={{ 
                    color: 'red', 
                    padding: '10px', 
                    marginBottom: '10px',
                    backgroundColor: '#ffebee',
                    borderRadius: '4px'
                }}>
                    {state.error}
                </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button 
                    onClick={decrement} 
                    disabled={state.loading}
                    style={{ flex: 1, padding: '8px' }}
                >
                    -
                </button>
                <button 
                    onClick={increment} 
                    disabled={state.loading}
                    style={{ flex: 1, padding: '8px' }}
                >
                    +
                </button>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button 
                    onClick={incrementAsync} 
                    disabled={state.loading}
                    style={{ flex: 2, padding: '8px' }}
                >
                    {state.loading ? 'Loading...' : 'Increment Async'}
                </button>
                <button 
                    onClick={undo}
                    disabled={state.loading || state.history.length === 0}
                    style={{ flex: 1, padding: '8px' }}
                >
                    Undo
                </button>
            </div>

            <button 
                onClick={reset}
                style={{ 
                    width: '100%', 
                    padding: '8px',
                    backgroundColor: '#ff5252',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px'
                }}
            >
                Reset
            </button>

            {state.history.length > 0 && (
                <div style={{ 
                    marginTop: '20px',
                    padding: '10px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '4px'
                }}>
                    <h3>History</h3>
                    <ul style={{ margin: 0, padding: '0 0 0 20px' }}>
                        {state.history.slice(-5).map((value, index) => (
                            <li key={index}>{value}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}