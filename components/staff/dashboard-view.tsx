'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BadgeCheck, CreditCard, FileText, LogOut, Settings2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export function StaffDashboardView() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Hospital Staff Portal</p>
            <h1 className="text-3xl font-semibold text-slate-900">Staff Dashboard</h1>
            <p className="mt-2 text-sm text-slate-600">Welcome back, {user?.firstName} {user?.lastName}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-3xl bg-slate-100 px-4 py-2 text-sm text-slate-700">
              Role: <span className="font-semibold">Staff</span>
            </div>
            <Button variant="outline" className="rounded-full" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">ID Card Status</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">Pending</p>
                  <p className="text-xs text-slate-500 mt-1">Application under review</p>
                </div>
                <BadgeCheck className="h-10 w-10 text-blue-600 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">Payment Slips</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">3</p>
                  <p className="text-xs text-slate-500 mt-1">Ready to print</p>
                </div>
                <CreditCard className="h-10 w-10 text-emerald-600 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">Profile Completion</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">92%</p>
                  <p className="text-xs text-slate-500 mt-1">Update your contact details</p>
                </div>
                <BadgeCheck className="h-10 w-10 text-violet-600 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">Support</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">24/7</p>
                  <p className="text-xs text-slate-500 mt-1">Staff service desk</p>
                </div>
                <ShieldCheck className="h-10 w-10 text-cyan-600 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Complete common staff tasks in one place.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Link href="/staff/id-card" className="block">
                <Button className="w-full justify-start gap-3 bg-blue-600 text-white hover:bg-blue-700">
                  <BadgeCheck className="h-4 w-4" /> Apply for Hospital ID Card
                </Button>
              </Link>

              <Link href="/staff/payment-slip" className="block">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <FileText className="h-4 w-4" /> Print Payment Slip
                </Button>
              </Link>

              <Link href="/staff/profile" className="block">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <Settings2 className="h-4 w-4" /> Update Profile
                </Button>
              </Link>

              <Button variant="ghost" className="w-full justify-start gap-3 text-red-600 hover:bg-red-50" onClick={handleLogout}>
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Latest Activity</CardTitle>
              <CardDescription>Recent staff actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-900">ID Card Application</p>
                <p className="text-sm text-slate-600 mt-1">Submitted 3 days ago. Awaiting approval.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-900">Payment Slip Generated</p>
                <p className="text-sm text-slate-600 mt-1">Your last slip was issued 1 day ago.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-900">Profile Updated</p>
                <p className="text-sm text-slate-600 mt-1">Contact details were updated recently.</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
