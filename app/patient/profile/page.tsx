import { PatientProfileForm } from '@/components/patient/profile-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Profile | Patient Portal',
  description: 'Update your personal information',
};

export default function PatientProfilePage() {
  return <PatientProfileForm />;
}
