'use client'

const columns = [
  { id: 'todo', label: 'To Do', color: 'bg-red-50' },
  { id: 'in_progress', label: 'In Progress', color: 'bg-blue-50' },
  { id: 'done', label: 'Done', color: 'bg-green-50' }
]

export default function BoardShimmer() {
  return (
    <div className="flex gap-4 h-[calc(100vh-12rem)]">
      {columns.map(column => (
        <div key={column.id} className="flex-1 flex flex-col min-w-[300px] max-h-full">
          <div className="flex items-center gap-2 mb-3 px-2">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className={`flex-1 rounded-lg ${column.color} p-4 overflow-y-auto`}>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white p-3 rounded-md shadow-sm animate-shimmer"
                >
                  <div className="h-4 w-3/4 bg-gray-200 rounded mb-3" />
                  <div className="h-6 w-16 bg-gray-200 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 