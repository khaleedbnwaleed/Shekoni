# Healthcare Management Platform

A comprehensive, full-stack healthcare management system built with Next.js 16, TypeScript, and PostgreSQL. This platform enables patients to book appointments, manage medical records, and interact with doctors through telemedicine, while providing doctors and administrators with powerful tools for managing their practice.

## Features

### Patient Portal
- **User Authentication**: Secure signup and login with JWT tokens
- **Profile Management**: View and update personal medical information
- **Appointment Booking**: Search doctors, view availability, and book appointments
- **Queue Management**: Real-time queue tracking and wait time estimation
- **Medical Records**: Upload and access medical documents and test results
- **Prescription Management**: View and download prescriptions from doctors
- **Notifications**: Real-time alerts for appointments, prescriptions, and system updates

### Doctor Dashboard
- **Schedule Management**: View appointments and manage availability
- **Patient Consultation**: View patient records and appointment details
- **Prescription Issuance**: Issue and manage prescriptions
- **Queue Monitoring**: Track patient queue and manage appointments
- **Telemedicine**: Conduct video consultations with patients
- **Performance Analytics**: View consultation statistics and ratings

### Admin Dashboard
- **System Analytics**: Monitor key metrics and system health
- **User Management**: Manage doctors, patients, and staff
- **Department Management**: Organize and manage medical departments
- **Audit Logs**: Track system activities and user actions
- **System Configuration**: Configure system settings and parameters

### Telemedicine
- **Video Consultations**: Secure video calls between doctors and patients
- **Call Scheduling**: Manage telemedicine appointment timings
- **Recording & Storage**: Optional recording of consultations
- **Integration**: Seamless integration with appointment system

## Technology Stack

### Frontend
- **Next.js 16**: Modern React framework with App Router
- **React 19**: Latest React features and hooks
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components
- **SWR**: Data fetching and caching library

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **PostgreSQL**: Relational database
- **JWT**: Token-based authentication
- **bcrypt**: Password hashing

### Infrastructure
- **Vercel**: Production deployment platform
- **Docker**: Containerization (optional)
- **GitHub**: Version control and CI/CD

## Project Structure

```
healthcare-platform/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── auth/                # Authentication endpoints
│   │   ├── patients/            # Patient endpoints
│   │   ├── doctors/             # Doctor endpoints
│   │   ├── appointments/        # Appointment management
│   │   ├── prescriptions/       # Prescription endpoints
│   │   ├── notifications/       # Notification system
│   │   ├── admin/               # Admin endpoints
│   │   └── queue/               # Queue management
│   ├── patient/                 # Patient routes
│   ├── doctor/                  # Doctor routes
│   ├── admin/                   # Admin routes
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
├── components/                   # Reusable React components
│   ├── ui/                      # shadcn/ui components
│   ├── patient/                 # Patient components
│   ├── doctor/                  # Doctor components
│   ├── admin/                   # Admin components
│   └── notifications/           # Notification components
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts              # Authentication hook
│   ├── use-mobile.tsx          # Mobile detection
│   └── use-toast.ts            # Toast notifications
├── lib/                          # Utility functions
│   ├── auth.ts                 # JWT utilities
│   ├── db.ts                   # Database client
│   ├── api-client.ts           # API client utilities
│   ├── notification-service.ts # Notification service
│   └── utils.ts                # General utilities
├── scripts/                      # Build and database scripts
│   ├── migrations/             # Database migrations
│   └── seeds/                  # Database seeders
├── docs/                         # Documentation
│   ├── API_REFERENCE.md        # API documentation
│   └── DEPLOYMENT.md           # Deployment guide
├── public/                       # Static assets
├── next.config.mjs             # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS config
├── tsconfig.json               # TypeScript config
└── package.json                # Dependencies

```

## Getting Started

### Prerequisites
- Node.js 18.17 or later
- pnpm (recommended) or npm/yarn
- PostgreSQL 12 or later

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/healthcare-platform.git
   cd healthcare-platform
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your values:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/healthcare_db
   JWT_SECRET=your-super-secret-key
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. **Create and migrate database**
   ```bash
   createdb healthcare_db
   pnpm run db:migrate
   ```

5. **Seed sample data (optional)**
   ```bash
   pnpm run db:seed
   ```

6. **Start development server**
   ```bash
   pnpm run dev
   ```

7. **Open application**
   Navigate to `http://localhost:3000`

## Default Credentials

For testing with seeded data:

**Patient:**
- Email: `patient@example.com`
- Password: `password123`

**Doctor:**
- Email: `doctor@example.com`
- Password: `password123`

**Admin:**
- Email: `admin@example.com`
- Password: `password123`

## Available Scripts

```bash
# Development
pnpm run dev          # Start development server
pnpm run build        # Build for production
pnpm run start        # Start production server
pnpm run lint         # Run ESLint

# Database
pnpm run db:migrate   # Run database migrations
pnpm run db:seed      # Seed sample data
pnpm run db:reset     # Reset database (warning: destructive)

# Docker
pnpm run docker:build # Build Docker image
pnpm run docker:run   # Run Docker container
```

## API Documentation

Complete API documentation is available in [docs/API_REFERENCE.md](./docs/API_REFERENCE.md)

Key endpoints:
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/appointments` - Get user appointments
- `POST /api/appointments` - Book new appointment
- `GET /api/doctors` - Get list of doctors
- `GET /api/notifications` - Get user notifications
- `GET /api/admin/dashboard` - Get admin dashboard stats

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Visit https://vercel.com/new
3. Select your repository
4. Add environment variables
5. Deploy

For detailed instructions, see [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)

### Deploy with Docker

```bash
docker build -t healthcare-platform .
docker run -p 3000:3000 -e DATABASE_URL="..." healthcare-platform
```

## Security Features

- **Password Hashing**: bcrypt for secure password storage
- **JWT Authentication**: Stateless token-based auth
- **Database Security**: Parameterized queries prevent SQL injection
- **CORS**: Configured for trusted domains
- **HTTPS**: Required in production
- **Rate Limiting**: Protect against brute force attacks
- **Input Validation**: Server-side validation of all inputs

## Performance Features

- **Server-Side Rendering**: Optimized page loads
- **API Caching**: SWR for intelligent data fetching
- **Database Optimization**: Indexed queries and connection pooling
- **Image Optimization**: Next.js image component
- **Code Splitting**: Automatic route-based splitting
- **Compression**: Gzip compression enabled

## Database Schema

### Key Tables
- **users**: User accounts and authentication
- **patients**: Patient profiles and medical info
- **doctors**: Doctor profiles and specializations
- **appointments**: Appointment bookings and management
- **medical_records**: Patient documents and test results
- **prescriptions**: Medication prescriptions
- **notifications**: User notifications
- **queue_management**: Real-time queue tracking
- **departments**: Medical departments
- **audit_logs**: System activity logging

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues and support:
- Open an issue on GitHub
- Check existing documentation
- Review API reference guide

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Hosted on [Vercel](https://vercel.com/)

## Roadmap

- [ ] Mobile app (React Native)
- [ ] SMS notifications
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Payment integration
- [ ] Pharmacy integration
- [ ] Lab test integration
- [ ] Insurance support
- [ ] Multi-language support
- [ ] Accessibility improvements

## Contact

For more information, visit our [website](https://example.com) or email us at support@example.com
