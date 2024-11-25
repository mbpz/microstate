import { MicroStore } from './store';
import type { Store, Listener, Updater } from './types';

// 导出类型
export type { Store, Listener, Updater };

// 导出 MicroStore 作为 MicroState
export { MicroStore as MicroState };