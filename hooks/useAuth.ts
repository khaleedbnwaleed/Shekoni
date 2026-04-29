'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/auth';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    accessToken: null,
    loading: true,
    error: null,
  });

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const userData = localStorage.getItem('user');

        if (token && userData) {
          setAuthState({
            user: JSON.parse(userData),
            accessToken: token,
            loading: false,
            error: null,
          });
        } else {
          setAuthState({
            user: null,
            accessToken: null,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthState({
          user: null,
          accessToken: null,
          loading: false,
          error: 'Failed to restore session',
        });
      }
    };

    checkAuth();
  }, []);

  const register = useCallback(
    async (data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      userType: string;
      phoneNumber?: string;
    }) => {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Registration failed');
        }

        const result = await response.json();
        const user = result.user;
        const accessToken = result.accessToken;

        // Store auth data
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify(user));

        setAuthState({
          user,
          accessToken,
          loading: false,
          error: null,
        });

        return { success: true, user };
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Registration failed';
        setAuthState((prev) => ({
          ...prev,
          loading: false,
          error: errorMsg,
        }));
        return { success: false, error: errorMsg };
      }
    },
    []
  );

  const login = useCallback(
    async (email: string, password: string) => {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Login failed');
        }

        const result = await response.json();
        const user = result.user;
        const accessToken = result.accessToken;

        // Store auth data
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify(user));

        setAuthState({
          user,
          accessToken,
          loading: false,
          error: null,
        });

        return { success: true, user };
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Login failed';
        setAuthState((prev) => ({
          ...prev,
          loading: false,
          error: errorMsg,
        }));
        return { success: false, error: errorMsg };
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, loading: true }));

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear auth data regardless of API response
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');

      setAuthState({
        user: null,
        accessToken: null,
        loading: false,
        error: null,
      });

      router.push('/login');
    }
  }, [router]);

  const refreshToken = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/refresh-token', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const result = await response.json();
      const newAccessToken = result.accessToken;

      localStorage.setItem('accessToken', newAccessToken);

      setAuthState((prev) => ({
        ...prev,
        accessToken: newAccessToken,
      }));

      return newAccessToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      await logout();
      return null;
    }
  }, [logout]);

  return {
    ...authState,
    register,
    login,
    logout,
    refreshToken,
    isAuthenticated: !!authState.user,
  };
}
