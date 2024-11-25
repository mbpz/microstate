// 创建store
interface TodoState {
  todos: string[];
  loading: boolean;
}

const initialState: TodoState = {
  todos: [],
  loading: false
};

const store = new MicroStore<TodoState>(initialState);

// 添加中间件
store.use(logger);
store.use(persistence('todos'));

// 订阅状态变化
const unsubscribe = store.subscribe((state) => {
  console.log('State updated:', state);
});

// 派发action
store.dispatch({
  type: 'ADD_TODO',
  payload: 'Learn TypeScript'
});
