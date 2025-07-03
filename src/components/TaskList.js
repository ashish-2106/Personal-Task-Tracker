import TaskItem from "./TaskItem"

function TaskList({ tasks, onToggleComplete, onEditTask, onDeleteTask, searchTerm }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          {searchTerm ? (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          ) : (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          )}
        </div>
        <h3 className="empty-title">{searchTerm ? "No tasks found" : "No tasks yet"}</h3>
        <p className="empty-description">
          {searchTerm
            ? `No tasks match "${searchTerm}". Try adjusting your search or filters.`
            : "Get started by adding your first task with priorities, categories, and due dates!"}
        </p>
        {!searchTerm && (
          <div className="empty-features">
            <div className="feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>Set priorities (High, Medium, Low)</span>
            </div>
            <div className="feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
              <span>Organize with categories</span>
            </div>
            <div className="feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
              </svg>
              <span>Track due dates</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h2>Tasks ({tasks.length})</h2>
      </div>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
        />
      ))}
    </div>
  )
}

export default TaskList
