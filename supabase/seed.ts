// Run: npx tsx supabase/seed.ts
// Seeds inventory data from data/inventory.json into Supabase

import { createClient } from "@supabase/supabase-js";
import inventoryData from "../data/inventory.json";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log("Seeding inventory...");

  for (const item of inventoryData.items) {
    const { error } = await supabase.from("inventory").upsert(
      {
        slug: item.id,
        name: item.name,
        description: item.description,
        price: item.price * 100, // Convert dollars to cents
        power: item.power as "solar" | "battery" | "electric",
        status: item.status as "available" | "sold",
        images: item.images,
        dimensions: item.dimensions,
        wood: item.wood,
        sort_order: inventoryData.items.indexOf(item),
      },
      { onConflict: "slug" }
    );

    if (error) {
      console.error(`Error seeding ${item.name}:`, error.message);
    } else {
      console.log(`Seeded: ${item.name}`);
    }
  }

  console.log("Seed complete.");
}

seed();
