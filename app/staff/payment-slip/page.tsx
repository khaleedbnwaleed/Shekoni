'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Printer, Receipt } from 'lucide-react';
import Link from 'next/link';

export default function StaffPaymentSlipPage() {
  const { user } = useAuth();

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between gap-4 bg-white px-6 py-5 rounded-3xl shadow-sm border border-slate-200">
          <div>
            <p className="text-slate-500 text-sm">Hospital Staff Portal</p>
            <h1 className="text-2xl font-semibold text-slate-900">Payment Slip</h1>
            <p className="mt-2 text-sm text-slate-600">Review and print your latest salary slip.</p>
          </div>
          <Link href="/staff/dashboard">
            <Button variant="outline" className="rounded-full">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Latest Payment Slip</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-500">Employee</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{user?.firstName} {user?.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Month</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">April 2026</p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-white p-4 shadow-sm">
                  <p className="text-xs uppercase text-slate-500">Net Pay</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">$3,200</p>
                </div>
                <div className="rounded-3xl bg-white p-4 shadow-sm">
                  <p className="text-xs uppercase text-slate-500">Deductions</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">$420</p>
                </div>
                <div className="rounded-3xl bg-white p-4 shadow-sm">
                  <p className="text-xs uppercase text-slate-500">Gross Pay</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">$3,620</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" /> Print Slip
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
