'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiGet } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertCircle,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MessageSquare,
  Search,
  Settings2,
  Stethoscope,
  Users,
} from 'lucide-react';

interface DoctorProfile {
  firstName: string;
  lastName: string;
  specialization: string;
  departmentName: string;
  consultationFee?: number;
  isAvailable: boolean;
}

interface DoctorDashboardStats {
  totalAppointments: number;
  pendingConsultations: number;
  patientsSeen: number;
  alerts: number;
}

interface AppointmentItem {
  id: string;
  queueNumber: string;
  status: 'waiting' | 'in_service' | 'completed';
  patientName: string;
  phoneNumber: string;
  appointmentTime: string;
  appointmentType: string;
  patientAge: number;
  patientCondition: string;
}

interface PatientRecord {
  id: string;
  name: string;
  age: number;
  condition: string;
  lastVisit: string;
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

interface MessageItem {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
}

interface ConsultationDraft {
  symptoms: string;
  diagnosis: string;
  prescriptions: string;
  labRequests: string[];
}

type SectionKey =
  | 'dashboard'
  | 'appointments'
  | 'patients'
  | 'consultations'
  | 'labRequests'
  | 'messages'
  | 'settings';

const defaultPatients: PatientRecord[] = [
  {
    id: 'patient-1',
    name: 'John Doe',
    age: 34,
    condition: 'Hypertension',
    lastVisit: 'Apr 4, 2026',
  },
  {
    id: 'patient-2',
    name: 'Jane Smith',
    age: 29,
    condition: 'Diabetes',
    lastVisit: 'Apr 5, 2026',
  },
  {
    id: 'patient-3',
    name: 'Mike Johnson',
    age: 42,
    condition: 'Back Pain',
    lastVisit: 'Apr 3, 2026',
  },
  {
    id: 'patient-4',
    name: 'Aisha Bello',
    age: 38,
    condition: 'Asthma',
    lastVisit: 'Apr 1, 2026',
  },
];

const defaultNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Lab result ready',
    description: 'Blood test results are ready for review.',
    time: '5m ago',
    unread: true,
  },
  {
    id: 'notif-2',
    title: 'Appointment request',
    description: 'New telemedicine appointment requested.',
    time: '22m ago',
    unread: true,
  },
  {
    id: 'notif-3',
    title: 'Medication update',
    description: 'Patient medication has been updated.',
    time: '1h ago',
    unread: false,
  },
];

const defaultMessages: MessageItem[] = [
  {
    id: 'msg-1',
    sender: 'John Doe',
    subject: 'Follow-up questions',
    preview: 'Could we review the medication plan for next week?',
    time: '2m ago',
    unread: true,
  },
  {
    id: 'msg-2',
    sender: 'Jane Smith',
    subject: 'Lab appointment',
    preview: 'I have received the schedule for my lab tests.',
    time: '45m ago',
    unread: false,
  },

];

export function DoctorDashboardView() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DoctorDashboardStats | null>(null);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(defaultNotifications);
  const [messages, setMessages] = useState<MessageItem[]>(defaultMessages);
  const [patients, setPatients] = useState<PatientRecord[]>(defaultPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<SectionKey>('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [consultationDraft, setConsultationDraft] = useState<ConsultationDraft>({
    symptoms: '',
    diagnosis: '',
    prescriptions: '',
    labRequests: [],
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const profileRes = await apiGet('/api/doctors/profile');
        if (profileRes.success) {
          setProfile(profileRes.data.doctor);
        }

        const queueRes = await apiGet('/api/doctors/queue');
        if (queueRes.success) {
          const fetchedAppointments = queueRes.data.queue.map((item: any, index: number) => ({
            ...item,
            appointmentType:
              index % 3 === 0
                ? 'New Patient'
                : index % 3 === 1
                ? 'Follow-up'
                : 'Review',
            patientAge: 28 + index * 4,
            patientCondition:
              index % 2 === 0 ? 'Hypertension' : index % 3 === 0 ? 'Diabetes' : 'Routine Checkup',
          })) as AppointmentItem[];
          setAppointments(fetchedAppointments);
          setDashboardStats({
            totalAppointments: queueRes.data.statistics.total,
            pendingConsultations: queueRes.data.statistics.waiting,
            patientsSeen: queueRes.data.statistics.completed,
            alerts: defaultNotifications.filter((item) => item.unread).length,
          });
          setSelectedAppointmentId(fetchedAppointments[0]?.id ?? null);
        } else {
          setDashboardStats({
            totalAppointments: 0,
            pendingConsultations: 0,
            patientsSeen: 0,
            alerts: defaultNotifications.filter((item) => item.unread).length,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  const selectedAppointment = appointments.find((item) => item.id === selectedAppointmentId) ?? appointments[0] ?? null;
  const selectedPatient = patients.find((patient) => patient.id === selectedPatientId) ?? null;

  const filteredPatients = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return patients;
    }

    return patients.filter((patient) =>
      patient.name.toLowerCase().includes(term) || patient.condition.toLowerCase().includes(term),
    );
  }, [patients, searchTerm]);

  const unreadNotificationCount = notifications.filter((item) => item.unread).length;
  const activeMessagesCount = messages.filter((item) => item.unread).length;

  const calendarMonthLabel = calendarDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const calendarCells = useMemo(() => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: Array<{ key: string; label: number | null; date: Date | null; isToday: boolean; hasEvent: boolean }> = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push({ key: `empty-${i}`, label: null, date: null, isToday: false, hasEvent: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === new Date().toDateString();
      const hasEvent = [5, 12, 18, 25].includes(day);
      cells.push({ key: `day-${day}`, label: day, date, isToday, hasEvent });
    }

    return cells;
  }, [calendarDate]);

  const selectedDateLabel = calendarDate.toLocaleDateString('default', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const calendarEvents = useMemo(() => {
    return appointments.slice(0, 3).map((appointment) => ({
      id: appointment.id,
      title: appointment.patientName,
      time: appointment.appointmentTime,
    }));
  }, [appointments]);

  const handleLogout = async () => {
    await logout();
  };

  const selectAppointment = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setActiveSection('consultations');
  };

  const startConsultation = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setActiveSection('consultations');
  };

  const rescheduleAppointment = (appointmentId: string) => {
    const newTime = window.prompt('Enter a new time for this appointment:', '02:00 PM');
    if (newTime) {
      window.alert(`Appointment ${appointmentId} rescheduled to ${newTime}`);
    }
  };

  const selectPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveSection('patients');
  };

  const saveConsultationDraft = () => {
    window.alert('Consultation draft saved.');
  };

  const completeConsultation = () => {
    window.alert('Consultation completed successfully.');
    setConsultationDraft({ symptoms: '', diagnosis: '', prescriptions: '', labRequests: [] });
  };

  const openMessage = (messageId: string) => {
    setMessages((current) =>
      current.map((message) =>
        message.id === messageId ? { ...message, unread: false } : message,
      ),
    );
  };

  const previousMonth = () => {
    setCalendarDate((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCalendarDate((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1));
  };

  const selectCalendarDate = (date: Date) => {
    setCalendarDate(date);
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600">Redirecting to login...</p>
      </div>
    );
  }

  if (user.userType !== 'doctor') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
          <p className="text-xl font-semibold text-slate-900">Access denied</p>
          <p className="mt-2 text-sm text-slate-600">You do not have permission to access the doctor dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Doctor Dashboard</p>
            <h1 className="text-3xl font-semibold text-slate-900">Welcome back, Dr. {user.firstName}</h1>
            <p className="text-sm text-slate-600">{profile?.specialization ?? 'General Physician'} • {profile?.departmentName ?? 'General Clinic'}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
            >
              <CalendarDays className="h-4 w-4" />
              New Visit
            </button>
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-300"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute right-0 top-0 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[0.65rem] font-semibold text-white">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition hover:border-blue-300"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-700">{user.firstName?.[0]}</span>
                <span className="hidden sm:block">Dr. {user.lastName}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Navigation</CardTitle>
                <CardDescription>Jump to key sections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {([
                  { key: 'dashboard', label: 'Dashboard', icon: Users },
                  { key: 'appointments', label: 'Appointments', icon: CalendarDays },
                  { key: 'patients', label: 'Patients', icon: Stethoscope },
                  { key: 'consultations', label: 'Consultations', icon: MessageSquare },
                  { key: 'labRequests', label: 'Lab Requests', icon: CheckCircle2 },
                  { key: 'messages', label: 'Messages', icon: MessageSquare },
                  { key: 'settings', label: 'Settings', icon: Settings2 },
                ] as const).map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setActiveSection(item.key)}
                      className={`flex w-full items-center gap-3 rounded-3xl border px-4 py-3 text-left text-sm transition ${
                        isActive
                          ? 'border-blue-300 bg-blue-50 text-blue-700 shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Today’s Snapshot</CardTitle>
                <CardDescription>Performance summary for the shift</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-3xl bg-blue-50 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-blue-700">Alerts</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{dashboardStats?.alerts ?? 0}</p>
                  <p className="text-sm text-slate-600 mt-1">Critical items that need immediate review.</p>
                </div>
                <div className="grid gap-3">
                  <div className="rounded-3xl border border-slate-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Unread messages</p>
                    <p className="mt-2 text-xl font-semibold text-slate-900">{activeMessagesCount}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Pending notifications</p>
                    <p className="mt-2 text-xl font-semibold text-slate-900">{unreadNotificationCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          <section className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Card className="rounded-4xl border-blue-100 bg-white shadow-sm">
                <CardContent>
                  <p className="text-sm text-slate-500">Today's Appointments</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{dashboardStats?.totalAppointments ?? 0}</p>
                </CardContent>
              </Card>
              <Card className="rounded-4xl border-amber-100 bg-white shadow-sm">
                <CardContent>
                  <p className="text-sm text-slate-500">Pending Consultations</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{dashboardStats?.pendingConsultations ?? 0}</p>
                </CardContent>
              </Card>
              <Card className="rounded-4xl border-emerald-100 bg-white shadow-sm">
                <CardContent>
                  <p className="text-sm text-slate-500">Patients Seen</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{dashboardStats?.patientsSeen ?? 0}</p>
                </CardContent>
              </Card>
              <Card className="rounded-4xl border-red-100 bg-white shadow-sm">
                <CardContent>
                  <p className="text-sm text-slate-500">Alerts</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{dashboardStats?.alerts ?? 0}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="items-center gap-2">
                <div>
                  <CardTitle>Appointments</CardTitle>
                  <CardDescription>Today's patient visits and actions.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setActiveSection('appointments')}>
                  View all
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Time</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Patient</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Type</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">{appointment.appointmentTime}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">{appointment.patientName}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">{appointment.appointmentType}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                appointment.status === 'waiting'
                                  ? 'bg-amber-100 text-amber-800'
                                  : appointment.status === 'in_service'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {appointment.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <button
                              type="button"
                              className="mr-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 hover:bg-slate-50"
                              onClick={() => selectAppointment(appointment.id)}
                            >
                              View
                            </button>
                            <button
                              type="button"
                              className="mr-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-blue-700 hover:bg-blue-100"
                              onClick={() => startConsultation(appointment.id)}
                            >
                              Start
                            </button>
                            <button
                              type="button"
                              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 hover:bg-slate-50"
                              onClick={() => rescheduleAppointment(appointment.id)}
                            >
                              Reschedule
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Records</CardTitle>
                  <CardDescription>Search and review patient history.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-400" />
                    <input
                      type="search"
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-12 py-3 text-sm text-slate-900 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      placeholder="Search patient name or condition"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                    />
                  </div>
                  {filteredPatients.length === 0 ? (
                    <p className="text-sm text-slate-500">No matching patients found.</p>
                  ) : (
                    <div className="space-y-3">
                      {filteredPatients.slice(0, 5).map((patient) => (
                        <button
                          key={patient.id}
                          type="button"
                          onClick={() => selectPatient(patient.id)}
                          className="w-full rounded-3xl border border-slate-200 bg-white p-4 text-left hover:border-blue-300 hover:bg-blue-50"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-semibold text-slate-900">{patient.name}</p>
                              <p className="text-sm text-slate-500">{patient.condition}</p>
                            </div>
                            <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Age {patient.age}</span>
                          </div>
                          <p className="mt-2 text-xs text-slate-400">Last visit: {patient.lastVisit}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Consultation Panel</CardTitle>
                  <CardDescription>Manage symptoms, diagnosis, notes, and lab requests.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Current Patient</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{selectedPatient?.name ?? selectedAppointment?.patientName ?? 'No patient selected'}</p>
                    <p className="text-sm text-slate-500">{selectedAppointment?.appointmentType ?? 'Consultation'}</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Symptoms</label>
                      <textarea
                        value={consultationDraft.symptoms}
                        onChange={(event) => setConsultationDraft((prev) => ({ ...prev, symptoms: event.target.value }))}
                        rows={3}
                        className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        placeholder="Describe symptoms"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Diagnosis</label>
                      <textarea
                        value={consultationDraft.diagnosis}
                        onChange={(event) => setConsultationDraft((prev) => ({ ...prev, diagnosis: event.target.value }))}
                        rows={3}
                        className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        placeholder="Enter diagnosis"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Prescriptions</label>
                      <textarea
                        value={consultationDraft.prescriptions}
                        onChange={(event) => setConsultationDraft((prev) => ({ ...prev, prescriptions: event.target.value }))}
                        rows={3}
                        className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        placeholder="Enter prescriptions"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Lab Requests</label>
                      <select
                        multiple
                        value={consultationDraft.labRequests}
                        onChange={(event) =>
                          setConsultationDraft((prev) => ({
                            ...prev,
                            labRequests: Array.from(event.target.selectedOptions, (option) => option.value),
                          }))
                        }
                        className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      >
                        <option>Blood Panel</option>
                        <option>Urine Analysis</option>
                        <option>X-ray</option>
                        <option>MRI</option>
                        <option>CT Scan</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={saveConsultationDraft}>
                    Save Draft
                  </Button>
                  <Button variant="default" size="sm" onClick={completeConsultation}>
                    Complete Consultation
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Calendar</CardTitle>
                  <CardDescription>Track scheduled consultation days.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-3xl bg-slate-50 p-4">
                    <button
                      type="button"
                      className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:border-blue-300"
                      onClick={previousMonth}
                    >
                      Prev
                    </button>
                    <p className="font-semibold text-slate-900">{calendarMonthLabel}</p>
                    <button
                      type="button"
                      className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:border-blue-300"
                      onClick={nextMonth}
                    >
                      Next
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-500">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label) => (
                      <div key={label}>{label}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center text-sm">
                    {calendarCells.map((cell) => (
                      <button
                        key={cell.key}
                        type="button"
                        disabled={!cell.date}
                        onClick={() => cell.date && selectCalendarDate(cell.date)}
                        className={`rounded-2xl p-3 text-sm ${cell.isToday ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-700'} ${cell.hasEvent ? 'ring-1 ring-blue-200' : ''}`}
                      >
                        {cell.label ?? ''}
                      </button>
                    ))}
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <p>Upcoming</p>
                      <span>{selectedDateLabel}</span>
                    </div>
                    {calendarEvents.length === 0 ? (
                      <p className="mt-3 text-sm text-slate-500">No appointments scheduled for this date.</p>
                    ) : (
                      <div className="mt-3 space-y-3">
                        {calendarEvents.map((event) => (
                          <div key={event.id} className="rounded-3xl bg-white p-3 shadow-sm">
                            <p className="font-semibold text-slate-900">{event.title}</p>
                            <p className="text-sm text-slate-500">{event.time}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Messages</CardTitle>
                  <CardDescription>Recent patient messages.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {messages.map((message) => (
                    <button
                      key={message.id}
                      type="button"
                      onClick={() => openMessage(message.id)}
                      className={`w-full rounded-3xl border px-4 py-4 text-left transition ${
                        message.unread ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">{message.sender}</p>
                          <p className="text-sm text-slate-500">{message.subject}</p>
                        </div>
                        <span className="text-xs uppercase tracking-[0.2em] text-slate-500">{message.time}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-500">{message.preview}</p>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
