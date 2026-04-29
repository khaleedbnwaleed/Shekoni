import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Admin | Hospital Management',
  description: 'Hospital administration system',
};

export default function AdminPage() {
  redirect('/admin/dashboard');
}
