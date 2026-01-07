import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
);

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { event, properties, distinct_id, session_id } = data;

    if (!event || !properties?.token || !distinct_id || !session_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const eventData = {
      site_id: properties.token,
      session_id: session_id,
      distinct_id: distinct_id,
      event_name: event,
      timestamp: new Date(properties.time).toISOString(),
      properties: properties,
      url: properties.$current_url,
      title: properties.$title,
      referrer: properties.$referrer === '$direct' ? null : properties.$referrer,
      ai_source: properties.$ai_source,
      ai_domain: properties.$ai_domain,
      device_type: properties.$device_type,
      browser: properties.$browser,
      os: properties.$os,
      language: properties.$language,
      timezone: properties.$timezone,
      screen_width: properties.$screen_width,
      screen_height: properties.$screen_height,
      viewport_width: properties.$viewport_width,
      viewport_height: properties.$viewport_height,
      time_on_page: properties.time_on_page,
      time_to_engage: properties.time_to_engage,
      engaged: properties.engaged,
      ip_address: request.ip ||
                  request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                  request.headers.get('x-real-ip') ||
                  'unknown'
    };

    const { error } = await supabase
      .from('events')
      .insert(eventData);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to save event' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 1,
      error: null
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        status: 0,
        error: 'Invalid request'
      },
      { status: 400 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}