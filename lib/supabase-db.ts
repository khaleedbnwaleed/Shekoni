import { supabaseServer } from './supabase';

/**
 * Supabase Database Utilities
 * Common operations for the hospital management system
 */

// Users
export async function getUser(userId: string) {
  const { data, error } = await supabaseServer
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw new Error(`Failed to get user: ${error.message}`);
  return data;
}

export async function getUserByEmail(email: string) {
  const { data, error } = await supabaseServer
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to get user: ${error.message}`);
  }
  return data || null;
}

export async function createUser(userData: {
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  user_type: 'patient' | 'doctor' | 'admin' | 'staff';
}) {
  const { data, error } = await supabaseServer
    .from('users')
    .insert([userData])
    .select()
    .single();

  if (error) throw new Error(`Failed to create user: ${error.message}`);
  return data;
}

// Departments
export async function getDepartments() {
  const { data, error } = await supabaseServer
    .from('departments')
    .select('*')
    .order('name');

  if (error) throw new Error(`Failed to get departments: ${error.message}`);
  return data;
}

export async function getDepartment(id: string) {
  const { data, error } = await supabaseServer
    .from('departments')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(`Failed to get department: ${error.message}`);
  return data;
}

// Doctors
export async function getDoctors(departmentId?: string) {
  let query = supabaseServer
    .from('doctors')
    .select('*, users(*), departments(*)');

  if (departmentId) {
    query = query.eq('department_id', departmentId);
  }

  const { data, error } = await query;

  if (error) throw new Error(`Failed to get doctors: ${error.message}`);
  return data;
}

export async function getDoctor(id: string) {
  const { data, error } = await supabaseServer
    .from('doctors')
    .select('*, users(*), departments(*)')
    .eq('id', id)
    .single();

  if (error) throw new Error(`Failed to get doctor: ${error.message}`);
  return data;
}

// Appointments
export async function getAppointments(filters?: {
  patientId?: string;
  doctorId?: string;
  status?: string;
}) {
  let query = supabaseServer
    .from('appointments')
    .select('*, patients:patient_id(*), doctors(*, users(*)), departments(*)');

  if (filters?.patientId) {
    query = query.eq('patient_id', filters.patientId);
  }
  if (filters?.doctorId) {
    query = query.eq('doctor_id', filters.doctorId);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query.order('appointment_date');

  if (error) throw new Error(`Failed to get appointments: ${error.message}`);
  return data;
}

export async function createAppointment(appointmentData: {
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}) {
  const { data, error } = await supabaseServer
    .from('appointments')
    .insert([{
      ...appointmentData,
      status: appointmentData.status || 'pending'
    }])
    .select()
    .single();

  if (error) throw new Error(`Failed to create appointment: ${error.message}`);
  return data;
}

export async function updateAppointment(
  appointmentId: string,
  updates: {
    status?: string;
    appointment_date?: string;
    appointment_time?: string;
  }
) {
  const { data, error } = await supabaseServer
    .from('appointments')
    .update(updates)
    .eq('id', appointmentId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update appointment: ${error.message}`);
  return data;
}

// Notifications
export async function createNotification(notificationData: {
  user_id: string;
  title: string;
  message: string;
  type: string;
  data?: any;
}) {
  const { data, error } = await supabaseServer
    .from('notifications')
    .insert([notificationData])
    .select()
    .single();

  if (error) throw new Error(`Failed to create notification: ${error.message}`);
  return data;
}

export async function getNotifications(userId: string) {
  const { data, error } = await supabaseServer
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to get notifications: ${error.message}`);
  return data;
}