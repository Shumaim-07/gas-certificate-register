import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { api, getStoredToken, setStoredToken } from '../api'
import type { EngineerProfile, UserRole } from '../types'

interface AuthContextValue {
  role: UserRole | null
  engineer: EngineerProfile | null
  adminUsername: string | null
  loading: boolean
  loginEngineer: (token: string, engineer: EngineerProfile) => void
  loginAdmin: (token: string, username: string) => void
  logout: () => void
  refresh: () => Promise<void>
  setEngineer: (engineer: EngineerProfile) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null)
  const [engineer, setEngineer] = useState<EngineerProfile | null>(null)
  const [adminUsername, setAdminUsername] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const logout = useCallback(() => {
    setStoredToken(null)
    setRole(null)
    setEngineer(null)
    setAdminUsername(null)
  }, [])

  const refresh = useCallback(async () => {
    const token = getStoredToken()
    if (!token) {
      setRole(null)
      setEngineer(null)
      setAdminUsername(null)
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const me = await api.getMe()
      setRole(me.role)
      if (me.role === 'admin') {
        setAdminUsername(me.username ?? null)
        setEngineer(null)
      } else {
        setEngineer(me.engineer ?? null)
        setAdminUsername(null)
      }
    } catch {
      logout()
    } finally {
      setLoading(false)
    }
  }, [logout])

  useEffect(() => {
    refresh()
  }, [refresh])

  const loginEngineer = useCallback((token: string, eng: EngineerProfile) => {
    setStoredToken(token)
    setRole('engineer')
    setEngineer(eng)
    setAdminUsername(null)
  }, [])

  const loginAdmin = useCallback((token: string, username: string) => {
    setStoredToken(token)
    setRole('admin')
    setAdminUsername(username)
    setEngineer(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        role,
        engineer,
        adminUsername,
        loading,
        loginEngineer,
        loginAdmin,
        logout,
        refresh,
        setEngineer,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
