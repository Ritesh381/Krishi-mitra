import React from 'react'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

function Dashboard() {
  const { user, logout } = useAuth()
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Krishi Mitra Dashboard</h1>
          <div className="flex items-center">
            <span className="mr-4 text-gray-700">Welcome, {user?.username}</span>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
            <h2 className="text-xl font-semibold mb-4">Protected Content</h2>
            <p>This content is only visible to authenticated users.</p>
            <div className="mt-4">
              <h3 className="text-lg font-medium">User Information:</h3>
              <p>ID: {user?.id}</p>
              <p>Username: {user?.username}</p>
              <p>Email: {user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  )
}

export default App
