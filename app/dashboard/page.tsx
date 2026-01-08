'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser, UserButton, SignInButton } from '@clerk/nextjs'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { getAnalyticsData, getUserSites } from '../../lib/supabase'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const mockData = {
  totalViews: 0,
  aiViews: 0,
  topAiSources: [],
  topPages: [],
  timeSeries: {
    labels: [],
    totalData: [],
    aiData: []
  }
}

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [timeRange, setTimeRange] = useState('7d')
  const [loading, setLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState(mockData)
  const [sites, setSites] = useState<any[]>([])

  const loadUserData = useCallback(async () => {
    try {
      setLoading(true)

      if (!user?.id) {
        setLoading(false)
        return
      }

      const userSites = await getUserSites(user.id)
      setSites(userSites)

      if (userSites.length > 0) {
        // Use the site with actual tracking data or fall back to most recent site
        const targetSite = userSites.find(site => site.id === 'site_xnurtj0yv4f_mk4i6uvk') || userSites[userSites.length - 1]
        const data = await getAnalyticsData(targetSite.id, timeRange)
        if (data) {
          setAnalyticsData(data)
        }
      } else {
        // No sites found - show empty state
        setAnalyticsData({ totalViews: 0, aiViews: 0, topAiSources: [], topPages: [] })
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }, [user?.id, timeRange])

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && user?.id) {
        loadUserData()
      } else {
        setLoading(false)
      }
    }
  }, [isLoaded, isSignedIn, user?.id, loadUserData])

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to AISource</h1>
          <p className="text-gray-600 mb-8">Track AI traffic that Google Analytics misses</p>
          <SignInButton mode="modal">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Sign In to Continue
            </button>
          </SignInButton>
        </div>
      </div>
    )
  }

  const aiTrafficPercentage = Math.round((analyticsData.aiViews / analyticsData.totalViews) * 100) || 0

  const timeSeriesData = {
    labels: analyticsData.timeSeries?.labels || [],
    datasets: [
      {
        label: 'Total Traffic',
        data: analyticsData.timeSeries?.totalData || [],
        borderColor: '#e5e7eb',
        backgroundColor: 'rgba(229, 231, 235, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'AI Traffic',
        data: analyticsData.timeSeries?.aiData || [],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  const sourceDistribution = {
    labels: analyticsData.topAiSources.map(s => s.name),
    datasets: [{
      data: analyticsData.topAiSources.map(s => s.views),
      backgroundColor: [
        '#10b981',
        '#8b5cf6',
        '#f59e0b',
        '#ef4444',
        '#3b82f6'
      ],
      borderWidth: 0
    }]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">AI Traffic Analytics</h1>
            <div className="flex items-center gap-4">
              <UserButton afterSignOutUrl="/" />
              <div className="flex gap-2">
              {['24h', '7d', '30d', '90d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    timeRange === range
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {range}
                </button>
              ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="text-sm font-medium text-gray-500 mb-1">Total Page Views</div>
            <div className="text-3xl font-bold text-gray-900">{analyticsData.totalViews.toLocaleString()}</div>
            <div className="text-sm text-green-600 mt-1">+12% vs last period</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="text-sm font-medium text-gray-500 mb-1">AI Traffic</div>
            <div className="text-3xl font-bold text-purple-600">{analyticsData.aiViews.toLocaleString()}</div>
            <div className="text-sm text-green-600 mt-1">+28% vs last period</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="text-sm font-medium text-gray-500 mb-1">AI Traffic %</div>
            <div className="text-3xl font-bold text-blue-600">{aiTrafficPercentage}%</div>
            <div className="text-sm text-green-600 mt-1">+3.2% vs last period</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="text-sm font-medium text-gray-500 mb-1">Top AI Source</div>
            <div className="text-3xl font-bold text-green-600">{analyticsData.topAiSources[0]?.name || 'No Data'}</div>
            <div className="text-sm text-gray-600 mt-1">{analyticsData.topAiSources[0]?.views || 0} views</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-lg font-semibold mb-4">Traffic Over Time</h2>
            <div className="h-80">
              <Line
                data={timeSeriesData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: '#f3f4f6'
                      }
                    },
                    x: {
                      grid: {
                        display: false
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-lg font-semibold mb-4">AI Sources</h2>
            <div className="h-80 flex items-center justify-center">
              <Doughnut
                data={sourceDistribution}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-lg font-semibold mb-4">Top AI Sources</h2>
            <div className="space-y-4">
              {analyticsData.topAiSources.map((source, index) => (
                <div key={source.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: sourceDistribution.datasets[0].backgroundColor[index] }}></div>
                    <span className="font-medium">{source.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{source.views}</div>
                    <div className={`text-sm ${source.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {source.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-lg font-semibold mb-4">Top Pages by AI Traffic</h2>
            <div className="space-y-4">
              {analyticsData.topPages.map((page, index) => (
                <div key={page.path} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-sm mb-1">{page.path}</div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Total: {page.views}</span>
                    <span className="text-purple-600 font-medium">AI: {page.aiViews}</span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${(page.aiViews / page.views) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-2">Getting Started</h2>
          <p className="text-gray-600 mb-4">Add the tracking script to your site to start collecting AI referral data:</p>
          <div className="bg-white p-4 rounded-lg border font-mono text-sm text-gray-800">
            {'<script src="https://aisource.vercel.app/track.js" data-site="demo-site-123"></script>'}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Replace "demo-site-123" with your unique site ID. Visit our setup guide for more details.
          </p>
        </div>
      </div>
    </div>
  )
}