# Quick Environment Setup

## 🗄️ 1. Set up Supabase (2 minutes)

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Name: `aisource`, Region: `East US`
4. Wait 2 minutes for setup
5. Go to **Settings** → **API**
6. Copy:
   - Project URL: `https://xxx.supabase.co`
   - Anon public key: `eyJhbGci...`

## 🗄️ 2. Create Database Tables

1. Go to **SQL Editor** in Supabase
2. Paste this SQL and click **RUN**:

```sql
-- Create events table
CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,
  site_id VARCHAR(255) NOT NULL,
  session_id VARCHAR(255) NOT NULL,
  distinct_id VARCHAR(255) NOT NULL,
  event_name VARCHAR(255) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  properties JSONB NOT NULL DEFAULT '{}',
  url TEXT,
  title TEXT,
  referrer TEXT,
  ai_source VARCHAR(100),
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
  time_on_page INTEGER,
  time_to_engage INTEGER,
  engaged BOOLEAN,
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create sites table
CREATE TABLE sites (
  id VARCHAR(255) PRIMARY KEY,
  domain VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  owner_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_events_site_id ON events(site_id);
CREATE INDEX idx_events_timestamp ON events(timestamp);
CREATE INDEX idx_events_ai_source ON events(ai_source) WHERE ai_source IS NOT NULL;

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

-- Allow public inserts for tracking
CREATE POLICY "Allow public event inserts" ON events FOR INSERT WITH CHECK (true);
```

## 🔐 3. Set up Clerk (2 minutes)

1. Go to [clerk.com/dashboard](https://clerk.com/dashboard)
2. Click "Add Application"
3. Name: `AISource`
4. Go to **API Keys**
5. Copy:
   - Publishable key: `pk_test_...`
   - Secret key: `sk_test_...`

## ⚙️ 4. Add to Vercel (1 minute)

Go to [Vercel Dashboard](https://vercel.com/ryan-claytons-projects-bea7dd99/aisource/settings/environment-variables)

Add these 4 variables:

```
NEXT_PUBLIC_SUPABASE_URL = [your supabase project URL]
NEXT_PUBLIC_SUPABASE_ANON_KEY = [your supabase anon key]
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = [your clerk publishable key]
CLERK_SECRET_KEY = [your clerk secret key]
```

Then click **Redeploy** in your Vercel dashboard.

## 🎯 5. Test It!

Once redeployed, your tracking script will be:
```html
<script src="https://aisource-xxx.vercel.app/track.js" data-site="demo-123"></script>
```

Add this to any website to start tracking AI traffic!