"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { InventoryItem } from "@/lib/types/database";

export async function getInventory(): Promise<InventoryItem[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("inventory")
    .select("*")
    .in("status", ["available", "sold"])
    .order("sort_order", { ascending: true });

  return (data as InventoryItem[]) ?? [];
}

export async function getAllInventory(): Promise<InventoryItem[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("inventory")
    .select("*")
    .order("sort_order", { ascending: true });

  return (data as InventoryItem[]) ?? [];
}

export async function getInventoryBySlug(slug: string): Promise<InventoryItem | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("inventory")
    .select("*")
    .eq("slug", slug)
    .single();

  return data as InventoryItem | null;
}

export async function getInventoryById(id: string): Promise<InventoryItem | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("inventory")
    .select("*")
    .eq("id", id)
    .single();

  return data as InventoryItem | null;
}

export async function createInventoryItem(formData: FormData) {
  const supabase = await createClient();

  const images = (formData.get("images") as string)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const item = {
    slug: formData.get("slug") as string,
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    price: Math.round(parseFloat(formData.get("price") as string) * 100),
    power: formData.get("power") as string,
    status: formData.get("status") as string,
    images,
    dimensions: formData.get("dimensions") as string,
    wood: formData.get("wood") as string,
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  };

  const { data, error } = await supabase
    .from("inventory")
    .insert(item as any)
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/admin/inventory");
  revalidatePath("/shop");
  return { data: data as InventoryItem };
}

export async function updateInventoryItem(id: string, formData: FormData) {
  const supabase = await createClient();

  const images = (formData.get("images") as string)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const updates = {
    slug: formData.get("slug") as string,
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    price: Math.round(parseFloat(formData.get("price") as string) * 100),
    power: formData.get("power") as string,
    status: formData.get("status") as string,
    images,
    dimensions: formData.get("dimensions") as string,
    wood: formData.get("wood") as string,
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  };

  const { error } = await supabase
    .from("inventory")
    .update(updates as any)
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/inventory");
  revalidatePath(`/admin/inventory/${id}`);
  revalidatePath("/shop");
  return { success: true };
}

export async function deleteInventoryItem(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("inventory").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/inventory");
  revalidatePath("/shop");
  return { success: true };
}
