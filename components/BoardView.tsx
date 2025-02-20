'use client'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Task } from '@/types'
import { useTaskStore } from '@/store/useTaskStore'
import { motion } from 'framer-motion'
import TaskModal from './TaskModal'
import { useState } from 'react'

const columns = [
  { id: 'todo', label: 'To Do', color: 'bg-red-50' },
  { id: 'in_progress', label: 'In Progress', color: 'bg-blue-50' },
  { id: 'done', label: 'Done', color: 'bg-green-50' }
] as const

export default function BoardView() {
  const { tasks, updateTask, reorderTasks, boardOrders } = useTaskStore()
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result
    if (!destination) return

    // Moving within the same list
    if (destination.droppableId === source.droppableId) {
      reorderTasks(source.index, destination.index, source.droppableId as Task['status'])
      return
    }
    
    // Moving to a different list
    const task = tasks.find(t => t.id === draggableId)
    if (!task) return

    const sourceStatusTasks = tasks.filter(t => t.status === source.droppableId)
    const destinationStatusTasks = tasks.filter(t => t.status === destination.droppableId)

    // First reorder within source list
    reorderTasks(source.index, sourceStatusTasks.length - 1, source.droppableId as Task['status'])
    
    // Then update status
    updateTask(draggableId, {
      status: destination.droppableId as Task['status'],
      updatedAt: new Date().toISOString()
    })

    // Finally reorder within destination list
    reorderTasks(destinationStatusTasks.length, destination.index, destination.droppableId as Task['status'])
  }

  const handleTaskClick = (task: Task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const getTasksByStatus = (status: Task['status']) => {
    const statusOrder = boardOrders[status]
    return statusOrder
      .map(id => tasks.find(t => t.id === id))
      .filter((task): task is Task => task !== undefined)
  }

  return (
    <div className="flex gap-4 h-[calc(100vh-12rem)]">
      <DragDropContext onDragEnd={handleDragEnd}>
        {columns.map(column => (
          <div key={column.id} className="flex-1 flex flex-col min-w-[300px] max-h-full">
            <div className="flex items-center gap-2 mb-3 px-2">
              <span className="text-sm font-medium">{column.label}</span>
              <span className="text-xs text-gray-500">
                {getTasksByStatus(column.id as Task['status']).length}
              </span>
            </div>
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 rounded-lg ${column.color} p-4 overflow-y-auto transition-colors duration-200 ${
                    snapshot.isDraggingOver ? 'bg-indigo-50 ring-2 ring-indigo-400 ring-inset' : ''
                  }`}
                >
                  <div className="space-y-3">
                    {getTasksByStatus(column.id as Task['status']).map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              transform: snapshot.isDragging 
                                ? provided.draggableProps.style?.transform 
                                : 'none',
                              transition: snapshot.isDragging
                                ? provided.draggableProps.style?.transition
                                : 'transform 0.2s ease-in-out'
                            }}
                          >
                            <motion.div
                              initial={false}
                              animate={{
                                scale: snapshot.isDragging ? 1.05 : 1,
                                boxShadow: snapshot.isDragging 
                                  ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' 
                                  : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                                borderColor: snapshot.isDragging ? '#818CF8' : 'transparent',
                              }}
                              transition={{ duration: 0.2 }}
                              className={`bg-white p-3 rounded-lg border-2 cursor-grab active:cursor-grabbing ${
                                snapshot.isDragging ? 'shadow-lg' : 'shadow-sm hover:shadow-md'
                              }`}
                              onClick={() => !snapshot.isDragging && handleTaskClick(task)}
                            >
                              <div className="text-sm font-medium">{task.title}</div>
                              <div className="mt-2 flex items-center gap-2">
                                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                                  task.priority === 'high'
                                    ? 'bg-red-50 text-red-700 ring-1 ring-red-600/10'
                                    : task.priority === 'medium'
                                    ? 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/10'
                                    : 'bg-gray-50 text-gray-600 ring-1 ring-gray-500/10'
                                }`}>
                                  <svg 
                                    className={`mr-1 h-3 w-3 ${
                                      task.priority === 'high'
                                        ? 'text-red-600'
                                        : task.priority === 'medium'
                                        ? 'text-yellow-600'
                                        : 'text-gray-500'
                                    }`} 
                                    viewBox="0 0 20 20" 
                                    fill="currentColor"
                                  >
                                    <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                  {task.priority}
                                </span>
                                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md ${
                                  task.status === 'done'
                                    ? 'bg-green-100 text-green-800'
                                    : task.status === 'in_progress'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {task.status.replace('_', ' ')}
                                </span>
                              </div>
                            </motion.div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>

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
          }
          setIsModalOpen(false)
          setEditingTask(null)
        }}
        title="Edit Task"
      />
    </div>
  )
} 