import { getSupabase } from "../config/supabase";

// ============================================================
// Operation Log Operations
// ============================================================

export async function logAction(
  userId: string,
  action: string,
  details: string,
  vesselName?: string
): Promise<void> {
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

  const { error } = await supabase.from("operation_logs").insert({
    user_id: userId,
    vessel_id: vesselId,
    action,
    details,
  });

  if (error) {
    console.error("[Log Handler] Failed to log action:", error.message);
    // Don't throw — logging failures shouldn't break the flow
  }
}

export async function getRecentLogs(userId: string, limit: number = 10): Promise<string> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("operation_logs")
    .select(`
      *,
      vessels (name)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to query logs: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return "No recent operation logs found.";
  }

  const lines = data.map((log: any) => {
    const vessel = log.vessels?.name || "N/A";
    const time = new Date(log.created_at).toLocaleString();
    return `• ${time} — ${log.action}: ${log.details} (vessel: ${vessel})`;
  });

  return `Recent operations:\n${lines.join("\n")}`;
}
