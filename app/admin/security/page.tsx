'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Lock, Shield } from 'lucide-react';
import Link from 'next/link';

export default function AdminSecurityPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Security & Compliance</h1>
            <p className="mt-1 text-sm text-slate-600">Manage data access, backups, and privacy</p>
          </div>
          <Link href="/admin/dashboard">
            <Button variant="outline" className="rounded-full">
              <ArrowLeft className="mr-2 h-4 w-4" /> Dashboard
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Data Access Policies</CardTitle>
            <CardDescription>Manage role-based access control</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { role: 'Doctor', canView: 'Own Patients', canEdit: 'Appointments', dataAccess: 'Controlled' },
              { role: 'Nurse', canView: 'Department Patients', canEdit: 'Patient Records', dataAccess: 'Limited' },
              { role: 'Staff', canView: 'Scheduled Patients', canEdit: 'None', dataAccess: 'View Only' },
            ].map((policy) => (
              <div key={policy.role} className="rounded-lg border border-slate-200 p-4">
                <p className="font-medium text-slate-900">{policy.role}</p>
                <div className="mt-3 grid gap-2 text-sm text-slate-600">
                  <p>View: {policy.canView}</p>
                  <p>Edit: {policy.canEdit}</p>
                  <p>Access: {policy.dataAccess}</p>
                </div>
                <Button variant="outline" size="sm" className="mt-3">
                  Configure
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Backups</CardTitle>
            <CardDescription>Database backup and restore management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { date: '2026-04-07', time: '02:00 AM', size: '2.4 GB', status: 'Complete' },
                { date: '2026-04-06', time: '02:00 AM', size: '2.3 GB', status: 'Complete' },
                { date: '2026-04-05', time: '02:00 AM', size: '2.2 GB', status: 'Complete' },
              ].map((backup) => (
                <div key={backup.date} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                  <div>
                    <p className="font-medium text-slate-900">{backup.date} {backup.time}</p>
                    <p className="text-sm text-slate-600">{backup.size}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                      {backup.status}
                    </span>
                    <Button variant="ghost" size="sm">Restore</Button>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full gap-2">
              <Lock className="h-4 w-4" /> Create Backup Now
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Privacy & HIPAA Compliance</CardTitle>
            <CardDescription>Patient data protection and regulatory compliance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg bg-green-50 border border-green-200 p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">✓ HIPAA Compliant</p>
                  <p className="text-sm text-green-800 mt-1">All patient data is encrypted and secured according to HIPAA standards.</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">Require password change every 90 days</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">Enable two-factor authentication</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">Log all data access events</span>
              </label>
            </div>
            <Button className="gap-2">
              <Shield className="h-4 w-4" /> Save Security Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
