'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser, UserButton, SignInButton } from '@clerk/nextjs'
import Link from 'next/link'
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
import { AnalyticsData } from '../../lib/types'

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
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(mockData)
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
        // Aggregate data from all user sites
        const allAnalyticsData = await Promise.all(
          userSites.map(site => getAnalyticsData(site.id, timeRange))
        )

        // Combine all the data
        let combinedData = {
          totalViews: 0,
          aiViews: 0,
          topAiSources: [] as any[],
          topPages: [] as any[],
          timeSeries: { labels: [], totalData: [], aiData: [] }
        }

        // Aggregate totals and collect all sources/pages
        allAnalyticsData.forEach(siteData => {
          if (siteData) {
            combinedData.totalViews += siteData.totalViews
            combinedData.aiViews += siteData.aiViews
            combinedData.topAiSources.push(...siteData.topAiSources)
            combinedData.topPages.push(...siteData.topPages)

            // Use the first site's time series data for the chart
            if (!combinedData.timeSeries.labels.length && siteData.timeSeries) {
              combinedData.timeSeries = siteData.timeSeries
            }
          }
        })

        // Process aggregated AI sources
        const aiSourceCounts: { [key: string]: number } = {}
        combinedData.topAiSources.forEach(source => {
          aiSourceCounts[source.name] = (aiSourceCounts[source.name] || 0) + source.views
        })

        const aggregatedAiSources = Object.entries(aiSourceCounts)
          .map(([name, views]) => ({ name, views, change: '+0%' }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 5)

        // Process aggregated pages
        const pageCounts: { [key: string]: { views: number, aiViews: number } } = {}
        combinedData.topPages.forEach(page => {
          if (!pageCounts[page.path]) {
            pageCounts[page.path] = { views: 0, aiViews: 0 }
          }
          pageCounts[page.path].views += page.views
          pageCounts[page.path].aiViews += page.aiViews
        })

        const aggregatedPages = Object.entries(pageCounts)
          .map(([path, counts]) => ({ path, views: counts.views, aiViews: counts.aiViews }))
          .sort((a, b) => b.aiViews - a.aiViews)
          .slice(0, 5)

        setAnalyticsData({
          ...combinedData,
          topAiSources: aggregatedAiSources,
          topPages: aggregatedPages
        })
      } else {
        // No sites found - show empty state
        setAnalyticsData({
          totalViews: 0,
          aiViews: 0,
          topAiSources: [],
          topPages: [],
          timeSeries: { labels: [], totalData: [], aiData: [] }
        })
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


  const timeSeriesData = {
    labels: analyticsData.timeSeries?.labels || [],
    datasets: [
      {
        label: 'AI Referrals',
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
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold text-gray-900">AI Referral Analytics</h1>
              <Link
                href="/sites"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Manage Sites
              </Link>
            </div>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="text-sm font-medium text-gray-500 mb-1">AI Referrals</div>
            <div className="text-3xl font-bold text-purple-600">{analyticsData.aiViews.toLocaleString()}</div>
            <div className="text-sm text-green-600 mt-1">+28% vs last period</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="text-sm font-medium text-gray-500 mb-1">Top AI Source</div>
            <div className="text-3xl font-bold text-green-600">{analyticsData.topAiSources[0]?.name || 'No Data'}</div>
            <div className="text-sm text-gray-600 mt-1">{analyticsData.topAiSources[0]?.views || 0} referrals</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="text-sm font-medium text-gray-500 mb-1">AI Sources</div>
            <div className="text-3xl font-bold text-blue-600">{analyticsData.topAiSources.length}</div>
            <div className="text-sm text-gray-600 mt-1">Active sources</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-lg font-semibold mb-4">AI Referrals Over Time</h2>
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
            <h2 className="text-lg font-semibold mb-4">Top Pages by AI Referrals</h2>
            <div className="space-y-4">
              {analyticsData.topPages.map((page) => (
                <div key={page.path} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{page.path}</div>
                    <div className="text-xs text-gray-500 mt-1">Page URL</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-purple-600">{page.aiViews}</div>
                    <div className="text-xs text-gray-500">AI referrals</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {sites.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl">
            <h2 className="text-lg font-semibold mb-2">Currently Tracking ({sites.length} {sites.length === 1 ? 'site' : 'sites'})</h2>
            <div className="space-y-2">
              {sites.slice(0, 3).map(site => (
                <div key={site.id} className="bg-white p-3 rounded-lg border flex justify-between items-center">
                  <div>
                    <span className="font-medium text-sm">{site.name}</span>
                    <span className="text-xs text-gray-500 ml-2">{site.domain}</span>
                  </div>
                  <div className="text-xs text-gray-400">{site.id}</div>
                </div>
              ))}
              {sites.length > 3 && (
                <div className="text-sm text-gray-600 text-center pt-2">
                  And {sites.length - 3} more sites
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Analytics above show aggregated data from all your sites. <Link href="/sites" className="text-blue-600 hover:underline">Manage all sites</Link>
            </p>
          </div>
        )}

        {sites.length === 0 && (
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl">
            <h2 className="text-lg font-semibold mb-2">Getting Started</h2>
            <p className="text-gray-600 mb-4">Add your first site to start tracking AI referral data:</p>
            <Link
              href="/sites"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Add Your First Site
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}