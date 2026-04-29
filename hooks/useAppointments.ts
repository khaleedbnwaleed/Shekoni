'use client';

import { useState, useCallback, useEffect } from 'react';
import { apiGet, apiPost, apiPatch } from '@/lib/api-client';
import { useAuth } from './useAuth';

interface AvailableSlot {
  id: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  departmentName: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  availableSlots: number;
  totalSlots: number;
}

interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  departmentName: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  appointmentType: 'in_person' | 'telemedicine';
  reasonForVisit?: string;
  queueNumber?: string;
  durationMinutes: number;
}

interface AppointmentsState {
  appointments: Appointment[];
  availableSlots: AvailableSlot[];
  loading: boolean;
  error: string | null;
}

export function useAppointments() {
  const { isAuthenticated, accessToken } = useAuth();
  const [state, setState] = useState<AppointmentsState>({
    appointments: [],
    availableSlots: [],
    loading: false,
    error: null,
  });

  // Fetch appointments
  const fetchAppointments = useCallback(async () => {
    if (!isAuthenticated || !accessToken) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiGet('/api/appointments');

      if (response.success) {
        setState((prev) => ({
          ...prev,
          appointments: response.data.appointments || [],
          loading: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: response.error || 'Failed to fetch appointments',
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch appointments',
      }));
    }
  }, [isAuthenticated, accessToken]);

  // Fetch available slots
  const fetchAvailableSlots = useCallback(
    async (date?: string, doctorId?: string, departmentId?: string) => {
      if (!isAuthenticated || !accessToken) return;

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const params = new URLSearchParams();
        if (date) params.append('date', date);
        if (doctorId) params.append('doctorId', doctorId);
        if (departmentId) params.append('departmentId', departmentId);

        const endpoint = `/api/appointments/available-slots${params.toString() ? '?' + params.toString() : ''}`;
        const response = await apiGet(endpoint);

        if (response.success) {
          setState((prev) => ({
            ...prev,
            availableSlots: response.data.slots || [],
            loading: false,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: response.error || 'Failed to fetch available slots',
          }));
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch available slots',
        }));
      }
    },
    [isAuthenticated, accessToken]
  );

  // Book appointment
  const bookAppointment = useCallback(
    async (data: {
      doctorId: string;
      appointmentDate: string;
      appointmentTime: string;
      appointmentType: string;
      reasonForVisit?: string;
    }) => {
      if (!isAuthenticated || !accessToken) {
        return { success: false, error: 'Not authenticated' };
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await apiPost('/api/appointments', data);

        if (response.success) {
          // Refresh appointments list
          await fetchAppointments();
          setState((prev) => ({
            ...prev,
            loading: false,
          }));
          return { success: true, appointment: response.data.appointment };
        } else {
          const error = response.error || 'Failed to book appointment';
          setState((prev) => ({
            ...prev,
            loading: false,
            error,
          }));
          return { success: false, error };
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Failed to book appointment';
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMsg,
        }));
        return { success: false, error: errorMsg };
      }
    },
    [isAuthenticated, accessToken, fetchAppointments]
  );

  // Cancel appointment
  const cancelAppointment = useCallback(
    async (appointmentId: string, reason?: string) => {
      if (!isAuthenticated || !accessToken) {
        return { success: false, error: 'Not authenticated' };
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await apiPatch(`/api/appointments/${appointmentId}/cancel`, { reason });

        if (response.success) {
          // Refresh appointments list
          await fetchAppointments();
          setState((prev) => ({
            ...prev,
            loading: false,
          }));
          return { success: true };
        } else {
          const error = response.error || 'Failed to cancel appointment';
          setState((prev) => ({
            ...prev,
            loading: false,
            error,
          }));
          return { success: false, error };
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Failed to cancel appointment';
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMsg,
        }));
        return { success: false, error: errorMsg };
      }
    },
    [isAuthenticated, accessToken, fetchAppointments]
  );

  // Fetch appointments on mount
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return {
    ...state,
    fetchAppointments,
    fetchAvailableSlots,
    bookAppointment,
    cancelAppointment,
  };
}
