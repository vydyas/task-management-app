export type Task = {
  id: string
  title: string
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
  customFields: {
    [key: string]: CustomFieldValue
  }
}

export type CustomFieldType = 'text' | 'number' | 'checkbox'

export type CustomFieldValue = string | number | boolean

export interface CustomField {
  id: string
  name: string
  type: CustomFieldType
  defaultValue: CustomFieldValue
}

export interface Column {
  key: keyof Task
  label: string
  sortable?: boolean
} 