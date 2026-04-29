import { supabaseServer } from '@/lib/supabase';

export type NotificationType = 'appointment' | 'message' | 'alert' | 'reminder' | 'system';

interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  relatedAppointmentId?: string;
}

/**
 * Create a notification for a user
 */
export async function createNotification({
  userId,
  title,
  message,
  type,
  relatedAppointmentId,
}: CreateNotificationParams) {
  try {
    const { error } = await supabaseServer
      .from('notifications')
      .insert([{
        user_id: userId,
        title,
        message,
        notification_type: type,
        related_appointment_id: relatedAppointmentId || null,
        is_read: false,
        created_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Failed to create notification:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to create notification:', error);
    throw error;
  }
}

/**
 * Create appointment-related notifications for relevant users
 */
export async function notifyAppointmentCreated(appointmentId: string, patientId: string, doctorId: string) {
  try {
    // Notify patient
    await createNotification({
      userId: patientId,
      title: 'Appointment Scheduled',
      message: 'Your appointment has been successfully scheduled.',
      type: 'appointment',
      relatedAppointmentId: appointmentId,
    });

    // Notify doctor
    await createNotification({
      userId: doctorId,
      title: 'New Appointment',
      message: 'You have a new appointment scheduled.',
      type: 'appointment',
      relatedAppointmentId: appointmentId,
    });
  } catch (error) {
    console.error('Failed to notify appointment creation:', error);
  }
}

/**
 * Create appointment cancelled notifications
 */
export async function notifyAppointmentCancelled(appointmentId: string, patientId: string, doctorId: string, reason?: string) {
  try {
    const message = reason ? `Appointment cancelled: ${reason}` : 'Appointment has been cancelled.';

    // Notify patient
    await createNotification({
      userId: patientId,
      title: 'Appointment Cancelled',
      message,
      type: 'alert',
      relatedAppointmentId: appointmentId,
    });

    // Notify doctor
    await createNotification({
      userId: doctorId,
      title: 'Appointment Cancelled',
      message,
      type: 'alert',
      relatedAppointmentId: appointmentId,
    });
  } catch (error) {
    console.error('Failed to notify appointment cancellation:', error);
  }
}

/**
 * Create appointment reminder notifications
 */
export async function notifyAppointmentReminder(appointmentId: string, patientId: string, doctorId: string) {
  try {
    // Notify patient
    await createNotification({
      userId: patientId,
      title: 'Appointment Reminder',
      message: 'Your appointment is scheduled for soon.',
      type: 'reminder',
      relatedAppointmentId: appointmentId,
    });

    // Notify doctor
    await createNotification({
      userId: doctorId,
      title: 'Upcoming Appointment',
      message: 'You have an appointment coming up soon.',
      type: 'reminder',
      relatedAppointmentId: appointmentId,
    });
  } catch (error) {
    console.error('Failed to notify appointment reminder:', error);
  }
}

/**
 * Create prescription notifications
 */
export async function notifyPrescriptionAvailable(patientId: string, doctorName: string) {
  try {
    await createNotification({
      userId: patientId,
      title: 'New Prescription',
      message: `You have a new prescription from Dr. ${doctorName}. Please review it.`,
      type: 'message',
    });
  } catch (error) {
    console.error('Failed to notify prescription:', error);
  }
}

/**
 * Create system notifications (e.g., maintenance, updates)
 */
export async function notifySystemMessage(userId: string, title: string, message: string) {
  try {
    await createNotification({
      userId,
      title,
      message,
      type: 'system',
    });
  } catch (error) {
    console.error('Failed to send system notification:', error);
  }
}

/**
 * Broadcast system notification to all users
 */
export async function broadcastSystemNotification(title: string, message: string) {
  try {
    // Get all user IDs and insert notifications
    const { data: users, error: usersError } = await supabaseServer
      .from('users')
      .select('id');

    if (usersError) {
      console.error('Failed to get users for broadcast:', usersError);
      throw usersError;
    }

    if (users && users.length > 0) {
      const notifications = users.map(user => ({
        user_id: user.id,
        title,
        message,
        notification_type: 'system',
        is_read: false,
        created_at: new Date().toISOString()
      }));

      const { error } = await supabaseServer
        .from('notifications')
        .insert(notifications);

      if (error) {
        console.error('Failed to broadcast system notification:', error);
        throw error;
      }
    }
  } catch (error) {
    console.error('Failed to broadcast system notification:', error);
    throw error;
  }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(userId: string) {
  try {
    const { error } = await supabaseServer
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Failed to mark all notifications as read:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
    throw error;
  }
}

/**
 * Clear old notifications (older than 30 days)
 */
export async function clearOldNotifications() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { error } = await supabaseServer
      .from('notifications')
      .delete()
      .lt('created_at', thirtyDaysAgo.toISOString());

    if (error) {
      console.error('Failed to clear old notifications:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to clear old notifications:', error);
    throw error;
  }
}
