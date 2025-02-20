'use client';
import { useState, useCallback, useEffect } from 'react'
import { Task } from '@/types'
import { useTaskStore } from '@/store/useTaskStore'
import TaskModal from './TaskModal'
import NoDataState from './NoDataState'
import Pagination from './Pagination'
import { motion, AnimatePresence } from 'framer-motion'
import { usePersistedPageSize } from '@/hooks/usePersistedPageSize'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import TaskViewHeader, { TaskViewFilters } from './TaskViewHeader'
import { useCustomFieldsStore } from '@/store/useCustomFieldsStore'
import ResizableColumn from './ResizableColumn'
import CustomFieldsEditor from './CustomFieldsEditor'

export default function TaskTable() {
  const { tasks, updateTask, deleteTask, reorderTasks, tableOrder, addTask } = useTaskStore()
  const [sortColumn, setSortColumn] = useState<string>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showCustomFieldsModal, setShowCustomFieldsModal] = useState(false)
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set())
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = usePersistedPageSize()

  const { fields } = useCustomFieldsStore()

  const [filters, setFilters] = useState<TaskViewFilters>({
    title: '',
    status: 'all',
    priority: 'all',
    customFields: {}
  })

  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
    title: 350,
    createdAt: 250,
    status: 150,
    priority: 150,
  })

  // Add new state for visible fields
  const [visibleFields, setVisibleFields] = useState<Set<string>>(() => 
    new Set(fields.map(f => f.id))
  )

  useEffect(() => {
    setColumnWidths(prev => {
      const newWidths = { ...prev }
      fields.forEach(field => {
        if (!newWidths[field.id]) {
          newWidths[field.id] = 150 // Default width for custom fields
        }
      })
      return newWidths
    })
  }, [fields])

  const handleSort = (column: keyof Task | string) => {
    setSortColumn(column as string)
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortDirection('asc')
    }
  }

  const handleSelectTask = (taskId: string) => {
    const newSelected = new Set(selectedTasks)
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId)
    } else {
      newSelected.add(taskId)
    }
    setSelectedTasks(newSelected)
  }

  const handleSelectAll = () => {
    const pageTaskIds = new Set(paginatedTasks.map(task => task.id))
    const selectedPageTasks = new Set([...selectedTasks].filter(id => pageTaskIds.has(id)))
    
    if (selectedPageTasks.size === paginatedTasks.length) {
      // Deselect only current page tasks
      const newSelected = new Set([...selectedTasks].filter(id => !pageTaskIds.has(id)))
      setSelectedTasks(newSelected)
    } else {
      // Select all current page tasks
      setSelectedTasks(new Set([...selectedTasks, ...paginatedTasks.map(task => task.id)]))
    }
  }

  const handleDeleteSelected = () => {
    if (confirm(`Are you sure you want to delete ${selectedTasks.size} tasks?`)) {
      selectedTasks.forEach(taskId => deleteTask(taskId))
      setSelectedTasks(new Set())
      setCurrentPage(1) // Reset to first page after deletion
    }
  }

  const handleTaskClick = (task: Task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString()
    addTask({
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    })
    setIsModalOpen(false)
  }

  // Filter and sort tasks
  const orderedTasks = tasks
    .slice()
    .sort((a, b) => {
      const aIndex = tableOrder.indexOf(a.id)
      const bIndex = tableOrder.indexOf(b.id)
      return aIndex - bIndex
    })

  const filteredAndSortedTasks = orderedTasks
    .filter(task => {
      const titleMatch = task.title.toLowerCase().includes(filters.title.toLowerCase())
      const statusMatch = filters.status === 'all' || task.status === filters.status
      const priorityMatch = filters.priority === 'all' || task.priority === filters.priority
      
      // Only filter on visible custom fields
      const customFieldsMatch = Object.entries(filters.customFields).every(([fieldId, filterValue]) => {
        // Skip filtering if field is not visible
        if (!visibleFields.has(fieldId)) return true
        if (!filterValue) return true
        
        const fieldValue = task.customFields?.[fieldId]
        if (fieldValue === undefined) return false
        return String(fieldValue).toLowerCase().includes(filterValue.toLowerCase())
      })
      
      return titleMatch && statusMatch && priorityMatch && customFieldsMatch
    })
    .sort((a, b) => {
      if (sortColumn.startsWith('customFields.')) {
        const fieldId = sortColumn.split('.')[1]
        const aValue = a.customFields?.[fieldId] ?? ''
        const bValue = b.customFields?.[fieldId] ?? ''
        return sortDirection === 'asc'
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue))
      }
      
      return sortDirection === 'asc'
        ? String(a[sortColumn as keyof Task]).localeCompare(String(b[sortColumn as keyof Task]))
        : String(b[sortColumn as keyof Task]).localeCompare(String(a[sortColumn as keyof Task]))
    })

  // Get paginated data from filtered tasks
  const paginatedTasks = filteredAndSortedTasks
    .slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setSelectedTasks(new Set()) // Clear selection on page change
  }

  // Handle page size changes
  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1) // Reset to first page
    setSelectedTasks(new Set()) // Clear selection
  }

  const checkboxRef = useCallback((ref: HTMLInputElement | null) => {
    if (ref) {
      const pageTaskIds = new Set(paginatedTasks.map(task => task.id))
      const selectedPageTasks = new Set([...selectedTasks].filter(id => pageTaskIds.has(id)))
      ref.indeterminate = selectedPageTasks.size > 0 && selectedPageTasks.size < pageTaskIds.size
      
      // Reset indeterminate state if all or none are selected
      if (selectedPageTasks.size === 0 || selectedPageTasks.size === pageTaskIds.size) {
        ref.indeterminate = false
      }
    }
  }, [selectedTasks, paginatedTasks])

  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result
    if (!destination) return
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return

    reorderTasks(source.index, destination.index)
  }

  const handleColumnWidthChange = (column: string, width: number) => {
    setColumnWidths(prev => ({
      ...prev,
      [column]: width
    }))
  }

  // Add handler for visibility changes
  const handleFieldVisibilityChange = (fieldId: string, isVisible: boolean) => {
    setVisibleFields(prev => {
      const next = new Set(prev)
      if (isVisible) {
        next.add(fieldId)
      } else {
        next.delete(fieldId)
      }
      return next
    })
  }

  if (tasks.length === 0) {
    return <NoDataState />
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <TaskViewHeader
        onFilter={setFilters}
        filters={filters}
        visibleFields={visibleFields}
        onVisibilityChange={handleFieldVisibilityChange}
        onNewTask={() => setIsModalOpen(true)}
        onCustomFields={() => setShowCustomFieldsModal(true)}
        selectedTasks={selectedTasks}
        onDeleteSelected={handleDeleteSelected}
      />
      
      <div className="flex items-center px-4 py-2 border-b sticky top-0 bg-white z-50">
        <div className="flex items-center w-full min-w-0 gap-0">
          <ResizableColumn
            width={columnWidths.title}
            onWidthChange={(width) => handleColumnWidthChange('title', width)}
            minWidth={350}
          >
            <div className="flex items-center h-full px-2 w-full">
              <input
                type="checkbox"
                ref={checkboxRef}
                checked={paginatedTasks.length > 0 && paginatedTasks.every(task => selectedTasks.has(task.id))}
                onChange={handleSelectAll}
                className="ml-6 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="h-4 w-px bg-gray-200 mx-4" />
              <div className="cursor-pointer" onClick={() => handleSort('title')}>
                <span>Title</span>
                {sortColumn === 'title' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </div>
            </div>
          </ResizableColumn>
          
          {/* Other columns */}
          <ResizableColumn
            width={columnWidths.createdAt}
            onWidthChange={(width) => handleColumnWidthChange('createdAt', width)}
            minWidth={200}
          >
            <div className="cursor-pointer px-2" onClick={() => handleSort('createdAt')}>
              <span>Created At</span>
              {sortColumn === 'createdAt' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </div>
          </ResizableColumn>
          
          <ResizableColumn
            width={columnWidths.status}
            onWidthChange={(width) => handleColumnWidthChange('status', width)}
            minWidth={150}
          >
            <div className="cursor-pointer px-2" onClick={() => handleSort('status')}>
              <span>Status</span>
              {sortColumn === 'status' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </div>
          </ResizableColumn>
          
          <ResizableColumn
            width={columnWidths.priority}
            onWidthChange={(width) => handleColumnWidthChange('priority', width)}
            minWidth={150}
          >
            <div className="cursor-pointer px-2" onClick={() => handleSort('priority')}>
              <span>Priority</span>
              {sortColumn === 'priority' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </div>
          </ResizableColumn>
          
          {/* Custom field columns */}
          {fields
            .filter(field => visibleFields.has(field.id))
            .map(field => (
              <ResizableColumn
                key={field.id}
                width={columnWidths[field.id] || 150}
                onWidthChange={(width) => handleColumnWidthChange(field.id, width)}
                minWidth={100}
              >
                <div 
                  className="cursor-pointer px-2"
                  onClick={() => handleSort(`customFields.${field.id}`)}
                >
                  <span>{field.name}</span>
                  {sortColumn === `customFields.${field.id}` && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </ResizableColumn>
            ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="table">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="h-full"
              >
                <AnimatePresence initial={false}>
                  {paginatedTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <motion.div
                          initial={snapshot.isDragging ? undefined : { opacity: 0 }}
                          animate={snapshot.isDragging ? undefined : { opacity: 1 }}
                          exit={snapshot.isDragging ? undefined : { opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`flex items-center px-4 py-2 hover:bg-gray-50 group border-b cursor-pointer w-full
                            ${snapshot.isDragging ? 'bg-indigo-50 shadow-md' : ''}`}
                          onClick={() => handleTaskClick(task)}
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="p-1 mr-2 rounded hover:bg-gray-100"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                            </svg>
                          </div>
                          <div className="flex items-center w-full min-w-0 gap-0">
                            <div 
                              className="flex items-center overflow-hidden flex-shrink-0"
                              style={{ width: `${columnWidths.title}px` }}
                            >
                              <input
                                type="checkbox"
                                checked={selectedTasks.has(task.id)}
                                onChange={() => handleSelectTask(task.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-4 h-4 flex-shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-4"
                              />
                              <span className="text-gray-600 truncate px-2">{task.title}</span>
                            </div>
                            <span 
                              className="overflow-hidden px-2 flex-shrink-0 text-left"
                              style={{ width: `${columnWidths.createdAt}px` }}
                            >
                              {new Date(task.createdAt).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                            <span 
                              className="overflow-hidden px-2 flex-shrink-0 text-left"
                              style={{ width: `${columnWidths.status}px` }}
                            >
                              <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium
                                ${
                                  task.status === 'done'
                                    ? 'bg-green-100 text-green-800'
                                    : task.status === 'in_progress'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {task.status.replace('_', ' ')}
                              </span>
                            </span>
                            <span 
                              className="overflow-hidden px-2 flex-shrink-0 text-left"
                              style={{ width: `${columnWidths.priority}px` }}
                            >
                              <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium
                                ${
                                  task.priority === 'high'
                                    ? 'bg-red-50 text-red-700'
                                    : task.priority === 'medium'
                                    ? 'bg-yellow-50 text-yellow-700'
                                    : 'bg-gray-50 text-gray-600'
                                }`}
                              >
                                {task.priority}
                              </span>
                            </span>
                            {/* Custom field values */}
                            {fields
                              .filter(field => visibleFields.has(field.id))
                              .map(field => (
                                <span 
                                  key={field.id}
                                  className="overflow-hidden px-2 flex-shrink-0 text-left"
                                  style={{ width: `${columnWidths[field.id] || 150}px` }}
                                >
                                  {(task.customFields?.[field.id] ?? field.defaultValue) || (
                                    <span className="text-gray-400">-</span>
                                  )}
                                </span>
                              ))}
                          </div>
                        </motion.div>
                      )}
                    </Draggable>
                  ))}
                </AnimatePresence>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div className="border-t border-gray-200 bg-white">
        <Pagination
          currentPage={currentPage}
          totalItems={filteredAndSortedTasks.length}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTask(null)
        }}
        task={editingTask ?? undefined}
        onSave={(updates) => {
          if (editingTask) {
            updateTask(editingTask.id, {
              ...updates,
              updatedAt: new Date().toISOString(),
            })
            setIsModalOpen(false)
            setEditingTask(null)
          } else {
            handleCreateTask(updates)
          }
        }}
        title={editingTask ? 'Edit Task' : 'Create Task'}
      />

      <CustomFieldsEditor
        isOpen={showCustomFieldsModal}
        onClose={() => setShowCustomFieldsModal(false)}
      />
    </div>
  )
}
