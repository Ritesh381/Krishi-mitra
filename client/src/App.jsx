import React from 'react'
import LanguagePage from './components/LanguagePage.jsx'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './components/LandingPage.jsx'
import Signup from './components/Signup.jsx'
import LoginPage from './components/Login.jsx'
import Dashboard from './components/Dashboard.jsx'
import Chat from './components/chat/Chat.jsx'
import PestDetection from './components/PestDetection.jsx'
import CropSuggestions from './components/CropSuggestions.jsx'
import MarketPrices from './components/MarketPrices.jsx'
import IrrigationPlanner from './components/IrrigationPlanner.jsx'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import WeatherForecast from './components/WeatherForecast.jsx'

function App() {
  const { user, loading } = useAuth()

  if (loading) return null

  // If logged in, visiting /login or /signup should redirect to dashboard
  const redirectIfAuthenticated = (element) => (user ? <Navigate to="/dashboard" replace /> : element)

  return (
      <Routes>
        <Route path="/" element={<LanguagePage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/signup" element={redirectIfAuthenticated(<Signup />)} />
        <Route path="/login" element={redirectIfAuthenticated(<LoginPage />)} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path='/chat' element={<ProtectedRoute><Chat/></ProtectedRoute>}></Route>
        <Route path="/pest-detection" element={<ProtectedRoute><PestDetection /></ProtectedRoute>} />
        <Route path="/crop-suggestions" element={<ProtectedRoute><CropSuggestions /></ProtectedRoute>} />
        <Route path="/market-prices" element={<ProtectedRoute><MarketPrices /></ProtectedRoute>} />
        <Route path="/irrigation-planner" element={<ProtectedRoute><IrrigationPlanner /></ProtectedRoute>} />
        <Route path="/weather-forecast" element={<ProtectedRoute><WeatherForecast /></ProtectedRoute>} />
      </Routes>
  )
}

export default App

