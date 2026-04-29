import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabase';

/**
 * GET /api/doctors/appointments - Get doctor's appointments
 * Supports filtering by date and status
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

    if (!payload || payload.userType !== 'doctor') {
      return NextResponse.json(
        { error: 'Only doctors can access this endpoint' },
        { status: 403 }
      );
    }

    // Get doctor ID
    const { data: doctorRecord, error: doctorError } = await supabaseServer
      .from('doctors')
      .select('id')
      .eq('user_id', payload.userId)
      .single();

    if (doctorError || !doctorRecord) {
      return NextResponse.json(
        { error: 'Doctor profile not found' },
        { status: 404 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');
    const status = searchParams.get('status');

    // Build query
    let query = supabaseServer
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
        users!patient_id (
          id,
          first_name,
          last_name,
          phone_number,
          email
        ),
        queue_management (
          queue_number,
          status,
          estimated_wait_time
        )
      `)
      .eq('doctor_id', doctorRecord.id);

    if (date) {
      query = query.eq('appointment_date', date);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: appointments, error: aptError } = await query
      .order('appointment_date', { ascending: false })
      .order('appointment_time', { ascending: false });

    if (aptError) {
      console.error('Get doctor appointments error:', aptError);
      return NextResponse.json(
        { error: 'Failed to fetch appointments' },
        { status: 500 }
      );
    }

    const formattedAppointments = appointments.map(apt => ({
      id: apt.id,
      patientId: apt.users?.[0]?.id,
      patientName: `${apt.users?.[0]?.first_name || ''} ${apt.users?.[0]?.last_name || ''}`.trim(),
      email: apt.users?.[0]?.email,
      phone: apt.users?.[0]?.phone_number,
      appointmentDate: apt.appointment_date,
      appointmentTime: apt.appointment_time,
      status: apt.status,
      appointmentType: apt.appointment_type,
      reasonForVisit: apt.reason_for_visit,
      queueNumber: apt.queue_management?.[0]?.queue_number,
      queueStatus: apt.queue_management?.[0]?.status,
      estimatedWaitTime: apt.queue_management?.[0]?.estimated_wait_time,
      durationMinutes: apt.duration_minutes,
    }));

    return NextResponse.json({
      appointments: formattedAppointments,
      total: formattedAppointments.length,
    });
  } catch (error) {
    console.error('Get doctor appointments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
