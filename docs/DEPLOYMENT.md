# Deployment Guide

## Prerequisites

- Node.js 18.17 or later
- pnpm (or npm/yarn)
- PostgreSQL database
- Vercel account (for production deployment)

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/healthcare_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRY=24h

# Telemedicine (if using video services)
VIDEO_API_URL=https://api.example.com/video
VIDEO_API_KEY=your-video-api-key

# Email Service (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-email-password

# Application
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=production
```

## Local Development

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Setup Database
```bash
# Run database migration scripts
pnpm run db:migrate
```

### 3. Run Development Server
```bash
pnpm run dev
```

The application will be available at `http://localhost:3000`

## Database Setup

### 1. Create PostgreSQL Database
```bash
createdb healthcare_db
```

### 2. Run Migrations
The migration scripts are located in `/scripts/migrations/`:

```bash
# Run all migrations
pnpm run db:migrate

# Or individually
psql -U postgres -d healthcare_db -f scripts/migrations/001-init-schema.sql
psql -U postgres -d healthcare_db -f scripts/migrations/002-auth-tables.sql
psql -U postgres -d healthcare_db -f scripts/migrations/003-appointments.sql
```

### 3. Seed Sample Data (Optional)
```bash
pnpm run db:seed
```

## Building for Production

### 1. Build the Application
```bash
pnpm run build
```

### 2. Start Production Server
```bash
pnpm run start
```

## Vercel Deployment

### 1. Connect GitHub Repository
- Push your code to GitHub
- Visit https://vercel.com/new
- Select your GitHub repository

### 2. Configure Environment Variables
In the Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add all variables from `.env.local`
3. Make sure sensitive values are set as secrets

### 3. Configure Database
For production, use a managed PostgreSQL service:
- Amazon RDS
- Heroku Postgres
- Neon
- DigitalOcean

Update `DATABASE_URL` environment variable with your production database URL.

### 4. Deploy
```bash
# Automatic deployment on push to main
git push origin main
```

## Docker Deployment

### 1. Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

# Copy source code
COPY . .

# Build application
RUN pnpm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["pnpm", "start"]
```

### 2. Build Docker Image
```bash
docker build -t healthcare-platform:latest .
```

### 3. Run Docker Container
```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:password@db:5432/healthcare_db" \
  -e JWT_SECRET="your-secret-key" \
  healthcare-platform:latest
```

## Database Backup

### PostgreSQL Backup
```bash
# Full database backup
pg_dump healthcare_db > backup.sql

# Restore from backup
psql healthcare_db < backup.sql

# Compressed backup
pg_dump -Fc healthcare_db > backup.dump
pg_restore -d healthcare_db backup.dump
```

## Monitoring

### Application Health Checks
- Health check endpoint: `GET /api/health`
- Returns status of database connection and API services

### Logging
- Application logs are sent to stdout
- In production, integrate with logging services like:
  - ELK Stack (Elasticsearch, Logstash, Kibana)
  - Datadog
  - New Relic
  - Sentry

### Performance Monitoring
```env
# Sentry error tracking (optional)
NEXT_PUBLIC_SENTRY_DSN=https://your-key@sentry.io/project-id
```

## Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Use HTTPS/TLS in production
- [ ] Enable database encryption
- [ ] Configure firewall rules
- [ ] Set up rate limiting
- [ ] Enable CORS only for trusted domains
- [ ] Regular security updates
- [ ] Implement backup strategy
- [ ] Set up monitoring and alerts
- [ ] Use environment variables for all secrets

## Scaling

### Horizontal Scaling
- Use load balancer (e.g., AWS ELB, Vercel Edge Network)
- Deploy multiple application instances
- Use managed database service with read replicas

### Caching Strategy
- Implement Redis for session storage
- Use CDN for static assets
- Cache API responses

### Database Optimization
- Create indexes on frequently queried columns
- Archive old data
- Implement connection pooling
- Monitor query performance

## Troubleshooting

### Database Connection Issues
```bash
# Test database connection
psql $DATABASE_URL

# Check active connections
SELECT * FROM pg_stat_activity;

# Kill idle connections
SELECT pg_terminate_backend(pid) FROM pg_stat_activity 
WHERE state = 'idle' AND query_start < now() - interval '1 hour';
```

### High Memory Usage
- Reduce Next.js cache size
- Implement pagination for large datasets
- Use streaming for large responses

### Slow API Responses
- Check database query performance
- Implement caching
- Add indexes to frequently queried columns
- Monitor external API calls

## Rollback Procedure

```bash
# Rollback last deployment
vercel rollback

# Deploy specific commit
vercel --prod --target=production <commit-hash>
```

## Support

For deployment issues:
1. Check application logs
2. Verify environment variables
3. Test database connectivity
4. Review Vercel deployment status
5. Contact support team
