/**
 * Seed script: Migrate blog posts from content/blog/posts.json to Supabase.
 *
 * Usage:
 *   npx tsx supabase/seed-blog.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function main() {
  const filePath = resolve(__dirname, "../content/blog/posts.json");
  const raw = readFileSync(filePath, "utf-8");
  const { posts } = JSON.parse(raw) as {
    posts: Array<{
      slug: string;
      title: string;
      excerpt: string;
      date: string;
      author: string;
      category: string;
      image: string;
      content: string;
    }>;
  };

  console.log(`Found ${posts.length} blog posts to seed...`);

  for (const post of posts) {
    const { error } = await supabase.from("blog_posts").upsert(
      {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        date: post.date,
        author: post.author,
        category: post.category,
        image: post.image,
        published: true,
      },
      { onConflict: "slug" }
    );

    if (error) {
      console.error(`Error seeding "${post.title}":`, error.message);
    } else {
      console.log(`Seeded: ${post.title}`);
    }
  }

  console.log("Blog seed complete.");
}

main();
