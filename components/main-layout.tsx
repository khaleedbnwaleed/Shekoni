import type { ReactNode } from 'react';
import MainSidebar from '@/components/main-sidebar';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-950">
      <MainSidebar />
      <main className="flex-1 lg:ml-64">
        {children}
      </main>
    </div>
  );
}