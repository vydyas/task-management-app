'use client'
import { useState } from 'react'
import { Task } from '@/types'
import { useTaskStore } from '@/store/useTaskStore'
import TaskViewHeader, { TaskViewFilters } from './TaskViewHeader'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import NoDataState from './NoDataState'
import { useCustomFieldsStore } from '@/store/useCustomFieldsStore'
import CustomFieldsEditor from './CustomFieldsEditor'
import TaskModal from './TaskModal'
import { AnimatePresence } from 'framer-motion'

export default function Board() {
  const { tasks, updateTask } = useTaskStore()
  const { fields } = useCustomFieldsStore()
  const [filteredTasks] = useState<Task[]>(tasks)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showCustomFieldsModal, setShowCustomFieldsModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filters, setFilters] = useState<TaskViewFilters>({
    title: '',
    status: 'all',
    priority: 'all',
    customFields: {}
  })
  const [visibleFields] = useState<Set<string>>(() => 
    new Set(fields.map(f => f.id))
  )

  const handleFieldVisibilityChange = () => {}

  const handleDragEnd = () => {}

  if (tasks.length === 0) {
    return <NoDataState />
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <TaskViewHeader
        onFilter={setFilters}
        filters={filters}
        visibleFields={visibleFields}
        onVisibilityChange={handleFieldVisibilityChange}
        onNewTask={() => setIsModalOpen(true)}
        onCustomFields={() => setShowCustomFieldsModal(true)}
        selectedTasks={new Set()}
        onDeleteSelected={() => {}}
      />
      <div className="flex-1 overflow-x-auto">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 p-4 h-full">
            {['todo', 'in_progress', 'done'].map((status) => (
              <div key={status} className="w-80 flex-shrink-0">
                <div className="bg-gray-50 rounded-lg p-4 h-full flex flex-col">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    {status === 'todo' ? 'To Do' : 
                     status === 'in_progress' ? 'In Progress' : 
                     'Done'}
                  </h3>
                  <Droppable droppableId={status}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex-1 overflow-y-auto"
                      >
                        <AnimatePresence mode="popLayout">
                          {filteredTasks
                            .filter(task => task.status === status)
                            .map((task, index) => (
                              <Draggable key={task.id} draggableId={task.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="p-4 mb-2 bg-white rounded-lg shadow-sm"
                                  >
                                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                                    <div className="mt-2 flex items-center gap-2">
                                      <span className={`px-2 py-1 text-xs font-medium rounded-full
                                        ${task.priority === 'high' 
                                          ? 'bg-red-50 text-red-700'
                                          : task.priority === 'medium'
                                          ? 'bg-yellow-50 text-yellow-700'
                                          : 'bg-gray-50 text-gray-600'
                                        }`}
                                      >
                                        {task.priority}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                        </AnimatePresence>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            ))}
          </div>
        </DragDropContext>
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
          }
          setIsModalOpen(false)
          setEditingTask(null)
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