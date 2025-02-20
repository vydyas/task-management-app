'use client';
import { useState } from 'react';
import { Task, CustomField } from '@/types';
import { useCustomFieldsStore } from '@/store/useCustomFieldsStore';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  initialData?: Task;
}

type CustomFieldValue = string | number | boolean;

export default function TaskForm({ onSubmit, onCancel, initialData }: TaskFormProps) {
  const { fields } = useCustomFieldsStore();
  const [formData, setFormData] = useState({
    title: initialData?.title ?? '',
    status: initialData?.status ?? 'todo',
    priority: initialData?.priority ?? 'medium',
    customFields: initialData?.customFields ?? {}
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleCustomFieldChange = (field: CustomField, value: CustomFieldValue) => {
    setFormData(prev => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [field.id]: value
      }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="block w-full rounded-lg border-0 px-4 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm"
          placeholder="Enter task title"
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
          Status
        </label>
        <div className="relative">
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
            className="appearance-none block w-full rounded-lg border-0 px-4 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm bg-white"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
          Priority
        </label>
        <div className="relative">
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
            className="appearance-none block w-full rounded-lg border-0 px-4 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm bg-white"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {fields.length > 0 && (
        <div className="border-t border-gray-200 mt-8">
          <div className="bg-gray-50 px-6 py-4 rounded-lg mt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              <span className="bg-gray-100 px-2 py-1 rounded">Custom Fields</span>
            </h3>
            <div className="space-y-4 divide-y divide-gray-200">
              {fields.map(field => (
                <div key={field.id} className="pt-4 first:pt-0">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.name}
                  </label>
                  {field.type === 'checkbox' ? (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={Boolean(formData.customFields[field.id] ?? field.defaultValue)}
                        onChange={(e) => handleCustomFieldChange(field, e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-500">
                        {formData.customFields[field.id] ? 'Yes' : 'No'}
                      </span>
                    </div>
                  ) : field.type === 'number' ? (
                    <input
                      type="number"
                      value={String(formData.customFields[field.id] ?? field.defaultValue)}
                      onChange={(e) => handleCustomFieldChange(field, Number(e.target.value))}
                      className="block w-full rounded-lg border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  ) : (
                    <input
                      type="text"
                      value={String(formData.customFields[field.id] ?? field.defaultValue)}
                      onChange={(e) => handleCustomFieldChange(field, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                      className="block w-full rounded-lg border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {initialData ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
