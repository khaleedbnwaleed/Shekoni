import { NextRequest, NextResponse } from 'next/server';
import { createUser, generateAccessToken, generateRefreshToken } from '@/lib/auth';
import { RegisterRequest } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();

    // Validate required fields
    if (!body.email || !body.password || !body.firstName || !body.lastName || !body.userType) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, firstName, lastName, userType' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength (at least 8 characters)
    if (body.password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Validate user type
    const validUserTypes = ['patient', 'doctor', 'admin', 'staff'];
    if (!validUserTypes.includes(body.userType)) {
      return NextResponse.json(
        { error: 'Invalid user type' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { supabaseServer } = await import('@/lib/supabase');
    const { data: existingUser } = await supabaseServer
      .from('users')
      .select('id')
      .eq('email', body.email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
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

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      userType: user.userType,
      email: user.email,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      userType: user.userType,
      email: user.email,
    });

    // Prepare response
    const response = NextResponse.json(
      {
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType,
          phoneNumber: user.phoneNumber,
        },
        accessToken,
      },
      { status: 201 }
    );

    // Set refresh token as HTTP-only cookie
    response.cookies.set({
      name: 'refreshToken',
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
