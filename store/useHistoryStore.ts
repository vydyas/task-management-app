import { create } from 'zustand'
import { Task } from '@/types'
import { useTaskStore } from './useTaskStore'
import { useCustomFieldsStore } from './useCustomFieldsStore'

interface HistoryState {
  past: Array<{
    tasks: Task[]
    tableOrder: string[]
    boardOrders: { [key in Task['status']]: string[] }
    action: 'delete' | 'add' | 'update' | 'reorder'
    affectedTaskIds?: string[]
  }>
  future: Array<{
    tasks: Task[]
    tableOrder: string[]
    boardOrders: { [key in Task['status']]: string[] }
    action: 'delete' | 'add' | 'update' | 'reorder'
    affectedTaskIds?: string[]
  }>
  canUndo: boolean
  canRedo: boolean
  pushState: (action?: 'delete' | 'add' | 'update' | 'reorder', affectedTaskIds?: string[]) => void
  undo: () => void
  redo: () => void
  clear: () => void
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  past: [],
  future: [],
  canUndo: false,
  canRedo: false,

  pushState: (action = 'update', affectedTaskIds?: string[]) => {
    const currentState = useTaskStore.getState()
    
    set(state => ({
      past: [...state.past, {
        tasks: currentState.tasks,
        tableOrder: currentState.tableOrder,
        boardOrders: currentState.boardOrders,
        action,
        affectedTaskIds
      }],
      future: [],
      canUndo: true,
      canRedo: false
    }))
  },

  undo: () => {
    const { past, future } = get()
    if (past.length === 0) return

    const previousState = past[past.length - 1]
    const currentState = useTaskStore.getState()

    useTaskStore.setState({
      tasks: previousState.tasks,
      tableOrder: previousState.tableOrder,
      boardOrders: previousState.boardOrders
    })

    set(state => ({
      past: state.past.slice(0, -1),
      future: [{
        tasks: currentState.tasks,
        tableOrder: currentState.tableOrder,
        boardOrders: previousState.boardOrders,
        action: previousState.action,
        affectedTaskIds: previousState.affectedTaskIds
      }, ...state.future],
      canUndo: state.past.length > 1,
      canRedo: true
    }))
  },

  redo: () => {
    const { past, future } = get()
    if (future.length === 0) return

    const nextState = future[0]
    const currentState = useTaskStore.getState()

    useTaskStore.setState({
      tasks: nextState.tasks,
      tableOrder: nextState.tableOrder,
      boardOrders: nextState.boardOrders
    })

    set(state => ({
      past: [...state.past, {
        tasks: currentState.tasks,
        tableOrder: currentState.tableOrder,
        boardOrders: nextState.boardOrders,
        action: nextState.action,
        affectedTaskIds: nextState.affectedTaskIds
      }],
      future: state.future.slice(1),
      canUndo: true,
      canRedo: state.future.length > 1
    }))
  },

  clear: () => {
    set({ past: [], future: [], canUndo: false, canRedo: false })
  }
})) 