"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, requireAdmin } from "@/lib/actions/auth-guard";
import type { Quote, QuoteWithClient, QuoteDetail } from "@/lib/types/database";

export async function createQuoteRequest(
  formData: FormData
): Promise<{ error: string } | { data: Quote }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const insert = {
    client_id: user.id,
    status: "submitted",
    wood_type: formData.get("wood_type") as string,
    power_source: (formData.get("power_source") as string) || null,
    dimensions: formData.get("dimensions") as string,
    quantity: parseInt(formData.get("quantity") as string) || 1,
    custom_notes: formData.get("custom_notes") as string,
  };

  const { data, error } = await supabase
    .from("quotes")
    .insert(insert as any)
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/portal/quotes");
  return { data: data as Quote };
}

export async function getClientQuotes(): Promise<Quote[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("quotes")
    .select("*")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  return (data as Quote[]) ?? [];
}

export async function getQuoteById(id: string): Promise<QuoteDetail | null> {
  const auth = await requireAuth();
  if (auth.error) return null;

  const supabase = await createClient();

  const { data } = await supabase
    .from("quotes")
    .select("*, profiles(full_name, email, phone), quote_line_items(*)")
    .eq("id", id)
    .single();

  return data as QuoteDetail | null;
}

export async function getAllQuotes(): Promise<QuoteWithClient[]> {
  const auth = await requireAdmin();
  if (auth.error) return [];

  const supabase = await createClient();

  const { data } = await supabase
    .from("quotes")
    .select("*, profiles(full_name, email)")
    .order("created_at", { ascending: false });

  return (data as QuoteWithClient[]) ?? [];
}

export async function updateQuoteStatus(id: string, status: Quote["status"], adminNotes?: string) {
  const auth = await requireAdmin();
  if (auth.error) return { error: auth.error };

  const supabase = await createClient();

  const updates: Record<string, unknown> = { status };
  if (adminNotes !== undefined) updates.admin_notes = adminNotes;

  const { error } = await supabase
    .from("quotes")
    .update(updates as any)
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath(`/admin/quotes/${id}`);
  revalidatePath("/admin/quotes");
  return { success: true };
}

export async function addLineItem(
  quoteId: string,
  item: { description: string; quantity: number; unit_price: number; sort_order: number }
) {
  const auth = await requireAdmin();
  if (auth.error) return { error: auth.error };

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("quote_line_items")
    .insert({ ...item, quote_id: quoteId } as any)
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath(`/admin/quotes/${quoteId}`);
  return { data };
}

export async function updateLineItem(
  id: string,
  updates: { description?: string; quantity?: number; unit_price?: number; sort_order?: number }
) {
  const auth = await requireAdmin();
  if (auth.error) return { error: auth.error };

  const supabase = await createClient();

  const { error } = await supabase
    .from("quote_line_items")
    .update(updates as any)
    .eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function removeLineItem(id: string, quoteId: string) {
  const auth = await requireAdmin();
  if (auth.error) return { error: auth.error };

  const supabase = await createClient();

  const { error } = await supabase.from("quote_line_items").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath(`/admin/quotes/${quoteId}`);
  return { success: true };
}

export async function sendQuote(id: string, quotedTotal: number, validUntil: string) {
  const auth = await requireAdmin();
  if (auth.error) return { error: auth.error };

  const supabase = await createClient();

  const { error } = await supabase
    .from("quotes")
    .update({
      status: "quoted",
      quoted_total: quotedTotal,
      valid_until: validUntil,
    } as any)
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath(`/admin/quotes/${id}`);
  revalidatePath(`/portal/quotes/${id}`);
  return { success: true };
}

export async function acceptQuote(id: string) {
  const auth = await requireAuth();
  if (auth.error) return { error: auth.error };

  const supabase = await createClient();

  const { data: quote } = await supabase
    .from("quotes")
    .select("client_id, status")
    .eq("id", id)
    .single();

  if (!quote) return { error: "Quote not found" };
  if ((quote as any).client_id !== auth.user!.id) return { error: "Not authorized" };
  if ((quote as any).status !== "quoted") return { error: "Quote cannot be accepted in its current status" };

  const { error } = await supabase
    .from("quotes")
    .update({ status: "accepted" } as any)
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath(`/portal/quotes/${id}`);
  revalidatePath(`/admin/quotes/${id}`);
  return { success: true };
}

export async function rejectQuote(id: string) {
  const auth = await requireAuth();
  if (auth.error) return { error: auth.error };

  const supabase = await createClient();

  const { data: quote } = await supabase
    .from("quotes")
    .select("client_id, status")
    .eq("id", id)
    .single();

  if (!quote) return { error: "Quote not found" };
  if ((quote as any).client_id !== auth.user!.id) return { error: "Not authorized" };
  if ((quote as any).status !== "quoted") return { error: "Quote cannot be rejected in its current status" };

  const { error } = await supabase
    .from("quotes")
    .update({ status: "rejected" } as any)
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath(`/portal/quotes/${id}`);
  revalidatePath(`/admin/quotes/${id}`);
  return { success: true };
}
