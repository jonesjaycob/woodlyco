/**
 * Seed script: Insert gallery items into Supabase.
 *
 * Usage:
 *   npx tsx supabase/seed-gallery.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const galleryItems = [
  {
    title: "Classic Driveway Post",
    description: "11″×11″×11′ pine post with solar lantern",
    image: "/IMG_4945.jpeg",
    sort_order: 1,
    published: true,
  },
  {
    title: "Garden Pathway Light",
    description: "Traditional mortise and tenon joinery",
    image: "/IMG_4942.jpeg",
    sort_order: 2,
    published: true,
  },
  {
    title: "Estate Entrance",
    description: "Custom matched pair for grand driveways",
    image: "/IMG_4941.jpeg",
    sort_order: 3,
    published: true,
  },
];

async function main() {
  console.log(`Seeding ${galleryItems.length} gallery items...`);

  for (const item of galleryItems) {
    const { error } = await supabase.from("gallery_items").insert(item);

    if (error) {
      console.error(`Error seeding "${item.title}":`, error.message);
    } else {
      console.log(`Seeded: ${item.title}`);
    }
  }

  console.log("Gallery seed complete.");
}

main();
