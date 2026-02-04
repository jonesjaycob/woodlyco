/**
 * Uploads all public images to Vercel Blob and outputs seed SQL with blob URLs.
 *
 * Usage:
 *   env $(grep -v '^#' .env.local | xargs) npx tsx supabase/upload-and-seed.ts
 */

import { put } from "@vercel/blob";
import { readFileSync, readdirSync } from "fs";
import { resolve, extname } from "path";

const imageExtensions = [".jpg", ".jpeg", ".png", ".webp"];

async function main() {
  const publicDir = resolve(__dirname, "../public");
  const files = readdirSync(publicDir).filter((f) =>
    imageExtensions.includes(extname(f).toLowerCase())
  );

  console.log(`Found ${files.length} images to upload...\n`);

  const urlMap: Record<string, string> = {};

  for (const file of files) {
    const filePath = resolve(publicDir, file);
    const fileBuffer = readFileSync(filePath);
    const blob = new Blob([fileBuffer]);

    try {
      const result = await put(`woodly/${file}`, blob, {
        access: "public",
        allowOverwrite: true,
      });
      urlMap[`/${file}`] = result.url;
      console.log(`Uploaded: ${file} -> ${result.url}`);
    } catch (err: any) {
      console.error(`Failed to upload ${file}:`, err.message);
    }
  }

  console.log("\n--- URL Mapping ---");
  for (const [local, remote] of Object.entries(urlMap)) {
    console.log(`${local} -> ${remote}`);
  }

  // Generate seed SQL
  const blogImage1 = urlMap["/jkalina-lQcTsouDFVg-unsplash.jpg"] || "/jkalina-lQcTsouDFVg-unsplash.jpg";
  const blogImage2 = urlMap["/michael-pointner-ZGzMr04QdmU-unsplash.jpg"] || "/michael-pointner-ZGzMr04QdmU-unsplash.jpg";
  const blogImage3 = urlMap["/brad-weaver-7apH2wgMdW4-unsplash.jpg"] || "/brad-weaver-7apH2wgMdW4-unsplash.jpg";

  const galleryImage1 = urlMap["/IMG_4945.jpeg"] || "/IMG_4945.jpeg";
  const galleryImage2 = urlMap["/IMG_4942.jpeg"] || "/IMG_4942.jpeg";
  const galleryImage3 = urlMap["/IMG_4941.jpeg"] || "/IMG_4941.jpeg";

  const invImage1 = urlMap["/IMG_5639.jpg"] || "/IMG_5639.jpg";
  const invImage2 = urlMap["/IMG_5638.jpg"] || "/IMG_5638.jpg";
  const invImage3 = urlMap["/IMG_4942.jpeg"] || "/IMG_4942.jpeg";

  const esc = (s: string) => s.replace(/'/g, "''");

  console.log("\n\n========== SEED SQL (paste into Supabase SQL Editor) ==========\n");

  console.log(`-- Update existing blog post image (if already inserted)
UPDATE public.blog_posts SET image = '${blogImage1}' WHERE slug = 'why-timber-frame-construction-lasts-generations';
`);

  console.log(`-- Blog Post 2: Solar or Electric
INSERT INTO public.blog_posts (slug, title, excerpt, date, author, category, image, content, published)
VALUES (
  'solar-or-electric-choosing-the-right-power',
  'Solar or Electric: Choosing the Right Power for Your Light Post',
  '${esc("We offer two power options for our handcrafted light posts. Here's how to decide which is right for your property — including what to expect across the seasons.")}',
  '2026-02-03',
  'Woodly Team',
  'Product Guide',
  '${blogImage2}',
  E'One of the most common questions we hear from customers is: *"Which power option should I choose?"* At Woodly, we offer two options — **solar with battery** and **hardwired electric**. The right choice depends on your property, placement, and how you want your light to perform year-round.\\n\\n## Solar-Powered Light Posts (with Battery)\\n\\n**Best for:** Driveways, garden paths, and anywhere electrical access is limited.\\n\\nOur solar posts use a panel to charge an integrated battery during the day. At dusk, the light automatically turns on and runs off stored battery power through the night.\\n\\n**Pros:**\\n- Zero operating cost after installation\\n- No wiring required — install anywhere with sun exposure\\n- Environmentally friendly\\n- Automatic dusk-to-dawn operation\\n\\n**Considerations:**\\n- Requires good sun exposure for optimal charging\\n- Battery replacement every 3-5 years depending on use\\n\\n## How Seasons Affect Solar Charging\\n\\nAlabama gets plenty of sunshine, but daylight hours change significantly across the year — and that affects how your solar post performs.\\n\\n**Summer (June):**\\n- ~14 hours of daylight\\n- Long charging window, shorter nights\\n- Battery easily stays topped off\\n- Peak performance season\\n\\n**Winter (December):**\\n- ~10 hours of daylight\\n- Shorter charging window, longer nights\\n- Battery works harder to last until dawn\\n- Positioning matters more — avoid shaded spots\\n\\n**The good news:** Our solar systems are sized to handle Alabama winters. As long as your post gets 4-6 hours of direct sunlight, it will perform reliably year-round. In deep winter, you might notice slightly dimmer output toward dawn — but for most installations, it''s barely noticeable.\\n\\n**Tip:** If your driveway entrance is heavily shaded by trees (especially evergreens), hardwired electric may be the better choice.\\n\\n## Hardwired Electric Light Posts\\n\\n**Best for:** Heavily shaded locations, security lighting, or when you want maximum brightness and reliability regardless of weather or season.\\n\\nHardwired posts connect directly to your home''s electrical system. They deliver consistent, bright illumination every night — no charging required.\\n\\n**Pros:**\\n- Brightest, most consistent light output\\n- Works in any location, even full shade\\n- No batteries to replace\\n- Can integrate with smart home systems, timers, or motion sensors\\n- Ideal for security lighting\\n\\n**Considerations:**\\n- Requires professional electrical installation\\n- Ongoing energy costs (though LED fixtures keep this minimal)\\n- Less flexibility if you want to relocate the post later\\n\\n## Our Recommendation\\n\\nFor most Alabama homeowners with a sunny driveway entrance, **solar with battery** is the way to go. The installation savings are significant, and our sunshine is reliable enough to keep your post glowing year-round.\\n\\nIf your property is heavily wooded, your entrance faces north, or you need rock-solid security lighting, **hardwired electric** is worth the extra installation cost.\\n\\nNot sure which is right for your property? [Contact us for a free consultation](/contact) — we''re happy to visit your site and make a recommendation based on your specific situation.\\n\\n---\\n\\n*Every Woodly light post is handcrafted using traditional timber frame joinery, regardless of which power option you choose. The craftsmanship stays the same — only the technology inside changes.*',
  true
)
ON CONFLICT (slug) DO NOTHING;
`);

  console.log(`-- Blog Post 3: 5 Ways Curb Appeal
INSERT INTO public.blog_posts (slug, title, excerpt, date, author, category, image, content, published)
VALUES (
  '5-ways-wooden-light-post-boosts-curb-appeal',
  '5 Ways a Wooden Light Post Transforms Your Curb Appeal',
  '${esc("First impressions matter. Here's how a handcrafted wooden light post can elevate your home's entrance and set your property apart.")}',
  '2026-02-03',
  'Woodly Team',
  'Inspiration',
  '${blogImage3}',
  E'They say you never get a second chance at a first impression. When visitors, neighbors, or potential buyers pull up to your home, what do they see? A handcrafted wooden light post at the end of your driveway makes a statement before anyone reaches your front door.\\n\\n## 1. It Creates a Sense of Arrival\\n\\nThere''s something special about turning onto a driveway marked by a beautiful timber post. It signals that you''ve arrived somewhere intentional — a home where details matter.\\n\\nUnlike generic metal lamp posts or plastic solar stakes, a wooden light post says *"Welcome. This place is cared for."*\\n\\n## 2. It Adds Warmth to Your Landscape\\n\\nMetal and plastic feel industrial. Wood feels like home.\\n\\nThe natural grain, the warm tones, the way it weathers gracefully over time — a wooden post complements gardens, stone pathways, and natural landscaping in a way synthetic materials simply can''t.\\n\\n## 3. It Stands Out (In the Best Way)\\n\\nDrive through any neighborhood and you''ll see the same mass-produced fixtures repeated house after house. A handcrafted timber post is different. It''s a conversation starter, a piece of craftsmanship that neighbors notice and remember.\\n\\n*"Where did you get that light post?"* — You''ll hear it more than you expect.\\n\\n## 4. It Increases Property Value\\n\\nReal estate professionals consistently list outdoor lighting and landscaping among the top curb appeal investments. A quality wooden light post checks both boxes:\\n\\n- **Functional lighting** — Safety and visibility at night\\n- **Architectural detail** — Visual interest that photographs well\\n- **Quality craftsmanship** — Signals a well-maintained property\\n\\nWhether you''re planning to sell or simply want to enjoy your investment, curb appeal pays dividends.\\n\\n## 5. It Reflects Your Personal Style\\n\\nEvery Woodly post is built to order. Want a rustic, weathered look? We can do that. Prefer clean lines and a contemporary finish? We''ve got you covered. The wood species, stain, and fixture style all come together to match *your* vision.\\n\\nYour home is unique. Your light post should be too.\\n\\n---\\n\\n## Ready to Transform Your Driveway?\\n\\nOur timber light posts are handcrafted in Pell City, Alabama using traditional mortise and tenon joinery. Each one is built to last generations.\\n\\n[Request a custom quote](/contact) or [browse our gallery](/gallery) for inspiration.',
  true
)
ON CONFLICT (slug) DO NOTHING;
`);

  console.log(`-- Gallery Items
INSERT INTO public.gallery_items (title, description, image, sort_order, published) VALUES
  ('Classic Driveway Post', '11″×11″×11′ pine post with solar lantern', '${galleryImage1}', 1, true),
  ('Garden Pathway Light', 'Traditional mortise and tenon joinery', '${galleryImage2}', 2, true),
  ('Estate Entrance', 'Custom matched pair for grand driveways', '${galleryImage3}', 3, true);
`);

  console.log(`-- Inventory Items (prices in cents)
INSERT INTO public.inventory (slug, name, description, price, power, status, images, dimensions, wood, sort_order) VALUES
  ('lp-002', 'Rustic Oak Post', 'Stunning white oak with prominent grain patterns. Built to last generations.', 420000, 'electric', 'available', ARRAY['${invImage1}', '${invImage2}'], '11" × 11" × 11''', 'White Oak', 0),
  ('lp-003', 'Natural Pine Post', 'Classic southern yellow pine with character knots. Excellent value without compromising quality.', 420000, 'solar', 'sold', ARRAY['${invImage3}'], '11" × 11" × 11''', 'Southern Yellow Pine', 1)
ON CONFLICT (slug) DO NOTHING;
`);
}

main();
