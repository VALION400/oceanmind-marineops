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
