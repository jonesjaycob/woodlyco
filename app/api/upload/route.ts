import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import sharp from "sharp";
import { createClient } from "@/lib/supabase/server";

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/tiff",
  "image/avif",
]);

const MAX_WIDTH = 2048;
const QUALITY = 80;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Check admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || (profile as { role: string }).role !== "admin") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  let buffer: Buffer = Buffer.from(await file.arrayBuffer());
  let filename = file.name;

  // Compress if it's a supported image type
  if (IMAGE_TYPES.has(file.type)) {
    const image = sharp(buffer);
    const metadata = await image.metadata();

    let pipeline = image;

    // Resize if wider than max width, preserving aspect ratio
    if (metadata.width && metadata.width > MAX_WIDTH) {
      pipeline = pipeline.resize(MAX_WIDTH, undefined, { withoutEnlargement: true });
    }

    // Convert to WebP for best compression
    buffer = await pipeline.webp({ quality: QUALITY }).toBuffer();
    filename = filename.replace(/\.[^.]+$/, ".webp");
  }

  const blob = await put(filename, buffer, {
    access: "public",
    allowOverwrite: true,
    contentType: IMAGE_TYPES.has(file.type) ? "image/webp" : file.type,
  });

  return NextResponse.json({ url: blob.url });
}
