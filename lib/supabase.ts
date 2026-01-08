import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Analytics query helpers
export async function getAnalyticsData(siteId: string, timeRange: string = '7d') {
  const now = new Date()
  const daysAgo = timeRange === '24h' ? 1 :
                  timeRange === '7d' ? 7 :
                  timeRange === '30d' ? 30 : 90

  const startDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000))

  // Get total views
  const { data: totalEvents, error: totalError } = await supabase
    .from('events')
    .select('*')
    .eq('site_id', siteId)
    .gte('timestamp', startDate.toISOString())

  if (totalError) {
    console.error('Error fetching total events:', totalError)
    return null
  }

  // Get AI views
  const { data: aiEvents, error: aiError } = await supabase
    .from('events')
    .select('*')
    .eq('site_id', siteId)
    .not('ai_source', 'is', null)
    .gte('timestamp', startDate.toISOString())

  if (aiError) {
    console.error('Error fetching AI events:', aiError)
    return null
  }

  // Process data for dashboard
  const totalViews = totalEvents?.length || 0
  const aiViews = aiEvents?.length || 0

  // Group AI sources
  const aiSourceCounts: { [key: string]: number } = {}
  aiEvents?.forEach(event => {
    if (event.ai_source) {
      aiSourceCounts[event.ai_source] = (aiSourceCounts[event.ai_source] || 0) + 1
    }
  })

  const topAiSources = Object.entries(aiSourceCounts)
    .map(([name, views]) => ({ name, views, change: '+0%' }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)

  // Group pages
  const pageCounts: { [key: string]: { total: number, ai: number } } = {}
  totalEvents?.forEach(event => {
    const path = event.url || '/'
    if (!pageCounts[path]) {
      pageCounts[path] = { total: 0, ai: 0 }
    }
    pageCounts[path].total++
  })

  aiEvents?.forEach(event => {
    const path = event.url || '/'
    if (pageCounts[path]) {
      pageCounts[path].ai++
    }
  })

  const topPages = Object.entries(pageCounts)
    .map(([path, counts]) => ({ path, views: counts.total, aiViews: counts.ai }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)

  // Generate time series data
  const dailyCounts: { [key: string]: { total: number, ai: number } } = {}

  // Initialize all days in range with zero counts
  for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
    const dateKey = d.toISOString().split('T')[0]
    dailyCounts[dateKey] = { total: 0, ai: 0 }
  }

  // Count events by day
  totalEvents?.forEach(event => {
    const dateKey = event.timestamp.split('T')[0]
    if (dailyCounts[dateKey]) {
      dailyCounts[dateKey].total++
    }
  })

  aiEvents?.forEach(event => {
    const dateKey = event.timestamp.split('T')[0]
    if (dailyCounts[dateKey]) {
      dailyCounts[dateKey].ai++
    }
  })

  // Convert to arrays for chart
  const sortedDates = Object.keys(dailyCounts).sort()
  const timeSeriesLabels = sortedDates.map(date => {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  })
  const timeSeriesTotal = sortedDates.map(date => dailyCounts[date].total)
  const timeSeriesAI = sortedDates.map(date => dailyCounts[date].ai)

  return {
    totalViews,
    aiViews,
    topAiSources,
    topPages,
    timeSeries: {
      labels: timeSeriesLabels,
      totalData: timeSeriesTotal,
      aiData: timeSeriesAI
    }
  }
}

export async function getUserSites(userId: string) {
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user sites:', error)
    return []
  }

  return data || []
}