'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminContentPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Content Management</h1>
            <p className="mt-1 text-sm text-slate-600">Update website content, news, and announcements</p>
          </div>
          <Link href="/admin/dashboard">
            <Button variant="outline" className="rounded-full">
              <ArrowLeft className="mr-2 h-4 w-4" /> Dashboard
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Website Pages</CardTitle>
            <CardDescription>Edit main website content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { title: 'Home Page', lastUpdate: '2026-04-05' },
              { title: 'About Us', lastUpdate: '2026-03-28' },
              { title: 'Services', lastUpdate: '2026-04-01' },
              { title: 'Contact Page', lastUpdate: '2026-02-15' },
            ].map((page) => (
              <div key={page.title} className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                <div>
                  <p className="font-medium text-slate-900">{page.title}</p>
                  <p className="text-sm text-slate-600">Updated: {page.lastUpdate}</p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>News & Announcements</CardTitle>
            <CardDescription>Post updates and news to the website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: 'New Emergency Ward Opening', date: '2026-04-07', status: 'Published' },
              { title: 'Dr. Smith Joins Cardiology', date: '2026-04-06', status: 'Published' },
              { title: 'System Maintenance Notice', date: '2026-04-10', status: 'Draft' },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-600">{item.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${item.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {item.status}
                    </span>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
              </div>
            ))}
            <Button className="w-full">+ New Announcement</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
