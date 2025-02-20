'use client'
import { FunnelIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import { Task } from '@/types'
import { useCustomFieldsStore } from '@/store/useCustomFieldsStore'

interface BoardHeaderProps {
  onFilter: (filters: BoardFilters) => void
  filters: BoardFilters
}

export interface BoardFilters {
  title: string
  priority: Task['priority'] | 'all'
  customFields: { [key: string]: string }
}

export default function BoardHeader({ onFilter, filters }: BoardHeaderProps) {
  const [showFilters, setShowFilters] = useState(false)
  const { fields } = useCustomFieldsStore()

  return (
    <div className="bg-white border-b">
      <div className="px-4 py-3 flex items-center justify-between">
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
      </div>

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
            value={filters.priority}
            onChange={(e) => onFilter({ ...filters, priority: e.target.value as Task['priority'] | 'all' })}
            className="px-3 py-1.5 text-sm rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          {fields.map(field => (
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