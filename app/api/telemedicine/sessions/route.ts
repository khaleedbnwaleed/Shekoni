import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabase';

/**
 * POST /api/telemedicine/sessions - Start a telemedicine session
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

    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();

    if (!body.appointmentId) {
      return NextResponse.json(
        { error: 'appointmentId is required' },
        { status: 400 }
      );
    }

    // Get appointment details
    const { data: appointment, error: aptError } = await supabaseServer
      .from('appointments')
      .select('id, patient_id, doctor_id, status, appointment_type')
      .eq('id', body.appointmentId)
      .eq('appointment_type', 'telemedicine')
      .single();

    if (aptError || !appointment) {
      return NextResponse.json(
        { error: 'Appointment not found or is not a telemedicine appointment' },
        { status: 404 }
      );
    }

    // Verify user is either the patient or doctor
    const isPatient = payload.userType === 'patient' && appointment.patient_id === payload.userId;
    const { data: doctorRecord, error: docError } = await supabaseServer
      .from('doctors')
      .select('id')
      .eq('user_id', payload.userId)
      .single();
    const isDoctor = payload.userType === 'doctor' && doctorRecord?.id === appointment.doctor_id;

    if (!isPatient && !isDoctor) {
      return NextResponse.json(
        { error: 'You are not authorized for this telemedicine session' },
        { status: 403 }
      );
    }

    // Check if session already exists
    const { data: existingSession, error: sessionError } = await supabaseServer
      .from('telemedicine_sessions')
      .select('id, agora_channel_name, agora_token')
      .eq('appointment_id', body.appointmentId)
      .neq('status', 'cancelled')
      .single();

    if (existingSession) {
      return NextResponse.json({
        session: {
          id: existingSession.id,
          appointmentId: body.appointmentId,
          channelName: existingSession.agora_channel_name,
          token: existingSession.agora_token,
          status: 'active',
        },
      });
    }

    // Create new telemedicine session
    // In production, you would integrate with Agora SDK to generate real tokens
    const channelName = `appointment-${body.appointmentId}`;
    const agoraToken = `temp-token-${Date.now()}-${Math.random()}`; // Placeholder

    const { data: session, error: createError } = await supabaseServer
      .from('telemedicine_sessions')
      .insert([{
        appointment_id: body.appointmentId,
        agora_channel_name: channelName,
        agora_token: agoraToken,
        doctor_id: appointment.doctor_id,
        patient_id: appointment.patient_id,
        session_start: new Date().toISOString(),
        status: 'active'
      }])
      .select('id')
      .single();

    if (createError || !session) {
      return NextResponse.json(
        { error: 'Failed to create telemedicine session' },
        { status: 500 }
      );
    }

    // Update appointment status
    const { error: updateError } = await supabaseServer
      .from('appointments')
      .update({ status: 'in_progress' })
      .eq('id', body.appointmentId);

    if (updateError) {
      console.error('Failed to update appointment status:', updateError);
      // Continue anyway
    }

    return NextResponse.json({
      session: {
        id: session.id,
        appointmentId: body.appointmentId,
        channelName,
        token: agoraToken,
        status: 'active',
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Create telemedicine session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/telemedicine/sessions/:appointmentId - Get session details
 */
export async function GET(request: NextRequest) {
  try {
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

    const searchParams = request.nextUrl.searchParams;
    const appointmentId = searchParams.get('appointmentId');

    if (!appointmentId) {
      return NextResponse.json(
        { error: 'appointmentId is required' },
        { status: 400 }
      );
    }

    const { data: session, error } = await supabaseServer
      .from('telemedicine_sessions')
      .select('id, appointment_id, agora_channel_name, agora_token, status, session_start, session_end')
      .eq('appointment_id', appointmentId)
      .single();

    if (error || !session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      session: {
        id: session.id,
        appointmentId: session.appointment_id,
        channelName: session.agora_channel_name,
        token: session.agora_token,
        status: session.status,
        sessionStart: session.session_start,
        sessionEnd: session.session_end,
      },
    });
  } catch (error) {
    console.error('Get telemedicine session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
