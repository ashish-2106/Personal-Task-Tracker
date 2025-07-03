"use client"

import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import TaskForm from "./TaskForm"
import TaskList from "./TaskList"
import TaskFilter from "./TaskFilter"

function TaskDashboard({ username, onLogout, darkMode, onToggleDarkMode }) {
  // Initialize state with direct localStorage access to avoid race conditions
  const [tasks, setTasks] = useState(() => {
    try {
      const storedTasks = localStorage.getItem("taskTracker_tasks")
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks)
        console.log("Initial state - loaded tasks:", parsedTasks.length)
        return parsedTasks
      } else {
        // First time user - add sample task
        const sampleTask = {
          id: Date.now().toString(),
          title: "Welcome to Task Tracker!",
          description: "This is a sample task. Add your own tasks to get started!",
          completed: false,
          priority: "medium",
          createdAt: new Date().toISOString(),
        }
        console.log("Initial state - adding sample task")
        localStorage.setItem("taskTracker_tasks", JSON.stringify([sampleTask]))
        return [sampleTask]
      }
    } catch (error) {
      console.error("Error loading tasks:", error)
      return []
    }
  })

  const [categories, setCategories] = useState(() => {
    try {
      const storedCategories = localStorage.getItem("taskTracker_categories")
      if (storedCategories) {
        return JSON.parse(storedCategories)
      } else {
        const defaultCategories = ["Work", "Personal", "Shopping", "Health"]
        localStorage.setItem("taskTracker_categories", JSON.stringify(defaultCategories))
        return defaultCategories
      }
    } catch (error) {
      console.error("Error loading categories:", error)
      return ["Work", "Personal", "Shopping", "Health"]
    }
  })

  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")
  const [showFilters, setShowFilters] = useState(false)

  // Save tasks whenever they change
  useEffect(() => {
    console.log("Saving tasks:", tasks.length)
    localStorage.setItem("taskTracker_tasks", JSON.stringify(tasks))
  }, [tasks])

  // Save categories whenever they change
  useEffect(() => {
    console.log("Saving categories:", categories.length)
    localStorage.setItem("taskTracker_categories", JSON.stringify(categories))
  }, [categories])

  const addTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    console.log("Adding new task:", newTask)
    setTasks((prev) => {
      const newTasks = [newTask, ...prev]
      console.log("New tasks array:", newTasks.length)
      return newTasks
    })
    setShowTaskForm(false)

    toast.success(`Task "${taskData.title}" created successfully! 🎉`, {
      duration: 4000,
    })
  }

  const updateTask = (updatedTask) => {
    console.log("Updating task:", updatedTask.id)
    setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    setEditingTask(null)

    toast.success(`Task "${updatedTask.title}" updated successfully! ✏️`, {
      duration: 3000,
    })
  }

  const deleteTask = (taskId) => {
    const taskToDelete = tasks.find((task) => task.id === taskId)
    console.log("Deleting task:", taskId)
    setTasks((prev) => {
      const newTasks = prev.filter((task) => task.id !== taskId)
      console.log("Tasks after deletion:", newTasks.length)
      return newTasks
    })

    toast.success(`Task "${taskToDelete?.title}" deleted successfully! 🗑️`, {
      duration: 3000,
    })
  }

  const toggleTaskComplete = (taskId) => {
    const task = tasks.find((t) => t.id === taskId)
    const newStatus = !task.completed

    console.log("Toggling task completion:", taskId, newStatus)
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, completed: newStatus } : task)))

    if (newStatus) {
      toast.success(`Task "${task.title}" completed! 🎉`, {
        duration: 3000,
      })
    } else {
      toast(`Task "${task.title}" marked as pending 📝`, {
        duration: 2000,
        icon: "📝",
      })
    }
  }

  const addCategory = (newCategory) => {
    if (!categories.includes(newCategory)) {
      console.log("Adding new category:", newCategory)
      setCategories((prev) => [...prev, newCategory])
      toast.success(`Category "${newCategory}" added! 🏷️`, {
        duration: 2000,
      })
    } else {
      toast.error(`Category "${newCategory}" already exists!`)
    }
  }

  const handleLogout = () => {
    const logoutPromise = new Promise((resolve) => {
      setTimeout(() => {
        onLogout()
        resolve()
      }, 500)
    })

    toast.promise(logoutPromise, {
      loading: "Signing out...",
      success: "Successfully signed out! 👋",
      error: "Failed to sign out",
    })
  }

  const handleThemeToggle = () => {
    console.log("Theme toggle clicked")
    onToggleDarkMode()
    toast(`Switched to ${!darkMode ? "dark" : "light"} mode! ${!darkMode ? "🌙" : "☀️"}`, {
      duration: 2000,
      icon: !darkMode ? "🌙" : "☀️",
    })
  }

  const filteredAndSortedTasks = tasks
    .filter((task) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "completed" && task.completed) ||
        (filter === "pending" && !task.completed) ||
        (filter === "overdue" && task.dueDate && new Date(task.dueDate) < new Date() && !task.completed) ||
        (filter.startsWith("priority-") && task.priority === filter.split("-")[1]) ||
        (filter.startsWith("category-") && task.category === filter.split("-")[1])

      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.category && task.category.toLowerCase().includes(searchTerm.toLowerCase()))

      return matchesFilter && matchesSearch
    })
    .sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          aValue = priorityOrder[a.priority] || 0
          bValue = priorityOrder[b.priority] || 0
          break
        case "dueDate":
          aValue = a.dueDate ? new Date(a.dueDate) : new Date("9999-12-31")
          bValue = b.dueDate ? new Date(b.dueDate) : new Date("9999-12-31")
          break
        case "category":
          aValue = a.category || "zzz"
          bValue = b.category || "zzz"
          break
        default:
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const taskCounts = {
    all: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
    overdue: tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && !t.completed).length,
    high: tasks.filter((t) => t.priority === "high").length,
    medium: tasks.filter((t) => t.priority === "medium").length,
    low: tasks.filter((t) => t.priority === "low").length,
  }

  categories.forEach((category) => {
    taskCounts[`category-${category}`] = tasks.filter((t) => t.category === category).length
  })

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div>
              <h1 className="app-title">Personal Task Tracker</h1>
              <p className="app-subtitle">Welcome back, {username}!</p>
            </div>
          </div>

          <div className="header-right">
            <div className="header-stats">
              <div className="stat">
                <span className="stat-number">{taskCounts.pending}</span>
                <span className="stat-label">Pending</span>
              </div>
              <div className="stat">
                <span className="stat-number">{taskCounts.completed}</span>
                <span className="stat-label">Done</span>
              </div>
            </div>

            <button onClick={handleThemeToggle} className="theme-toggle" title="Toggle theme">
              {darkMode ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            

            <button onClick={handleLogout} className="logout-button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16,17 21,12 16,7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {/* Controls */}
        <div className="dashboard-controls">
          <div className="controls-row">
            <div className="search-container">
              <svg
                className="search-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search tasks, categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="sort-controls">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                <option value="createdAt">Date Created</option>
                <option value="title">Title</option>
                <option value="priority">Priority</option>
                <option value="dueDate">Due Date</option>
                <option value="category">Category</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="sort-order-button"
                title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {sortOrder === "asc" ? (
                    <path d="M3 6l3 3 3-3M6 9V3M13 6h8M13 12h8M13 18h8" />
                  ) : (
                    <path d="M3 18l3-3 3 3M6 15v6M13 6h8M13 12h8M13 18h8" />
                  )}
                </svg>
              </button>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`filter-toggle-button ${showFilters ? "active" : ""}`}
              title="Toggle filters"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
              </svg>
              <span>Filter</span>
            </button>

            <button onClick={() => setShowTaskForm(true)} className="add-task-button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Add Task</span>
            </button>
          </div>

          <TaskFilter
            currentFilter={filter}
            onFilterChange={setFilter}
            taskCounts={taskCounts}
            categories={categories}
            showFilters={showFilters}
          />
        </div>

        {/* Task List */}
        <TaskList
          tasks={filteredAndSortedTasks}
          onToggleComplete={toggleTaskComplete}
          onEditTask={setEditingTask}
          onDeleteTask={deleteTask}
          searchTerm={searchTerm}
        />

        {/* Task Form Modal */}
        {(showTaskForm || editingTask) && (
          <TaskForm
            task={editingTask}
            categories={categories}
            onSubmit={editingTask ? updateTask : addTask}
            onCancel={() => {
              setShowTaskForm(false)
              setEditingTask(null)
            }}
            onAddCategory={addCategory}
          />
        )}
      </main>
    </div>
  )
}

export default TaskDashboard
