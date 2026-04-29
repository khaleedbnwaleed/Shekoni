#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Tests the connection to the hospital management system database
 */

const { getRows } = require('../lib/db');

async function testDatabaseConnection() {
  console.log('🧪 Testing database connection...\n');

  try {
    // Test basic connection
    console.log('🔌 Testing connection...');
    const result = await getRows('SELECT version()');
    console.log('✅ Database connected successfully!');
    console.log(`📊 PostgreSQL Version: ${result[0].version.split(' ')[1]}\n`);

    // Test if tables exist
    console.log('📋 Checking database tables...');
    const tables = await getRows(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    if (tables.length === 0) {
      console.log('⚠️  No tables found. Run the schema setup first:');
      console.log('   npm run db:setup');
    } else {
      console.log('📊 Found tables:');
      tables.forEach(table => {
        console.log(`   - ${table.table_name}`);
      });
    }

    console.log('\n🎉 Database test completed successfully!');

  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('Error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your DATABASE_URL in .env.local');
    console.log('2. Make sure your Neon database is active');
    console.log('3. Verify your connection string format');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  testDatabaseConnection();
}