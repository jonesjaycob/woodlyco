import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { modeConfigs, type AiMode } from "@/lib/ai/prompts";

const anthropic = new Anthropic();

export async function POST(request: NextRequest) {
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

  const body = await request.json();
  const { prompt, mode } = body as { prompt: string; mode: AiMode };

  if (!prompt || !mode || !modeConfigs[mode]) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const config = modeConfigs[mode];
  let systemPrompt = config.systemPrompt;

  // For blog mode, fetch existing posts as style examples
  if (mode === "blog") {
    const { data: posts } = await supabase
      .from("blog_posts")
      .select("title, excerpt, content, category")
      .eq("published", true)
      .order("date", { ascending: false })
      .limit(3);

    if (posts && posts.length > 0) {
      const examples = posts
        .map(
          (p, i) =>
            `--- Example ${i + 1} ---\nTitle: ${p.title}\nCategory: ${p.category ?? ""}\nExcerpt: ${p.excerpt ?? ""}\nContent:\n${p.content}\n---`,
        )
        .join("\n\n");

      systemPrompt += `\n\nHere are examples of blog posts you've written before. The style is creative writing. It should be optimize so that LLMs can use this content. It should be in form of answering questions. It should be relatively medium to long:\n\n${examples}`;
    }
  }

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json(
        { error: "No text response from AI" },
        { status: 500 },
      );
    }

    const generated = JSON.parse(textBlock.text);
    return NextResponse.json(generated);
  } catch (e) {
    const errMsg = e instanceof Error ? e.message : "AI generation failed";
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
