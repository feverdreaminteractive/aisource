'use client'

import { useState, useEffect } from 'react'
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
  totalViews: 12847,
  aiViews: 2156,
  topAiSources: [
    { name: 'ChatGPT', views: 847, change: '+23%' },
    { name: 'Claude', views: 562, change: '+15%' },
    { name: 'Perplexity', views: 324, change: '+8%' },
    { name: 'Gemini', views: 287, change: '-2%' },
    { name: 'Copilot', views: 136, change: '+45%' }
  ],
  topPages: [
    { path: '/blog/ai-trends-2024', views: 423, aiViews: 189 },
    { path: '/products/ml-tools', views: 356, aiViews: 134 },
    { path: '/docs/api-guide', views: 289, aiViews: 98 },
    { path: '/blog/chatgpt-integration', views: 234, aiViews: 156 },
    { path: '/pricing', views: 167, aiViews: 45 }
  ]
}

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('7d')
  const [loading, setLoading] = useState(false)

  const aiTrafficPercentage = Math.round((mockData.aiViews / mockData.totalViews) * 100)

  const timeSeriesData = {
    labels: ['Jan 1', 'Jan 2', 'Jan 3', 'Jan 4', 'Jan 5', 'Jan 6', 'Jan 7'],
    datasets: [
      {
        label: 'Total Traffic',
        data: [1200, 1400, 1100, 1800, 1600, 1900, 2100],
        borderColor: '#e5e7eb',
        backgroundColor: 'rgba(229, 231, 235, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'AI Traffic',
        data: [180, 210, 165, 290, 245, 320, 380],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  const sourceDistribution = {
    labels: mockData.topAiSources.map(s => s.name),
    datasets: [{
      data: mockData.topAiSources.map(s => s.views),
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="text-sm font-medium text-gray-500 mb-1">Total Page Views</div>
            <div className="text-3xl font-bold text-gray-900">{mockData.totalViews.toLocaleString()}</div>
            <div className="text-sm text-green-600 mt-1">+12% vs last period</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="text-sm font-medium text-gray-500 mb-1">AI Traffic</div>
            <div className="text-3xl font-bold text-purple-600">{mockData.aiViews.toLocaleString()}</div>
            <div className="text-sm text-green-600 mt-1">+28% vs last period</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="text-sm font-medium text-gray-500 mb-1">AI Traffic %</div>
            <div className="text-3xl font-bold text-blue-600">{aiTrafficPercentage}%</div>
            <div className="text-sm text-green-600 mt-1">+3.2% vs last period</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="text-sm font-medium text-gray-500 mb-1">Top AI Source</div>
            <div className="text-3xl font-bold text-green-600">ChatGPT</div>
            <div className="text-sm text-gray-600 mt-1">{mockData.topAiSources[0].views} views</div>
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
              {mockData.topAiSources.map((source, index) => (
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
              {mockData.topPages.map((page, index) => (
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