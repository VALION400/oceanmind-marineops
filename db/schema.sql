-- OceanMind Database Schema for Supabase (PostgreSQL)
-- Professional Enterprise Marine Operations Management System
-- Run this in your Supabase SQL Editor

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- ENUMS - Professional Status Types
-- ============================================================
CREATE TYPE vessel_status AS ENUM ('active', 'maintenance', 'inactive', 'in_transit', 'docked', 'under_repair');
CREATE TYPE crew_status AS ENUM ('on_duty', 'off_duty', 'on_leave', 'training', 'emergency_leave');
CREATE TYPE operation_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled', 'failed');
CREATE TYPE log_action AS ENUM ('vessel_created', 'vessel_updated', 'crew_added', 'operation_started', 'operation_completed', 'reminder_sent', 'alert_triggered');

-- ============================================================
-- Users Table - Multi-tenant User Management
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  role VARCHAR(50) DEFAULT 'user',
  avatar_url TEXT,
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- ============================================================
-- Vessels Table - Fleet Management
-- ============================================================
CREATE TABLE IF NOT EXISTS vessels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  mmsi VARCHAR(20) UNIQUE,
  imo_number VARCHAR(20) UNIQUE,
  vessel_type VARCHAR(100),
  status vessel_status DEFAULT 'active',
  location POINT,
  last_location_update TIMESTAMP WITH TIME ZONE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vessels_user ON vessels(user_id);
CREATE INDEX IF NOT EXISTS idx_vessels_name ON vessels(name);
CREATE INDEX IF NOT EXISTS idx_vessels_status ON vessels(status);
CREATE INDEX IF NOT EXISTS idx_vessels_mmsi ON vessels(mmsi);
CREATE INDEX IF NOT EXISTS idx_vessels_location ON vessels USING GIST(location);

-- ============================================================
-- Crew Members Table - Personnel Management
-- ============================================================
CREATE TABLE IF NOT EXISTS crew (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vessel_id UUID NOT NULL REFERENCES vessels(id) ON DELETE CASCADE,
  member_name VARCHAR(255) NOT NULL,
  employee_id VARCHAR(100) UNIQUE,
  role VARCHAR(100) NOT NULL,
  certification_level VARCHAR(50),
  status crew_status DEFAULT 'on_duty',
  on_duty_from TIMESTAMP WITH TIME ZONE,
  on_duty_to TIMESTAMP WITH TIME ZONE,
  contact_phone VARCHAR(50),
  emergency_contact VARCHAR(255),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crew_vessel ON crew(vessel_id);
CREATE INDEX IF NOT EXISTS idx_crew_status ON crew(status);
CREATE INDEX IF NOT EXISTS idx_crew_name ON crew USING GIN(to_tsvector('english', member_name));

-- ============================================================
-- Operation Logs Table - Professional Audit Trail
-- ============================================================
CREATE TABLE IF NOT EXISTS operation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vessel_id UUID REFERENCES vessels(id) ON DELETE SET NULL,
  action log_action NOT NULL,
  status operation_status DEFAULT 'pending',
  details TEXT,
  severity VARCHAR(20) DEFAULT 'info',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_logs_user ON operation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_vessel ON operation_logs(vessel_id);
CREATE INDEX IF NOT EXISTS idx_logs_created ON operation_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_action ON operation_logs(action);
CREATE INDEX IF NOT EXISTS idx_logs_status ON operation_logs(status);

-- ============================================================
-- Reminders Table - Smart Scheduling System
-- ============================================================
CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vessel_id UUID REFERENCES vessels(id) ON DELETE SET NULL,
  reminder_type VARCHAR(50) NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  message TEXT NOT NULL,
  status operation_status DEFAULT 'pending',
  completed BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reminders_user ON reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_scheduled ON reminders(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_reminders_completed ON reminders(completed);
CREATE INDEX IF NOT EXISTS idx_reminders_status ON reminders(status);

-- ============================================================
-- Audit History Table - Comprehensive Tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  table_name VARCHAR(100) NOT NULL,
  record_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL,
  changes JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_history(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_table ON audit_history(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_history(created_at DESC);

-- ============================================================
-- Row Level Security (RLS) - Multi-tenant Data Isolation
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vessels ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew ENABLE ROW LEVEL SECURITY;
ALTER TABLE operation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_history ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Vessels accessible by owner" ON vessels
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Crew accessible by vessel owner" ON crew
  FOR ALL USING (vessel_id IN (SELECT id FROM vessels WHERE user_id = auth.uid()));

CREATE POLICY "Logs accessible by user" ON operation_logs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Reminders accessible by user" ON reminders
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Audit history accessible by user" ON audit_history
  FOR SELECT USING (user_id = auth.uid());

-- ============================================================
-- Automatic Updated_at Trigger
-- ============================================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_update_timestamp BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER vessels_update_timestamp BEFORE UPDATE ON vessels
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER crew_update_timestamp BEFORE UPDATE ON crew
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER operation_logs_update_timestamp BEFORE UPDATE ON operation_logs
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER reminders_update_timestamp BEFORE UPDATE ON reminders
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================================
-- VIEWS - Professional Analytics
-- ============================================================

-- Fleet Status Overview
CREATE OR REPLACE VIEW fleet_overview AS
SELECT
  u.id as user_id,
  u.name as user_name,
  COUNT(v.id) as total_vessels,
  COUNT(CASE WHEN v.status = 'active' THEN 1 END) as active_vessels,
  COUNT(CASE WHEN v.status = 'in_transit' THEN 1 END) as in_transit,
  COUNT(CASE WHEN v.status = 'docked' THEN 1 END) as docked,
  COUNT(CASE WHEN v.status = 'maintenance' THEN 1 END) as in_maintenance
FROM users u
LEFT JOIN vessels v ON u.id = v.user_id
GROUP BY u.id, u.name;

-- Crew Status Overview
CREATE OR REPLACE VIEW crew_overview AS
SELECT
  v.id as vessel_id,
  v.name as vessel_name,
  COUNT(c.id) as total_crew,
  COUNT(CASE WHEN c.status = 'on_duty' THEN 1 END) as on_duty,
  COUNT(CASE WHEN c.status = 'off_duty' THEN 1 END) as off_duty,
  COUNT(CASE WHEN c.status = 'on_leave' THEN 1 END) as on_leave
FROM vessels v
LEFT JOIN crew c ON v.id = c.vessel_id
GROUP BY v.id, v.name;

-- Operation Summary
CREATE OR REPLACE VIEW operation_summary AS
SELECT
  u.id as user_id,
  u.name as user_name,
  COUNT(ol.id) as total_operations,
  COUNT(CASE WHEN ol.status = 'completed' THEN 1 END) as completed,
  COUNT(CASE WHEN ol.status = 'in_progress' THEN 1 END) as in_progress,
  COUNT(CASE WHEN ol.status = 'failed' THEN 1 END) as failed,
  MAX(ol.created_at) as last_operation
FROM users u
LEFT JOIN operation_logs ol ON u.id = ol.user_id
GROUP BY u.id, u.name;
