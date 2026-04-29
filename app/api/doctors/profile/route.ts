import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabase';

/**
 * GET /api/doctors/profile - Get doctor profile
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

    const { data: doctorData, error } = await supabaseServer
      .from('doctors')
      .select(`
        id,
        user_id,
        license_number,
        specialization,
        department_id,
        bio,
        profile_image_url,
        consultation_fee,
        is_available,
        working_days,
        working_hours_start,
        working_hours_end,
        users (
          email,
          first_name,
          last_name,
          phone_number
        ),
        departments (
          name
        )
      `)
      .eq('user_id', payload.userId)
      .single();

    if (error || !doctorData) {
      return NextResponse.json(
        { error: 'Doctor profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      doctor: {
        id: doctorData.id,
        userId: doctorData.user_id,
        firstName: doctorData.users?.[0]?.first_name,
        lastName: doctorData.users?.[0]?.last_name,
        email: doctorData.users?.[0]?.email,
        phoneNumber: doctorData.users?.[0]?.phone_number,
        licenseNumber: doctorData.license_number,
        specialization: doctorData.specialization,
        departmentId: doctorData.department_id,
        departmentName: doctorData.departments?.[0]?.name,
        bio: doctorData.bio,
        profileImageUrl: doctorData.profile_image_url,
        consultationFee: doctorData.consultation_fee,
        isAvailable: doctorData.is_available,
        workingDays: doctorData.working_days,
        workingHoursStart: doctorData.working_hours_start,
        workingHoursEnd: doctorData.working_hours_end,
      },
    });
  } catch (error) {
    console.error('Get doctor profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
