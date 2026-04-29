import { StaffDashboardView } from '@/components/staff/dashboard-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Staff Portal',
  description: 'Staff dashboard with ID card, payment slip and profile actions',
};

export default function StaffDashboardPage() {
  return <StaffDashboardView />;
}
