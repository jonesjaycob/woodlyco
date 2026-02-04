"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Order, OrderWithClient, OrderDetail, Quote, Profile } from "@/lib/types/database";

export async function createOrderFromQuote(
  quoteId: string
): Promise<{ error: string } | { data: Order }> {
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
  const supabase = await createClient();

  const { data } = await supabase
    .from("orders")
    .select("*, profiles(full_name, email, phone), quotes(wood_type, power_source, dimensions, quantity)")
    .eq("id", id)
    .single();

  return data as OrderDetail | null;
}

export async function getAllOrders(): Promise<OrderWithClient[]> {
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
  const supabase = await createClient();

  const updates: Record<string, unknown> = { status };
  if (statusNote !== undefined) updates.status_note = statusNote;
  if (extras?.estimated_completion) updates.estimated_completion = extras.estimated_completion;
  if (extras?.tracking_number) updates.tracking_number = extras.tracking_number;

  const { error } = await supabase
    .from("orders")
    .update(updates as any)
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath(`/admin/orders/${id}`);
  revalidatePath(`/portal/orders/${id}`);
  return { success: true };
}
