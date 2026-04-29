# Database Setup Guide

This guide will help you set up the database for the RSFUDTH Hospital Management System.

## Prerequisites

- Node.js installed
- A Neon account (free tier available at [neon.tech](https://neon.tech))

## Database Setup Steps

### 1. Create a Neon Database

1. Go to [neon.tech](https://neon.tech) and sign up for a free account
2. Create a new project
3. Copy the connection string from the dashboard

### 2. Configure Environment Variables

1. Copy `.env.local` file (already created)
2. Replace `your_neon_database_connection_string_here` with your actual Neon connection string

```bash
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
```

### 3. Initialize the Database

Run the database setup script:

```bash
npm run db:setup
```

This will prepare your database schema for deployment.

### 4. Apply the Schema

You can apply the database schema in several ways:

#### Option A: Using Neon Dashboard
1. Go to your Neon project dashboard
2. Open the SQL Editor
3. Copy and paste the contents of `scripts/01-init-schema.sql`
4. Execute the script

#### Option B: Using Command Line
```bash
# Install psql if not available
# Then run:
psql "$DATABASE_URL" -f scripts/01-init-schema.sql
```

### 5. Test the Connection

Verify your database connection:

```bash
npm run db:test
```

You should see:
- ✅ Database connected successfully
- 📊 PostgreSQL version information
- 📋 List of created tables

## Database Schema Overview

The database includes the following main tables:

- **users**: Patient and staff accounts
- **departments**: Hospital departments
- **doctors**: Doctor profiles and specializations
- **appointments**: Appointment scheduling
- **notifications**: System notifications
- **telemedicine_sessions**: Video consultation records
- **queue_management**: Patient queue system
- **chat_messages**: Communication logs

## Troubleshooting

### Connection Issues
- Verify your `DATABASE_URL` is correct
- Ensure your Neon database is not paused
- Check that SSL mode is set to `require`

### Schema Issues
- Make sure you're running the script in the correct database
- Check for any syntax errors in the SQL file
- Ensure you have the necessary permissions

### Environment Issues
- Make sure `.env.local` is in the project root
- Restart your development server after changing environment variables
- Don't commit `.env.local` to version control

## Next Steps

Once your database is set up:

1. Start the development server: `npm run dev`
2. Test the API endpoints
3. Begin building your application features

## Support

If you encounter issues:

1. Check the console output for error messages
2. Verify all prerequisites are met
3. Review the Neon documentation
4. Check the project issues on GitHub