import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabase';

/**
 * GET /api/doctors/queue - Get today's queue status
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
    const { data: doctorRecord, error: docError } = await supabaseServer
      .from('doctors')
      .select('id')
      .eq('user_id', payload.userId)
      .single();

    if (docError || !doctorRecord) {
      return NextResponse.json(
        { error: 'Doctor profile not found' },
        { status: 404 }
      );
    }

    const today = new Date().toISOString().split('T')[0];

    // Get queue stats
    const { data: queueData, error: statsError } = await supabaseServer
      .from('queue_management')
      .select('*')
      .eq('doctor_id', doctorRecord.id)
      .eq('date', today);

    if (statsError) {
      console.error('Queue stats error:', statsError);
    }

    // Calculate stats
    const stats = {
      total_count: queueData?.length || 0,
      waiting_count: queueData?.filter(q => q.status === 'waiting').length || 0,
      in_service_count: queueData?.filter(q => q.status === 'in_service').length || 0,
      completed_count: queueData?.filter(q => q.status === 'completed').length || 0,
      avg_wait_time: queueData?.reduce((sum, q) => sum + (q.actual_wait_time || 0), 0) / (queueData?.length || 1) || 0,
    };

    // Get detailed queue
    const { data: queueDetails, error: queueError } = await supabaseServer
      .from('queue_management')
      .select(`
        id,
        queue_number,
        status,
        estimated_wait_time,
        actual_wait_time,
        check_in_time,
        service_start_time,
        appointments (
          appointment_time,
          users!patient_id (
            first_name,
            last_name,
            phone_number
          )
        )
      `)
      .eq('doctor_id', doctorRecord.id)
      .eq('date', today)
      .order('status', { ascending: false })
      .order('queue_number', { ascending: true });

    if (queueError) {
      console.error('Queue details error:', queueError);
      return NextResponse.json(
        { error: 'Failed to fetch queue details' },
        { status: 500 }
      );
    }

    const formattedQueue = queueDetails.map(q => ({
      id: q.id,
      queueNumber: q.queue_number,
      status: q.status,
      patientName: `${q.appointments?.[0]?.users?.[0]?.first_name || ''} ${q.appointments?.[0]?.users?.[0]?.last_name || ''}`.trim(),
      phoneNumber: q.appointments?.[0]?.users?.[0]?.phone_number,
      appointmentTime: q.appointments?.[0]?.appointment_time,
      estimatedWaitTime: q.estimated_wait_time,
      actualWaitTime: q.actual_wait_time,
      checkInTime: q.check_in_time,
      serviceStartTime: q.service_start_time,
    }));

    return NextResponse.json({
      date: today,
      statistics: {
        total: stats.total_count || 0,
        waiting: stats.waiting_count || 0,
        inService: stats.in_service_count || 0,
        completed: stats.completed_count || 0,
        averageWaitTime: stats.avg_wait_time || 0,
      },
      queue: formattedQueue,
    });
  } catch (error) {
    console.error('Get queue status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
