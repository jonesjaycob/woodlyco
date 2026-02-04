"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { MessageWithSender } from "@/lib/types/database";

export async function getMessages(
  type: "quote" | "order",
  id: string
): Promise<MessageWithSender[]> {
  const supabase = await createClient();

  const column = type === "quote" ? "quote_id" : "order_id";

  const { data } = await supabase
    .from("messages")
    .select("*, profiles(full_name, email)")
    .eq(column, id)
    .order("created_at", { ascending: true });

  return (data as MessageWithSender[]) ?? [];
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
