-- Create the events table for tracking AI referral data
CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,
  site_id VARCHAR(255) NOT NULL,
  session_id VARCHAR(255) NOT NULL,
  distinct_id VARCHAR(255) NOT NULL,
  event_name VARCHAR(255) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  properties JSONB NOT NULL DEFAULT '{}',

  -- Extracted properties for easier querying
  url TEXT,
  title TEXT,
  referrer TEXT,
  ai_source VARCHAR(100), -- ChatGPT, Claude, Perplexity, etc.
  ai_domain VARCHAR(255),
  device_type VARCHAR(50),
  browser VARCHAR(50),
  os VARCHAR(50),
  language VARCHAR(10),
  timezone VARCHAR(100),
  screen_width INTEGER,
  screen_height INTEGER,
  viewport_width INTEGER,
  viewport_height INTEGER,
  time_on_page INTEGER, -- in milliseconds
  time_to_engage INTEGER, -- in milliseconds
  engaged BOOLEAN,
  ip_address INET,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create sites table for managing tracked websites
CREATE TABLE sites (
  id VARCHAR(255) PRIMARY KEY, -- site_id from tracking script
  domain VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  owner_id VARCHAR(255) NOT NULL, -- Clerk user ID
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_events_site_id ON events(site_id);
CREATE INDEX idx_events_timestamp ON events(timestamp);
CREATE INDEX idx_events_ai_source ON events(ai_source) WHERE ai_source IS NOT NULL;
CREATE INDEX idx_events_session_id ON events(session_id);
CREATE INDEX idx_events_event_type ON events(event_type);

-- Composite indexes for common queries
CREATE INDEX idx_events_site_timestamp ON events(site_id, timestamp);
CREATE INDEX idx_events_site_ai_source ON events(site_id, ai_source) WHERE ai_source IS NOT NULL;

-- Index for sites
CREATE INDEX idx_sites_owner_id ON sites(owner_id);

-- Row Level Security policies (for Supabase)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert events (tracking script needs this)
CREATE POLICY "Allow public event inserts" ON events
  FOR INSERT WITH CHECK (true);

-- Users can only see their own sites and events
CREATE POLICY "Users can view own sites" ON sites
  FOR SELECT USING (owner_id = auth.uid()::text);

CREATE POLICY "Users can manage own sites" ON sites
  FOR ALL USING (owner_id = auth.uid()::text);

CREATE POLICY "Users can view events for own sites" ON events
  FOR SELECT USING (
    site_id IN (
      SELECT id FROM sites WHERE owner_id = auth.uid()::text
    )
  );