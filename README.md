# MicroState

A lightweight, framework-agnostic state management library with comprehensive TypeScript support.

## Features

- 🎯 **Framework Agnostic**: Works with any JavaScript framework or vanilla JS
- 📦 **Lightweight**: Minimal bundle size with zero dependencies
- 💪 **TypeScript First**: Complete type safety and excellent IDE support
- 🔄 **Immutable Updates**: Predictable state changes with immutable patterns
- 🔌 **Middleware Support**: Extensible with custom middleware
- 🎨 **Multiple Module Formats**: Support for ESM, CommonJS, and UMD

## Installation

```bash
npm install microstate
```

## Basic Usage

```typescript
import { MicroState } from 'microstate';

// Define your state type
interface CounterState {
  count: number;
  lastUpdated: string;
}

// Create initial state
const initialState: CounterState = {
  count: 0,
  lastUpdated: new Date().toISOString()
};

// Create store instance
const store = new MicroState<CounterState>(initialState);

// Add middleware (optional)
store.use((state, action) => {
  console.log('Previous State:', state);
  console.log('Action:', action);
  return state;
});

// Add reducer
store.addReducer((state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + 1,
        lastUpdated: new Date().toISOString()
      };
    case 'DECREMENT':
      return {
        ...state,
        count: state.count - 1,
        lastUpdated: new Date().toISOString()
      };
    default:
      return state;
  }
});

// Subscribe to state changes
store.subscribe((state) => {
  console.log('New state:', state);
});

// Dispatch actions
store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'DECREMENT' });
```

## Framework Integration Examples

### React Example

```typescript
import { MicroState } from 'microstate';
import { useEffect, useState } from 'react';

// Define state type
interface TodoState {
  todos: Array<{ id: number; text: string; completed: boolean }>;
  filter: 'all' | 'active' | 'completed';
}

// Create store
const todoStore = new MicroState<TodoState>({
  todos: [],
  filter: 'all'
});

// Custom hook for using MicroState
function useMicroState<T>(store: MicroState<T>) {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    return store.subscribe(setState);
  }, [store]);

  return state;
}

// Todo component
function TodoApp() {
  const state = useMicroState(todoStore);

  const addTodo = (text: string) => {
    todoStore.dispatch({
      type: 'ADD_TODO',
      payload: { id: Date.now(), text, completed: false }
    });
  };

  return (
    <div>
      <input
        type="text"
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            addTodo(e.currentTarget.value);
            e.currentTarget.value = '';
          }
        }}
      />
      <ul>
        {state.todos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => todoStore.dispatch({
                type: 'TOGGLE_TODO',
                payload: todo.id
              })}
            />
            <span>{todo.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Vue Example

```typescript
import { MicroState } from 'microstate';
import { ref, onMounted, onUnmounted } from 'vue';

// Define state type
interface CounterState {
  count: number;
}

// Create store
const counterStore = new MicroState<CounterState>({ count: 0 });

// Counter component
export default {
  setup() {
    const count = ref(counterStore.getState().count);

    // Subscribe to state changes
    const unsubscribe = counterStore.subscribe((state) => {
      count.value = state.count;
    });

    // Cleanup subscription
    onUnmounted(() => {
      unsubscribe();
    });

    return {
      count,
      increment: () => counterStore.dispatch({ type: 'INCREMENT' }),
      decrement: () => counterStore.dispatch({ type: 'DECREMENT' })
    };
  }
};
```

## Advanced Features

### Middleware

```typescript
// Logger middleware
store.use((state, action) => {
  console.log('Previous State:', state);
  console.log('Action:', action);
  return state;
});

// Local storage persistence middleware
store.use((state, action) => {
  localStorage.setItem('app-state', JSON.stringify(state));
  return state;
});

// Async middleware
store.use(async (state, action) => {
  if (action.type === 'FETCH_DATA') {
    const response = await fetch('/api/data');
    const data = await response.json();
    return { ...state, data };
  }
  return state;
});
```

### Type-Safe Actions

```typescript
// Define action types
type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'SET_COUNT'; payload: number };

// Create typed store
const store = new MicroState<CounterState, Action>(initialState);

// Type-safe dispatch
store.dispatch({ type: 'INCREMENT' }); // OK
store.dispatch({ type: 'SET_COUNT', payload: 42 }); // OK
store.dispatch({ type: 'UNKNOWN' }); // Type Error
```

## API Reference

### `MicroState<T>`

The main store class.

#### Methods

- `constructor(initialState: T)`: Create a new store instance
- `getState(): T`: Get current state
- `dispatch(action: Action): void`: Dispatch an action
- `subscribe(listener: (state: T) => void): () => void`: Subscribe to state changes
- `use(middleware: Middleware<T>): void`: Add middleware
- `addReducer(reducer: Reducer<T>): void`: Add reducer

### Types

```typescript
type Listener<T> = (state: T) => void;
type Middleware<T> = (state: T, action: Action) => T;
type Reducer<T> = (state: T, action: Action) => T;
type Action = { type: string; payload?: any };
```

## License

MIT