import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabase';

/**
 * GET /api/patients/profile - Get patient profile
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

    if (!payload || payload.userType !== 'patient') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { data: user, error } = await supabaseServer
      .from('users')
      .select('id, email, first_name, last_name, phone_number, date_of_birth, gender, address, emergency_contact, created_at, updated_at')
      .eq('id', payload.userId)
      .eq('user_type', 'patient')
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phoneNumber: user.phone_number,
        dateOfBirth: user.date_of_birth,
        gender: user.gender,
        address: user.address,
        emergencyContact: user.emergency_contact,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    });
  } catch (error) {
    console.error('Get patient profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/patients/profile - Update patient profile
 */
export async function PUT(request: NextRequest) {
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
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate input
    const allowedFields = ['firstName', 'lastName', 'phoneNumber', 'dateOfBirth', 'gender', 'address', 'emergencyContact'];
    const updates: any = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        const dbField = field.replace(/([A-Z])/g, '_$1').toLowerCase();
        updates[dbField] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    const { data: updatedUser, error: updateError } = await supabaseServer
      .from('users')
      .update(updates)
      .eq('id', payload.userId)
      .eq('user_type', 'patient')
      .select('id, email, first_name, last_name, phone_number, date_of_birth, gender, address, emergency_contact')
      .single();

    if (updateError || !updatedUser) {
      return NextResponse.json(
        { error: 'Patient not found or update failed' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        phoneNumber: updatedUser.phone_number,
        dateOfBirth: updatedUser.date_of_birth,
        gender: updatedUser.gender,
        address: updatedUser.address,
        emergencyContact: updatedUser.emergency_contact,
      },
    });
  } catch (error) {
    console.error('Update patient profile error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
