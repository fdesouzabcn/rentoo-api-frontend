import { createContext, useState, useContext, useEffect } from 'react'
import { login as loginService, logout as logoutService } from '@/services/authService'
import { getUser } from '@/services/userService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem('rentoo_user')
    return stored ? JSON.parse(stored) : null
  })

  const [token, setToken] = useState(() => {
    return sessionStorage.getItem('rentoo_token') ?? null
  })

  const login = async (email, password) => {
    const result = await loginService(email, password)
    // result = { data: { id, name, email }, token: "..." }

    const partialUser = result.data
    const accessToken = result.token

    // Store token immediately so the next API call (getUser) is authenticated
    sessionStorage.setItem('rentoo_token', accessToken)
    setToken(accessToken)

    // Fetch full user object to get roles array
    const fullUser = await getUser(partialUser.id)
    // fullUser = { id, name, email, dni, phone, ..., roles: ["User"|"Admin"] }

    sessionStorage.setItem('rentoo_user', JSON.stringify(fullUser))
    setUser(fullUser)

    return fullUser
  }

  const logout = async () => {
    try {
      await logoutService()
    } catch {
      // Token may already be invalid — clear local state regardless
    } finally {
      sessionStorage.removeItem('rentoo_token')
      sessionStorage.removeItem('rentoo_user')
      setToken(null)
      setUser(null)
    }
  }

  const isAdmin = () => {
    return Array.isArray(user?.roles) && user.roles.includes('Admin')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used inside <AuthProvider>')
  }
  return context
}