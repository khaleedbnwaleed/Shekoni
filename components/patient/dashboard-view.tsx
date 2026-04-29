'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiGet } from '@/lib/api-client';
import { useAuth } from '@/hooks/useAuth';
import { usePatient } from '@/hooks/usePatient';
import { useAppointments } from '@/hooks/useAppointments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Calendar, FileText, LogOut, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

interface AppointmentOverview {
  id: string;
  doctorName: string;
  specialization: string;
  departmentName?: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  appointmentType: string;
  reasonForVisit?: string;
  queueNumber?: string;
  durationMinutes: number;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

function formatAppointmentDate(date: string, time: string) {
  return `${date} · ${time}`;
}

export function PatientDashboardView() {
  const { user, logout } = useAuth();
  const { profile, loading: profileLoading } = usePatient();
  const { appointments, loading: appointmentsLoading, error: appointmentsError } = useAppointments();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    const loadNotifications = async () => {
      try {
        setNotificationsLoading(true);
        setNotificationsError(null);
        const response = await apiGet('/api/notifications?limit=5');

        if (response.success) {
          setNotifications(response.data.notifications || []);
        } else {
          setNotificationsError(response.error || 'Failed to load notifications');
        }
      } catch (error) {
        setNotificationsError(error instanceof Error ? error.message : 'Failed to load notifications');
      } finally {
        setNotificationsLoading(false);
      }
    };

    loadNotifications();
  }, [user]);

  const upcomingAppointments = useMemo(
    () => appointments.filter((appointment) => appointment.status !== 'completed' && appointment.status !== 'cancelled').slice(0, 3),
    [appointments]
  );

  const appointmentCount = appointments.length;
  const completedCount = appointments.filter((appointment) => appointment.status === 'completed').length;
  const doctorsSeenCount = useMemo(
    () => new Set(appointments.map((appointment) => appointment.doctorName)).size,
    [appointments]
  );
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  const handleLogout = async () => {
    await logout();
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
            <p className="text-gray-600 text-sm mt-1">Welcome back, {user.firstName} {user.lastName}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleLogout} className="rounded-full">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Upcoming</p>
                  <p className="text-3xl font-bold text-blue-600">{appointmentCount}</p>
                  <p className="text-gray-500 text-xs mt-1">Appointments</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Medical</p>
                  <p className="text-3xl font-bold text-green-600">{completedCount}</p>
                  <p className="text-gray-500 text-xs mt-1">Completed Visits</p>
                </div>
                <FileText className="w-8 h-8 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Unread</p>
                  <p className="text-3xl font-bold text-purple-600">{unreadCount}</p>
                  <p className="text-gray-500 text-xs mt-1">Notifications</p>
                </div>
                <Bell className="w-8 h-8 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Doctors</p>
                  <p className="text-3xl font-bold text-orange-600">{doctorsSeenCount}</p>
                  <p className="text-gray-500 text-xs mt-1">Consulted</p>
                </div>
                <Phone className="w-8 h-8 text-orange-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {(appointmentsError || notificationsError) && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {appointmentsError || notificationsError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your patient journey</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Link href="/patient/appointments/book">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Book Appointment</Button>
                </Link>
                <Link href="/patient/appointments">
                  <Button variant="outline" className="w-full">View Appointments</Button>
                </Link>
                <Link href="/patient/profile">
                  <Button variant="outline" className="w-full">Update Profile</Button>
                </Link>
                <Link href="/patient/medical-records">
                  <Button variant="outline" className="w-full">Medical Records</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Your next scheduled visits</CardDescription>
              </CardHeader>
              <CardContent>
                {appointmentsLoading ? (
                  <div className="text-gray-600">Loading appointments...</div>
                ) : upcomingAppointments.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-600">
                    No upcoming appointments found.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">{appointment.doctorName}</p>
                            <p className="text-sm text-gray-600">{appointment.specialization} • {formatAppointmentDate(appointment.appointmentDate, appointment.appointmentTime)}</p>
                          </div>
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                            {appointment.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                          <span>{appointment.appointmentType.replace('_', ' ')}</span>
                          {appointment.departmentName && <span>{appointment.departmentName}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profileLoading ? (
                  <p className="text-gray-600 text-sm">Loading profile...</p>
                ) : profile ? (
                  <>
                    <div>
                      <p className="text-xs uppercase text-gray-500 font-semibold">Name</p>
                      <p className="font-medium text-gray-900">{profile.firstName} {profile.lastName}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-gray-500 font-semibold">Email</p>
                      <p className="text-sm text-gray-600">{profile.email}</p>
                    </div>
                    {profile.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <p className="text-sm text-gray-600">{profile.phoneNumber}</p>
                      </div>
                    )}
                    {profile.address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                        <p className="text-sm text-gray-600">{profile.address}</p>
                      </div>
                    )}
                    <Link href="/patient/profile">
                      <Button variant="outline" className="w-full mt-4">Edit Profile</Button>
                    </Link>
                  </>
                ) : (
                  <p className="text-gray-600 text-sm">No profile information available.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>Latest updates from your care team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {notificationsLoading ? (
                  <p className="text-gray-600 text-sm">Loading notifications...</p>
                ) : notifications.length === 0 ? (
                  <p className="text-gray-600 text-sm">No new notifications.</p>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`rounded-3xl border p-4 ${notification.isRead ? 'border-slate-200 bg-white' : 'border-blue-200 bg-blue-50'}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-gray-900">{notification.title}</p>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          </div>
                          <span className="text-xs text-slate-400">{new Date(notification.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
