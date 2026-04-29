import { DoctorDashboardView } from '@/components/doctor/dashboard-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Doctor Portal',
  description: 'Doctor dashboard with appointment and queue management',
};

export default function DoctorDashboardPage() {
  return <DoctorDashboardView />;
}
