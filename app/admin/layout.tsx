import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import AdminLayoutWrapper from '@/components/admin/admin-layout-wrapper';

export const metadata: Metadata = {
  title: 'Admin | RSFUDTH Hospital',
  description: 'Admin portal for RSFUDTH Hospital management',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
