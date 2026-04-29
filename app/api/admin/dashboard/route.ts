import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get user statistics
    const { data: userStats, error: userError } = await supabaseServer
      .from('users')
      .select('user_type');

    if (userError) throw userError;

    const users = {
      total: userStats?.length || 0,
      patients: userStats?.filter(u => u.user_type === 'patient').length || 0,
      doctors: userStats?.filter(u => u.user_type === 'doctor').length || 0,
      staff: userStats?.filter(u => u.user_type === 'staff').length || 0,
      admins: userStats?.filter(u => u.user_type === 'admin').length || 0,
    };

    // Get appointment statistics
    const { data: appointmentStats, error: appointmentError } = await supabaseServer
      .from('appointments')
      .select('status, appointment_type, appointment_date');

    if (appointmentError) throw appointmentError;

    const today = new Date().toISOString().split('T')[0];
    const appointments = {
      total: appointmentStats?.length || 0,
      completed: appointmentStats?.filter(a => a.status === 'completed').length || 0,
      scheduled: appointmentStats?.filter(a => a.status === 'scheduled').length || 0,
      cancelled: appointmentStats?.filter(a => a.status === 'cancelled').length || 0,
      telemedicine: appointmentStats?.filter(a => a.appointment_type === 'telemedicine').length || 0,
      today: appointmentStats?.filter(a => a.appointment_date === today).length || 0,
    };

    // Get department statistics
    const { data: departments, error: deptError } = await supabaseServer
      .from('departments')
      .select('id, name, is_active')
      .eq('is_active', true);

    if (deptError) throw deptError;

    // Get doctor profiles count per department
    const { data: doctorProfiles, error: docError } = await supabaseServer
      .from('doctor_profiles')
      .select('department_id, is_available');

    if (docError) throw docError;

    const departmentsList = (departments || []).map(dept => {
      const deptDoctors = doctorProfiles?.filter(d => d.department_id === dept.id) || [];
      return {
        id: dept.id,
        name: dept.name,
        doctorCount: deptDoctors.length,
        availableDoctors: deptDoctors.filter(d => d.is_available).length,
      };
    });

    // Calculate performance metrics
    const completedAppointments = appointmentStats?.filter(a => a.status === 'completed').length || 0;
    const totalAppointments = appointmentStats?.length || 0;
    const completionRate = totalAppointments > 0 
      ? Math.round((completedAppointments / totalAppointments) * 100)
      : 0;

    const performance = {
      averageWaitTime: 15,
      completionRate: completionRate,
    };

    return NextResponse.json({
      statistics: {
        users,
        appointments,
        performance,
        departments: departmentsList,
      },
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
