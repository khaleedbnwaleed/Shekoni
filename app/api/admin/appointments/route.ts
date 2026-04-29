import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabase';

/**
 * GET /api/admin/appointments - Get all appointments for admin
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

    if (!payload || payload.userType !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can access this endpoint' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const date = searchParams.get('date');
    const doctorId = searchParams.get('doctorId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

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
        notes,
        created_at,
        updated_at,
        patient:users!appointments_patient_id_fkey (
          id,
          first_name,
          last_name,
          email,
          phone_number
        ),
        doctor:users!appointments_doctor_id_fkey (
          id,
          first_name,
          last_name,
          email,
          doctor_profiles (
            specialization,
            departments (
              name
            )
          )
        )
      `)
      .order('appointment_date', { ascending: false })
      .order('appointment_time', { ascending: false });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    if (date) {
      query = query.eq('appointment_date', date);
    }

    if (doctorId) {
      query = query.eq('doctor_id', doctorId);
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: appointments, error, count } = await query;

    if (error) {
      console.error('Failed to fetch appointments:', error);
      throw error;
    }

    // Get total count for pagination
    const { count: totalCount } = await supabaseServer
      .from('appointments')
      .select('*', { count: 'exact', head: true });

    // Get appointment statistics
    const { data: statsData, error: statsError } = await supabaseServer
      .from('appointments')
      .select('status, appointment_date');

    let stats = {
      total: 0,
      scheduled: 0,
      completed: 0,
      cancelled: 0,
      today: 0,
    };

    if (!statsError && statsData) {
      stats.total = statsData.length;
      stats.scheduled = statsData.filter(apt => apt.status === 'scheduled').length;
      stats.completed = statsData.filter(apt => apt.status === 'completed').length;
      stats.cancelled = statsData.filter(apt => apt.status === 'cancelled').length;

      const today = new Date().toISOString().split('T')[0];
      stats.today = statsData.filter(apt => apt.appointment_date === today).length;
    }

    return NextResponse.json({
      appointments: appointments?.map(apt => ({
        id: apt.id,
        appointmentDate: apt.appointment_date,
        appointmentTime: apt.appointment_time,
        status: apt.status,
        appointmentType: apt.appointment_type,
        reasonForVisit: apt.reason_for_visit,
        assignedQueueNumber: apt.assigned_queue_number,
        durationMinutes: apt.duration_minutes,
        notes: apt.notes,
        createdAt: apt.created_at,
        updatedAt: apt.updated_at,
        patient: apt.patient ? {
          id: apt.patient.id,
          name: `${apt.patient.first_name} ${apt.patient.last_name}`,
          email: apt.patient.email,
          phoneNumber: apt.patient.phone_number,
        } : null,
        doctor: apt.doctor ? {
          id: apt.doctor.id,
          name: `${apt.doctor.first_name} ${apt.doctor.last_name}`,
          email: apt.doctor.email,
          specialization: apt.doctor.doctor_profiles?.[0]?.specialization,
          department: apt.doctor.doctor_profiles?.[0]?.departments?.name,
        } : null,
      })) || [],
      statistics: stats,
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Get admin appointments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}