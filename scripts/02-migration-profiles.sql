-- Hospital Service Platform - Database Migration
-- Migration: Add Profile Tables for Better User Management
-- This migration adds profile tables to match the admin API expectations
-- Date: April 7, 2026

-- ============================================================================
-- MIGRATION: Add Profile Tables
-- ============================================================================

-- Create doctor_profiles table (separate from doctors table for flexibility)
CREATE TABLE IF NOT EXISTS doctor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    specialization VARCHAR(255),
    license_number VARCHAR(100),
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    is_available BOOLEAN DEFAULT true,
    bio TEXT,
    profile_image_url VARCHAR(500),
    consultation_fee DECIMAL(10, 2),
    working_days JSONB DEFAULT '["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]',
    working_hours_start TIME DEFAULT '08:00:00',
    working_hours_end TIME DEFAULT '17:00:00',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create staff_profiles table
CREATE TABLE IF NOT EXISTS staff_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    position VARCHAR(255),
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    employee_id VARCHAR(50),
    hire_date DATE,
    salary DECIMAL(12, 2),
    supervisor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create patient_profiles table
CREATE TABLE IF NOT EXISTS patient_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    emergency_contact VARCHAR(255),
    medical_history TEXT,
    allergies TEXT,
    blood_type VARCHAR(10),
    insurance_provider VARCHAR(255),
    insurance_number VARCHAR(100),
    preferred_language VARCHAR(50),
    medical_record_number VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- MIGRATION: Update Appointments Table
-- ============================================================================

-- Update appointments table to reference users directly instead of doctors table
-- This allows appointments to be made with any user type that has doctor profile
ALTER TABLE appointments
DROP CONSTRAINT IF EXISTS appointments_doctor_id_fkey;

ALTER TABLE appointments
ADD CONSTRAINT appointments_doctor_id_fkey
FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE RESTRICT;

-- Update existing appointments to use user_id from doctors table
UPDATE appointments
SET doctor_id = d.user_id
FROM doctors d
WHERE appointments.doctor_id = d.id;

-- ============================================================================
-- MIGRATION: Migrate Existing Data
-- ============================================================================

-- Migrate data from doctors table to doctor_profiles
INSERT INTO doctor_profiles (
    user_id,
    specialization,
    license_number,
    department_id,
    is_available,
    bio,
    profile_image_url,
    consultation_fee,
    working_days,
    working_hours_start,
    working_hours_end,
    created_at,
    updated_at
)
SELECT
    user_id,
    specialization,
    license_number,
    department_id,
    is_available,
    bio,
    profile_image_url,
    consultation_fee,
    working_days,
    working_hours_start,
    working_hours_end,
    created_at,
    updated_at
FROM doctors
ON CONFLICT (user_id) DO NOTHING;

-- Migrate emergency_contact and medical_history from users to patient_profiles
INSERT INTO patient_profiles (
    user_id,
    emergency_contact,
    medical_history,
    created_at,
    updated_at
)
SELECT
    id,
    emergency_contact,
    NULL, -- medical_history not in users table
    created_at,
    updated_at
FROM users
WHERE user_type = 'patient'
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================================
-- MIGRATION: Update Indexes
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_doctor_profiles_user ON doctor_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_doctor_profiles_department ON doctor_profiles(department_id);
CREATE INDEX IF NOT EXISTS idx_doctor_profiles_specialization ON doctor_profiles(specialization);

CREATE INDEX IF NOT EXISTS idx_staff_profiles_user ON staff_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_staff_profiles_department ON staff_profiles(department_id);
CREATE INDEX IF NOT EXISTS idx_staff_profiles_position ON staff_profiles(position);

CREATE INDEX IF NOT EXISTS idx_patient_profiles_user ON patient_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_patient_profiles_medical_record ON patient_profiles(medical_record_number);

-- ============================================================================
-- MIGRATION: Update Triggers
-- ============================================================================

-- Add update triggers for new profile tables
CREATE TRIGGER update_doctor_profiles_updated_at BEFORE UPDATE ON doctor_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_profiles_updated_at BEFORE UPDATE ON staff_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patient_profiles_updated_at BEFORE UPDATE ON patient_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- MIGRATION: Update Views
-- ============================================================================

-- Update v_doctor_today_appointments view to use doctor_profiles
CREATE OR REPLACE VIEW v_doctor_today_appointments AS
SELECT
    a.id,
    a.appointment_time,
    a.status,
    a.appointment_type,
    a.reason_for_visit,
    u.first_name,
    u.last_name,
    u.phone_number,
    u.email,
    a.assigned_queue_number,
    q.queue_number,
    q.status as queue_status,
    dp.specialization,
    d.name as department_name
FROM appointments a
JOIN users u ON a.patient_id = u.id
LEFT JOIN queue_management q ON a.id = q.appointment_id
LEFT JOIN doctor_profiles dp ON a.doctor_id = dp.user_id
LEFT JOIN departments d ON dp.department_id = d.id
WHERE a.appointment_date = CURRENT_DATE
ORDER BY a.appointment_time;

-- Update v_available_slots view to use doctor_profiles
CREATE OR REPLACE VIEW v_available_slots AS
SELECT
    da.id,
    da.doctor_id,
    dp.user_id,
    u.first_name,
    u.last_name,
    da.date,
    da.time_slot_start,
    da.time_slot_end,
    da.max_appointments_per_slot,
    da.current_appointments,
    (da.max_appointments_per_slot - da.current_appointments) as available_slots,
    dp.specialization,
    d.name as department_name
FROM doctor_availability da
JOIN doctor_profiles dp ON da.doctor_id = dp.id
JOIN users u ON dp.user_id = u.id
LEFT JOIN departments d ON dp.department_id = d.id
WHERE da.is_available = true
    AND da.date >= CURRENT_DATE
    AND (da.max_appointments_per_slot - da.current_appointments) > 0
ORDER BY da.date, da.time_slot_start;

-- ============================================================================
-- MIGRATION: Add Admin Dashboard Views
-- ============================================================================

-- View for admin dashboard statistics
CREATE OR REPLACE VIEW v_admin_dashboard_stats AS
SELECT
    -- User statistics
    (SELECT COUNT(*) FROM users WHERE user_type = 'patient' AND is_active = true) as active_patients,
    (SELECT COUNT(*) FROM users WHERE user_type = 'doctor' AND is_active = true) as active_doctors,
    (SELECT COUNT(*) FROM users WHERE user_type = 'staff' AND is_active = true) as active_staff,
    (SELECT COUNT(*) FROM users WHERE user_type = 'admin' AND is_active = true) as active_admins,
    (SELECT COUNT(*) FROM users WHERE is_active = true) as total_active_users,

    -- Appointment statistics
    (SELECT COUNT(*) FROM appointments) as total_appointments,
    (SELECT COUNT(*) FROM appointments WHERE status = 'completed') as completed_appointments,
    (SELECT COUNT(*) FROM appointments WHERE status = 'scheduled') as scheduled_appointments,
    (SELECT COUNT(*) FROM appointments WHERE status = 'cancelled') as cancelled_appointments,
    (SELECT COUNT(*) FROM appointments WHERE appointment_type = 'telemedicine') as telemedicine_appointments,
    (SELECT COUNT(*) FROM appointments WHERE appointment_date = CURRENT_DATE) as today_appointments,

    -- Department statistics
    (SELECT COUNT(*) FROM departments WHERE is_active = true) as active_departments,

    -- Performance metrics
    (SELECT ROUND(AVG(actual_wait_time)) FROM queue_management WHERE actual_wait_time IS NOT NULL AND date = CURRENT_DATE) as avg_wait_time_today,
    (SELECT
        CASE
            WHEN COUNT(*) > 0 THEN ROUND((COUNT(CASE WHEN status = 'completed' THEN 1 END)::decimal / COUNT(*)::decimal) * 100)
            ELSE 0
        END
     FROM appointments) as completion_rate;

-- View for department statistics with doctor counts
CREATE OR REPLACE VIEW v_department_stats AS
SELECT
    d.id,
    d.name,
    d.description,
    COUNT(dp.id) as doctor_count,
    COUNT(CASE WHEN dp.is_available THEN 1 END) as available_doctors,
    d.is_active
FROM departments d
LEFT JOIN doctor_profiles dp ON d.id = dp.department_id
GROUP BY d.id, d.name, d.description, d.is_active
ORDER BY doctor_count DESC;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Note: After running this migration, you can optionally drop the old 'doctors' table
-- if all data has been successfully migrated and tested:
-- DROP TABLE IF EXISTS doctors CASCADE;

-- Also update any application code that references the old 'doctors' table
-- to use 'doctor_profiles' instead.