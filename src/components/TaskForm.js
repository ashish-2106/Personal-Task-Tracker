"use client"

import { useState, useEffect } from "react"
import toast from "react-hot-toast"

function TaskForm({ task, categories, onSubmit, onCancel, onAddCategory }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("medium")
  const [category, setCategory] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || "")
      setPriority(task.priority || "medium")
      setCategory(task.category || "")
      setDueDate(task.dueDate || "")
    }
  }, [task])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!title.trim()) {
      setError("Task title is required")
      toast.error("Please enter a task title")
      return
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      category: category || undefined,
      dueDate: dueDate || undefined,
      completed: task ? task.completed : false,
    }

    if (task) {
      onSubmit({ ...task, ...taskData })
    } else {
      onSubmit(taskData)
    }
  }

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error("Please enter a category name")
      return
    }

    if (categories.includes(newCategory.trim())) {
      toast.error("Category already exists")
      return
    }

    onAddCategory(newCategory.trim())
    setCategory(newCategory.trim())
    setNewCategory("")
    setShowNewCategory(false)
  }

  const handleCancel = () => {
    if (title.trim() || description.trim()) {
      toast("Changes discarded", {
        icon: "📝",
        duration: 2000,
      })
    }
    onCancel()
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#ef4444"
      case "medium":
        return "#f59e0b"
      case "low":
        return "#10b981"
      default:
        return "#6b7280"
    }
  }

  const isOverdue = dueDate && new Date(dueDate) < new Date()

  return (
    <div className="modal-overlay">
      <div className="task-form-modal">
        <div className="modal-header">
          <h2 className="modal-title">{task ? "Edit Task" : "Add New Task"}</h2>
          <button onClick={handleCancel} className="close-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title *
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setError("")
              }}
              className="form-input"
            />
            {error && <p className="error-message">{error}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Enter task description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="form-textarea"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority" className="form-label">
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="form-select"
                style={{ borderColor: getPriorityColor(priority) }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dueDate" className="form-label">
                Due Date
              </label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`form-input ${isOverdue ? "overdue" : ""}`}
                min={new Date().toISOString().split("T")[0]}
              />
              {isOverdue && <p className="overdue-warning">This date has passed</p>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <div className="category-input-group">
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-select"
              >
                <option value="">No Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewCategory(!showNewCategory)}
                className="add-category-button"
                title="Add new category"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>

            {showNewCategory && (
              <div className="new-category-input">
                <input
                  type="text"
                  placeholder="New category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="form-input"
                  onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
                />
                <button type="button" onClick={handleAddCategory} className="confirm-category-button">
                  Add
                </button>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button">
              {task ? "Update Task" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskForm
