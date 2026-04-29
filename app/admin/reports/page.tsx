'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Filter } from 'lucide-react';
import Link from 'next/link';

export default function AdminReportsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
            <p className="mt-1 text-sm text-slate-600">View system performance metrics and export reports</p>
          </div>
          <Link href="/admin/dashboard">
            <Button variant="outline" className="rounded-full">
              <ArrowLeft className="mr-2 h-4 w-4" /> Dashboard
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-slate-600">Total Visits (Month)</p>
              <p className="mt-2 text-3xl font-bold text-blue-600">847</p>
              <p className="text-xs text-slate-500 mt-2">↑ 12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-slate-600">New Admissions</p>
              <p className="mt-2 text-3xl font-bold text-emerald-600">156</p>
              <p className="text-xs text-slate-500 mt-2">+8 this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-slate-600">Avg. Recovery Rate</p>
              <p className="mt-2 text-3xl font-bold text-purple-600">94.2%</p>
              <p className="text-xs text-slate-500 mt-2">↑ 2.1% YoY</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Available Reports</CardTitle>
                <CardDescription>Generate and export system reports</CardDescription>
              </div>
              <Button className="gap-2">
                <Filter className="h-4 w-4" /> Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: 'Patient Statistics Report', format: 'PDF/Excel', download: true },
              { name: 'Staff Performance Report', format: 'PDF/Excel', download: true },
              { name: 'Department Activity Report', format: 'PDF/Excel', download: true },
              { name: 'Appointment Analytics', format: 'PDF/Excel', download: true },
              { name: 'Financial Report', format: 'PDF/Excel', download: false },
            ].map((report) => (
              <div key={report.name} className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{report.name}</p>
                  <p className="text-sm text-slate-600">{report.format}</p>
                </div>
                <Button variant={report.download ? 'default' : 'ghost'} size="sm" className="gap-2">
                  <Download className="h-4 w-4" /> Export
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
            <CardDescription>Performance metrics by department</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: 'Cardiology', patients: 124, satisfaction: '96%' },
              { name: 'Surgery', patients: 89, satisfaction: '93%' },
              { name: 'Pediatrics', patients: 156, satisfaction: '98%' },
            ].map((dept) => (
              <div key={dept.name} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <div>
                  <p className="font-medium text-slate-900">{dept.name}</p>
                  <p className="text-sm text-slate-600">{dept.patients} patients this month</p>
                </div>
                <p className="text-sm font-semibold text-slate-900">⭐ {dept.satisfaction}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
