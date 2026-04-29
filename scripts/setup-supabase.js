#!/usr/bin/env node

/**
 * Supabase Database Setup Script
 * Initializes the hospital management system with Supabase
 */

const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

async function setupSupabase() {
  console.log('🚀 Setting up RSFUDTH Supabase Database...\n');

  try {
    // Check if environment variables are set
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Supabase environment variables are not set!');
      console.log('\n📋 Required environment variables:');
      console.log('   - NEXT_PUBLIC_SUPABASE_URL');
      console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY');
      console.log('   - SUPABASE_SERVICE_ROLE_KEY (optional but recommended)');
      console.log('\n🔧 Steps to get these values:');
      console.log('1. Go to https://app.supabase.com/');
      console.log('2. Sign in to your Supabase project');
      console.log('3. Navigate to Settings > API');
      console.log('4. Copy the Project URL and Anon Public key');
      console.log('5. Also copy the Service Role key');
      console.log('\n📝 Update your .env.local file with these values');
      process.exit(1);
    }

    console.log('✅ Found Supabase configuration\n');

    // Read the SQL schema
    const schemaPath = path.join(__dirname, '01-init-schema.sql');
    if (!fs.existsSync(schemaPath)) {
      console.error('❌ Schema file not found at:', schemaPath);
      process.exit(1);
    }

    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    console.log('📄 Loaded database schema file');
    console.log('   Location: scripts/01-init-schema.sql\n');

    console.log('📝 To complete the setup:\n');
    console.log('1. Go to your Supabase Project Dashboard:');
    console.log(`   https://app.supabase.com/project/scnxudzcugtvmqhajrjh/sql\n`);
    console.log('2. Create a new SQL query\n');
    console.log('3. Copy and paste the following SQL:\n');
    console.log('=' .repeat(50));
    console.log(schemaSQL);
    console.log('=' .repeat(50));
    console.log('\n4. Click "Run" to execute the schema\n');
    console.log('5. Verify tables were created in the Table Editor\n');
    console.log('6. Run: npm run dev\n');

    console.log('🎉 Supabase setup ready!');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  setupSupabase();
}