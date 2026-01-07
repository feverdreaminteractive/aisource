import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { createClient } from '@supabase/supabase-js'
import { CreateSiteRequest } from '@/lib/types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: sites, error } = await supabase
      .from('sites')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch sites' }, { status: 500 })
    }

    return NextResponse.json({ sites })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: CreateSiteRequest = await request.json()
    const { domain, name } = body

    if (!domain || !name) {
      return NextResponse.json({ error: 'Domain and name are required' }, { status: 400 })
    }

    // Generate a unique site ID
    const siteId = `site_${Math.random().toString(36).substring(2)}_${Date.now().toString(36)}`

    const { data: site, error } = await supabase
      .from('sites')
      .insert({
        id: siteId,
        domain: domain.replace(/^https?:\/\//, '').replace(/\/$/, ''), // Clean domain
        name,
        owner_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to create site' }, { status: 500 })
    }

    return NextResponse.json({ site })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}