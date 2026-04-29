import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, generateAccessToken, generateRefreshToken, getUserById } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token found' },
        { status: 401 }
      );
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    if (!payload) {
      const response = NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      );
      // Clear invalid refresh token
      response.cookies.delete('refreshToken');
      return response;
    }

    // Get fresh user data
    const user = await getUserById(payload.userId);

    if (!user || !user.isActive) {
      const response = NextResponse.json(
        { error: 'User not found or inactive' },
        { status: 401 }
      );
      response.cookies.delete('refreshToken');
      return response;
    }

    // Generate new access token
    const newAccessToken = generateAccessToken({
      userId: user.id,
      userType: user.userType,
      email: user.email,
    });

    // Optionally rotate refresh token
    const newRefreshToken = generateRefreshToken({
      userId: user.id,
      userType: user.userType,
      email: user.email,
    });

    const response = NextResponse.json(
      {
        message: 'Token refreshed successfully',
        accessToken: newAccessToken,
      },
      { status: 200 }
    );

    // Update refresh token cookie
    response.cookies.set({
      name: 'refreshToken',
      value: newRefreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
