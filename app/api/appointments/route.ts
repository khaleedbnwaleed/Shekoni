import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabase';
import { notifyAppointmentCreated } from '@/lib/notification-service';

/**
 * GET /api/appointments - Get user's appointments
 */
export async function GET(request: NextRequest) {
  try {
    // Extract and verify token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    const payload = verifyAccessToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { data: appointments, error } = await supabaseServer
      .from('appointments')
      .select(`
        id,
        appointment_date,
        appointment_time,
        status,
        appointment_type,
        reason_for_visit,
        assigned_queue_number,
        duration_minutes,
        doctors (
          id,
          specialization,
          users (
            first_name,
            last_name
          ),
          departments (
            name
          )
        ),
        queue_management (
          queue_number,
          status
        )
      `)
      .eq('patient_id', payload.userId)
      .order('appointment_date', { ascending: false })
      .order('appointment_time', { ascending: false });

    if (error) {
      console.error('Get appointments error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch appointments' },
        { status: 500 }
      );
    }

    const formattedAppointments = appointments.map(apt => ({
      id: apt.id,
      doctorId: apt.doctors?.[0]?.id,
      doctorName: `${apt.doctors?.[0]?.users?.[0]?.first_name || ''} ${apt.doctors?.[0]?.users?.[0]?.last_name || ''}`.trim(),
      specialization: apt.doctors?.[0]?.specialization,
      departmentName: apt.doctors?.[0]?.departments?.[0]?.name,
      appointmentDate: apt.appointment_date,
      appointmentTime: apt.appointment_time,
      status: apt.status,
      appointmentType: apt.appointment_type,
      reasonForVisit: apt.reason_for_visit,
      queueNumber: apt.queue_management?.[0]?.queue_number,
      durationMinutes: apt.duration_minutes,
    }));

    return NextResponse.json({
      appointments: formattedAppointments,
      total: formattedAppointments.length,
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/appointments - Book new appointment
 */
export async function POST(request: NextRequest) {
  try {
    // Extract and verify token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    const payload = verifyAccessToken(token);

    if (!payload || payload.userType !== 'patient') {
      return NextResponse.json(
        { error: 'Only patients can book appointments' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.doctorId || !body.appointmentDate || !body.appointmentTime || !body.appointmentType) {
      return NextResponse.json(
        { error: 'Missing required fields: doctorId, appointmentDate, appointmentTime, appointmentType' },
        { status: 400 }
      );
    }

    // Verify doctor exists and is available
    const { data: doctor, error: doctorError } = await supabaseServer
      .from('doctors')
      .select('id')
      .eq('id', body.doctorId)
      .eq('is_available', true)
      .single();

    if (doctorError || !doctor) {
      return NextResponse.json(
        { error: 'Doctor not found or unavailable' },
        { status: 404 }
      );
    }

    // Check availability slot
    const { data: slot, error: slotError } = await supabaseServer
      .from('doctor_availability')
      .select('id, max_appointments_per_slot, current_appointments')
      .eq('doctor_id', body.doctorId)
      .eq('date', body.appointmentDate)
      .lte('time_slot_start', body.appointmentTime)
      .gt('time_slot_end', body.appointmentTime)
      .single();

    if (slotError || !slot || slot.current_appointments >= slot.max_appointments_per_slot) {
      return NextResponse.json(
        { error: 'No available slots at selected time' },
        { status: 409 }
      );
    }

    // Check for duplicate appointments at same time
    const { data: existingAppointment, error: dupError } = await supabaseServer
      .from('appointments')
      .select('id')
      .eq('patient_id', payload.userId)
      .eq('appointment_date', body.appointmentDate)
      .eq('appointment_time', body.appointmentTime)
      .single();

    if (existingAppointment) {
      return NextResponse.json(
        { error: 'You already have an appointment at this time' },
        { status: 409 }
      );
    }

    // Create appointment
    const { data: appointment, error: createError } = await supabaseServer
      .from('appointments')
      .insert([{
        patient_id: payload.userId,
        doctor_id: body.doctorId,
        appointment_date: body.appointmentDate,
        appointment_time: body.appointmentTime,
        appointment_type: body.appointmentType,
        reason_for_visit: body.reasonForVisit || null,
        duration_minutes: 30,
        status: 'scheduled'
      }])
      .select('id, appointment_date, appointment_time, status, appointment_type')
      .single();

    if (createError || !appointment) {
      return NextResponse.json(
        { error: 'Failed to create appointment' },
        { status: 500 }
      );
    }

    // Update doctor availability slot
    const { error: updateSlotError } = await supabaseServer
      .from('doctor_availability')
      .update({ current_appointments: slot.current_appointments + 1 })
      .eq('id', slot.id);

    if (updateSlotError) {
      console.error('Failed to update slot:', updateSlotError);
      // Continue anyway, as appointment is created
    }

    // Generate queue number
    const { count: queueCount, error: countError } = await supabaseServer
      .from('queue_management')
      .select('*', { count: 'exact', head: false })
      .eq('doctor_id', body.doctorId)
      .eq('date', body.appointmentDate);

    if (countError) {
      console.error('Failed to count queue:', countError);
    }

    const queueNumber = ((queueCount || 0) + 1).toString().padStart(3, '0');

    // Create queue entry
    const { error: queueError } = await supabaseServer
      .from('queue_management')
      .insert([{
        appointment_id: appointment.id,
        doctor_id: body.doctorId,
        queue_number: queueNumber,
        date: body.appointmentDate,
        status: 'waiting'
      }]);

    if (queueError) {
      console.error('Failed to create queue entry:', queueError);
      // Continue anyway
    }

    // Send notifications to patient and doctor
    try {
      await notifyAppointmentCreated(appointment.id, payload.userId, body.doctorId);
    } catch (notificationError) {
      console.error('Failed to send notification:', notificationError);
      // Don't fail the appointment creation if notifications fail
    }

    return NextResponse.json({
      message: 'Appointment booked successfully',
      appointment: {
        id: appointment.id,
        appointmentDate: appointment.appointment_date,
        appointmentTime: appointment.appointment_time,
        status: appointment.status,
        appointmentType: appointment.appointment_type,
        queueNumber,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Book appointment error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
