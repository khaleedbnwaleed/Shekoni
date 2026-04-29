import { PatientDashboardView } from '@/components/patient/dashboard-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Patient Portal',
  description: 'Patient dashboard with appointment and medical records management',
};

export default function PatientDashboardPage() {
  return <PatientDashboardView />;
}
