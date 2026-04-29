-- Hospital Service Platform - Database Schema
-- PostgreSQL Migration Script
-- Ensures idempotent execution with IF NOT EXISTS clauses

-- Create UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing objects in reverse dependency order (optional cleanup)
-- Uncomment if you want a fresh start
-- DROP TABLE IF EXISTS emr_integration_logs CASCADE;
-- DROP TABLE IF EXISTS admin_audit_logs CASCADE;
-- DROP TABLE IF EXISTS doctor_availability CASCADE;
-- DROP TABLE IF EXISTS chat_messages CASCADE;
-- DROP TABLE IF EXISTS telemedicine_sessions CASCADE;
-- DROP TABLE IF EXISTS notifications CASCADE;
-- DROP TABLE IF EXISTS queue_management CASCADE;
-- DROP TABLE IF EXISTS appointments CASCADE;
-- DROP TABLE IF EXISTS doctors CASCADE;
-- DROP TABLE IF EXISTS departments CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- ============================================================================
-- 1. USERS TABLE (Patients + Staff)
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10),
    address TEXT,
    emergency_contact VARCHAR(255),
    user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('patient', 'doctor', 'admin', 'staff')),
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- ============================================================================
-- 2. DEPARTMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    head_doctor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_departments_is_active ON departments(is_active);
CREATE INDEX IF NOT EXISTS idx_departments_head_doctor ON departments(head_doctor_id);

-- ============================================================================
-- 3. DOCTORS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    specialization VARCHAR(255) NOT NULL,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    bio TEXT,
    profile_image_url VARCHAR(500),
    consultation_fee DECIMAL(10, 2),
    is_available BOOLEAN DEFAULT true,
    working_days JSONB DEFAULT '["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]',
    working_hours_start TIME DEFAULT '08:00:00',
    working_hours_end TIME DEFAULT '17:00:00',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_doctors_user ON doctors(user_id);
CREATE INDEX IF NOT EXISTS idx_doctors_department ON doctors(department_id);
CREATE INDEX IF NOT EXISTS idx_doctors_license ON doctors(license_number);
CREATE INDEX IF NOT EXISTS idx_doctors_is_available ON doctors(is_available);

-- ============================================================================
-- 4. APPOINTMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled' 
        CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show')),
    appointment_type VARCHAR(50) NOT NULL 
        CHECK (appointment_type IN ('in_person', 'telemedicine')),
    reason_for_visit TEXT,
    queue_position INTEGER,
    assigned_queue_number VARCHAR(10),
    notes TEXT,
    is_reminder_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancelled_reason TEXT
);

CREATE INDEX IF NOT EXISTS idx_appointments_patient_date ON appointments(patient_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_date ON appointments(doctor_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_type ON appointments(appointment_type);
CREATE INDEX IF NOT EXISTS idx_appointments_appointment_date ON appointments(appointment_date);

-- ============================================================================
-- 5. QUEUE MANAGEMENT TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS queue_management (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    queue_number VARCHAR(10) NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'waiting'
        CHECK (status IN ('waiting', 'in_service', 'completed', 'no_show')),
    check_in_time TIMESTAMP WITH TIME ZONE,
    service_start_time TIMESTAMP WITH TIME ZONE,
    service_end_time TIMESTAMP WITH TIME ZONE,
    estimated_wait_time INTEGER,
    actual_wait_time INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(appointment_id)
);

CREATE INDEX IF NOT EXISTS idx_queue_doctor_date ON queue_management(doctor_id, date);
CREATE INDEX IF NOT EXISTS idx_queue_status ON queue_management(status);
CREATE INDEX IF NOT EXISTS idx_queue_queue_number ON queue_management(queue_number, date);

-- ============================================================================
-- 6. NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL 
        CHECK (notification_type IN ('sms', 'email', 'whatsapp', 'in_app')),
    message TEXT NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'sent', 'failed')),
    delivery_status VARCHAR(50)
        CHECK (delivery_status IN ('delivered', 'failed', 'bounced')),
    sent_at TIMESTAMP WITH TIME ZONE,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_status ON notifications(user_id, status);
CREATE INDEX IF NOT EXISTS idx_notifications_appointment ON notifications(appointment_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(notification_type);

-- ============================================================================
-- 7. TELEMEDICINE SESSIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS telemedicine_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID UNIQUE NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    agora_channel_name VARCHAR(255),
    agora_token TEXT,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_start TIMESTAMP WITH TIME ZONE,
    session_end TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    recording_url VARCHAR(500),
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled'
        CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_telemedicine_doctor ON telemedicine_sessions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_telemedicine_patient ON telemedicine_sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_telemedicine_status ON telemedicine_sessions(status);

-- ============================================================================
-- 8. CHAT MESSAGES TABLE (Doctor-Patient)
-- ============================================================================
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES telemedicine_sessions(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message_content TEXT NOT NULL,
    attachment_url VARCHAR(500),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_chat_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_sender ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_receiver ON chat_messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_chat_is_read ON chat_messages(is_read);

-- ============================================================================
-- 9. DOCTOR AVAILABILITY TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS doctor_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time_slot_start TIME NOT NULL,
    time_slot_end TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    max_appointments_per_slot INTEGER DEFAULT 1,
    current_appointments INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(doctor_id, date, time_slot_start)
);

CREATE INDEX IF NOT EXISTS idx_doctor_availability_doctor_date ON doctor_availability(doctor_id, date);
CREATE INDEX IF NOT EXISTS idx_doctor_availability_is_available ON doctor_availability(is_available);

-- ============================================================================
-- 10. ADMIN AUDIT LOG TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    changes JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_admin ON admin_audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON admin_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON admin_audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON admin_audit_logs(created_at);

-- ============================================================================
-- 11. EMR INTEGRATION LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS emr_integration_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('success', 'failure')),
    patient_emr_id VARCHAR(255),
    request_payload JSONB,
    response_payload JSONB,
    error_message TEXT,
    response_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_emr_status ON emr_integration_logs(status);
CREATE INDEX IF NOT EXISTS idx_emr_patient_id ON emr_integration_logs(patient_emr_id);
CREATE INDEX IF NOT EXISTS idx_emr_created_at ON emr_integration_logs(created_at);

-- ============================================================================
-- TRIGGERS & STORED PROCEDURES
-- ============================================================================

-- Update updated_at timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_queue_management_updated_at BEFORE UPDATE ON queue_management
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_telemedicine_sessions_updated_at BEFORE UPDATE ON telemedicine_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_messages_updated_at BEFORE UPDATE ON chat_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctor_availability_updated_at BEFORE UPDATE ON doctor_availability
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View: Doctor's today's appointments
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
    q.status as queue_status
FROM appointments a
JOIN users u ON a.patient_id = u.id
LEFT JOIN queue_management q ON a.id = q.appointment_id
WHERE a.appointment_date = CURRENT_DATE
ORDER BY a.appointment_time;

-- View: Available doctor slots
CREATE OR REPLACE VIEW v_available_slots AS
SELECT 
    da.id,
    da.doctor_id,
    d.user_id,
    u.first_name,
    u.last_name,
    da.date,
    da.time_slot_start,
    da.time_slot_end,
    da.max_appointments_per_slot,
    da.current_appointments,
    (da.max_appointments_per_slot - da.current_appointments) as available_slots
FROM doctor_availability da
JOIN doctors d ON da.doctor_id = d.id
JOIN users u ON d.user_id = u.id
WHERE da.is_available = true
    AND da.date >= CURRENT_DATE
    AND (da.max_appointments_per_slot - da.current_appointments) > 0
ORDER BY da.date, da.time_slot_start;

-- View: Queue status by doctor
CREATE OR REPLACE VIEW v_queue_status AS
SELECT 
    qm.doctor_id,
    qm.date,
    COUNT(*) as total_in_queue,
    COUNT(CASE WHEN qm.status = 'waiting' THEN 1 END) as waiting_count,
    COUNT(CASE WHEN qm.status = 'in_service' THEN 1 END) as in_service_count,
    AVG(qm.actual_wait_time) as avg_wait_time
FROM queue_management qm
WHERE qm.date = CURRENT_DATE
GROUP BY qm.doctor_id, qm.date;

-- ============================================================================
-- SCHEMA INITIALIZATION COMPLETE
-- ============================================================================
-- All tables, indexes, triggers, and views have been created successfully.
-- The database is ready for application integration.
