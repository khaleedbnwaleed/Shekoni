'use client';

import { useState, useCallback, useEffect } from 'react';
import { apiGet, apiPut } from '@/lib/api-client';
import { useAuth } from './useAuth';

interface PatientProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  emergencyContact?: string;
  createdAt: string;
  updatedAt: string;
}

interface PatientState {
  profile: PatientProfile | null;
  loading: boolean;
  error: string | null;
}

export function usePatient() {
  const { isAuthenticated, accessToken } = useAuth();
  const [patientState, setPatientState] = useState<PatientState>({
    profile: null,
    loading: false,
    error: null,
  });

  // Fetch patient profile
  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated || !accessToken) return;

    setPatientState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiGet('/api/patients/profile');

      if (response.success) {
        setPatientState({
          profile: response.data.user,
          loading: false,
          error: null,
        });
      } else {
        setPatientState({
          profile: null,
          loading: false,
          error: response.error || 'Failed to fetch profile',
        });
      }
    } catch (error) {
      setPatientState({
        profile: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch profile',
      });
    }
  }, [isAuthenticated, accessToken]);

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Update profile
  const updateProfile = useCallback(
    async (updates: Partial<PatientProfile>) => {
      if (!isAuthenticated || !accessToken) return { success: false, error: 'Not authenticated' };

      setPatientState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await apiPut('/api/patients/profile', updates);

        if (response.success) {
          setPatientState({
            profile: response.data.user,
            loading: false,
            error: null,
          });
          return { success: true };
        } else {
          const error = response.error || 'Failed to update profile';
          setPatientState((prev) => ({
            ...prev,
            loading: false,
            error,
          }));
          return { success: false, error };
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Failed to update profile';
        setPatientState((prev) => ({
          ...prev,
          loading: false,
          error: errorMsg,
        }));
        return { success: false, error: errorMsg };
      }
    },
    [isAuthenticated, accessToken]
  );

  return {
    ...patientState,
    fetchProfile,
    updateProfile,
  };
}
