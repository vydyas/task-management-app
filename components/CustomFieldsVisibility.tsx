'use client'
import { useState, useRef } from 'react'
import { useCustomFieldsStore } from '@/store/useCustomFieldsStore'
import { EyeIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Transition } from '@headlessui/react'
import { useOnClickOutside } from '@/hooks/useOnClickOutside'

interface CustomFieldsVisibilityProps {
  visibleFields: Set<string>
  onVisibilityChange: (fieldId: string, isVisible: boolean) => void
}

export default function CustomFieldsVisibility({ 
  visibleFields, 
  onVisibilityChange 
}: CustomFieldsVisibilityProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { fields } = useCustomFieldsStore()
  const containerRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(containerRef, () => setIsOpen(false))

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-1.5 rounded-md transition-colors ${
          fields.length > 0 && visibleFields.size < fields.length
            ? 'bg-indigo-50 text-indigo-600'
            : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
        }`}
        title="Manage visible columns"
      >
        <EyeIcon className="w-5 h-5" />
      </button>

      <Transition
        show={isOpen}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-[60]">
          <div className="px-4 py-3 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Visible Columns</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Select which columns to show in the table
            </p>
          </div>
          <div className="p-2 max-h-[calc(100vh-20rem)] overflow-y-auto">
            <div className="space-y-1">
              {fields.map(field => (
                <label
                  key={field.id}
                  className="flex items-center gap-3 px-2 py-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={visibleFields.has(field.id)}
                    onChange={(e) => onVisibilityChange(field.id, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{field.name}</div>
                    <div className="text-sm text-gray-500">Custom field</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Transition>
    </div>
  )
} 