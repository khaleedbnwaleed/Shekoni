import { AdminDashboardView } from '@/components/admin/dashboard-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Hospital Management',
  description: 'Comprehensive hospital administration and management system',
};

export default function AdminDashboardPage() {
  return <AdminDashboardView />;
}
