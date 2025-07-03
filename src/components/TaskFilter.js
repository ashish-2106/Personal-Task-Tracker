"use client"

function TaskFilter({ currentFilter, onFilterChange, taskCounts, categories, showFilters }) {
  const statusFilters = [
    {
      key: "all",
      label: "All Tasks",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      ),
      count: taskCounts.all,
    },
    {
      key: "pending",
      label: "Pending",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12,6 12,12 16,14" />
        </svg>
      ),
      count: taskCounts.pending,
    },
    {
      key: "completed",
      label: "Completed",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
      ),
      count: taskCounts.completed,
    },
    {
      key: "overdue",
      label: "Overdue",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
      count: taskCounts.overdue,
      className: "overdue-filter",
    },
  ]

  const priorityFilters = [
    {
      key: "priority-high",
      label: "High Priority",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
      count: taskCounts.high,
      className: "priority-high",
    },
    {
      key: "priority-medium",
      label: "Medium Priority",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
        </svg>
      ),
      count: taskCounts.medium,
      className: "priority-medium",
    },
    {
      key: "priority-low",
      label: "Low Priority",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
      count: taskCounts.low,
      className: "priority-low",
    },
  ]

  const categoryFilters = categories.map((category) => ({
    key: `category-${category}`,
    label: category,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
    count: taskCounts[`category-${category}`] || 0,
    className: "category-filter",
  }))

  const renderFilterGroup = (title, filters) => (
    <div className="filter-group">
      <h4 className="filter-group-title">{title}</h4>
      <div className="filter-buttons">
        {filters.map((filter) => {
          const isActive = currentFilter === filter.key
          return (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              className={`filter-button ${isActive ? "active" : ""} ${filter.className || ""}`}
              title={`${filter.label} (${filter.count})`}
            >
              {filter.icon}
              <span className="filter-label">{filter.label}</span>
              <span className="filter-count">{filter.count}</span>
            </button>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="task-filter">
      {/* Status Filters - Always Visible */}
      <div className="filter-group">
        <h4 className="filter-group-title">STATUS</h4>
        <div className="filter-buttons">
          {statusFilters.map((filter) => {
            const isActive = currentFilter === filter.key
            return (
              <button
                key={filter.key}
                onClick={() => onFilterChange(filter.key)}
                className={`filter-button ${isActive ? "active" : ""} ${filter.className || ""}`}
                title={`${filter.label} (${filter.count})`}
              >
                {filter.icon}
                <span className="filter-label">{filter.label}</span>
                <span className="filter-count">{filter.count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Priority and Category Filters - Show when filter button is clicked */}
      {showFilters && (
        <div className="expandable-filters">
          {renderFilterGroup("PRIORITY", priorityFilters)}
          {categories.length > 0 && renderFilterGroup("CATEGORIES", categoryFilters)}
        </div>
      )}
    </div>
  )
}

export default TaskFilter
