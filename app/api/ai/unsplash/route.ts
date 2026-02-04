import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type UnsplashPhoto = {
  id: string;
  urls: { regular: string; thumb: string };
  alt_description: string | null;
  user: { name: string };
};

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || (profile as { role: string }).role !== "admin") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const q = request.nextUrl.searchParams.get("q");
  if (!q) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    return NextResponse.json(
      { error: "Unsplash not configured" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=6&orientation=landscape&page=${request.nextUrl.searchParams.get("page") || "1"}`,
      { headers: { Authorization: `Client-ID ${accessKey}` } }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Unsplash API error" },
        { status: res.status }
      );
    }

    const data = await res.json();
    const images = (data.results as UnsplashPhoto[]).map((photo) => ({
      id: photo.id,
      url: photo.urls.regular,
      thumbUrl: photo.urls.thumb,
      alt: photo.alt_description ?? "",
      photographer: photo.user.name,
    }));

    return NextResponse.json(images);
  } catch {
    return NextResponse.json(
      { error: "Failed to search Unsplash" },
      { status: 500 }
    );
  }
}
