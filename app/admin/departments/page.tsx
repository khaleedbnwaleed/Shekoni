'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Edit2, Trash2, Users } from 'lucide-react';
import Link from 'next/link';

export default function AdminDepartmentsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Departments & Staff</h1>
            <p className="mt-1 text-sm text-slate-600">Manage hospital departments, staff assignments, and schedules</p>
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
                <CardTitle>Hospital Departments</CardTitle>
                <CardDescription>Add, edit, or remove departments and manage staff</CardDescription>
              </div>
              <Button className="gap-2 bg-blue-600">
                <Plus className="h-4 w-4" /> Add Department
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'Cardiology', staff: 12, doctors: 4 },
              { name: 'General Practice', staff: 18, doctors: 6 },
              { name: 'Surgery', staff: 15, doctors: 5 },
              { name: 'Pediatrics', staff: 10, doctors: 3 },
            ].map((dept) => (
              <div key={dept.name} className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{dept.name}</p>
                    <div className="mt-2 flex gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" /> {dept.staff} staff
                      </span>
                      <span>{dept.doctors} doctors</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Duty Schedules & Shifts</CardTitle>
            <CardDescription>Manage staff working schedules</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">Schedule management interface - manage shifts for each department</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
