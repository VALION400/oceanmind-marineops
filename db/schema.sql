-- OceanMind Database Schema for Supabase (PostgreSQL)
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Users Table
-- Phone number is the primary identifier (WhatsApp identity)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);

-- ============================================================
-- Vessels Table
-- Each vessel belongs to a user (multi-tenant isolation)
-- ============================================================
CREATE TABLE IF NOT EXISTS vessels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vessels_user ON vessels(user_id);
CREATE INDEX IF NOT EXISTS idx_vessels_name ON vessels(name);

-- ============================================================
-- Crew Members Table
-- Crew assigned to vessels
-- ============================================================
CREATE TABLE IF NOT EXISTS crew (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vessel_id UUID NOT NULL REFERENCES vessels(id) ON DELETE CASCADE,
  member_name VARCHAR(255) NOT NULL,
  role VARCHAR(100),
  status VARCHAR(50) DEFAULT 'on_duty',
  on_duty_from TIMESTAMP WITH TIME ZONE,
  on_duty_to TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crew_vessel ON crew(vessel_id);

-- ============================================================
-- Operation Logs Table
-- Audit trail of all actions
-- ============================================================
CREATE TABLE IF NOT EXISTS operation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vessel_id UUID REFERENCES vessels(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_logs_user ON operation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_vessel ON operation_logs(vessel_id);
CREATE INDEX IF NOT EXISTS idx_logs_created ON operation_logs(created_at DESC);

-- ============================================================
-- Reminders Table
-- Scheduled WhatsApp reminders
-- ============================================================
CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vessel_id UUID REFERENCES vessels(id) ON DELETE SET NULL,
  reminder_type VARCHAR(50) DEFAULT 'message',
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  message TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reminders_user ON reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_scheduled ON reminders(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_reminders_completed ON reminders(completed);

-- ============================================================
-- Row Level Security (RLS) Policies
-- Every query must be scoped by user_id
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vessels ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew ENABLE ROW LEVEL SECURITY;
ALTER TABLE operation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (phone_number = current_setting('app.current_phone', TRUE));

CREATE POLICY "Users can insert own data" ON vessels
  FOR ALL USING (user_id IN (SELECT id FROM users WHERE phone_number = current_setting('app.current_phone', TRUE)));

CREATE POLICY "Users can manage crew" ON crew
  FOR ALL USING (vessel_id IN (SELECT id FROM vessels WHERE user_id IN (SELECT id FROM users WHERE phone_number = current_setting('app.current_phone', TRUE))));

CREATE POLICY "Users can view logs" ON operation_logs
  FOR SELECT USING (user_id IN (SELECT id FROM users WHERE phone_number = current_setting('app.current_phone', TRUE)));

CREATE POLICY "Users can manage reminders" ON reminders
  FOR ALL USING (user_id IN (SELECT id FROM users WHERE phone_number = current_setting('app.current_phone', TRUE)));
