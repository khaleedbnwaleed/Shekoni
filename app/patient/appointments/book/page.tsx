import { AppointmentBooking } from '@/components/patient/appointment-booking';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Appointment | Patient Portal',
  description: 'Schedule a new appointment with a healthcare professional',
};

export default function BookAppointmentPage() {
  return <AppointmentBooking />;
}
