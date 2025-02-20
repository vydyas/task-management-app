import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CustomField } from '@/types'

interface CustomFieldsStore {
  fields: CustomField[]
  addField: (field: Omit<CustomField, 'id'>) => void
  removeField: (id: string) => void
  updateField: (id: string, updates: Partial<Omit<CustomField, 'id'>>) => void
}

export const useCustomFieldsStore = create<CustomFieldsStore>()(
  persist(
    (set) => ({
      fields: [],
      addField: (field) =>
        set((state) => ({
          fields: [...state.fields, { ...field, id: crypto.randomUUID() }],
        })),
      removeField: (id) =>
        set((state) => ({
          fields: state.fields.filter((field) => field.id !== id),
        })),
      updateField: (id, updates) =>
        set((state) => ({
          fields: state.fields.map((field) =>
            field.id === id ? { ...field, ...updates } : field
          ),
        })),
    }),
    { name: 'custom-fields-storage' }
  )
) 