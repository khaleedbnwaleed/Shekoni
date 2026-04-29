'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiGet } from '@/lib/api-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Search,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  AlertCircle,
  BarChart3,
  Settings,
  Shield,
  FileText,
  Bell,
  Activity,
} from 'lucide-react';
import Link from 'next/link';

interface AdminStats {
  users: {
    total: number;
    patients: number;
    doctors: number;
    staff: number;
    admins: number;
  };
  appointments: {
    total: number;
    completed: number;
    scheduled: number;
    cancelled: number;
    telemedicine: number;
    today: number;
  };
  performance: {
    averageWaitTime: number;
    completionRate: number;
  };
  departments: Array<{
    id: string;
    name: string;
    doctorCount: number;
    availableDoctors: number;
  }>;
}

export function AdminDashboardView() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiGet('/api/admin/dashboard');
        if (response.success && response.data) {
          setStats(response.data.statistics);
        } else {
          setError(response.error || 'Failed to load statistics');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadStats();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    );
  }

  const userName = user?.email?.split('@')[0] ?? 'Admin';

  return (
    <>
      <section className="mb-8 overflow-hidden rounded-4xl bg-linear-to-r from-emerald-600 via-slate-900 to-slate-700 p-6 text-white shadow-2xl shadow-slate-900/10 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-center">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-emerald-200">Admin Dashboard</p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <h1 className="text-4xl font-semibold tracking-tight text-white">Good morning, {userName}</h1>
                <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100 shadow-inner shadow-slate-950/10">
                  Hospital Control Center
                </span>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-emerald-100/90">
                Monitor hospital operations, appointments, patient flow and staff performance from one central dashboard.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/10 p-5 shadow-inner shadow-slate-950/10">
                <p className="text-sm uppercase tracking-[0.2em] text-emerald-200">Appointments Today</p>
                <p className="mt-4 text-3xl font-semibold text-white">{stats?.appointments.today ?? '—'}</p>
                <p className="mt-2 text-sm text-emerald-100/80">Scheduled appointments happening today.</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5 shadow-inner shadow-slate-950/10">
                <p className="text-sm uppercase tracking-[0.2em] text-emerald-200">Telemedicine</p>
                <p className="mt-4 text-3xl font-semibold text-white">{stats?.appointments.telemedicine ?? '—'}</p>
                <p className="mt-2 text-sm text-emerald-100/80">Virtual consultations in progress.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-inner shadow-slate-950/10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-emerald-100/85">Search</p>
                  <div className="relative mt-4">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-200" />
                    <Input
                      className="h-12 rounded-full border border-white/20 bg-white/10 pl-12 pr-4 text-white placeholder:text-emerald-100/65 focus:border-emerald-300 focus:bg-white/20"
                      placeholder="Search patients, users, or reports"
                    />
                  </div>
                </div>
                <Button variant="secondary" size="sm" className="h-12 w-full whitespace-nowrap rounded-full px-5 sm:w-auto">
                  <Bell className="h-4 w-4" />
                  View Alerts
                </Button>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="rounded-3xl bg-white/10 p-5 shadow-inner shadow-slate-950/10">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-emerald-200">Response time</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{stats?.performance.averageWaitTime ?? '—'}m</p>
                  </div>
                  <Clock className="h-8 w-8 text-emerald-200" />
                </div>
              </div>
              <div className="rounded-3xl bg-white/10 p-5 shadow-inner shadow-slate-950/10">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-emerald-200">Completion</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{stats?.performance.completionRate ?? '—'}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-emerald-200" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="flex items-center gap-3 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error}
          </div>
        )}

        {loading && (
          <div className="space-y-6">
            <div className="h-14 rounded-3xl bg-slate-200/80 animate-pulse" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4">
                <div className="h-40 rounded-3xl bg-slate-200/80 animate-pulse" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="h-28 rounded-3xl bg-slate-200/80 animate-pulse" />
                  <div className="h-28 rounded-3xl bg-slate-200/80 animate-pulse" />
                </div>
              </div>
              <div className="h-112 rounded-3xl bg-slate-200/80 animate-pulse" />
            </div>
          </div>
        )}

        {stats && (
          <div className="space-y-8">
            <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <Card className="overflow-hidden">
                <div className="bg-slate-950/5 px-6 py-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <CardTitle className="text-2xl">Admin Overview</CardTitle>
                      <CardDescription>Fast access to your hospital operations.</CardDescription>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                      Active
                    </span>
                  </div>
                </div>
                <CardContent className="grid gap-6 py-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-700">
                        <Users className="h-8 w-8" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Signed in as</p>
                        <p className="text-lg font-semibold text-slate-900">{user?.email}</p>
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Users</p>
                        <p className="mt-3 text-2xl font-semibold text-slate-900">{stats.users.total}</p>
                      </div>
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Patients</p>
                        <p className="mt-3 text-2xl font-semibold text-slate-900">{stats.users.patients}</p>
                      </div>
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Doctors</p>
                        <p className="mt-3 text-2xl font-semibold text-slate-900">{stats.users.doctors}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Scheduled</p>
                      <p className="mt-3 text-2xl font-semibold text-slate-900">{stats.appointments.scheduled}</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Completed</p>
                      <p className="mt-3 text-2xl font-semibold text-slate-900">{stats.appointments.completed}</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Cancelled</p>
                      <p className="mt-3 text-2xl font-semibold text-slate-900">{stats.appointments.cancelled}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle>Performance Snapshot</CardTitle>
                      <CardDescription>Key metrics across the hospital.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Avg wait</p>
                          <p className="mt-3 text-2xl font-semibold text-slate-900">{stats.performance.averageWaitTime}m</p>
                        </div>
                        <Clock className="h-6 w-6 text-emerald-600" />
                      </div>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Completion</p>
                          <p className="mt-3 text-2xl font-semibold text-slate-900">{stats.performance.completionRate}%</p>
                        </div>
                        <TrendingUp className="h-6 w-6 text-cyan-600" />
                      </div>
                    </div>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>Completion Rate</span>
                      <span>{stats.performance.completionRate}%</span>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-emerald-600" style={{ width: `${stats.performance.completionRate}%` }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
              <Card className="overflow-hidden">
                <CardHeader className="items-center">
                  <div>
                    <CardTitle>Departments Overview</CardTitle>
                    <CardDescription>Department size and live doctor coverage.</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats.departments.map((department) => (
                    <div key={department.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{department.name}</p>
                          <p className="text-sm text-slate-500">
                            {department.doctorCount} doctors · {department.availableDoctors} available
                          </p>
                        </div>
                        <div className="rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-700">
                          Live
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>One-click access to admin workflows.</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-3">
                  {[
                    { href: '/admin/users', label: 'Manage users', icon: Users },
                    { href: '/admin/appointments', label: 'Review appointments', icon: Calendar },
                    { href: '/admin/reports', label: 'Run reports', icon: BarChart3 },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link key={item.href} href={item.href} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-900 transition hover:border-slate-300 hover:bg-white">
                        <span>{item.label}</span>
                        <Icon className="h-5 w-5 text-emerald-600" />
                      </Link>
                    );
                  })}
                </CardContent>
              </Card>
            </section>

            <section>
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Core Administration</h2>
                  <p className="text-sm text-slate-500">Manage hospital users, appointments, departments and system settings.</p>
                </div>
                <Link href="/admin/reports" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                  View all admin pages
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { href: '/admin/users', label: 'Users', icon: Users, description: 'Manage accounts' },
                  { href: '/admin/departments', label: 'Departments', icon: TrendingUp, description: 'Manage teams' },
                  { href: '/admin/appointments', label: 'Appointments', icon: Calendar, description: 'Track schedules' },
                  { href: '/admin/patients', label: 'Patients', icon: FileText, description: 'Patient records' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href} className="rounded-3xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                          <p className="text-sm text-slate-500">{item.description}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          </div>
        )}
    </>
  );
}
