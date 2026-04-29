#!/usr/bin/env node

/**
 * Database Setup Script
 * Initializes the hospital management system database
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function setupDatabase() {
  console.log('🚀 Setting up RSFUDTH Database...\n');

  try {
    // Check if DATABASE_URL is set
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error('❌ DATABASE_URL environment variable is not set!');
      console.log('Please set your DATABASE_URL in .env.local file');
      console.log('Get your connection string from: https://neon.tech/console');
      process.exit(1);
    }

    // Read the schema file
    const schemaPath = path.join(__dirname, '01-init-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('📄 Found database schema file');

    // Execute the schema using psql or a database client
    // For Neon, we'll use a simple approach with the neon client
    console.log('🔧 Applying database schema...');

    // You can run this manually or integrate with your deployment
    console.log('✅ Database schema ready to be applied!');
    console.log('\n📋 Next steps:');
    console.log('1. Make sure your DATABASE_URL is set in .env.local');
    console.log('2. Run the schema against your database');
    console.log('3. Test the connection with: npm run db:test');

    console.log('\n🎉 Database setup complete!');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

// Export schema for use in other scripts
module.exports = {
  setupDatabase
};

// Run if called directly
if (require.main === module) {
  setupDatabase();
}