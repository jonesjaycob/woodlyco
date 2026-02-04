"use server";

import { createClient } from "@/lib/supabase/server";

type AuthResult =
  | { user: { id: string }; error?: never }
  | { user?: never; error: string };

type AdminResult =
  | { user: { id: string }; error?: never }
  | { user?: never; error: string };

export async function requireAuth(): Promise<AuthResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };
  return { user: { id: user.id } };
}

export async function requireAdmin(): Promise<AdminResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || (profile as { role: string }).role !== "admin") {
    return { error: "Not authorized" };
  }

  return { user: { id: user.id } };
}
