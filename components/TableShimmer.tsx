'use client'
import { useCustomFieldsStore } from '@/store/useCustomFieldsStore'

export default function TableShimmer() {
  const { fields } = useCustomFieldsStore()

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Header shimmer */}
      <div className="border-b">
        <div className="px-4 py-3 flex flex-wrap gap-2 bg-white">
          {/* Filter button shimmer */}
          <div className="w-8 h-8 rounded-md bg-gray-100 animate-shimmer" />
        </div>
      </div>

      {/* Table header shimmer */}
      <div className="flex items-center px-4 py-2 border-b bg-white">
        <div className="flex items-center gap-8 flex-1">
          {/* Title column - 200px */}
          <div className="w-[200px] flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-100 animate-shimmer" />
            <div className="h-4 w-16 rounded bg-gray-100 animate-shimmer" />
          </div>
          {/* Date column - 200px */}
          <div className="w-[200px]">
            <div className="h-4 w-24 rounded bg-gray-100 animate-shimmer" />
          </div>
          {/* Status column - 150px */}
          <div className="w-[150px]">
            <div className="h-4 w-16 rounded bg-gray-100 animate-shimmer" />
          </div>
          {/* Priority column - 150px */}
          <div className="w-[150px]">
            <div className="h-4 w-16 rounded bg-gray-100 animate-shimmer" />
          </div>
          {/* Custom fields - 150px each */}
          {fields.map(field => (
            <div key={field.id} className="w-[150px]">
              <div className="h-4 w-24 rounded bg-gray-100 animate-shimmer" />
            </div>
          ))}
        </div>
      </div>

      {/* Table rows shimmer */}
      <div className="flex-1 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i} 
            className="flex items-center px-4 py-2 border-b"
          >
            <div className="w-6 mr-2">
              <div className="w-4 h-4 rounded bg-gray-100 animate-shimmer" />
            </div>
            <div className="flex items-center gap-8 flex-1">
              {/* Title column */}
              <div className="w-[200px] flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gray-100 animate-shimmer" />
                <div className="h-4 w-32 rounded bg-gray-100 animate-shimmer" />
              </div>
              {/* Date column */}
              <div className="w-[200px]">
                <div className="h-4 w-32 rounded bg-gray-100 animate-shimmer" />
              </div>
              {/* Status column */}
              <div className="w-[150px]">
                <div className="h-6 w-20 rounded-full bg-gray-100 animate-shimmer" />
              </div>
              {/* Priority column */}
              <div className="w-[150px]">
                <div className="h-6 w-16 rounded-full bg-gray-100 animate-shimmer" />
              </div>
              {/* Custom fields */}
              {fields.map(field => (
                <div key={field.id} className="w-[150px]">
                  <div className="h-4 w-24 rounded bg-gray-100 animate-shimmer" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination shimmer */}
      <div className="border-t bg-white px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="w-32 h-8 rounded bg-gray-100 animate-shimmer" />
          <div className="w-48 h-8 rounded bg-gray-100 animate-shimmer" />
        </div>
      </div>
    </div>
  )
} 