'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppointments } from '@/hooks/useAppointments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Calendar, Clock, Video, MapPin, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';

const statusConfig = {
  scheduled: { color: 'bg-blue-100 text-blue-800', icon: Calendar },
  in_progress: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
  no_show: { color: 'bg-gray-100 text-gray-800', icon: AlertTriangle },
};

export function AppointmentsList() {
  const router = useRouter();
  const { appointments, loading, error, cancelAppointment } = useAppointments();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');

  const handleCancel = async (appointmentId: string) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    setCancellingId(appointmentId);
    const result = await cancelAppointment(appointmentId, cancellationReason);

    if (result.success) {
      setCancellingId(null);
      setCancellationReason('');
    }
    setCancellingId(null);
  };

  const upcomingAppointments = appointments.filter(
    apt => new Date(`${apt.appointmentDate} ${apt.appointmentTime}`) > new Date() && apt.status !== 'cancelled'
  );

  const pastAppointments = appointments.filter(
    apt => new Date(`${apt.appointmentDate} ${apt.appointmentTime}`) <= new Date() || apt.status === 'cancelled'
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/patient/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
              <p className="text-gray-600 text-sm mt-1">Manage your scheduled appointments</p>
            </div>
            <Link href="/patient/appointments/book">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Book New Appointment
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-6">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading appointments...</p>
          </div>
        )}

        {/* No Appointments */}
        {!loading && appointments.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">No appointments scheduled yet</p>
              <Link href="/patient/appointments/book">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Book Your First Appointment
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Appointments */}
        {!loading && upcomingAppointments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
            <div className="space-y-4">
              {upcomingAppointments.map((apt) => (
                <Card key={apt.id} className="hover:shadow-md transition">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Dr. {apt.doctorName}
                          </h3>
                          <Badge variant="outline">{apt.specialization}</Badge>
                          {apt.appointmentType === 'telemedicine' && (
                            <Video className="w-4 h-4 text-blue-600" />
                          )}
                          {apt.appointmentType === 'in_person' && (
                            <MapPin className="w-4 h-4 text-gray-600" />
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-3">{apt.departmentName}</p>

                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">
                              {new Date(apt.appointmentDate).toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">{apt.appointmentTime}</span>
                          </div>
                        </div>

                        {apt.queueNumber && (
                          <p className="text-sm text-gray-600 mb-3">
                            Queue Number: <span className="font-semibold">{apt.queueNumber}</span>
                          </p>
                        )}

                        {apt.reasonForVisit && (
                          <p className="text-sm text-gray-600 mb-3">
                            Reason: <span className="text-gray-700">{apt.reasonForVisit}</span>
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Badge className={statusConfig[apt.status as keyof typeof statusConfig]?.color || 'bg-gray-100'}>
                          {apt.status.replace('_', ' ').charAt(0).toUpperCase() + apt.status.slice(1).replace('_', ' ')}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancel(apt.id)}
                          disabled={cancellingId === apt.id}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          {cancellingId === apt.id ? 'Cancelling...' : 'Cancel'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Past Appointments */}
        {!loading && pastAppointments.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Past Appointments</h2>
            <div className="space-y-4">
              {pastAppointments.map((apt) => (
                <Card key={apt.id} className="opacity-75">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Dr. {apt.doctorName}
                          </h3>
                          <Badge variant="outline">{apt.specialization}</Badge>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">{apt.departmentName}</p>

                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {new Date(apt.appointmentDate).toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{apt.appointmentTime}</span>
                          </div>
                        </div>
                      </div>

                      <Badge className={statusConfig[apt.status as keyof typeof statusConfig]?.color || 'bg-gray-100'}>
                        {apt.status.replace('_', ' ').charAt(0).toUpperCase() + apt.status.slice(1).replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
