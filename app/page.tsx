'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import TaskTable from '@/components/TaskTable';
import BoardView from '@/components/BoardView';
import TaskModal from '@/components/TaskModal';
import ViewToggle from '@/components/ViewToggle';
import TableShimmer from '@/components/TableShimmer';
import BoardShimmer from '@/components/BoardShimmer';
import CustomFieldsEditor from '@/components/CustomFieldsEditor';
import { useTaskStore } from '@/store/useTaskStore';
import { usePersistedView } from '@/hooks/usePersistedView';
import { Task } from '@/types';
import { fetchTasks } from '@/data/mockTasks';
import { BookOpenIcon } from '@heroicons/react/24/outline'

export default function Home() {
  const { setTasks, addTask } = useTaskStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCustomFieldsOpen, setIsCustomFieldsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = usePersistedView();

  useEffect(() => {
    async function loadTasks() {
      try {
        setIsLoading(true);
        // Check if we have tasks in localStorage
        const storedData = localStorage.getItem('task-storage');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          if (parsedData.state.tasks && parsedData.state.tasks.length > 0) {
            // Use stored tasks if they exist
            return;
          }
        }
        // If no stored tasks, fetch initial data
        const initialTasks = await fetchTasks();
        setTasks(initialTasks);
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      }
    }

    loadTasks();
  }, [setTasks]);

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    addTask({
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    });
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Task Management App</h1>
          <ViewToggle view={view} onChange={setView} />
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/docs"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <BookOpenIcon className="h-4 w-4" />
            <span>Documentation</span>
          </Link>
        </div>
      </div>

      {isLoading ? (
        view === 'table' ? <TableShimmer /> : <BoardShimmer />
      ) : (
        view === 'table' ? <TaskTable /> : <BoardView />
      )}

      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateTask}
        title="Create Task"
      />

      <CustomFieldsEditor
        isOpen={isCustomFieldsOpen}
        onClose={() => setIsCustomFieldsOpen(false)}
      />
    </main>
  );
}
