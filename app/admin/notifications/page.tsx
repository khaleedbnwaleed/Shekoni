'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, AlertCircle, Bell } from 'lucide-react';
import Link from 'next/link';

export default function AdminNotificationsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Notifications & Alerts</h1>
            <p className="mt-1 text-sm text-slate-600">Send system announcements and emergency alerts</p>
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
                <CardTitle>System Announcements</CardTitle>
                <CardDescription>Send updates to all hospital staff</CardDescription>
              </div>
              <Button className="gap-2 bg-blue-600">
                <Plus className="h-4 w-4" /> New Announcement
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { title: 'System Maintenance', date: '2026-04-10', recipients: 'All Users', priority: 'High' },
              { title: 'New Emergency Protocol', date: '2026-04-08', recipients: 'All Staff', priority: 'High' },
              { title: 'Policy Update', date: '2026-04-05', recipients: 'Doctors, Nurses', priority: 'Normal' },
            ].map((announce) => (
              <div key={announce.title} className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{announce.title}</p>
                  <p className="text-sm text-slate-600">{announce.date} • {announce.recipients}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${announce.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                  {announce.priority}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Emergency Alerts</CardTitle>
                <CardDescription>Critical system and operational alerts</CardDescription>
              </div>
              <Button className="gap-2 bg-red-600">
                <AlertCircle className="h-4 w-4" /> Send Emergency Alert
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { alert: 'Server Down', status: 'Active', sent: '2026-04-07 12:45' },
                { alert: 'Data Breach Attempt', status: 'Resolved', sent: '2026-04-06 18:30' },
              ].map((item) => (
                <div key={item.alert} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">{item.alert}</p>
                      <p className="text-sm text-slate-600">Sent: {item.sent}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${item.status === 'Active' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operational Updates</CardTitle>
            <CardDescription>Routine operational broadcasts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { title: 'Daily Operations Summary', frequency: 'Daily', time: '08:00 AM' },
              { title: 'Weekly Performance Report', frequency: 'Weekly', time: 'Monday 09:00 AM' },
              { title: 'Staff Meeting Reminder', frequency: 'As Needed', time: 'Variable' },
            ].map((update) => (
              <div key={update.title} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{update.title}</p>
                    <p className="text-sm text-slate-600">{update.frequency} at {update.time}</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
