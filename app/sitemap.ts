import { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import type { BlogPost, InventoryItem } from "@/lib/types/database";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://woodlyco.com";

  const staticRoutes = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/shop", priority: 0.95, changeFrequency: "daily" as const },
    { path: "/blog", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/gallery", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/faq", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/care", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/shipping", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const supabase = createAdminClient();

  // Dynamic blog post entries
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, updated_at")
    .eq("published", true);

  const blogEntries: MetadataRoute.Sitemap = ((posts as Pick<BlogPost, "slug" | "updated_at">[]) ?? []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Dynamic inventory entries
  const { data: items } = await supabase
    .from("inventory")
    .select("id, updated_at")
    .in("status", ["available", "sold"]);

  const shopEntries: MetadataRoute.Sitemap = ((items as Pick<InventoryItem, "id" | "updated_at">[]) ?? []).map((item) => ({
    url: `${baseUrl}/shop/${item.id}`,
    lastModified: new Date(item.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticEntries, ...blogEntries, ...shopEntries];
}
