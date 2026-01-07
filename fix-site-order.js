#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixSiteOrder() {
  console.log('🔧 Fixing site order issue...\n');

  // Delete the test site that has no events
  const testSiteId = 'site_test_1767812526070';

  console.log(`🗑️ Deleting test site: ${testSiteId}`);

  const { error } = await supabase
    .from('sites')
    .delete()
    .eq('id', testSiteId);

  if (error) {
    console.error('❌ Error deleting test site:', error);
  } else {
    console.log('✅ Successfully deleted test site');
  }

  // Check remaining sites
  console.log('\n📊 Remaining sites:');
  const { data: sites } = await supabase
    .from('sites')
    .select('*')
    .eq('owner_id', 'user_37wIoTZgnSGOp2yMpSUzbRQn2wG')
    .order('created_at', { ascending: true });

  sites?.forEach((site, i) => {
    console.log(`  ${i+1}. ${site.id} | ${site.domain} | Created: ${site.created_at}`);
  });

  if (sites && sites.length > 0) {
    console.log(`\n🎯 Dashboard will now use: ${sites[0].id}`);
  }
}

fixSiteOrder().catch(console.error);