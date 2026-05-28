import React, { createContext, useContext, useState } from 'react'
import { removeCookie } from '../utils/cookie'

const AuthContext = createContext(null)

const MOCK_USER = {
  id: 'u1',
  name: 'Thanachot S.',
  email: 'thanachot@pungkang.com',
  role: 'owner',
  area: 'Bangkok Branch',
}

export function AuthStoreProvider({ children }) {
  const [user, setUser] = useState(MOCK_USER)
  const [isAuthenticated, setIsAuthenticated] = useState(true)

  const login = (u) => { setUser(u); setIsAuthenticated(true) }
  const logout = () => { 
    setUser(null); 
    setIsAuthenticated(false);
    removeCookie('token');
  }

  const value = {
    user,
    role: user?.role ?? null,
    workspace: user?.area ?? null,
    isAuthenticated,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuthStore = () => useContext(AuthContext)
