#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugUserSites() {
  const userId = 'user_37wIoTZgnSGOp2yMpSUzbRQn2wG';

  console.log(`🔍 Checking sites for user: ${userId}\n`);

  // This is the exact query from getUserSites function
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('owner_id', userId);

  if (error) {
    console.error('❌ Error fetching user sites:', error);
    return;
  }

  console.log(`📊 Found ${data?.length || 0} sites for this user:`);
  data?.forEach((site, i) => {
    console.log(`  ${i+1}. ${site.id} | ${site.domain} | Created: ${site.created_at}`);
  });

  if (data && data.length > 0) {
    const firstSite = data[0];
    console.log(`\n🎯 Dashboard would use first site: ${firstSite.id}`);
    console.log(`📅 Testing analytics for this site with 7d range...\n`);

    // Test analytics for the first site (what dashboard actually queries)
    const timeRange = '7d';
    const now = new Date();
    const daysAgo = 7;
    const startDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));

    const { data: totalEvents, error: totalError } = await supabase
      .from('events')
      .select('*')
      .eq('site_id', firstSite.id)
      .gte('timestamp', startDate.toISOString());

    if (totalError) {
      console.error('❌ Error fetching events for first site:', totalError);
    } else {
      console.log(`📈 Events found for first site (${firstSite.id}): ${totalEvents?.length || 0}`);
      if (totalEvents && totalEvents.length > 0) {
        totalEvents.forEach(event => {
          console.log(`  - ${event.event_name} | AI: ${event.ai_source || 'None'} | ${event.timestamp}`);
        });
      } else {
        console.log(`❌ No events found for first site! This explains why dashboard shows 0.`);

        // Check if events exist for the correct site
        console.log(`\n🔍 Checking events for the tracking site: site_xnurtj0yv4f_mk4i6uvk`);
        const { data: correctSiteEvents } = await supabase
          .from('events')
          .select('*')
          .eq('site_id', 'site_xnurtj0yv4f_mk4i6uvk')
          .gte('timestamp', startDate.toISOString());

        console.log(`📊 Events for tracking site: ${correctSiteEvents?.length || 0}`);
        if (correctSiteEvents && correctSiteEvents.length > 0) {
          console.log(`✅ Events exist for tracking site but dashboard is looking at wrong site!`);
        }
      }
    }
  }
}

debugUserSites().catch(console.error);