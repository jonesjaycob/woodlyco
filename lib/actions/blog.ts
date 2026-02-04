"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/actions/auth-guard";
import type { BlogPost } from "@/lib/types/database";

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("date", { ascending: false });

  return (data as BlogPost[]) ?? [];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  return data as BlogPost | null;
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const auth = await requireAdmin();
  if (auth.error) return [];

  const supabase = await createClient();

  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .order("date", { ascending: false });

  return (data as BlogPost[]) ?? [];
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  const auth = await requireAdmin();
  if (auth.error) return null;

  const supabase = await createClient();

  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  return data as BlogPost | null;
}

export async function createPost(formData: FormData) {
  const auth = await requireAdmin();
  if (auth.error) return { error: auth.error };

  const supabase = await createClient();

  const item = {
    slug: formData.get("slug") as string,
    title: formData.get("title") as string,
    excerpt: (formData.get("excerpt") as string) || null,
    content: formData.get("content") as string,
    date: formData.get("date") as string,
    author: (formData.get("author") as string) || "Woodly Team",
    category: (formData.get("category") as string) || null,
    image: (formData.get("image") as string) || null,
    published: formData.get("published") === "true",
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  };

  const { data, error } = await supabase
    .from("blog_posts")
    .insert(item as any)
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { data: data as BlogPost };
}

export async function updatePost(id: string, formData: FormData) {
  const auth = await requireAdmin();
  if (auth.error) return { error: auth.error };

  const supabase = await createClient();

  const updates = {
    slug: formData.get("slug") as string,
    title: formData.get("title") as string,
    excerpt: (formData.get("excerpt") as string) || null,
    content: formData.get("content") as string,
    date: formData.get("date") as string,
    author: (formData.get("author") as string) || "Woodly Team",
    category: (formData.get("category") as string) || null,
    image: (formData.get("image") as string) || null,
    published: formData.get("published") === "true",
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  };

  const { error } = await supabase
    .from("blog_posts")
    .update(updates as any)
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${id}`);
  revalidatePath("/blog");
  return { success: true };
}

export async function deletePost(id: string) {
  const auth = await requireAdmin();
  if (auth.error) return { error: auth.error };

  const supabase = await createClient();

  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { success: true };
}
