import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../utils/api'

const AuthContext = createContext(null)

const TOKEN_KEY = 'token'
const USER_KEY = 'owner_user'

const saveToStorage = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`
}

const clearStorage = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  document.cookie = 'token=; path=/; max-age=0'
}

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const AuthStoreProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = getStoredUser()
    const token = localStorage.getItem(TOKEN_KEY)
    if (storedUser && token) {
      setUser(storedUser)
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const data = await api.post('/api/auth/login', { email, password })

      if (!data.token) {
        throw new Error('No token received')
      }

      if (data.user.role !== 'owner') {
        throw new Error('Access denied — owner account required')
      }

      saveToStorage(data.token, data.user)
      setUser(data.user)
      setIsAuthenticated(true)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  const logout = () => {
    clearStorage()
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthStoreProvider')
  return ctx
}

export default AuthContext
