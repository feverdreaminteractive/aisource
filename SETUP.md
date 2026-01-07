# AISource Setup Guide

## 🗄️ Database Setup (Supabase)

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization & name: "aisource"
4. Choose region (closest to your users)
5. Generate strong password

### 2. Run Database Schema
1. Go to SQL Editor in Supabase dashboard
2. Copy & paste this SQL:

```sql
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
CREATE INDEX idx_events_event_type ON events(event_name);

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
```

3. Click "Run" to execute

### 3. Get Database Credentials
1. Go to Settings → API
2. Copy these values:
   - **Project URL**: `https://xxx.supabase.co`
   - **Anon/Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 🔐 Authentication Setup (Clerk)

### 1. Create Clerk Application
1. Go to [clerk.com](https://clerk.com)
2. Click "Add Application"
3. Name: "AISource"
4. Choose sign-in options: Email + Google/GitHub (recommended)

### 2. Configure Domains
1. Go to Domains in Clerk dashboard
2. Add your Vercel domain when deployed
3. Add `localhost:3000` for development

### 3. Get API Keys
1. Go to API Keys in Clerk dashboard
2. Copy these values:
   - **Publishable Key**: `pk_test_xxx`
   - **Secret Key**: `sk_test_xxx`

---

## 🚀 Vercel Environment Variables

Add these in Vercel Dashboard → Your Project → Settings → Environment Variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
```

---

## ✅ Test Your Setup

### 1. Check Database Connection
Visit: `https://your-app.vercel.app/api/analytics?siteId=test`
Should return: `{"error":"Unauthorized"}` (good - auth is working)

### 2. Test Tracking Script
Add to any website:
```html
<script src="https://your-app.vercel.app/track.js" data-site="demo-site-123"></script>
```

### 3. View Dashboard
Go to: `https://your-app.vercel.app/dashboard`

---

## 🎯 Quick Start Your First Site

1. Sign up at your deployed app
2. Create a new site in dashboard
3. Copy the tracking script
4. Add script to your website
5. Visit your website to generate test data
6. Check dashboard for real-time analytics!

## 🆘 Need Help?

- Check Vercel Function logs for API errors
- Supabase logs show database issues
- Clerk logs show auth problems