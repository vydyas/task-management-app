'use client'
import { Task } from '@/types'
import { ChevronUpIcon, ChevronDownIcon, FunnelIcon } from '@heroicons/react/20/solid'
import { useState, useEffect } from 'react'
import { useCustomFieldsStore } from '@/store/useCustomFieldsStore'
import CustomFieldsVisibility from './CustomFieldsVisibility'

interface TableHeaderProps {
  onSort: (column: keyof Task | string) => void
  sortColumn: string
  sortDirection: 'asc' | 'desc'
  onFilter: (filters: TableFilters) => void
  filters: TableFilters
  visibleFields: Set<string>
  onVisibilityChange: (fieldId: string, isVisible: boolean) => void
  selectedCount: number
  onDeleteSelected: () => void
}

export interface TableFilters {
  title: string
  status: Task['status'] | 'all'
  priority: Task['priority'] | 'all'
  customFields: { [key: string]: string }
}

export default function TableHeader({
  onSort,
  sortColumn,
  sortDirection,
  onFilter,
  filters,
  visibleFields,
  onVisibilityChange,
  selectedCount,
  onDeleteSelected
}: TableHeaderProps) {
  const [showFilters, setShowFilters] = useState(false)
  const { fields } = useCustomFieldsStore()

  const renderSortIcon = (column: string) => {
    if (sortColumn === column) {
      return sortDirection === 'asc' 
        ? <ChevronUpIcon className="w-4 h-4" />
        : <ChevronDownIcon className="w-4 h-4" />
    }
    return null
  }

  useEffect(() => {
    const newFilters = { ...filters }
    let hasChanges = false

    // Remove filters for hidden custom fields
    Object.keys(newFilters.customFields).forEach(fieldId => {
      if (!visibleFields.has(fieldId)) {
        delete newFilters.customFields[fieldId]
        hasChanges = true
      }
    })

    if (hasChanges) {
      onFilter(newFilters)
    }
  }, [visibleFields, filters, onFilter])

  return (
    <div className="bg-white border-b">
      <div className="px-4 py-3 flex flex-wrap gap-2">
        <div className="flex items-center gap-4 flex-1">
          {selectedCount > 0 && (
            <button
              onClick={onDeleteSelected}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100"
            >
              Delete Selected ({selectedCount})
            </button>
          )}
          <button
            onClick={() => onSort('title')}
            className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Title {renderSortIcon('title')}
          </button>
          <button
            onClick={() => onSort('createdAt')}
            className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Date Created {renderSortIcon('createdAt')}
          </button>
          <button
            onClick={() => onSort('status')}
            className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Status {renderSortIcon('status')}
          </button>
          <button
            onClick={() => onSort('priority')}
            className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Priority {renderSortIcon('priority')}
          </button>
          
          {/* Only show sort buttons for visible custom fields */}
          {fields
            .filter(field => visibleFields.has(field.id))
            .map(field => (
              <button
                key={field.id}
                onClick={() => onSort(`customFields.${field.id}`)}
                className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                {field.name} {renderSortIcon(`customFields.${field.id}`)}
              </button>
            ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-1.5 rounded-md ${
              showFilters || Object.values(filters).some(v => v !== 'all' && v !== '')
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <FunnelIcon className="w-5 h-5" />
          </button>
          <CustomFieldsVisibility
            visibleFields={visibleFields}
            onVisibilityChange={onVisibilityChange}
          />
        </div>
      </div>

      {/* Filter row */}
      {showFilters && (
        <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 border-t">
          <div className="flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Filter by title..."
              value={filters.title}
              onChange={(e) => onFilter({ ...filters, title: e.target.value })}
              className="w-full px-3 py-1.5 text-sm rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => onFilter({ ...filters, status: e.target.value as Task['status'] | 'all' })}
            className="px-3 py-1.5 text-sm rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select
            value={filters.priority}
            onChange={(e) => onFilter({ ...filters, priority: e.target.value as Task['priority'] | 'all' })}
            className="px-3 py-1.5 text-sm rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          {/* Only show filter inputs for visible custom fields */}
          {fields
            .filter(field => visibleFields.has(field.id))
            .map(field => (
              <input
                key={field.id}
                type="text"
                placeholder={`Filter ${field.name}`}
                value={filters.customFields[field.id] || ''}
                onChange={(e) =>
                  onFilter({
                    ...filters,
                    customFields: {
                      ...filters.customFields,
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