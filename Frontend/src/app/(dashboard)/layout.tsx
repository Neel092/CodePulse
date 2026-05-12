'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Sidebar from '@/components/layout/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.replace('/login')
    }
  }, [loading, user, router])

  // show loader while auth is resolving
  if (loading) {
    return <DashboardSkeleton />
  }

  // prevent dashboard flash before redirect
  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-background-dark text-foreground-dark overflow-hidden">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        <main className="p-8 pb-24">
          {children}
        </main>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#0F0D0B] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-[#D97B3C] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#7A7068] text-sm">
          Loading dashboard...
        </p>
      </div>
    </div>
  )
}