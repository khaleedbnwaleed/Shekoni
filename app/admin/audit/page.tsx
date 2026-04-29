'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';

export default function AdminAuditPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Audit & Activity Logs</h1>
            <p className="mt-1 text-sm text-slate-600">Monitor user activities and system events</p>
          </div>
          <Link href="/admin/dashboard">
            <Button variant="outline" className="rounded-full">
              <ArrowLeft className="mr-2 h-4 w-4" /> Dashboard
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Activity Log</CardTitle>
                <CardDescription>Track all user actions and system events</CardDescription>
              </div>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" /> Export
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { user: 'Dr. John Smith', action: 'Viewed patient record', time: '2026-04-07 14:32', type: 'view' },
              { user: 'Jane Nurses', action: 'Updated appointment', time: '2026-04-07 14:15', type: 'update' },
              { user: 'Mike Admin', action: 'Added new user', time: '2026-04-07 13:45', type: 'create' },
              { user: 'Sarah Doctor', action: 'Deleted appointment', time: '2026-04-07 13:20', type: 'delete' },
            ].map((log) => (
              <div key={`${log.user}-${log.time}`} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{log.user}</p>
                    <p className="text-sm text-slate-600">{log.action}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">{log.time}</p>
                    <span className={`mt-1 inline-block rounded-full px-2 py-1 text-xs font-medium ${log.type === 'view' ? 'bg-blue-100 text-blue-700' : log.type === 'update' ? 'bg-yellow-100 text-yellow-700' : log.type === 'create' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {log.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Access Summary</CardTitle>
            <CardDescription>Today's login and access events</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Total Logins</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">47</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Unique Users</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">23</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Failed Attempts</p>
              <p className="mt-2 text-2xl font-bold text-red-600">2</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
