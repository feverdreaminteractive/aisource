export interface Site {
  id: string
  domain: string
  name: string
  owner_id: string
  created_at: string
  updated_at: string
}

export interface Event {
  id: number
  site_id: string
  session_id: string
  distinct_id: string
  event_name: string
  timestamp: string
  properties: Record<string, any>
  url?: string
  title?: string
  referrer?: string
  ai_source?: string
  ai_domain?: string
  device_type?: string
  browser?: string
  os?: string
  language?: string
  timezone?: string
  screen_width?: number
  screen_height?: number
  viewport_width?: number
  viewport_height?: number
  time_on_page?: number
  time_to_engage?: number
  engaged?: boolean
  ip_address?: string
  created_at: string
}

export interface AnalyticsData {
  totalViews: number
  aiViews: number
  topAiSources: Array<{
    name: string
    views: number
    change: string
  }>
  topPages: Array<{
    path: string
    views: number
    aiViews: number
  }>
  timeSeries?: {
    labels: string[]
    totalData: number[]
    aiData: number[]
  }
}

export interface CreateSiteRequest {
  domain: string
  name: string
}

export interface TrackingEvent {
  event: string
  properties: {
    token: string
    [key: string]: any
  }
  distinct_id: string
  session_id: string
}