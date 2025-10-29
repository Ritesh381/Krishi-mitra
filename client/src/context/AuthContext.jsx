import React, { createContext, useContext, useEffect, useState } from 'react'
import request from '../utils/api'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // On mount, try to fetch profile (cookie-auth)
    let mounted = true
    ;(async () => {
      try {
        const data = await request('/auth/profile')
        // server may return user object directly or { user }
        const u = data?.user ? data.user : data
        if (mounted) setUser(u || null)
      } catch (err) {
        if (mounted) setUser(null)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const login = async (email, password) => {
    const data = await request('/auth/login', { method: 'POST', body: { email, password } })
    const u = data?.user ? data.user : data
    setUser(u || null)
    try { localStorage.setItem('user', JSON.stringify(u)) } catch (e) {}
    return data
  }

  const register = async (payload) => {
    const data = await request('/auth/register', { method: 'POST', body: payload })
    const u = data?.user ? data.user : data
    setUser(u || null)
    try { localStorage.setItem('user', JSON.stringify(u)) } catch (e) {}
    return data
  }

  const logout = async () => {
    try {
      await request('/auth/logout', { method: 'POST' })
    } catch (e) {
      // ignore errors
    }
    setUser(null)
    try { localStorage.removeItem('user') } catch (e) {}
    navigate('/landing')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
