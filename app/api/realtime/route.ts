import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(`Missing Supabase environment variables. URL: ${!!supabaseUrl}, Key: ${!!supabaseKey}`)
}

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const siteId = url.searchParams.get('siteId')

    if (!siteId) {
      return NextResponse.json({ error: 'siteId is required' }, { status: 400 })
    }

    // Get recent events (last 24 hours)
    const oneDayAgo = new Date()
    oneDayAgo.setDate(oneDayAgo.getDate() - 1)

    const { data: events, error } = await supabase
      .from('events')
      .select('event_name, ai_source, timestamp, url, title')
      .eq('site_id', siteId)
      .gte('timestamp', oneDayAgo.toISOString())
      .order('timestamp', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
    }

    return NextResponse.json({
      events: events || [],
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Realtime API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}