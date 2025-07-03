"use client"

import { useState, useEffect } from "react"
import { Toaster } from "react-hot-toast"
import Login from "./components/Login"
import TaskDashboard from "./components/TaskDashboard"
import "./styles/App.css"

function App() {
  // Initialize state with direct localStorage access to avoid race conditions
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return localStorage.getItem("taskTracker_username") || null
    } catch (error) {
      console.error("Error loading username:", error)
      return null
    }
  })

  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("taskTracker_darkMode") === "true"
    } catch (error) {
      console.error("Error loading theme preference:", error)
      return false
    }
  })

  const [isLoading, setIsLoading] = useState(false)

  // Apply theme whenever it changes
  useEffect(() => {
    console.log("Applying theme:", darkMode)

    if (darkMode) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }

    // Save theme preference
    localStorage.setItem("taskTracker_darkMode", darkMode.toString())
  }, [darkMode])

  const handleLogin = (username) => {
    console.log("Login:", username)
    localStorage.setItem("taskTracker_username", username)
    setCurrentUser(username)
  }

  const handleLogout = () => {
    console.log("Logout")
    localStorage.removeItem("taskTracker_username")
    setCurrentUser(null)
  }

  const toggleDarkMode = () => {
    console.log("Toggle theme from", darkMode, "to", !darkMode)
    setDarkMode((prev) => !prev)
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: darkMode ? "#111827" : "#ffffff",
            color: darkMode ? "#ffffff" : "#1f2937",
            border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "500",
            padding: "12px 16px",
            boxShadow: darkMode ? "0 10px 25px rgba(0, 0, 0, 0.5)" : "0 10px 25px rgba(0, 0, 0, 0.15)",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: darkMode ? "#111827" : "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: darkMode ? "#111827" : "#ffffff",
            },
          },
          loading: {
            iconTheme: {
              primary: "#667eea",
              secondary: darkMode ? "#111827" : "#ffffff",
            },
          },
        }}
      />
      {currentUser ? (
        <TaskDashboard
          username={currentUser}
          onLogout={handleLogout}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      ) : (
        <Login onLogin={handleLogin} darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
      )}
    </div>
  )
}

export default App
