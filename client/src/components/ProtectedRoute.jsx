import React from 'react'
import { useAuth } from '../context/AuthContext'
import Login from '../pages/Login'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return children
}

export default ProtectedRoute
