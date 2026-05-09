import { getSupabase } from "../config/supabase";

// ============================================================
// Reminder Operations
// ============================================================

export async function createReminder(
  userId: string,
  vesselName: string | undefined,
  message: string,
  minutesFromNow: number
): Promise<string> {
  const supabase = getSupabase();

  let vesselId: string | null = null;

  // If vessel name provided, find vessel ID
  if (vesselName) {
    const { data: vessel } = await supabase
      .from("vessels")
      .select("id")
      .eq("user_id", userId)
      .ilike("name", vesselName)
      .single();

    vesselId = vessel?.id || null;
  }

  const scheduledAt = new Date(Date.now() + minutesFromNow * 60 * 1000).toISOString();

  const { error } = await supabase.from("reminders").insert({
    user_id: userId,
    vessel_id: vesselId,
    reminder_type: "message",
    scheduled_at: scheduledAt,
    message,
    completed: false,
  });

  if (error) {
    throw new Error(`Failed to create reminder: ${error.message}`);
  }

  const when =
    minutesFromNow >= 1440
      ? `${Math.floor(minutesFromNow / 1440)} day(s)`
      : minutesFromNow >= 60
        ? `${Math.floor(minutesFromNow / 60)} hour(s)`
        : `${minutesFromNow} minute(s)`;

  return `Reminder set for ${when} from now: "${message}"`;
}

export async function listReminders(userId: string): Promise<string> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("reminders")
    .select(`
      *,
      vessels (name)
    `)
    .eq("user_id", userId)
    .eq("completed", false)
    .order("scheduled_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to query reminders: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return "You have no pending reminders.";
  }

  const lines = data.map((reminder: any) => {
    const vessel = reminder.vessels?.name || "General";
    const time = new Date(reminder.scheduled_at).toLocaleString();
    return `• ${time} — [${vessel}] ${reminder.message}`;
  });

  return `Your upcoming reminders:\n${lines.join("\n")}`;
}

export async function getDueReminders(): Promise<any[]> {
  const supabase = getSupabase();

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("reminders")
    .select(`
      *,
      users!inner (phone_number)
    `)
    .lte("scheduled_at", now)
    .eq("completed", false);

  if (error) {
    console.error("[Reminder] Failed to query due reminders:", error.message);
    return [];
  }

  return data || [];
}

export async function markReminderCompleted(reminderId: string): Promise<void> {
  const supabase = getSupabase();

  const { error } = await supabase
    .from("reminders")
    .update({ completed: true })
    .eq("id", reminderId);

  if (error) {
    console.error("[Reminder] Failed to mark completed:", error.message);
  }
}
