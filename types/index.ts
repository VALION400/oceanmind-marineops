// ============================================================
// AI Parsed Intent Types
// ============================================================

export type ActionType =
  | "update_vessel"
  | "query_vessel"
  | "update_crew"
  | "query_crew"
  | "log_event"
  | "set_reminder"
  | "query_reminder"
  | "unknown";

export interface ParsedIntent {
  action: ActionType;
  vessel?: string;
  crew?: string;
  status?: string;
  question?: string;
  date?: string;
  reminder_minutes?: number;
  details?: string;
  confidence?: number;
}

// ============================================================
// Database Entity Types
// ============================================================

export interface User {
  id: string;
  phone_number: string;
  name: string | null;
  created_at: string;
}

export interface Vessel {
  id: string;
  name: string;
  status: string;
  last_updated: string;
  user_id: string;
  created_at: string;
}

export interface CrewMember {
  id: string;
  vessel_id: string;
  member_name: string;
  role: string;
  status: string;
  on_duty_from: string | null;
  on_duty_to: string | null;
  created_at: string;
}

export interface OperationLog {
  id: string;
  user_id: string;
  vessel_id: string | null;
  action: string;
  details: string;
  created_at: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  vessel_id: string | null;
  reminder_type: string;
  scheduled_at: string;
  message: string;
  completed: boolean;
  created_at: string;
}

// ============================================================
// Request/Response Types
// ============================================================

export interface TwilioWebhookBody {
  From: string;
  Body: string;
  MessageSid: string;
}

export interface ServiceResponse {
  success: boolean;
  message: string;
  data?: unknown;
}