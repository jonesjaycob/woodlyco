"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, requireAdmin } from "@/lib/actions/auth-guard";
import type { MessageWithSender } from "@/lib/types/database";

export type Conversation = {
  id: string;
  type: "quote" | "order";
  clientName: string;
  clientEmail: string;
  clientId: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  status: string;
};

export async function getMessages(
  type: "quote" | "order",
  id: string
): Promise<MessageWithSender[]> {
  const auth = await requireAuth();
  if (auth.error) return [];

  const supabase = await createClient();

  if (type === "quote") {
    const { data } = await supabase
      .from("messages")
      .select("*, profiles!sender_id(full_name, email)")
      .eq("quote_id", id)
      .order("created_at", { ascending: true });

    return (data as MessageWithSender[]) ?? [];
  }

  // For orders, also include messages from the linked quote
  const { data: order } = await supabase
    .from("orders")
    .select("quote_id")
    .eq("id", id)
    .single();

  const quoteId = order ? (order as { quote_id: string }).quote_id : null;

  // Fetch order messages
  const { data: orderMessages } = await supabase
    .from("messages")
    .select("*, profiles!sender_id(full_name, email)")
    .eq("order_id", id)
    .order("created_at", { ascending: true });

  // Fetch quote messages if a linked quote exists
  let quoteMessages: MessageWithSender[] = [];
  if (quoteId) {
    const { data } = await supabase
      .from("messages")
      .select("*, profiles!sender_id(full_name, email)")
      .eq("quote_id", quoteId)
      .order("created_at", { ascending: true });

    quoteMessages = (data as MessageWithSender[]) ?? [];
  }

  // Merge and sort chronologically
  const all = [...(orderMessages as MessageWithSender[] ?? []), ...quoteMessages];
  all.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  return all;
}

export async function sendMessage(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const type = formData.get("type") as "quote" | "order";
  const refId = formData.get("ref_id") as string;
  const body = formData.get("body") as string;

  if (!body.trim()) return { error: "Message cannot be empty" };

  const insert: Record<string, unknown> = {
    sender_id: user.id,
    body: body.trim(),
  };

  if (type === "quote") {
    insert.quote_id = refId;
  } else {
    insert.order_id = refId;
  }

  const { error } = await supabase.from("messages").insert(insert as any);

  if (error) return { error: error.message };

  if (type === "quote") {
    revalidatePath(`/portal/quotes/${refId}`);
    revalidatePath(`/admin/quotes/${refId}`);
  } else {
    revalidatePath(`/portal/orders/${refId}`);
    revalidatePath(`/admin/orders/${refId}`);
  }

  return { success: true };
}

export async function markAsRead(messageIds: string[]) {
  if (messageIds.length === 0) return;

  const auth = await requireAuth();
  if (auth.error) return;

  const supabase = await createClient();

  await supabase
    .from("messages")
    .update({ is_read: true } as any)
    .in("id", messageIds);
}

export async function getUnreadCount(): Promise<number> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return 0;

  const { count } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false)
    .neq("sender_id", user.id);

  return count ?? 0;
}

export async function getAdminConversations(): Promise<Conversation[]> {
  const auth = await requireAdmin();
  if (auth.error) return [];

  const adminId = auth.user!.id;
  const supabase = await createClient();

  // Fetch all non-system messages ordered by newest first
  const { data: allMessages } = await supabase
    .from("messages")
    .select("id, quote_id, order_id, body, sender_id, is_read, created_at")
    .order("created_at", { ascending: false });

  if (!allMessages || allMessages.length === 0) return [];

  type RawMessage = {
    id: string;
    quote_id: string | null;
    order_id: string | null;
    body: string;
    sender_id: string | null;
    is_read: boolean;
    created_at: string;
  };

  const messages = allMessages as RawMessage[];

  // Group messages by conversation key
  const quoteConvos = new Map<string, RawMessage[]>();
  const orderConvos = new Map<string, RawMessage[]>();

  for (const msg of messages) {
    if (msg.order_id) {
      const list = orderConvos.get(msg.order_id) ?? [];
      list.push(msg);
      orderConvos.set(msg.order_id, list);
    } else if (msg.quote_id) {
      const list = quoteConvos.get(msg.quote_id) ?? [];
      list.push(msg);
      quoteConvos.set(msg.quote_id, list);
    }
  }

  // Collect IDs for batch lookup
  const quoteIds = [...quoteConvos.keys()];
  const orderIds = [...orderConvos.keys()];

  // Fetch quote and order context in parallel
  const [quotesResult, ordersResult] = await Promise.all([
    quoteIds.length > 0
      ? supabase
          .from("quotes")
          .select("id, status, client_id, profiles(full_name, email)")
          .in("id", quoteIds)
      : Promise.resolve({ data: [] }),
    orderIds.length > 0
      ? supabase
          .from("orders")
          .select("id, status, client_id, quote_id, profiles(full_name, email)")
          .in("id", orderIds)
      : Promise.resolve({ data: [] }),
  ]);

  type QuoteRow = {
    id: string;
    status: string;
    client_id: string;
    profiles: { full_name: string | null; email: string } | null;
  };
  type OrderRow = {
    id: string;
    status: string;
    client_id: string;
    quote_id: string;
    profiles: { full_name: string | null; email: string } | null;
  };

  const quotesMap = new Map<string, QuoteRow>();
  for (const q of (quotesResult.data ?? []) as unknown as QuoteRow[]) {
    quotesMap.set(q.id, q);
  }

  const ordersMap = new Map<string, OrderRow>();
  for (const o of (ordersResult.data ?? []) as unknown as OrderRow[]) {
    ordersMap.set(o.id, o);
  }

  // For orders, exclude quote conversations that have been promoted to an order
  // (those messages will show in the order thread)
  const quoteIdsWithOrders = new Set<string>();
  for (const o of ordersMap.values()) {
    quoteIdsWithOrders.add(o.quote_id);
  }

  const conversations: Conversation[] = [];

  // Build quote conversations (only those without an order)
  for (const [quoteId, msgs] of quoteConvos) {
    if (quoteIdsWithOrders.has(quoteId)) continue;

    const quote = quotesMap.get(quoteId);
    if (!quote) continue;

    const latest = msgs[0]; // already sorted desc
    const unreadCount = msgs.filter(
      (m) => !m.is_read && m.sender_id && m.sender_id !== adminId
    ).length;

    conversations.push({
      id: quoteId,
      type: "quote",
      clientName: quote.profiles?.full_name || "Unknown",
      clientEmail: quote.profiles?.email || "",
      clientId: quote.client_id,
      lastMessage: latest.body,
      lastMessageAt: latest.created_at,
      unreadCount,
      status: quote.status,
    });
  }

  // Build order conversations
  for (const [orderId, msgs] of orderConvos) {
    const order = ordersMap.get(orderId);
    if (!order) continue;

    // Also include quote messages in unread count
    const quoteMessages = quoteConvos.get(order.quote_id) ?? [];
    const allMsgs = [...msgs, ...quoteMessages];
    allMsgs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const latest = allMsgs[0];
    const unreadCount = allMsgs.filter(
      (m) => !m.is_read && m.sender_id && m.sender_id !== adminId
    ).length;

    conversations.push({
      id: orderId,
      type: "order",
      clientName: order.profiles?.full_name || "Unknown",
      clientEmail: order.profiles?.email || "",
      clientId: order.client_id,
      lastMessage: latest.body,
      lastMessageAt: latest.created_at,
      unreadCount,
      status: order.status,
    });
  }

  // Sort by latest message timestamp desc
  conversations.sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  );

  return conversations;
}
