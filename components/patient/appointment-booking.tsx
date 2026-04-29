'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppointments } from '@/hooks/useAppointments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Calendar, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function AppointmentBooking() {
  const router = useRouter();
  const { availableSlots, loading, error, fetchAvailableSlots, bookAppointment } = useAppointments();

  const [step, setStep] = useState<'date' | 'slots' | 'details'>('date');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [appointmentType, setAppointmentType] = useState<'in_person' | 'telemedicine'>('in_person');
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Get minimum date (today)
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];

  // Fetch available slots when date changes
  useEffect(() => {
    if (selectedDate && step === 'slots') {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate, step, fetchAvailableSlots]);

  const handleDateSelect = async () => {
    if (!selectedDate) {
      setBookingError('Please select a date');
      return;
    }
    setBookingError(null);
    setStep('slots');
    await fetchAvailableSlots(selectedDate);
  };

  const handleSlotSelect = (slot: any) => {
    setSelectedSlot(slot);
    setBookingError(null);
    setStep('details');
  };

  const handleBookAppointment = async () => {
    if (!selectedSlot) {
      setBookingError('No slot selected');
      return;
    }

    const result = await bookAppointment({
      doctorId: selectedSlot.doctorId,
      appointmentDate: selectedSlot.date,
      appointmentTime: selectedSlot.timeStart,
      appointmentType,
      reasonForVisit,
    });

    if (result.success) {
      setBookingSuccess(true);
      setTimeout(() => {
        router.push('/patient/appointments');
      }, 2000);
    } else {
      setBookingError(result.error || null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/patient/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Book an Appointment</h1>
          <p className="text-gray-600 text-sm mt-1">Schedule your visit with a healthcare professional</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          <div className={`flex items-center gap-2 ${step === 'date' || step === 'slots' || step === 'details' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === 'date' || step === 'slots' || step === 'details' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <span className="text-sm font-medium">Select Date</span>
          </div>
          <div className="flex-1 h-1 mx-4 bg-gray-200" />

          <div className={`flex items-center gap-2 ${step === 'slots' || step === 'details' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === 'slots' || step === 'details' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              2
            </div>
            <span className="text-sm font-medium">Choose Slot</span>
          </div>
          <div className="flex-1 h-1 mx-4 bg-gray-200" />

          <div className={`flex items-center gap-2 ${step === 'details' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === 'details' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              3
            </div>
            <span className="text-sm font-medium">Confirm</span>
          </div>
        </div>

        {/* Error Alert */}
        {(error || bookingError) && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-6">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error || bookingError}</span>
          </div>
        )}

        {/* Success Alert */}
        {bookingSuccess && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm mb-6">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>Appointment booked successfully! Redirecting...</span>
          </div>
        )}

        {/* Step 1: Select Date */}
        {step === 'date' && (
          <Card>
            <CardHeader>
              <CardTitle>Select Appointment Date</CardTitle>
              <CardDescription>Choose a date for your appointment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium text-gray-700">
                  Date
                </label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={minDate}
                />
              </div>
              <Button
                onClick={handleDateSelect}
                disabled={!selectedDate || loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Checking availability...' : 'Continue'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Choose Slot */}
        {step === 'slots' && (
          <Card>
            <CardHeader>
              <CardTitle>Available Time Slots</CardTitle>
              <CardDescription>Select a time slot for {selectedDate}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableSlots.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No available slots for this date</p>
                  <Button
                    variant="outline"
                    onClick={() => setStep('date')}
                    className="mt-4"
                  >
                    Choose Different Date
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {availableSlots.map((slot) => (
                    <div
                      key={slot.id}
                      onClick={() => handleSlotSelect(slot)}
                      className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 cursor-pointer transition"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{slot.doctorName}</p>
                          <p className="text-sm text-gray-600">{slot.specialization} • {slot.departmentName}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {slot.timeStart} - {slot.timeEnd}
                            </div>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              {slot.availableSlots} available
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Button
                variant="outline"
                onClick={() => setStep('date')}
                className="w-full"
              >
                Back
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Confirm Details */}
        {step === 'details' && selectedSlot && (
          <Card>
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
              <CardDescription>Review and confirm your appointment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Doctor Info */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Doctor</p>
                <p className="font-medium text-gray-900">{selectedSlot.doctorName}</p>
                <p className="text-sm text-gray-600">{selectedSlot.specialization}</p>
              </div>

              {/* Appointment Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Date</p>
                  <p className="font-medium text-gray-900">{selectedSlot.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Time</p>
                  <p className="font-medium text-gray-900">{selectedSlot.timeStart}</p>
                </div>
              </div>

              {/* Appointment Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Appointment Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="in_person"
                      checked={appointmentType === 'in_person'}
                      onChange={(e) => setAppointmentType(e.target.value as any)}
                    />
                    <span className="text-sm text-gray-700">In-Person</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="telemedicine"
                      checked={appointmentType === 'telemedicine'}
                      onChange={(e) => setAppointmentType(e.target.value as any)}
                    />
                    <span className="text-sm text-gray-700">Video Call</span>
                  </label>
                </div>
              </div>

              {/* Reason for Visit */}
              <div className="space-y-2">
                <label htmlFor="reason" className="text-sm font-medium text-gray-700">
                  Reason for Visit (Optional)
                </label>
                <Input
                  id="reason"
                  placeholder="Describe your symptoms or reason for visit"
                  value={reasonForVisit}
                  onChange={(e) => setReasonForVisit(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep('slots')}
                  className="flex-1"
                  disabled={loading}
                >
                  Back
                </Button>
                <Button
                  onClick={handleBookAppointment}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Booking...' : 'Confirm Booking'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
