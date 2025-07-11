"use client"

import { useState } from "react"
import toast from "react-hot-toast"

function Login({ onLogin, darkMode, onToggleDarkMode }) {
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!username.trim()) {
      setError("Username is required")
      toast.error("Please enter a username")
      return
    }

    if (username.trim().length < 2) {
      setError("Username must be at least 2 characters")
      toast.error("Username must be at least 2 characters long")
      return
    }

    // Show loading toast
    const loginPromise = new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem("taskTracker_username", username.trim())
        onLogin(username.trim())
        resolve()
      }, 500)
    })

    toast.promise(loginPromise, {
      loading: "Signing in...",
      success: `Welcome back, ${username.trim()}! 🎉`,
      error: "Failed to sign in",
    })
  }

  return (
    <div className="login-container">
      <div className="dark-mode-toggle">
        <button onClick={onToggleDarkMode} className="theme-toggle">
          {darkMode ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          </div>
          <h1 className="login-title">Personal Task Tracker</h1>
          <p className="login-subtitle">Organize your tasks with priorities, categories, and due dates</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <div className="input-container">
              
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  setError("")
                }}
                className="form-input"
              />
            </div>
            {error && <p className="error-message">{error}</p>}
          </div>

          <button type="submit" className="login-button">
            <span>Sign In</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12,5 19,12 12,19" />
            </svg>
          </button>
        </form>

        <div className="login-footer">
          <p>✨ Features: Priorities, Categories, Due Dates, Search & Dark Mode</p>
        </div>
      </div>
    </div>
  )
}

export default Login
