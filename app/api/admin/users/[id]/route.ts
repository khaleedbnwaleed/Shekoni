import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabase';

/**
 * GET /api/admin/users/[id] - Get a specific user
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const userId = params.id;

    const { data: user, error } = await supabaseServer
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
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      console.error('Failed to fetch user:', error);
      throw error;
    }

    return NextResponse.json({
      user: {
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
      },
    });
  } catch (error) {
    console.error('Get admin user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/users/[id] - Update a user
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
        { error: 'Only admins can update users' },
        { status: 403 }
      );
    }

    const userId = params.id;
    const body = await request.json();

    // Update user basic info
    const updateData: any = {};
    if (body.firstName !== undefined) updateData.first_name = body.firstName;
    if (body.lastName !== undefined) updateData.last_name = body.lastName;
    if (body.phoneNumber !== undefined) updateData.phone_number = body.phoneNumber;
    if (body.dateOfBirth !== undefined) updateData.date_of_birth = body.dateOfBirth;
    if (body.gender !== undefined) updateData.gender = body.gender;
    if (body.address !== undefined) updateData.address = body.address;
    if (body.isActive !== undefined) updateData.is_active = body.isActive;

    if (Object.keys(updateData).length > 0) {
      const { error: userError } = await supabaseServer
        .from('users')
        .update(updateData)
        .eq('id', userId);

      if (userError) {
        console.error('Failed to update user:', userError);
        throw userError;
      }
    }

    // Update profile based on user type
    if (body.profile) {
      if (body.userType === 'doctor') {
        const { error: profileError } = await supabaseServer
          .from('doctor_profiles')
          .update({
            specialization: body.profile.specialization,
            license_number: body.profile.licenseNumber,
            department_id: body.profile.departmentId,
            is_available: body.profile.isAvailable,
          })
          .eq('user_id', userId);

        if (profileError) {
          console.error('Failed to update doctor profile:', profileError);
        }
      } else if (body.userType === 'staff') {
        const { error: profileError } = await supabaseServer
          .from('staff_profiles')
          .update({
            position: body.profile.position,
            department_id: body.profile.departmentId,
          })
          .eq('user_id', userId);

        if (profileError) {
          console.error('Failed to update staff profile:', profileError);
        }
      }
    }

    return NextResponse.json({
      message: 'User updated successfully',
    });
  } catch (error) {
    console.error('Update admin user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[id] - Delete a user
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
        { error: 'Only admins can delete users' },
        { status: 403 }
      );
    }

    const userId = params.id;

    // Soft delete by setting is_active to false instead of hard delete
    const { error } = await supabaseServer
      .from('users')
      .update({ is_active: false })
      .eq('id', userId);

    if (error) {
      console.error('Failed to delete user:', error);
      throw error;
    }

    return NextResponse.json({
      message: 'User deactivated successfully',
    });
  } catch (error) {
    console.error('Delete admin user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}