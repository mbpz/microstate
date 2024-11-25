interface TodoState {
    todos: Array<{
        id: number;
        text: string;
        completed: boolean;
        createdAt: string;
    }>;
    filter: 'all' | 'active' | 'completed';
    loading: boolean;
    error: string | null;
}
declare const initialState: TodoState;
declare const store: MicroState<TodoState>;
declare const delay: (ms: number) => Promise<unknown>;
declare function fetchTodos(): Promise<void>;
declare function addTodo(text: string): void;
declare function toggleTodo(id: number): void;
declare function deleteTodo(id: number): void;
declare function setFilter(filter: TodoState['filter']): void;
declare function clearCompleted(): void;
