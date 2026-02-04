"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/actions/auth-guard";
import type { GalleryItem } from "@/lib/types/database";

export async function getPublishedGalleryItems(): Promise<GalleryItem[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  return (data as GalleryItem[]) ?? [];
}

export async function getAllGalleryItems(): Promise<GalleryItem[]> {
  const auth = await requireAdmin();
  if (auth.error) return [];

  const supabase = await createClient();

  const { data } = await supabase
    .from("gallery_items")
    .select("*")
    .order("sort_order", { ascending: true });

  return (data as GalleryItem[]) ?? [];
}

export async function getGalleryItemById(id: string): Promise<GalleryItem | null> {
  const auth = await requireAdmin();
  if (auth.error) return null;

  const supabase = await createClient();

  const { data } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("id", id)
    .single();

  return data as GalleryItem | null;
}

export async function createGalleryItem(formData: FormData) {
  const auth = await requireAdmin();
  if (auth.error) return { error: auth.error };

  const supabase = await createClient();

  const item = {
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || null,
    image: formData.get("image") as string,
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    published: formData.get("published") === "true",
  };

  const { data, error } = await supabase
    .from("gallery_items")
    .insert(item as any)
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return { data: data as GalleryItem };
}

export async function updateGalleryItem(id: string, formData: FormData) {
  const auth = await requireAdmin();
  if (auth.error) return { error: auth.error };

  const supabase = await createClient();

  const updates = {
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || null,
    image: formData.get("image") as string,
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    published: formData.get("published") === "true",
  };

  const { error } = await supabase
    .from("gallery_items")
    .update(updates as any)
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/gallery");
  revalidatePath(`/admin/gallery/${id}`);
  revalidatePath("/gallery");
  return { success: true };
}

export async function deleteGalleryItem(id: string) {
  const auth = await requireAdmin();
  if (auth.error) return { error: auth.error };

  const supabase = await createClient();

  const { error } = await supabase.from("gallery_items").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return { success: true };
}
