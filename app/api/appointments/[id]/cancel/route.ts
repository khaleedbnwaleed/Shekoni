import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabase';

/**
 * PATCH /api/appointments/[id]/cancel - Cancel appointment
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const body = await request.json();
    const appointmentId = id;

    // Get appointment
    const { data: appointment, error: aptError } = await supabaseServer
      .from('appointments')
      .select('id, patient_id, doctor_id, appointment_date, status')
      .eq('id', appointmentId)
      .single();

    if (aptError || !appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Check authorization - only patient can cancel their own appointment
    if (appointment.patient_id !== payload.userId) {
      return NextResponse.json(
        { error: 'You can only cancel your own appointments' },
        { status: 403 }
      );
    }

    // Check if appointment can be cancelled
    if (appointment.status === 'cancelled' || appointment.status === 'completed') {
      return NextResponse.json(
        { error: `Cannot cancel a ${appointment.status} appointment` },
        { status: 400 }
      );
    }

    // Cancel appointment
    const { error: cancelError } = await supabaseServer
      .from('appointments')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancelled_reason: body.reason || null
      })
      .eq('id', appointmentId);

    if (cancelError) {
      console.error('Cancel appointment error:', cancelError);
      return NextResponse.json(
        { error: 'Failed to cancel appointment' },
        { status: 500 }
      );
    }

    // Update queue status
    const { error: queueError } = await supabaseServer
      .from('queue_management')
      .update({ status: 'no_show' })
      .eq('appointment_id', appointmentId);

    if (queueError) {
      console.error('Update queue error:', queueError);
    }

    // Free up the availability slot
    const { data: slotData, error: slotFetchError } = await supabaseServer
      .from('doctor_availability')
      .select('current_appointments')
      .eq('doctor_id', appointment.doctor_id)
      .eq('date', appointment.appointment_date)
      .single();

    if (!slotFetchError && slotData && slotData.current_appointments > 0) {
      const { error: slotError } = await supabaseServer
        .from('doctor_availability')
        .update({ current_appointments: slotData.current_appointments - 1 })
        .eq('doctor_id', appointment.doctor_id)
        .eq('date', appointment.appointment_date);

      if (slotError) {
        console.error('Update slot error:', slotError);
      }
    }

    return NextResponse.json({
      message: 'Appointment cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
