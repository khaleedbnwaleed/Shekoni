'use client';

import { departments } from '@/lib/departments-data';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/main-layout';

export default function DepartmentsPage() {
  const [lang, setLang] = useState<'en' | 'ha'>('en');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDepartments = useMemo(() => {
    return departments.filter(dept =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const title = lang === 'en' ? 'Our Departments' : 'Satauninmu';
  const subtitle = lang === 'en' 
    ? 'Comprehensive specialty care across multiple medical disciplines' 
    : 'Kulawa ta musamman a kan gidaje dabam-dabam';
  const searchPlaceholder = lang === 'en' ? 'Search departments...' : 'Nemi sataunin...';

  return (
    <MainLayout>
      <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-emerald-50 to-blue-50 py-12 dark:from-slate-900 dark:to-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">{title}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-300">
              {subtitle}
            </p>
          </div>

          {/* Search Bar */}
          <div className="mx-auto mt-8 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        {filteredDepartments.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {lang === 'en' ? 'No departments found.' : 'Babu sataunin da aka tarai.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDepartments.map((dept) => {
              const Icon = dept.icon;
              return (
                <Link key={dept.id} href={`/departments/${dept.slug}`}>
                  <div className="group h-full cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-emerald-600">
                    <div className={`inline-flex rounded-lg bg-gradient-to-r ${dept.color} p-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      {dept.name}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                      {lang === 'en' ? dept.description : dept.description_ha}
                    </p>
                    <div className="mt-4 flex gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <span>👨‍⚕️ {dept.doctors} {lang === 'en' ? 'Doctors' : 'Likitoci'}</span>
                      <span>🛏️ {dept.beds} {lang === 'en' ? 'Beds' : 'Gadaje'}</span>
                    </div>
                    <div className="mt-4 inline-flex items-center text-sm font-semibold text-emerald-600 group-hover:gap-3">
                      {lang === 'en' ? 'View Details' : 'Duba Cikakke'} →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-900 px-4 py-12 text-slate-300 dark:border-slate-800 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p>© 2026 RSFUDTH. All departments are available with specialized care.</p>
          </div>
        </div>
      </footer>
      </div>
    </MainLayout>
  );
}