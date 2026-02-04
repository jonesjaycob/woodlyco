"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth, requireAdmin } from "@/lib/actions/auth-guard";
import type { Quote, QuoteWithClient, QuoteDetail } from "@/lib/types/database";

const STATUS_LABELS: Record<string, string> = {
  submitted: "Submitted",
  reviewing: "Reviewing",
  quoted: "Quoted",
  accepted: "Accepted",
  rejected: "Declined",
  expired: "Expired",
};

async function logQuoteStatusChange(quoteId: string, fromStatus: string, toStatus: string) {
  const adminSupabase = createAdminClient();
  const fromLabel = STATUS_LABELS[fromStatus] || fromStatus;
  const toLabel = STATUS_LABELS[toStatus] || toStatus;
  const { error } = await adminSupabase.from("messages").insert({
    quote_id: quoteId,
    sender_id: null,
    body: `Status changed from ${fromLabel} to ${toLabel}`,
    is_read: true,
  });
  if (error) {
    console.error("Failed to log quote status change:", error.message);
  }
}

// Valid status transitions for admin
const ADMIN_TRANSITIONS: Record<string, string[]> = {
  submitted: ["reviewing"],
  reviewing: ["quoted"],
  quoted: ["reviewing"], // allow re-reviewing if needed
};

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
  const userId = auth.user!.id;

  const supabase = await createClient();

  // Check if user is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  const isAdmin = profile && (profile as { role: string }).role === "admin";

  // Build query
  let query = supabase
    .from("quotes")
    .select("*, profiles(full_name, email, phone), quote_line_items(*)")
    .eq("id", id);

  // Non-admin users can only see their own quotes
  if (!isAdmin) {
    query = query.eq("client_id", userId);
  }

  const { data } = await query.single();

  return (data as QuoteDetail) ?? null;
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

  // Fetch current status to validate transition
  const { data: current } = await supabase
    .from("quotes")
    .select("status")
    .eq("id", id)
    .single();

  if (!current) return { error: "Quote not found" };

  const currentStatus = (current as { status: string }).status;
  const allowed = ADMIN_TRANSITIONS[currentStatus];
  if (!allowed || !allowed.includes(status)) {
    return { error: `Cannot transition from "${currentStatus}" to "${status}"` };
  }

  const updates: Record<string, unknown> = { status };
  if (adminNotes !== undefined) updates.admin_notes = adminNotes;

  const { error } = await supabase
    .from("quotes")
    .update(updates as any)
    .eq("id", id);

  if (error) return { error: error.message };

  await logQuoteStatusChange(id, currentStatus, status);

  revalidatePath(`/admin/quotes/${id}`);
  revalidatePath(`/portal/quotes/${id}`);
  revalidatePath("/admin/quotes");
  return { success: true };
}

export async function addLineItem(
  quoteId: string,
  item: { description: string; quantity: number; unit_price: number; sort_order: number }
) {
  const auth = await requireAdmin();
  if (auth.error) return { error: auth.error };

  // Validate inputs
  if (!item.description.trim()) return { error: "Description is required" };
  if (isNaN(item.quantity) || item.quantity < 1) return { error: "Invalid quantity" };
  if (isNaN(item.unit_price) || item.unit_price < 0) return { error: "Invalid price" };

  const supabase = await createClient();

  // Get the highest existing sort_order to avoid collisions
  const { data: existing } = await supabase
    .from("quote_line_items")
    .select("sort_order")
    .eq("quote_id", quoteId)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextSortOrder = existing && existing.length > 0
    ? (existing[0] as { sort_order: number }).sort_order + 1
    : 0;

  const { data, error } = await supabase
    .from("quote_line_items")
    .insert({ ...item, sort_order: nextSortOrder, quote_id: quoteId } as any)
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

  // Verify quote is in a valid state to be sent
  const { data: current } = await supabase
    .from("quotes")
    .select("status")
    .eq("id", id)
    .single();

  if (!current) return { error: "Quote not found" };
  const currentStatus = (current as { status: string }).status;
  if (currentStatus !== "reviewing" && currentStatus !== "submitted") {
    return { error: `Cannot send a quote that is "${currentStatus}"` };
  }

  const { error } = await supabase
    .from("quotes")
    .update({
      status: "quoted",
      quoted_total: quotedTotal,
      valid_until: validUntil,
    } as any)
    .eq("id", id);

  if (error) return { error: error.message };

  await logQuoteStatusChange(id, currentStatus, "quoted");

  revalidatePath(`/admin/quotes/${id}`);
  revalidatePath(`/portal/quotes/${id}`);
  return { success: true };
}

export async function acceptQuote(id: string) {
  const auth = await requireAuth();
  if (auth.error) return { error: auth.error };

  // Use admin client for all writes — RLS only allows clients to update draft quotes
  const adminSupabase = createAdminClient();

  const { data: quote } = await adminSupabase
    .from("quotes")
    .select("client_id, status, valid_until, quoted_total")
    .eq("id", id)
    .single();

  if (!quote) return { error: "Quote not found" };

  const q = quote as {
    client_id: string;
    status: string;
    valid_until: string | null;
    quoted_total: number | null;
  };

  if (q.client_id !== auth.user!.id) return { error: "Not authorized" };
  if (q.status !== "quoted") return { error: "Quote cannot be accepted in its current status" };

  // Check expiry
  if (q.valid_until && new Date(q.valid_until) < new Date()) {
    return { error: "This quote has expired. Please request a new quote." };
  }

  // Update quote status
  const { error } = await adminSupabase
    .from("quotes")
    .update({ status: "accepted" })
    .eq("id", id);

  if (error) return { error: error.message };

  await logQuoteStatusChange(id, "quoted", "accepted");

  // Get client profile for delivery address
  const { data: profile } = await adminSupabase
    .from("profiles")
    .select("address_line1, address_line2, address_city, address_state, address_zip")
    .eq("id", q.client_id)
    .single();

  const deliveryAddress = profile
    ? [
        (profile as any).address_line1,
        (profile as any).address_line2,
        (profile as any).address_city,
        (profile as any).address_state,
        (profile as any).address_zip,
      ]
        .filter(Boolean)
        .join(", ")
    : null;

  // Create order
  const { error: orderError } = await adminSupabase
    .from("orders")
    .insert({
      quote_id: id,
      client_id: q.client_id,
      status: "confirmed",
      total: q.quoted_total ?? 0,
      delivery_address: deliveryAddress,
    } as any);

  if (orderError) return { error: `Quote accepted but order creation failed: ${orderError.message}` };

  revalidatePath(`/portal/quotes/${id}`);
  revalidatePath(`/admin/quotes/${id}`);
  revalidatePath("/portal/orders");
  revalidatePath("/admin/orders");
  return { success: true };
}

export async function rejectQuote(id: string) {
  const auth = await requireAuth();
  if (auth.error) return { error: auth.error };

  // Use admin client — RLS only allows clients to update draft quotes
  const adminSupabase = createAdminClient();

  const { data: quote } = await adminSupabase
    .from("quotes")
    .select("client_id, status, valid_until")
    .eq("id", id)
    .single();

  if (!quote) return { error: "Quote not found" };

  const q = quote as { client_id: string; status: string; valid_until: string | null };

  if (q.client_id !== auth.user!.id) return { error: "Not authorized" };
  if (q.status !== "quoted") return { error: "Quote cannot be rejected in its current status" };

  const { error } = await adminSupabase
    .from("quotes")
    .update({ status: "rejected" })
    .eq("id", id);

  if (error) return { error: error.message };

  await logQuoteStatusChange(id, "quoted", "rejected");

  revalidatePath(`/portal/quotes/${id}`);
  revalidatePath(`/admin/quotes/${id}`);
  return { success: true };
}

export async function reopenQuote(id: string) {
  const auth = await requireAuth();
  if (auth.error) return { error: auth.error };

  const adminSupabase = createAdminClient();

  const { data: quote } = await adminSupabase
    .from("quotes")
    .select("client_id, status")
    .eq("id", id)
    .single();

  if (!quote) return { error: "Quote not found" };

  const q = quote as { client_id: string; status: string };

  if (q.client_id !== auth.user!.id) return { error: "Not authorized" };
  if (q.status !== "rejected" && q.status !== "expired") {
    return { error: "Only declined or expired quotes can be re-opened" };
  }

  const { error } = await adminSupabase
    .from("quotes")
    .update({
      status: "submitted",
      quoted_total: null,
      valid_until: null,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  await logQuoteStatusChange(id, q.status, "submitted");

  revalidatePath(`/portal/quotes/${id}`);
  revalidatePath(`/admin/quotes/${id}`);
  revalidatePath("/admin/quotes");
  revalidatePath("/portal/quotes");
  return { success: true };
}

export async function getOrderIdForQuote(quoteId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("id")
    .eq("quote_id", quoteId)
    .limit(1)
    .single();

  return data ? (data as { id: string }).id : null;
}

export async function deleteQuote(id: string) {
  const auth = await requireAdmin();
  if (auth.error) return { error: auth.error };

  const adminSupabase = createAdminClient();

  // Check that no orders exist for this quote
  const { data: orders } = await adminSupabase
    .from("orders")
    .select("id")
    .eq("quote_id", id)
    .limit(1);

  if (orders && orders.length > 0) {
    return { error: "Cannot delete a quote that has an associated order" };
  }

  // Delete the quote — line items and messages cascade via foreign keys
  const { error } = await adminSupabase.from("quotes").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/quotes");
  revalidatePath("/portal/quotes");
  return { success: true };
}
