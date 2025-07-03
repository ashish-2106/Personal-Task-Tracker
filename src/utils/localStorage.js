const TASKS_KEY = "taskTracker_tasks"
const USERNAME_KEY = "taskTracker_username"
const CATEGORIES_KEY = "taskTracker_categories"

export const getTasks = () => {
  try {
    const tasks = localStorage.getItem(TASKS_KEY)
    console.log("getTasks - raw data:", tasks) // Debug log
    const parsed = tasks ? JSON.parse(tasks) : []
    console.log("getTasks - parsed:", parsed) // Debug log
    return parsed
  } catch (error) {
    console.error("Error loading tasks from localStorage:", error)
    return []
  }
}

export const saveTasks = (tasks) => {
  try {
    console.log("saveTasks - saving:", tasks.length, "tasks") // Debug log
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
    console.log("saveTasks - saved successfully") // Debug log
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error)
  }
}

export const getStoredUsername = () => {
  try {
    const username = localStorage.getItem(USERNAME_KEY)
    console.log("getStoredUsername:", username) // Debug log
    return username
  } catch (error) {
    console.error("Error loading username from localStorage:", error)
    return null
  }
}

export const getCategories = () => {
  try {
    const categories = localStorage.getItem(CATEGORIES_KEY)
    console.log("getCategories - raw data:", categories) // Debug log
    const parsed = categories ? JSON.parse(categories) : []
    console.log("getCategories - parsed:", parsed) // Debug log
    return parsed
  } catch (error) {
    console.error("Error loading categories from localStorage:", error)
    return []
  }
}

export const saveCategories = (categories) => {
  try {
    console.log("saveCategories - saving:", categories) // Debug log
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
    console.log("saveCategories - saved successfully") // Debug log
  } catch (error) {
    console.error("Error saving categories to localStorage:", error)
  }
}

export const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInHours = diffInMs / (1000 * 60 * 60)
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24)

  if (diffInHours < 1) {
    const minutes = Math.floor(diffInMs / (1000 * 60))
    return minutes <= 1 ? "just now" : `${minutes} minutes ago`
  } else if (diffInHours < 24) {
    const hours = Math.floor(diffInHours)
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`
  } else if (diffInDays < 7) {
    const days = Math.floor(diffInDays)
    return days === 1 ? "1 day ago" : `${days} days ago`
  } else {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }
}

// Sample data for testing
export const sampleTasks = [
  {
    id: "1",
    title: "Complete React assignment",
    description:
      "Build a task tracker application with all required features including priorities, categories, and due dates",
    completed: false,
    priority: "high",
    category: "Work",
    dueDate: "2024-01-20",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Review JavaScript concepts",
    description: "Go through ES6+ features and modern JavaScript patterns",
    completed: true,
    priority: "medium",
    category: "Personal",
    createdAt: "2024-01-14T15:30:00Z",
  },
  {
    id: "3",
    title: "Buy groceries",
    description: "Milk, bread, eggs, fruits, vegetables",
    completed: false,
    priority: "low",
    category: "Shopping",
    dueDate: "2024-01-18",
    createdAt: "2024-01-13T09:15:00Z",
  },
  {
    id: "4",
    title: "Doctor appointment",
    description: "Annual health checkup",
    completed: false,
    priority: "high",
    category: "Health",
    dueDate: "2024-01-19",
    createdAt: "2024-01-12T14:20:00Z",
  },
]

// Helper function to load sample data (call this once to populate with sample tasks)
export const loadSampleData = () => {
  const existingTasks = getTasks()
  if (existingTasks.length === 0) {
    saveTasks(sampleTasks)
  }
}

export const hasTasksKey = () => {
  return localStorage.getItem(TASKS_KEY) !== null
}
