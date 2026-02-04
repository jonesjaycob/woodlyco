"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth, requireAdmin } from "@/lib/actions/auth-guard";
import type { Order, OrderWithClient, OrderDetail, Quote, Profile } from "@/lib/types/database";

const ORDER_STATUS_LABELS: Record<string, string> = {
  confirmed: "Confirmed",
  materials: "Sourcing Materials",
  building: "Building",
  finishing: "Finishing",
  ready: "Ready",
  shipped: "Shipped",
  delivered: "Delivered",
  completed: "Completed",
};

async function logOrderStatusChange(orderId: string, fromStatus: string, toStatus: string) {
  const adminSupabase = createAdminClient();
  const fromLabel = ORDER_STATUS_LABELS[fromStatus] || fromStatus;
  const toLabel = ORDER_STATUS_LABELS[toStatus] || toStatus;
  const { error } = await adminSupabase.from("messages").insert({
    order_id: orderId,
    sender_id: null,
    body: `Order status changed from ${fromLabel} to ${toLabel}`,
    is_read: true,
  });
  if (error) {
    console.error("Failed to log order status change:", error.message);
  }
}

export async function createOrderFromQuote(
  quoteId: string
): Promise<{ error: string } | { data: Order }> {
  const auth = await requireAdmin();
  if (auth.error) return { error: auth.error };

  const supabase = await createClient();

  const { data: quoteData, error: quoteError } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", quoteId)
    .single();

  const quote = quoteData as Quote | null;
  if (quoteError || !quote) return { error: "Quote not found" };
  if (quote.status !== "accepted") return { error: "Quote must be accepted first" };

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", quote.client_id)
    .single();

  const profile = profileData as Profile | null;

  const deliveryAddress = profile
    ? [
        profile.address_line1,
        profile.address_line2,
        profile.address_city,
        profile.address_state,
        profile.address_zip,
      ]
        .filter(Boolean)
        .join(", ")
    : null;

  const { data, error } = await supabase
    .from("orders")
    .insert({
      quote_id: quoteId,
      client_id: quote.client_id,
      status: "confirmed",
      total: quote.quoted_total ?? 0,
      delivery_address: deliveryAddress,
    } as any)
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/admin/orders");
  revalidatePath("/portal/orders");
  return { data: data as Order };
}

export async function getClientOrders(): Promise<Order[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("orders")
    .select("*")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  return (data as Order[]) ?? [];
}

export async function getOrderById(id: string): Promise<OrderDetail | null> {
  const auth = await requireAuth();
  if (auth.error) return null;

  const supabase = await createClient();

  const { data } = await supabase
    .from("orders")
    .select("*, profiles(full_name, email, phone), quotes(wood_type, power_source, dimensions, quantity)")
    .eq("id", id)
    .single();

  return data as OrderDetail | null;
}

export async function getAllOrders(): Promise<OrderWithClient[]> {
  const auth = await requireAdmin();
  if (auth.error) return [];

  const supabase = await createClient();

  const { data } = await supabase
    .from("orders")
    .select("*, profiles(full_name, email)")
    .order("created_at", { ascending: false });

  return (data as OrderWithClient[]) ?? [];
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"],
  statusNote?: string,
  extras?: { estimated_completion?: string; tracking_number?: string }
) {
  const auth = await requireAdmin();
  if (auth.error) return { error: auth.error };

  const supabase = await createClient();

  // Fetch current status for logging
  const { data: current } = await supabase
    .from("orders")
    .select("status")
    .eq("id", id)
    .single();

  if (!current) return { error: "Order not found" };

  const currentStatus = (current as { status: string }).status;

  const updates: Record<string, unknown> = { status };
  if (statusNote !== undefined) updates.status_note = statusNote;
  if (extras?.estimated_completion) updates.estimated_completion = extras.estimated_completion;
  if (extras?.tracking_number) updates.tracking_number = extras.tracking_number;

  const { error } = await supabase
    .from("orders")
    .update(updates as any)
    .eq("id", id);

  if (error) return { error: error.message };

  if (currentStatus !== status) {
    await logOrderStatusChange(id, currentStatus, status);
  }

  revalidatePath(`/admin/orders/${id}`);
  revalidatePath(`/portal/orders/${id}`);
  return { success: true };
}
