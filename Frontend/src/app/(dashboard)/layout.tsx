'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'

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

  if (loading) {
    return <DashboardSkeleton />
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-[#FAF8F5] dark:bg-[#080808] text-[#181818] dark:text-[#E5E5E5] overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8 lg:py-7">
          {children}
        </main>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#080808] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-9 h-9 border-2 border-[#A32616] dark:border-[#FF4D1C] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#777777] dark:text-[#666666] text-xs font-mono tracking-wider uppercase">
          INITIATING TELEMETRY LINK...
        </p>
      </div>
    </div>
  )
}
