#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAnalyticsQuery() {
  const siteId = 'site_xnurtj0yv4f_mk4i6uvk';
  const timeRange = '7d';

  console.log(`🔍 Testing analytics query for site: ${siteId}`);
  console.log(`📅 Time range: ${timeRange}\n`);

  const now = new Date();
  const daysAgo = timeRange === '24h' ? 1 :
                  timeRange === '7d' ? 7 :
                  timeRange === '30d' ? 30 : 90;
  const startDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));

  console.log(`📊 Query parameters:`);
  console.log(`  - Site ID: ${siteId}`);
  console.log(`  - Start date: ${startDate.toISOString()}`);
  console.log(`  - Current time: ${now.toISOString()}\n`);

  // Test exact query from getAnalyticsData
  console.log('🔎 Running total events query...');
  const { data: totalEvents, error: totalError } = await supabase
    .from('events')
    .select('*')
    .eq('site_id', siteId)
    .gte('timestamp', startDate.toISOString());

  if (totalError) {
    console.error('❌ Error fetching total events:', totalError);
  } else {
    console.log(`✅ Total events found: ${totalEvents?.length || 0}`);
    totalEvents?.forEach((event, i) => {
      console.log(`  ${i+1}. ${event.event_name} | ${event.ai_source || 'No AI'} | ${event.timestamp} | URL: ${event.url}`);
    });
  }

  console.log('\n🔎 Running AI events query...');
  const { data: aiEvents, error: aiError } = await supabase
    .from('events')
    .select('*')
    .eq('site_id', siteId)
    .not('ai_source', 'is', null)
    .gte('timestamp', startDate.toISOString());

  if (aiError) {
    console.error('❌ Error fetching AI events:', aiError);
  } else {
    console.log(`✅ AI events found: ${aiEvents?.length || 0}`);
    aiEvents?.forEach((event, i) => {
      console.log(`  ${i+1}. ${event.event_name} | AI: ${event.ai_source} | ${event.timestamp} | URL: ${event.url}`);
    });
  }

  // Calculate the same way as the actual function
  const totalViews = totalEvents?.length || 0;
  const aiViews = aiEvents?.length || 0;

  console.log('\n📈 Final analytics result:');
  console.log(`  - Total Views: ${totalViews}`);
  console.log(`  - AI Views: ${aiViews}`);
  console.log(`  - AI Percentage: ${Math.round((aiViews / totalViews) * 100) || 0}%`);

  // Check AI sources
  const aiSourceCounts = {};
  aiEvents?.forEach(event => {
    if (event.ai_source) {
      aiSourceCounts[event.ai_source] = (aiSourceCounts[event.ai_source] || 0) + 1;
    }
  });

  const topAiSources = Object.entries(aiSourceCounts)
    .map(([name, views]) => ({ name, views, change: '+0%' }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  console.log('\n🤖 AI Sources:');
  topAiSources.forEach(source => {
    console.log(`  - ${source.name}: ${source.views} views`);
  });

  // Check pages
  const pageCounts = {};
  totalEvents?.forEach(event => {
    const path = event.url || '/';
    if (!pageCounts[path]) {
      pageCounts[path] = { total: 0, ai: 0 };
    }
    pageCounts[path].total++;
  });

  aiEvents?.forEach(event => {
    const path = event.url || '/';
    if (pageCounts[path]) {
      pageCounts[path].ai++;
    }
  });

  const topPages = Object.entries(pageCounts)
    .map(([path, counts]) => ({ path, views: counts.total, aiViews: counts.ai }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  console.log('\n📄 Top Pages:');
  topPages.forEach(page => {
    console.log(`  - ${page.path}: ${page.views} total, ${page.aiViews} AI`);
  });
}

testAnalyticsQuery().catch(console.error);