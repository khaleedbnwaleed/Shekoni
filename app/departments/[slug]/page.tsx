'use client';

import { useState, useMemo } from 'react';
import { getDepartmentBySlug, getAllDepartmentSlugs } from '@/lib/departments-data';
import Link from 'next/link';
import { ArrowLeft, Calendar, Users, Bed, Clock } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/main-layout';

export default function DepartmentPage() {
  const params = useParams();
  const slug = params.slug as string;
  const department = getDepartmentBySlug(slug);
  const [lang, setLang] = useState<'en' | 'ha'>('en');

  if (!department) {
    return (
      <MainLayout>
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Department not found</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">The department you're looking for doesn't exist.</p>
            <Link href="/departments" className="mt-4 inline-block text-emerald-600 hover:text-emerald-700">
              Go back to departments
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const Icon = department.icon;
  const description = lang === 'en' ? department.description : department.description_ha;
  const services = lang === 'en' ? department.services : department.services_ha;

  return (
    <MainLayout>
      <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        {/* Back Button */}
        <div className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <Link href="/departments" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400">
            <ArrowLeft className="h-4 w-4" /> 
            {lang === 'en' ? 'Back to Departments' : 'Koma Satauninsu'}
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className={`bg-gradient-to-r ${department.color} py-16 text-white`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <div className="rounded-full bg-white/20 p-6">
              <Icon className="h-12 w-12" />
            </div>
            <div>
              <h1 className="text-4xl font-bold sm:text-5xl">{department.name}</h1>
              <p className="mt-2 text-lg text-white/90">{description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Department Info Cards */}
      <section className="bg-gradient-to-r from-slate-50 to-slate-100 py-12 dark:from-slate-900 dark:to-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-emerald-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-emerald-600" />
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{lang === 'en' ? 'Specialist Doctors' : 'Likitoci Musamman'}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{department.doctors}</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border border-emerald-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <Bed className="h-8 w-8 text-emerald-600" />
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{lang === 'en' ? 'Available Beds' : 'Gadaje Da Ake Samarwa'}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{department.beds}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-emerald-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-emerald-600" />
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{lang === 'en' ? 'Availability' : 'Samarwa'}</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{department.availability}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-emerald-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-emerald-600" />
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{lang === 'en' ? 'Book Appointment' : 'Taɗa Rabowa'}</p>
                  <p className="text-lg font-bold text-emerald-600">Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          {lang === 'en' ? 'Our Services' : 'Sabisunsu'}
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          {lang === 'en' 
            ? 'Comprehensive healthcare services offered by our department' 
            : 'Sabis na cikakke na lafiya da sataunin ake ba da shi'}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
                <span className="text-emerald-600 dark:text-emerald-400">✓</span>
              </div>
              <span className="font-medium text-slate-900 dark:text-white">{service}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-600 py-16 dark:bg-emerald-900">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-white">
            {lang === 'en' ? 'Ready to Schedule a Consultation?' : 'Shirye Ganawa?'}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-emerald-100">
            {lang === 'en'
              ? 'Contact our department or book an appointment online.'
              : 'Tuntubo sataunin ko yi taɗa rabowa.'}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/patient/appointments/book"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 font-semibold text-emerald-600 hover:bg-slate-50"
            >
              <Calendar className="mr-2 h-5 w-5" />
              {lang === 'en' ? 'Book Appointment' : 'Taɗa Rabowa'}
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white bg-transparent px-8 py-3 font-semibold text-white hover:bg-white/10"
            >
              {lang === 'en' ? 'Contact Department' : 'Tuntubo Sataunin'}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-900 px-4 py-12 text-slate-300 dark:border-slate-800 sm:px-6">
        <div className="mx-auto max-w-7xl text-center">
          <p>© 2026 RSFUDTH - {department.name}</p>
        </div>
      </footer>
      </div>
    </MainLayout>
  );
}