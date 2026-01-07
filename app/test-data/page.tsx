'use client'

import { useState, useEffect } from 'react'
import { getAnalyticsData } from '../../lib/supabase'

export default function TestDataPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        console.log('Loading analytics data for site_xnurtj0yv4f_mk4i6uvk')

        const analyticsData = await getAnalyticsData('site_xnurtj0yv4f_mk4i6uvk', '7d')
        console.log('Analytics data loaded:', analyticsData)

        setData(analyticsData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test Data Page - No Authentication</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Raw Analytics Data</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>

      {data && (
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded">
            <div className="text-sm text-gray-600">Total Views</div>
            <div className="text-2xl font-bold">{data.totalViews}</div>
          </div>
          <div className="bg-purple-50 p-4 rounded">
            <div className="text-sm text-gray-600">AI Views</div>
            <div className="text-2xl font-bold">{data.aiViews}</div>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <div className="text-sm text-gray-600">AI %</div>
            <div className="text-2xl font-bold">
              {Math.round((data.aiViews / data.totalViews) * 100) || 0}%
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded">
            <div className="text-sm text-gray-600">Top AI Source</div>
            <div className="text-xl font-bold">
              {data.topAiSources[0]?.name || 'None'}
            </div>
          </div>
        </div>
      )}

      {data?.topAiSources && data.topAiSources.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow mt-6">
          <h3 className="text-lg font-semibold mb-4">AI Sources</h3>
          {data.topAiSources.map((source: any, i: number) => (
            <div key={source.name} className="flex justify-between p-2 border-b">
              <span>{source.name}</span>
              <span className="font-semibold">{source.views}</span>
            </div>
          ))}
        </div>
      )}

      {data?.topPages && data.topPages.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow mt-6">
          <h3 className="text-lg font-semibold mb-4">Top Pages</h3>
          {data.topPages.map((page: any) => (
            <div key={page.path} className="flex justify-between p-2 border-b">
              <span className="truncate">{page.path}</span>
              <span className="font-semibold">{page.views} total, {page.aiViews} AI</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}