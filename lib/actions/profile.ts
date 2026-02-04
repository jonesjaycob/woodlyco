"use server";

import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types/database";

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data as Profile | null;
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const updates = {
    full_name: formData.get("full_name") as string,
    phone: formData.get("phone") as string,
    address_line1: formData.get("address_line1") as string,
    address_line2: formData.get("address_line2") as string,
    address_city: formData.get("address_city") as string,
    address_state: formData.get("address_state") as string,
    address_zip: formData.get("address_zip") as string,
    property_type: formData.get("property_type") as string,
    property_notes: formData.get("property_notes") as string,
  };

  const { error } = await supabase
    .from("profiles")
    .update(updates as any)
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
