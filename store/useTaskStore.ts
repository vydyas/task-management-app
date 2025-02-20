import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { Task } from '@/types';
import { useHistoryStore } from './useHistoryStore';

// Zustand Store
interface TaskStore {
  tasks: Task[];
  tableOrder: string[]; // Array of task IDs in table order
  boardOrders: { [key in Task['status']]: string[] }; // Object with arrays of task IDs for each status
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (sourceIndex: number, destinationIndex: number, status?: Task['status']) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      tableOrder: [], // Maintains table view order
      boardOrders: { todo: [], in_progress: [], done: [] }, // Maintains board view order
      
      setTasks: (tasks) => {
        set((state) => {
          const taskIds = tasks.map(task => task.id);
          const result = {
            ...state,
            tasks,
            tableOrder: taskIds,
            boardOrders: {
              todo: tasks.filter(t => t.status === 'todo').map(t => t.id),
              in_progress: tasks.filter(t => t.status === 'in_progress').map(t => t.id),
              done: tasks.filter(t => t.status === 'done').map(t => t.id)
            }
          };
          console.log('Tasks updated:', result);
          return result;
        });
        useHistoryStore.getState().pushState();
      },

      addTask: (task) => {
        set((state) => {
          const newTask = {
            ...task,
            customFields: task.customFields || {}
          }
          const newState = {
            ...state,
            tasks: [...state.tasks, newTask],
            tableOrder: [...state.tableOrder, newTask.id],
            boardOrders: {
              ...state.boardOrders,
              [newTask.status]: [...state.boardOrders[newTask.status], newTask.id]
            }
          };
          console.log('Task added:', newState);
          return newState;
        });
        useHistoryStore.getState().pushState('add', [task.id]);
      },

      updateTask: (id, updates) => {
        set((state) => {
          const oldTask = state.tasks.find(t => t.id === id)
          const newTasks = state.tasks.map(task => 
            task.id === id 
              ? { 
                  ...task, 
                  ...updates,
                  customFields: {
                    ...(task.customFields || {}),
                    ...(updates.customFields || {})
                  }
                } 
              : task
          )
          
          const newState = oldTask && 'status' in updates && updates.status !== oldTask.status
            ? {
                ...state,
                tasks: newTasks,
                boardOrders: {
                  ...state.boardOrders,
                  [oldTask.status]: state.boardOrders[oldTask.status].filter(taskId => taskId !== id),
                  [updates.status!]: [...state.boardOrders[updates.status!], id]
                }
              }
            : { ...state, tasks: newTasks };
          
          console.log('Task updated:', newState);
          return newState;
        });
        useHistoryStore.getState().pushState();
      },

      deleteTask: (id) => {
        set((state) => {
          const task = state.tasks.find(t => t.id === id);
          if (!task) return state;

          const newState = {
            ...state,
            tasks: state.tasks.filter(t => t.id !== id),
            tableOrder: state.tableOrder.filter(taskId => taskId !== id),
            boardOrders: {
              ...state.boardOrders,
              [task.status]: state.boardOrders[task.status].filter(taskId => taskId !== id)
            }
          };
          console.log('Task deleted:', newState);
          return newState;
        });
        useHistoryStore.getState().pushState('delete', [id]);
      },

      reorderTasks: (sourceIndex, destinationIndex, status) => {
        set((state) => {
          if (status) {
            // Board view reordering
            const statusOrder = [...state.boardOrders[status]];
            const [removed] = statusOrder.splice(sourceIndex, 1);
            statusOrder.splice(destinationIndex, 0, removed);
            
            const newState = {
              boardOrders: {
                ...state.boardOrders,
                [status]: statusOrder
              }
            };
            return newState;
          } else {
            // Table view reordering
            const newTableOrder = [...state.tableOrder];
            const [removed] = newTableOrder.splice(sourceIndex, 1);
            newTableOrder.splice(destinationIndex, 0, removed);
            
            const newState = { 
              ...state,
              tableOrder: newTableOrder 
            };
            return newState;
          }
        });
        useHistoryStore.getState().pushState();
      },
    }),
    { 
      name: 'task-storage',
      version: 1, // Add version for future migrations
      onRehydrateStorage: () => (state) => {
        console.log('Hydrated state:', state);
      },
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          try {
            return JSON.parse(str);
          } catch (e) {
            console.error('Error parsing stored data:', e);
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value));
            console.log('Stored data:', value);
          } catch (e) {
            console.error('Error storing data:', e);
          }
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
