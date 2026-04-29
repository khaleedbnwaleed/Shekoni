import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, generateAccessToken, generateRefreshToken } from '@/lib/auth';
import { LoginRequest } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();

    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Missing email or password' },
        { status: 400 }
      );
    }

    // Authenticate user
    const result = await authenticateUser(body.email, body.password);

    if (!result) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const { user } = result;

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'User account is inactive' },
        { status: 403 }
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

    // Update last login timestamp
    const { supabaseServer } = await import('@/lib/supabase');
    await supabaseServer
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id);

    // Prepare response
    const response = NextResponse.json(
      {
        message: 'Login successful',
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
      { status: 200 }
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
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
