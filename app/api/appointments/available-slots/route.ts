import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabase';

/**
 * GET /api/appointments/available-slots
 * Get available appointment slots for booking
 * Query params: doctorId (optional), departmentId (optional), date (optional)
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

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const doctorId = searchParams.get('doctorId');
    const departmentId = searchParams.get('departmentId');
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    // Build query
    let query = supabaseServer
      .from('doctor_availability')
      .select(`
        id,
        doctor_id,
        date,
        time_slot_start,
        time_slot_end,
        max_appointments_per_slot,
        current_appointments,
        doctors (
          user_id,
          specialization,
          is_available,
          users (
            first_name,
            last_name
          ),
          departments (
            name
          )
        )
      `)
      .eq('is_available', true)
      .eq('date', date)
      .eq('doctors.is_available', true);

    if (doctorId) {
      query = query.eq('doctor_id', doctorId);
    }

    if (departmentId) {
      query = query.eq('doctors.department_id', departmentId);
    }

    const { data: slots, error } = await query
      .order('time_slot_start', { ascending: true });

    if (error) {
      console.error('Get available slots error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch available slots' },
        { status: 500 }
      );
    }

    // Filter slots that have available appointments
    const availableSlots = slots?.filter(slot => 
      slot.current_appointments < slot.max_appointments_per_slot
    ) || [];

    const formattedSlots = availableSlots.map(slot => ({
      id: slot.id,
      doctorId: slot.doctor_id,
      doctorName: `${slot.doctors?.[0]?.users?.[0]?.first_name || ''} ${slot.doctors?.[0]?.users?.[0]?.last_name || ''}`.trim(),
      specialization: slot.doctors?.[0]?.specialization,
      departmentName: slot.doctors?.[0]?.departments?.[0]?.name,
      date: slot.date,
      timeStart: slot.time_slot_start,
      timeEnd: slot.time_slot_end,
      availableSlots: slot.max_appointments_per_slot - slot.current_appointments,
      totalSlots: slot.max_appointments_per_slot,
    }));

    return NextResponse.json({
      slots: formattedSlots,
      total: formattedSlots.length,
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
