'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit2, Save } from 'lucide-react';
import Link from 'next/link';

export default function AdminSystemPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">System Configuration</h1>
            <p className="mt-1 text-sm text-slate-600">Configure hospital settings and system parameters</p>
          </div>
          <Link href="/admin/dashboard">
            <Button variant="outline" className="rounded-full">
              <ArrowLeft className="mr-2 h-4 w-4" /> Dashboard
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hospital Settings</CardTitle>
            <CardDescription>Basic hospital configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">Hospital Name</label>
              <input type="text" className="w-full rounded-lg border border-slate-200 px-3 py-2" defaultValue="Shekoni Hospital" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">Hospital Email</label>
              <input type="email" className="w-full rounded-lg border border-slate-200 px-3 py-2" defaultValue="admin@shekoni.hospital" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">Phone Number</label>
              <input type="tel" className="w-full rounded-lg border border-slate-200 px-3 py-2" defaultValue="+234 800 000 0000" />
            </div>
            <Button className="gap-2">
              <Save className="h-4 w-4" /> Save Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appointment Configuration</CardTitle>
            <CardDescription>Set appointment rules and time slots</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Min. Appointment Duration (min)</label>
                <input type="number" className="w-full rounded-lg border border-slate-200 px-3 py-2" defaultValue="30" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Max. Daily Appointments</label>
                <input type="number" className="w-full rounded-lg border border-slate-200 px-3 py-2" defaultValue="50" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">Working Hours</label>
              <div className="grid gap-2 md:grid-cols-2">
                <input type="time" className="rounded-lg border border-slate-200 px-3 py-2" defaultValue="08:00" placeholder="Start Time" />
                <input type="time" className="rounded-lg border border-slate-200 px-3 py-2" defaultValue="18:00" placeholder="End Time" />
              </div>
            </div>
            <Button className="gap-2">
              <Save className="h-4 w-4" /> Save Configuration
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Module Management</CardTitle>
            <CardDescription>Enable/disable system features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: 'Telemedicine', enabled: true },
              { name: 'Appointment System', enabled: true },
              { name: 'Patient Portal', enabled: true },
              { name: 'Prescription Management', enabled: false },
            ].map((module) => (
              <div key={module.name} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <p className="font-medium text-slate-900">{module.name}</p>
                <input type="checkbox" defaultChecked={module.enabled} className="rounded" />
              </div>
            ))}
            <Button className="gap-2">
              <Save className="h-4 w-4" /> Save Modules
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Configure SMS and Email notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm font-medium">Enable SMS Notifications</span>
              </label>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className=" rounded" />
                <span className="text-sm font-medium">Enable Email Notifications</span>
              </label>
            </div>
            <Button className="gap-2">
              <Save className="h-4 w-4" /> Save Notification Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
