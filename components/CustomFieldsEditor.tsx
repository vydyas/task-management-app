'use client'
import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { CustomFieldType } from '@/types'
import { useCustomFieldsStore } from '@/store/useCustomFieldsStore'
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline'

interface CustomFieldsEditorProps {
  isOpen: boolean
  onClose: () => void
}

export default function CustomFieldsEditor({ isOpen, onClose }: CustomFieldsEditorProps) {
  const { fields, addField, removeField } = useCustomFieldsStore()
  const [newField, setNewField] = useState({
    name: '',
    type: 'text' as CustomFieldType,
  })
  const [error, setError] = useState<string | null>(null)

  const handleAddField = () => {
    if (!newField.name.trim()) return

    // Check for duplicate names (case-insensitive)
    const isDuplicate = fields.some(
      field => field.name.toLowerCase() === newField.name.trim().toLowerCase()
    )
    
    if (isDuplicate) {
      setError('A field with this name already exists')
      return
    }

    const defaultValue = newField.type === 'checkbox' ? false : 
                        newField.type === 'number' ? 0 : ''

    addField({
      name: newField.name.trim(),
      type: newField.type,
      defaultValue,
    })

    setNewField({ name: '', type: 'text' })
    setError(null)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewField(prev => ({ ...prev, name: e.target.value }))
    setError(null)  // Clear error when user starts typing
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-xl shadow-lg">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <Dialog.Title className="text-lg font-semibold">
              Custom Fields
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            {/* Add new field */}
            <div className="flex gap-4 mb-8">
              <div className="flex-1">
                <input
                  type="text"
                  value={newField.name}
                  onChange={handleNameChange}
                  placeholder="Field name"
                  className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500
                    ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                />
                {error && (
                  <p className="mt-1 text-sm text-red-600">
                    {error}
                  </p>
                )}
              </div>
              <select
                value={newField.type}
                onChange={(e) => setNewField({ ...newField, type: e.target.value as CustomFieldType })}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="checkbox">Checkbox</option>
              </select>
              <button
                onClick={handleAddField}
                disabled={!newField.name.trim()}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                <PlusIcon className="h-5 w-5 mr-1" />
                Add Field
              </button>
            </div>

            {/* Field list */}
            <div className="space-y-4">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{field.name}</h3>
                    <p className="text-sm text-gray-500">Type: {field.type}</p>
                  </div>
                  <button
                    onClick={() => removeField(field.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {fields.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No custom fields yet. Add one above!
                </p>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
} 