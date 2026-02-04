"use server";

import { createClient } from "@/lib/supabase/server";

export async function captureLead(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();

  if (!name || !email) {
    return { error: "Name and email are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("leads").insert({ name, email });

  if (error) {
    return { error: "Something went wrong. Please try again." };
  }

  return { name, email };
}
