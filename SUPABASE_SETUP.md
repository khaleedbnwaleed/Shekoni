# Supabase Setup Guide for RSFUDTH

This guide will help you set up Supabase as the database backend for the RSFUDTH Hospital Management System.

## What is Supabase?

Supabase is an open-source Firebase alternative that provides:
- ✅ PostgreSQL database (same as Neon)
- ✅ Real-time subscriptions
- ✅ Built-in authentication
- ✅ Row Level Security (RLS)
- ✅ Auto-generated REST API
- ✅ File storage
- ✅ Dashboard UI

## Prerequisites

- Supabase account (free tier available at [supabase.com](https://supabase.com))
- Node.js installed
- Your RSFUDTH project ready

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in the project name: `rsfudth-hospital`
4. Create a strong password for the database
5. Select your region (preferably closest to Nigeria)
6. Click "Create new project" and wait for initialization

## Step 2: Get Your Supabase Credentials

Once your project is created:

1. Navigate to **Settings** > **API**
2. You'll find:
   - **Project URL** - Copy this for `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Public** - Copy this for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service Role** - Copy this for `SUPABASE_SERVICE_ROLE_KEY`

## Step 3: Configure Environment Variables

Update your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Step 4: Initialize Database Schema

### Option A: Using SQL Editor (Recommended)

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the sidebar
3. Click **New Query**
4. Copy all contents from `scripts/01-init-schema.sql`
5. Paste into the SQL editor
6. Click **Run**

### Option B: Using Command Line

```bash
# If you have psql installed
psql "your_supabase_connection_string" < scripts/01-init-schema.sql
```

### Option C: Use the Setup Script

```bash
npm run db:setup
```

## Step 5: Verify Installation

Test your Supabase connection:

```bash
npm run db:test
```

You should see:
- ✅ Database connection successful
- ✅ PostgreSQL version information
- ✅ List of created tables

## Step 6: Enable Row Level Security (Optional but Recommended)

Row Level Security adds an extra layer of data protection:

### Enable RLS on Tables

1. Go to **Authentication** > **Policies**
2. For each table (users, appointments, doctors, etc.):
   - Click the table name
   - Click **Enable RLS**
   - Click **New Policy**

### Create Basic Policies

**For users table:**
```sql
-- Users can read their own profile
CREATE POLICY "Users can read own profile"
ON users
FOR SELECT
USING (auth.uid()::text = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON users
FOR UPDATE
USING (auth.uid()::text = id);
```

**For appointments table:**
```sql
-- Patients can read their own appointments
CREATE POLICY "Patients can read own appointments"
ON appointments
FOR SELECT
USING (auth.uid()::text = patient_id);

-- Doctors can read their appointments
CREATE POLICY "Doctors can read own appointments"
ON appointments
FOR SELECT
USING (auth.uid()::text IN (
  SELECT user_id FROM doctors WHERE doctors.id = appointments.doctor_id
));
```

## Step 7: Install Dependencies

Install the Supabase JavaScript client:

```bash
npm install @supabase/supabase-js
```

## Step 8: Start Your Application

```bash
npm run dev
```

Your app now uses Supabase as the backend!

## Usage in Your Code

### Client-Side

```typescript
import { supabase } from '@/lib/supabase';

// Get appointments
const { data, error } = await supabase
  .from('appointments')
  .select('*')
  .eq('patient_id', patientId);
```

### Server-Side

```typescript
import { supabaseServer } from '@/lib/supabase';
import { getDepartments, getDoctor } from '@/lib/supabase-db';

// Use pre-built utilities
const departments = await getDepartments();
const doctor = await getDoctor(doctorId);
```

## Database Schema Overview

The schema includes the following tables:

### 1. **users** - All system users
- Patients, Doctors, Admins, Staff
- Stores personal information
- Password stored as hash (bcryptjs)

### 2. **departments** - Hospital departments
- 16 medical specialties
- Contact information
- Head doctor assignment

### 3. **doctors** - Doctor profiles
- License information
- Specialization
- Consultation fees
- Availability/working hours

### 4. **appointments** - Appointment bookings
- Links patient and doctor
- Date and time information
- Status tracking (pending/confirmed/completed/cancelled)

### 5. **notifications** - System notifications
- Appointment reminders
- Status updates
- User alerts

### 6. **telemedicine_sessions** - Video consultations
- Session information
- Recording links
- Duration tracking

### 7. **queue_management** - Patient queuing
- Waiting list management
- Position tracking
- Estimated wait times

### 8. **admin_audit_logs** - Activity tracking
- Admin actions
- Compliance records
- Security audit trail

## Features Provided by Supabase

### Real-Time Database
Subscribe to changes in real-time:

```typescript
supabase
  .from('appointments')
  .on('INSERT', payload => {
    console.log('New appointment:', payload.new);
  })
  .subscribe();
```

### Built-in Authentication
Use Supabase Auth instead of custom auth:

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});
```

### File Storage
Store patient documents and medical records:

```typescript
// Upload file
const { data, error } = await supabase.storage
  .from('medical-records')
  .upload('patient-123/document.pdf', file);
```

## Troubleshooting

### Connection Issues
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- Ensure Supabase project is not paused

### Authentication Errors
- Enable Email auth in Supabase: **Authentication** > **Providers** > Enable Email
- Check password meets minimum requirements
- Verify user exists in database

### RLS Issues
- Make sure policies are created correctly
- Check user IDs match between tables
- Test policies in SQL Editor first

### Performance Issues
- Add indexes to frequently queried columns (already done in schema)
- Use RLS policies efficiently
- Monitor database usage in Supabase dashboard

## Next Steps

1. ✅ Database schema created
2. ✅ Environment variables configured
3. ✅ Dependencies installed
4. Next: Configure authentication in your API routes
5. Next: Update API endpoints to use Supabase queries
6. Next: Enable RLS policies for security

## Support Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

## Security Best Practices

1. **Never commit .env.local** - Add to .gitignore
2. **Use Service Role Key server-side only** - Never expose to browser
3. **Enable RLS for all tables** - Enforce row-level security
4. **Regularly update dependencies** - Keep packages current
5. **Monitor API usage** - Track rate limits in Supabase dashboard
6. **Backup your data** - Use Supabase backup features
7. **Use strong passwords** - For database and admin accounts