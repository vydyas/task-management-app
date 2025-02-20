'use client'
import { 
  FunnelIcon, 
  PlusIcon, 
  Cog6ToothIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon 
} from '@heroicons/react/20/solid'
import { useState, useEffect } from 'react'
import { Task } from '@/types'
import { useCustomFieldsStore } from '@/store/useCustomFieldsStore'
import CustomFieldsVisibility from './CustomFieldsVisibility'
import { useHistoryStore } from '@/store/useHistoryStore'
import debounce from 'lodash/debounce'

interface TaskViewHeaderProps {
  onFilter: (filters: TaskViewFilters) => void
  filters: TaskViewFilters
  visibleFields: Set<string>
  onVisibilityChange: (fieldId: string, isVisible: boolean) => void
  onNewTask: () => void
  onCustomFields: () => void
  selectedTasks: Set<string>
  onDeleteSelected: () => void
}

export interface TaskViewFilters {
  title: string
  status: Task['status'] | 'all'
  priority: Task['priority'] | 'all'
  customFields: { [key: string]: string }
}

export default function TaskViewHeader({ 
  onFilter, 
  filters,
  visibleFields,
  onVisibilityChange,
  onNewTask,
  onCustomFields,
  selectedTasks,
  onDeleteSelected
}: TaskViewHeaderProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [localFilters, setLocalFilters] = useState(filters)
  const { fields } = useCustomFieldsStore()
  const { canUndo, canRedo, undo, redo } = useHistoryStore()

  const debouncedOnFilter = debounce((filters: TaskViewFilters) => {
      onFilter(filters)
    }, 500)

  const handleFilterChange = (updates: Partial<TaskViewFilters>) => {
    const newFilters = { ...localFilters, ...updates }
    setLocalFilters(newFilters)
    debouncedOnFilter(newFilters)
  }

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  useEffect(() => {
    return () => {
      debouncedOnFilter.cancel()
    }
  }, [debouncedOnFilter])

  return (
    <div className="bg-white border-b">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 mr-4">
            <button
              onClick={undo}
              disabled={!canUndo}
              className={`p-1.5 rounded-md ${
                canUndo 
                  ? 'text-gray-500 hover:bg-gray-100' 
                  : 'text-gray-300 cursor-not-allowed'
              }`}
              title="Undo (Ctrl+Z)"
            >
              <ArrowUturnLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className={`p-1.5 rounded-md ${
                canRedo 
                  ? 'text-gray-500 hover:bg-gray-100' 
                  : 'text-gray-300 cursor-not-allowed'
              }`}
              title="Redo (Ctrl+Y)"
            >
              <ArrowUturnRightIcon className="w-5 h-5" />
            </button>
          </div>

          {selectedTasks.size > 0 && (
            <button
              onClick={onDeleteSelected}
              className="flex items-center gap-1 px-2 py-1 text-sm text-red-600 hover:text-red-700 font-medium rounded-md hover:bg-red-50"
            >
              Delete Selected ({selectedTasks.size})
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-1.5 rounded-md transition-colors ${
              showFilters || Object.values(filters).some(v => {
                if (typeof v === 'object') {
                  return Object.values(v).some(val => val !== '')
                }
                return v !== 'all' && v !== ''
              })
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
            }`}
          >
            <FunnelIcon className="w-5 h-5" />
          </button>
          {fields.length > 0 && (
            <CustomFieldsVisibility
              visibleFields={visibleFields}
              onVisibilityChange={onVisibilityChange}
            />
          )}
          <button
            onClick={onCustomFields}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Cog6ToothIcon className="w-4 h-4" />
            Custom Fields
          </button>
          <button
            onClick={onNewTask}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            <PlusIcon className="w-4 h-4" />
            New Task
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 border-t">
          <div className="flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Filter by title..."
              value={localFilters.title}
              onChange={(e) => handleFilterChange({ title: e.target.value })}
              className="w-full px-3 py-1.5 text-sm rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <select
            value={localFilters.status}
            onChange={(e) => handleFilterChange({ status: e.target.value as Task['status'] | 'all' })}
            className="px-3 py-1.5 text-sm rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select
            value={localFilters.priority}
            onChange={(e) => handleFilterChange({ priority: e.target.value as Task['priority'] | 'all' })}
            className="px-3 py-1.5 text-sm rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          {fields
            .filter(field => visibleFields.has(field.id))
            .map(field => (
              <input
                key={field.id}
                type="text"
                placeholder={`Filter ${field.name}`}
                value={localFilters.customFields[field.id] || ''}
                onChange={(e) =>
                  handleFilterChange({
                    ...localFilters,
                    customFields: {
                      ...localFilters.customFields,
                      [field.id]: e.target.value,
                    },
                  })
                }
                className="px-3 py-1 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            ))}
        </div>
      )}
    </div>
  )
} 