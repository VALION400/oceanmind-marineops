import { getSupabase } from "../config/supabase";
import { CrewMember } from "../types";

// ============================================================
// Crew CRUD Operations
// ============================================================

export async function findCrewByVessel(userId: string, vesselName: string): Promise<CrewMember[]> {
  const supabase = getSupabase();

  // Join crew with vessels to filter by user
  const { data, error } = await supabase
    .from("crew")
    .select(`
      *,
      vessels!inner (
        id,
        name,
        user_id
      )
    `)
    .eq("vessels.user_id", userId)
    .ilike("vessels.name", vesselName);

  if (error) {
    throw new Error(`Failed to query crew: ${error.message}`);
  }

  return (data || []) as unknown as CrewMember[];
}

export async function updateCrewStatus(
  userId: string,
  vesselName: string,
  status: string
): Promise<string> {
  const supabase = getSupabase();

  // Find the vessel
  const { data: vessel, error: vesselError } = await supabase
    .from("vessels")
    .select("id")
    .eq("user_id", userId)
    .ilike("name", vesselName)
    .single();

  if (vesselError || !vessel) {
    return `Vessel "${vesselName}" not found. Please update the vessel first.`;
  }

  // Update all crew members for this vessel
  const { data: updated, error } = await supabase
    .from("crew")
    .update({
      status,
      on_duty_from: status === "on_duty" ? new Date().toISOString() : null,
      on_duty_to: status === "off_duty" ? new Date().toISOString() : null,
    })
    .eq("vessel_id", vessel.id)
    .select();

  if (error) {
    throw new Error(`Failed to update crew: ${error.message}`);
  }

  const count = updated?.length || 0;
  return `Crew status for vessel "${vesselName}" updated to "${status}". ${count} crew member(s) affected.`;
}

export async function queryCrewCount(userId: string, vesselName: string): Promise<string> {
  const crew = await findCrewByVessel(userId, vesselName);

  if (crew.length === 0) {
    return `No crew members found for vessel "${vesselName}".`;
  }

  const onDuty = crew.filter((c) => c.status === "on_duty").length;
  const offDuty = crew.filter((c) => c.status === "off_duty").length;

  return `Vessel "${vesselName}" crew: ${crew.length} total (${onDuty} on duty, ${offDuty} off duty).`;
}
