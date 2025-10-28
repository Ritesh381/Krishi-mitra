import React from 'react'
import LanguagePage from './components/LanguagePage.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage.jsx'
import Signup from './components/Signup.jsx'
import LoginPage from './components/Login.jsx'
import Dashboard from './components/Dashboard.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LanguagePage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App
