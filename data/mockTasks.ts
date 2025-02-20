import { Task } from '@/types'

const GIST_URL = 'https://gist.githubusercontent.com/yangshun/7acbe005af922e43a26dea8109e16aed/raw/01df391c8320df0a37c73fdbf6b8fc7d88aae719/greatfrontend-tasks.json'

export async function fetchTasks(): Promise<Task[]> {
  try {
    const response = await fetch(GIST_URL)
    const data = await response.json()
    
    return data.map((task: any) => ({
      id: String(task.id),
      title: task.title,
      // Map status values to match our app's format
      status: (() => {
        switch (task.status.toLowerCase()) {
          case 'completed':
            return 'done'
          case 'not_started':
            return 'todo'
          case 'in_progress':
            return 'in_progress'
          default:
            return 'todo'
        }
      })(),
      // Map priority values to match our app's format
      priority: (() => {
        switch (task.priority.toLowerCase()) {
          case 'urgent':
            return 'high'
          case 'high':
            return 'high'
          case 'medium':
            return 'medium'
          case 'low':
            return 'low'
          case 'none':
            return 'low'
          default:
            return 'medium'
        }
      })(),
      // Add timestamps since they're not in the original data
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customFields: {}
    }))
  } catch (error) {
    console.error('Error fetching tasks:', error)
    // Return mock data as fallback
    return MOCK_TASKS
  }
}

export const MOCK_TASKS: Task[] = [
  {
    id: "1",
    title: "Complete project proposal",
    status: "in_progress",
    priority: "high",
    createdAt: "2024-03-19T10:00:00Z",
    updatedAt: "2024-03-19T10:00:00Z",
    customFields: {}
  },
  {
    id: "2",
    title: "Review code changes",
    status: "todo",
    priority: "medium",
    createdAt: "2024-03-19T11:00:00Z",
    updatedAt: "2024-03-19T11:00:00Z",
    customFields: {}
  },
  {
    id: "3",
    title: "Fix navigation bug",
    status: "done",
    priority: "high",
    createdAt: "2024-03-19T12:00:00Z",
    updatedAt: "2024-03-19T12:00:00Z",
    customFields: {}
  },
  {
    id: "4",
    title: "Update documentation",
    status: "todo",
    priority: "low",
    createdAt: "2024-03-19T13:00:00Z",
    updatedAt: "2024-03-19T13:00:00Z",
    customFields: {}
  },
  {
    id: "5",
    title: "Design new feature mockups",
    status: "in_progress",
    priority: "medium",
    createdAt: "2024-03-19T14:00:00Z",
    updatedAt: "2024-03-19T14:00:00Z",
    customFields: {}
  },
  {
    id: "6",
    title: "Set up testing environment",
    status: "done",
    priority: "high",
    createdAt: "2024-03-19T15:00:00Z",
    updatedAt: "2024-03-19T15:00:00Z",
    customFields: {}
  },
  {
    id: "7",
    title: "Write unit tests",
    status: "todo",
    priority: "medium",
    createdAt: "2024-03-19T16:00:00Z",
    updatedAt: "2024-03-19T16:00:00Z",
    customFields: {}
  },
  {
    id: "8",
    title: "Optimize database queries",
    status: "in_progress",
    priority: "high",
    createdAt: "2024-03-19T17:00:00Z",
    updatedAt: "2024-03-19T17:00:00Z",
    customFields: {}
  }
] 