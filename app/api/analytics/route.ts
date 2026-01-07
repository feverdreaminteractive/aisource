import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const siteId = url.searchParams.get('siteId')
    const days = parseInt(url.searchParams.get('days') || '7')

    if (!siteId) {
      return NextResponse.json({ error: 'siteId is required' }, { status: 400 })
    }

    // Verify user owns this site
    const { data: site } = await supabase
      .from('sites')
      .select('id')
      .eq('id', siteId)
      .eq('owner_id', userId)
      .single()

    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 })
    }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get total events
    const { count: totalViews } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('site_id', siteId)
      .eq('event_name', 'Page Viewed')
      .gte('timestamp', startDate.toISOString())

    // Get AI events
    const { count: aiViews } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('site_id', siteId)
      .eq('event_name', 'Page Viewed')
      .not('ai_source', 'is', null)
      .gte('timestamp', startDate.toISOString())

    // Get top AI sources
    const { data: aiSourcesData } = await supabase
      .from('events')
      .select('ai_source')
      .eq('site_id', siteId)
      .eq('event_name', 'Page Viewed')
      .not('ai_source', 'is', null)
      .gte('timestamp', startDate.toISOString())

    // Count AI sources
    const aiSourceCounts = aiSourcesData?.reduce((acc: Record<string, number>, event) => {
      const source = event.ai_source
      acc[source] = (acc[source] || 0) + 1
      return acc
    }, {}) || {}

    const topAiSources = Object.entries(aiSourceCounts)
      .map(([name, views]) => ({ name, views, change: '+0%' }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)

    // Get top pages
    const { data: pagesData } = await supabase
      .from('events')
      .select('url, ai_source')
      .eq('site_id', siteId)
      .eq('event_name', 'Page Viewed')
      .gte('timestamp', startDate.toISOString())

    const pageCounts = pagesData?.reduce((acc: Record<string, { total: number, ai: number }>, event) => {
      const path = new URL(event.url).pathname
      if (!acc[path]) acc[path] = { total: 0, ai: 0 }
      acc[path].total++
      if (event.ai_source) acc[path].ai++
      return acc
    }, {}) || {}

    const topPages = Object.entries(pageCounts)
      .map(([path, counts]) => ({
        path,
        views: counts.total,
        aiViews: counts.ai
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    return NextResponse.json({
      totalViews: totalViews || 0,
      aiViews: aiViews || 0,
      topAiSources,
      topPages
    })

  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}