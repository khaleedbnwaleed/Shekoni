import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabase';
import { createUser } from '@/lib/auth';

/**
 * GET /api/admin/users - Get all users with filtering and pagination
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
    const userType = searchParams.get('userType');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let query = supabaseServer
      .from('users')
      .select(`
        id,
        email,
        first_name,
        last_name,
        phone_number,
        user_type,
        date_of_birth,
        gender,
        address,
        is_active,
        created_at,
        updated_at,
        doctor_profiles (
          id,
          specialization,
          license_number,
          is_available,
          department_id,
          departments (
            id,
            name
          )
        ),
        patient_profiles (
          id,
          emergency_contact,
          medical_history
        ),
        staff_profiles (
          id,
          position,
          department_id,
          departments (
            id,
            name
          )
        )
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (userType) {
      query = query.eq('user_type', userType);
    }

    if (status === 'active') {
      query = query.eq('is_active', true);
    } else if (status === 'inactive') {
      query = query.eq('is_active', false);
    }

    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: users, error, count } = await query;

    if (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }

    // Get total count for pagination
    const { count: totalCount } = await supabaseServer
      .from('users')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      users: users?.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phoneNumber: user.phone_number,
        userType: user.user_type,
        dateOfBirth: user.date_of_birth,
        gender: user.gender,
        address: user.address,
        isActive: user.is_active,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        profile: user.doctor_profiles?.[0] || user.patient_profiles?.[0] || user.staff_profiles?.[0] || null,
      })) || [],
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Get admin users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/users - Create a new user
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

    if (!payload || payload.userType !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can create users' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.email || !body.password || !body.firstName || !body.lastName || !body.userType) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, firstName, lastName, userType' },
        { status: 400 }
      );
    }

    // Validate user type
    const validUserTypes = ['patient', 'doctor', 'admin', 'staff'];
    if (!validUserTypes.includes(body.userType)) {
      return NextResponse.json(
        { error: 'Invalid user type. Must be one of: patient, doctor, admin, staff' },
        { status: 400 }
      );
    }

    // Create user
    const user = await createUser({
      email: body.email,
      password: body.password,
      firstName: body.firstName,
      lastName: body.lastName,
      phoneNumber: body.phoneNumber,
      userType: body.userType,
      dateOfBirth: body.dateOfBirth,
      gender: body.gender,
      address: body.address,
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Create profile based on user type
    if (body.userType === 'doctor' && body.specialization) {
      const { error: profileError } = await supabaseServer
        .from('doctor_profiles')
        .insert({
          user_id: user.id,
          specialization: body.specialization,
          license_number: body.licenseNumber,
          department_id: body.departmentId,
          is_available: true,
        });

      if (profileError) {
        console.error('Failed to create doctor profile:', profileError);
        // Don't fail the whole request, just log the error
      }
    } else if (body.userType === 'staff' && body.position) {
      const { error: profileError } = await supabaseServer
        .from('staff_profiles')
        .insert({
          user_id: user.id,
          position: body.position,
          department_id: body.departmentId,
        });

      if (profileError) {
        console.error('Failed to create staff profile:', profileError);
      }
    }

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create admin user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}