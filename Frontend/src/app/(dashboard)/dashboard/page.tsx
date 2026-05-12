'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/axios'
import dynamic from 'next/dynamic'
import { Code2, Trophy } from 'lucide-react'
import StatCard from '@/components/dashboard/StatCard'

const RatingGraph = dynamic(
  () => import('@/components/dashboard/RatingGraph'),
  { ssr: false, loading: () => <div className="h-48 animate-pulse bg-muted rounded-lg" /> }
)
const DifficultyChart = dynamic(
  () => import('@/components/dashboard/DifficultyChart'),
  { ssr: false, loading: () => <div className="h-48 animate-pulse bg-muted rounded-lg" /> }
)
const UpcomingContests = dynamic(
  () => import('@/components/dashboard/UpcomingContests'),
  { ssr: false, loading: () => <div className="h-48 animate-pulse bg-muted rounded-lg" /> }
)
const ActivityHeatmap = dynamic(
  () => import('@/components/dashboard/ActivityHeatmap'),
  { ssr: false, loading: () => <div className="h-48 animate-pulse bg-muted rounded-lg" /> }
)
const PlatformChart = dynamic(
  () => import('@/components/dashboard/PlatformChart'),
  { ssr: false, loading: () => <div className="h-48 animate-pulse bg-muted rounded-lg" /> }
)
function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-6 p-6 animate-pulse">
      <div className="h-10 w-48 bg-[#2E2A24] rounded-xl" />
      <div className="h-60 bg-[#2E2A24] rounded-xl" />
    </div>
  )
}
function ErrorState({ message }: { message: string }) {
  return <div className="p-6 text-red-500">{message}</div>
}

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<any>(null)
  const [progress, setProgress]   = useState<any[]>([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Parallel fetch — total time = slowest single request, not sum of all
        const [dashRes, progRes] = await Promise.allSettled([
          api.get('/api/progress/dashboard'),
          api.get('/api/progress'),
        ])

        if (dashRes.status === 'fulfilled') {
          setDashboard(dashRes.value.data)
        } else {
          console.error('Dashboard fetch failed:', dashRes.reason)
        }
        
        if (progRes.status === 'fulfilled') {
          setProgress(progRes.value.data.progress || [])
        } else {
          console.error('Progress fetch failed:', progRes.reason)
        }
      } catch (e) {
        setError('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  if (loading) return <DashboardLoadingSkeleton />
  if (error)   return <ErrorState message={error} />

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-4xl font-display font-bold text-heading-dark">Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          label="LeetCode Solved"
          value={dashboard?.lcData?.totalSolved || 0}
          icon={Code2}
          color="text-[#FFA116]"
          subtext={`Streak: ${dashboard?.lcData?.streak || 0} days`}
        />
        <StatCard
          label="Competitive Programming"
          value={(dashboard?.platforms?.codeforces || 0) + (dashboard?.platforms?.codechef || 0)}
          icon={Trophy}
          color="text-[#3B82F6]"
          subtext={`CF Rating: ${dashboard?.cfData?.rating || 0} | CC: ${dashboard?.ccData?.rating || 0}`}
        />
      </div>

      <ActivityHeatmap data={dashboard?.heatmap ?? {}} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RatingGraph data={dashboard?.ratingHistory ?? []} />
        <DifficultyChart title="LeetCode Difficulty" data={dashboard?.lcDifficulty ?? { easy: 0, medium: 0, hard: 0 }} />
        <PlatformChart 
          title="Competitive Programming" 
          data={{ 
            codeforces: dashboard?.platforms?.codeforces || 0, 
            codechef: dashboard?.platforms?.codechef || 0 
          }} 
        />
      </div>
      <UpcomingContests />
    </div>
  )
}
