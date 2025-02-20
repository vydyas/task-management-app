'use client'
import Link from 'next/link'
import { ArrowLeftIcon, CodeBracketIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

const CodeSnippet = ({ children }: { children: React.ReactNode }) => (
  <div className="relative group">
    <div className="absolute -inset-y-2.5 -inset-x-4 group-hover:bg-slate-50/70 rounded-xl transition duration-200" />
    <div className="relative">
      <div className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-500">
        <CodeBracketIcon className="w-4 h-4" />
        <span>Example Code</span>
      </div>
      <pre className="overflow-x-auto p-4 rounded-lg bg-gray-50 text-sm font-mono text-gray-800">
        {children}
      </pre>
    </div>
  </div>
)

const ComponentCard = ({ name, description }: { name: string; description: string }) => (
  <div className="relative group rounded-lg border border-gray-200 p-4 hover:border-indigo-200 transition-colors duration-200">
    <h4 className="text-base font-semibold text-gray-900 mb-1">{name}</h4>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
)

const FolderTree = () => (
  <div className="font-mono text-sm">
    <pre className="p-4 bg-gray-50 rounded-lg overflow-auto">
      <code className="text-gray-800">
{`project-root/
├── app/
│   ├── docs/
│   │   └── page.tsx          # Documentation page
│   ├── page.tsx              # Main application page
│   └── globals.css           # Global styles
│
├── components/
│   ├── BoardView.tsx         # Kanban board view
│   ├── CustomFieldsEditor.tsx # Custom fields management
│   ├── NoDataState.tsx       # Empty state component
│   ├── Pagination.tsx        # Pagination controls
│   ├── TableHeader.tsx       # Table column headers
│   ├── TableShimmer.tsx      # Loading state for table
│   ├── TaskForm.tsx          # Task creation/edit form
│   ├── TaskModal.tsx         # Modal wrapper for task form
│   ├── TaskTable.tsx         # Table view implementation
│   └── ViewToggle.tsx        # View switching component
│
├── hooks/
│   ├── usePersistedPageSize.ts  # Page size persistence
│   └── usePersistedView.ts      # View preference persistence
│
├── store/
│   ├── useTaskStore.ts       # Main task state management
│   └── useCustomFieldsStore.ts # Custom fields state
│
├── types/
│   └── index.ts              # TypeScript type definitions
│
└── data/
    └── mockTasks.ts          # Mock data and API simulation`}
      </code>
    </pre>
  </div>
)

export default function Documentation() {

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Back to App
          </Link>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Architecture Overview</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <Image
              src="/architecture.png"
              alt="Task Management App Architecture"
              width={800}
              height={500}
              className="w-full"
            />
            <div className="mt-4 text-sm text-gray-600">
              <h3 className="font-medium mb-2">Key Components:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>TaskTable:</strong> Main component that orchestrates the table view</li>
                <li><strong>TaskViewHeader:</strong> Handles filtering, sorting, and task actions</li>
                <li><strong>Pagination:</strong> Manages page size and navigation</li>
                <li><strong>Store Layer:</strong> Zustand stores for tasks, custom fields, and history</li>
                <li><strong>Local Storage:</strong> Persists application state across sessions</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="prose prose-indigo max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Task Management Application</h1>
          
          <div className="bg-gradient-to-r from-indigo-50 to-indigo-100/50 rounded-xl p-6 mb-12">
            <h2 className="text-xl font-semibold text-indigo-900 mt-0">Tech Stack</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {[
                { name: 'Next.js 14', desc: 'with App Router' },
                { name: 'TypeScript', desc: 'Type-safe development' },
                { name: 'Tailwind CSS', desc: 'Utility-first styling' },
                { name: 'Zustand', desc: 'State management' },
                { name: 'Framer Motion', desc: 'Smooth animations' },
                { name: '@hello-pangea/dnd', desc: 'Drag and drop' },
              ].map((tech) => (
                <div key={tech.name} className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="font-medium text-indigo-900">{tech.name}</div>
                  <div className="text-sm text-gray-600">{tech.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Structure</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Directory Organization</h3>
                <p className="text-gray-600 mb-4">
                  The project follows a modular structure with clear separation of concerns:
                </p>
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li><strong>app/</strong> - Next.js app router pages and layouts</li>
                  <li><strong>components/</strong> - Reusable React components</li>
                  <li><strong>hooks/</strong> - Custom React hooks for shared logic</li>
                  <li><strong>store/</strong> - Zustand state management stores</li>
                  <li><strong>types/</strong> - TypeScript type definitions</li>
                  <li><strong>data/</strong> - Mock data and API simulation</li>
                </ul>
              </div>
              <FolderTree />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <ComponentCard 
              name="Task Management"
              description="Create, read, update, and delete tasks with properties including title, status, priority, and custom fields. Supports batch operations."
            />
            <ComponentCard 
              name="Multiple Views"
              description="Switch between Table and Kanban board views. View preferences are persisted across sessions."
            />
            <ComponentCard 
              name="Custom Fields"
              description="Dynamic schema modification with support for text, number, and checkbox field types. Fields are sortable and filterable."
            />
            <ComponentCard 
              name="Advanced Filtering"
              description="Filter by any field including custom fields. Multiple active filters with visual indicators."
            />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Implementation Examples</h2>

          <h3 className="text-xl font-semibold text-gray-900 mb-4">Custom Fields Store</h3>
          <CodeSnippet>
{`interface CustomFieldsStore {
  fields: CustomField[]
  addField: (field: Omit<CustomField, 'id'>) => void
  removeField: (id: string) => void
  updateField: (id: string, updates: Partial<CustomField>) => void
}

export const useCustomFieldsStore = create<CustomFieldsStore>()(
  persist(
    (set) => ({
      fields: [],
      addField: (field) => set((state) => ({
        fields: [...state.fields, { ...field, id: crypto.randomUUID() }],
      })),
      // ... other methods
    }),
    { name: 'custom-fields-storage' }
  )
)`}
          </CodeSnippet>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Drag and Drop Implementation</h3>
          <CodeSnippet>
{`<DragDropContext onDragEnd={handleDragEnd}>
  <Droppable droppableId={column.id}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
        className={\`flex-1 rounded-lg \${
          snapshot.isDraggingOver ? 'bg-indigo-50' : column.color
        }\`}
      >
        {tasks.map((task, index) => (
          <Draggable key={task.id} draggableId={task.id} index={index}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                {/* Task content */}
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
</DragDropContext>`}
          </CodeSnippet>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Component Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Core Components</h3>
              <div className="space-y-4">
                {[
                  { name: 'TaskTable', description: 'Main table view with sorting and filtering' },
                  { name: 'BoardView', description: 'Kanban board with drag-and-drop' },
                  { name: 'TaskModal', description: 'Task creation and editing interface' },
                  { name: 'CustomFieldsEditor', description: 'Schema modification UI' },
                ].map((component) => (
                  <ComponentCard key={component.name} {...component} />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Supporting Components</h3>
              <div className="space-y-4">
                {[
                  { name: 'TableHeader', description: 'Column headers with sorting controls' },
                  { name: 'Pagination', description: 'Page navigation and size controls' },
                  { name: 'ViewToggle', description: 'Switch between table and board views' },
                  { name: 'TaskForm', description: 'Reusable task form component' },
                ].map((component) => (
                  <ComponentCard key={component.name} {...component} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 