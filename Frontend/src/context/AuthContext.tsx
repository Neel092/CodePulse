'use client'

import { createContext, useContext, useEffect, useState, useRef } from 'react'
import api, { initCSRF } from '@/lib/axios'
import { useRouter, usePathname } from 'next/navigation'

interface User {
  _id: string
  username: string
  email: string
  displayName?: string
  platforms?: Record<string, string>
  syncMetadata?: Record<string, unknown>
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (data: Partial<User>) => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

const PUBLIC_ROUTES = ['/login', '/register', '/']

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const initialized = useRef(false)
  const pathname = usePathname()

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const init = async () => {
      try {
        await initCSRF()
        const { data } = await api.get('/api/auth/profile')
        setUser(data.user)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  useEffect(() => {
    if (loading) return

    const normalizedPath = pathname?.replace(/\/$/, '') || '/'
    const isPublic = PUBLIC_ROUTES.some(r =>
      r === '/' ? normalizedPath === '/' : normalizedPath.startsWith(r)
    )

    if (!user && !isPublic) {
      router.replace('/login')
    }
  }, [loading, user, pathname, router])

  const login = async (email: string, password: string) => {
    try {
      await initCSRF()
      const { data } = await api.post('/api/auth/login', { email, password })
      setUser(data.user)
      router.push('/dashboard')
    } catch (err: any) {
      console.error("LOGIN ERROR IN CONTEXT:", err.response?.data || err.message)
      throw err
    }
  }

  const logout = async () => {
    try {
      await api.post('/api/auth/logout')
    } finally {
      setUser(null)
      router.push('/login')
    }
  }

  const updateUser = (data: Partial<User>) => {
    setUser(prev => (prev ? { ...prev, ...data } : null))
  }

  const refreshUser = async () => {
    try {
      const { data } = await api.get('/api/auth/profile')
      setUser(data.user)
    } catch {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}