import AdminSidebar from '@/components/admin/admin-sidebar';
import { ReactNode } from 'react';

export default function AdminLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
