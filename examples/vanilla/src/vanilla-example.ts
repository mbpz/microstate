// 定义状态接口
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

// 创建初始状态
const initialState: TodoState = {
    todos: [],
    filter: 'all',
    loading: false,
    error: null
};

// 创建 store 实例，启用持久化
const store = new MicroState<TodoState>(initialState, {
    name: 'todo-app',
    storage: localStorage
});

// 模拟异步操作
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 异步操作示例
async function fetchTodos() {
    await store.update(state => ({
        ...state,
        loading: true,
        error: null
    }));

    try {
        await delay(1000);
        const mockTodos = [
            { id: 1, text: 'Learn TypeScript', completed: false, createdAt: new Date().toISOString() },
            { id: 2, text: 'Build a state management library', completed: true, createdAt: new Date().toISOString() }
        ];

        await store.update(state => ({
            ...state,
            todos: [...state.todos, ...mockTodos],
            loading: false
        }));
    } catch (error) {
        await store.update(state => ({
            ...state,
            error: 'Failed to fetch todos',
            loading: false
        }));
    }
}

// 订阅状态变化
store.subscribe((state: TodoState) => {
    console.log('State updated:', state);
    
    // 更新loading状态
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = state.loading ? 'block' : 'none';
    }

    // 显示错误信息
    const errorElement = document.getElementById('error');
    if (errorElement) {
        errorElement.textContent = state.error || '';
        errorElement.style.display = state.error ? 'block' : 'none';
    }

    // 更新todo列表
    const todoList = document.getElementById('todoList');
    if (todoList) {
        const filteredTodos = state.todos.filter(todo => {
            if (state.filter === 'active') return !todo.completed;
            if (state.filter === 'completed') return todo.completed;
            return true;
        });

        todoList.innerHTML = filteredTodos.length === 0
            ? '<div class="empty-state">No todos yet. Add one above!</div>'
            : filteredTodos.map(todo => `
                <li class="${todo.completed ? 'completed' : ''}">
                    <input type="checkbox" 
                           ${todo.completed ? 'checked' : ''} 
                           onchange="toggleTodo(${todo.id})" />
                    <span>${todo.text}</span>
                    <small>${new Date(todo.createdAt).toLocaleString()}</small>
                    <button onclick="deleteTodo(${todo.id})">Delete</button>
                </li>
            `).join('');
    }

    // 更新过滤器按钮状态
    const filterButtons = document.querySelectorAll('.filters button');
    filterButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.filter === state.filter);
    });

    // 更新待办事项计数
    const todoCount = document.getElementById('todoCount');
    if (todoCount) {
        const activeCount = state.todos.filter(todo => !todo.completed).length;
        todoCount.textContent = `${activeCount} item${activeCount === 1 ? '' : 's'} left`;
    }
});

// 辅助函数
function addTodo(text: string) {
    if (!text.trim()) return;
    store.update(state => ({
        ...state,
        todos: [
            ...state.todos,
            {
                id: Date.now(),
                text: text.trim(),
                completed: false,
                createdAt: new Date().toISOString()
            }
        ]
    }));
}

function toggleTodo(id: number) {
    store.update(state => ({
        ...state,
        todos: state.todos.map(todo =>
            todo.id === id
                ? { ...todo, completed: !todo.completed }
                : todo
        )
    }));
}

function deleteTodo(id: number) {
    store.update(state => ({
        ...state,
        todos: state.todos.filter(todo => todo.id !== id)
    }));
}

function setFilter(filter: TodoState['filter']) {
    store.update(state => ({
        ...state,
        filter
    }));
}

function clearCompleted() {
    store.update(state => ({
        ...state,
        todos: state.todos.filter(todo => !todo.completed)
    }));
}

// 重置数据
function resetData() {
    store.clear();
    window.location.reload();
}

// 初始化
fetchTodos();