"use client"

import { useState } from "react"
import toast from "react-hot-toast"
import { formatDate } from "../utils/localStorage"

function TaskItem({ task, onToggleComplete, onEdit, onDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(task.id)
    } else {
      setShowDeleteConfirm(true)
      toast(`Click delete again to confirm removal of "${task.title}"`, {
        icon: "⚠️",
        duration: 3000,
      })
      setTimeout(() => setShowDeleteConfirm(false), 3000)
    }
  }

  const handleEdit = () => {
    onEdit(task)
    toast(`Editing "${task.title}"`, {
      icon: "✏️",
      duration: 2000,
    })
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

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        )
      case "medium":
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
          </svg>
        )
      case "low":
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        )
      default:
        return null
    }
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed
  const isDueSoon =
    task.dueDate &&
    !task.completed &&
    new Date(task.dueDate) > new Date() &&
    new Date(task.dueDate) <= new Date(Date.now() + 24 * 60 * 60 * 1000)

  return (
    <div
      className={`task-item ${task.completed ? "completed" : ""} ${isOverdue ? "overdue" : ""} ${isDueSoon ? "due-soon" : ""}`}
    >
      <div className="task-content">
        {/* Checkbox */}
        <button
          onClick={() => onToggleComplete(task.id)}
          className={`task-checkbox ${task.completed ? "checked" : ""}`}
        >
          {task.completed && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20,6 9,17 4,12" />
            </svg>
          )}
        </button>

        {/* Task Details */}
        <div className="task-details">
          <div className="task-header">
            <h3 className={`task-title ${task.completed ? "completed-text" : ""}`}>{task.title}</h3>
            <div className="task-badges">
              {task.priority && (
                <span
                  className="priority-badge"
                  style={{ backgroundColor: getPriorityColor(task.priority) }}
                  title={`${task.priority} priority`}
                >
                  {getPriorityIcon(task.priority)}
                  {task.priority}
                </span>
              )}
              {task.category && (
                <span className="category-badge" title={`Category: ${task.category}`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                  </svg>
                  {task.category}
                </span>
              )}
            </div>
          </div>

          {task.description && (
            <p className={`task-description ${task.completed ? "completed-text" : ""}`}>{task.description}</p>
          )}

          <div className="task-meta">
            <div className="meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>Created {formatDate(task.createdAt)}</span>
            </div>

            {task.dueDate && (
              <div className={`meta-item ${isOverdue ? "overdue-text" : isDueSoon ? "due-soon-text" : ""}`}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
                <span>
                  Due {formatDate(task.dueDate)}
                  {isOverdue && " (Overdue)"}
                  {isDueSoon && " (Due Soon)"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="task-actions">
          <button onClick={handleEdit} className="action-button edit-button" title="Edit task">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className={`action-button delete-button ${showDeleteConfirm ? "confirm" : ""}`}
            title={showDeleteConfirm ? "Click again to confirm" : "Delete task"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3,6 5,6 21,6" />
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          Click delete again to confirm removal
        </div>
      )}
    </div>
  )
}

export default TaskItem
