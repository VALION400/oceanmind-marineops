import { getSupabase } from "../config/supabase";
import { Vessel } from "../types";

// ============================================================
// Get or create user by phone number
// ============================================================
export async function getOrCreateUser(phoneNumber: string, name?: string): Promise<string> {
  const supabase = getSupabase();

  // Check if user exists
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("phone_number", phoneNumber)
    .single();

  if (existing) {
    return existing.id;
  }

  // Create new user
  const { data: newUser, error } = await supabase
    .from("users")
    .insert({
      phone_number: phoneNumber,
      name: name || null,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }

  return newUser.id;
}

// ============================================================
// Vessel CRUD Operations
// ============================================================

export async function findVesselByName(userId: string, name: string): Promise<Vessel | null> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("vessels")
    .select("*")
    .eq("user_id", userId)
    .ilike("name", name)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Vessel;
}

export async function createVessel(
  userId: string,
  name: string,
  status: string = "active"
): Promise<Vessel> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("vessels")
    .insert({
      user_id: userId,
      name,
      status,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create vessel: ${error.message}`);
  }

  return data as Vessel;
}

export async function updateVesselStatus(
  userId: string,
  vesselName: string,
  status: string
): Promise<{ vessel: Vessel; created: boolean }> {
  const supabase = getSupabase();

  // Find existing vessel
  let vessel = await findVesselByName(userId, vesselName);

  if (vessel) {
    // Update existing
    const { data: updated, error } = await supabase
      .from("vessels")
      .update({ status, last_updated: new Date().toISOString() })
      .eq("id", vessel.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update vessel: ${error.message}`);
    }

    return { vessel: updated as Vessel, created: false };
  } else {
    // Create new vessel
    const created = await createVessel(userId, vesselName, status);
    return { vessel: created, created: true };
  }
}

export async function queryVesselStatus(userId: string, vesselName: string): Promise<string> {
  const vessel = await findVesselByName(userId, vesselName);

  if (!vessel) {
    return `Vessel "${vesselName}" not found in your fleet.`;
  }

  return `Vessel "${vessel.name}" — Status: ${vessel.status} (last updated: ${new Date(vessel.last_updated).toLocaleString()})`;
}

export async function listVessels(userId: string): Promise<Vessel[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("vessels")
    .select("*")
    .eq("user_id", userId)
    .order("name");

  if (error) {
    throw new Error(`Failed to list vessels: ${error.message}`);
  }

  return (data || []) as Vessel[];
}
