#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log('🔍 Checking database for tracking events...\n');

  // Check for our specific site
  const siteId = 'site_xnurtj0yv4f_mk4i6uvk';

  console.log(`Checking events for site: ${siteId}`);

  const { data: events, error: eventsError } = await supabase
    .from('events')
    .select('*')
    .eq('site_id', siteId)
    .order('timestamp', { ascending: false })
    .limit(10);

  if (eventsError) {
    console.error('❌ Error fetching events:', eventsError);
  } else {
    console.log(`📊 Found ${events?.length || 0} events for this site:`);
    events?.forEach(event => {
      console.log(`  - ${event.event_name} | ${event.ai_source || 'No AI'} | ${event.timestamp}`);
    });
  }

  // Check all events in last hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const { data: recentEvents, error: recentError } = await supabase
    .from('events')
    .select('site_id, event_name, ai_source, timestamp')
    .gte('timestamp', oneHourAgo.toISOString())
    .order('timestamp', { ascending: false });

  if (recentError) {
    console.error('❌ Error fetching recent events:', recentError);
  } else {
    console.log(`\n⏰ Found ${recentEvents?.length || 0} total events in last hour:`);
    recentEvents?.forEach(event => {
      console.log(`  - Site: ${event.site_id} | ${event.event_name} | AI: ${event.ai_source || 'None'} | ${event.timestamp}`);
    });
  }

  // Check sites table
  const { data: sites, error: sitesError } = await supabase
    .from('sites')
    .select('*');

  if (sitesError) {
    console.error('❌ Error fetching sites:', sitesError);
  } else {
    console.log(`\n🌐 Found ${sites?.length || 0} sites in database:`);
    sites?.forEach(site => {
      console.log(`  - ID: ${site.id} | Domain: ${site.domain} | Owner: ${site.owner_id}`);
    });
  }
}

checkDatabase().catch(console.error);