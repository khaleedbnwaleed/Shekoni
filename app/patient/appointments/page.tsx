import { AppointmentsList } from '@/components/patient/appointments-list';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Appointments | Patient Portal',
  description: 'View and manage your scheduled appointments',
};

export default function AppointmentsPage() {
  return <AppointmentsList />;
}
