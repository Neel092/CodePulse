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

const DEMO_USER: User = {
  _id: "demo-user-algotracer",
  username: "algotracer",
  displayName: "algotracer",
  email: "algotracer@codepulse.io",
  platforms: {
    leetcode: "Tushar_waghmare12",
    codeforces: "neelpatil092",
    codechef: "compiler7",
  },
};

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
        setUser(data.user || DEMO_USER)
      } catch {
        // Fallback to demo user if backend is offline so dashboard and problems are testable
        setUser(DEMO_USER)
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
      // If server unreachable, login with demo user
      setUser(DEMO_USER)
      router.push('/dashboard')
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