'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, Pencil } from 'lucide-react';
import Link from 'next/link';

export default function StaffProfilePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between gap-4 bg-white px-6 py-5 rounded-3xl shadow-sm border border-slate-200">
          <div>
            <p className="text-slate-500 text-sm">Hospital Staff Portal</p>
            <h1 className="text-2xl font-semibold text-slate-900">Update Profile</h1>
            <p className="mt-2 text-sm text-slate-600">Keep your staff profile up to date.</p>
          </div>
          <Link href="/staff/dashboard">
            <Button variant="outline" className="rounded-full">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <p className="text-xs uppercase text-slate-500">Name</p>
                <p className="mt-2 text-base font-medium text-slate-900">{user?.firstName} {user?.lastName}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <p className="text-xs uppercase text-slate-500">Email</p>
                <p className="mt-2 text-base font-medium text-slate-900">{user?.email}</p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-slate-700">
              <p className="text-sm font-medium text-slate-900">Need a profile update?</p>
              <p className="mt-2 text-sm text-slate-600">Please contact HR or use the internal staff system to make changes to your employment details.</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Pencil className="mr-2 h-4 w-4" /> Request Update
              </Button>
              <Link href="/staff/dashboard" className="w-full">
                <Button variant="outline" className="w-full">Return to Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
