import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { NavigationMenuMain } from "@/components/navbar";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import blogData from "@/content/blog/posts.json";

// Revalidate every 60 seconds - picks up new posts without full rebuild
export const revalidate = 60;

// Allow dynamic params for new posts added after build
export const dynamicParams = true;

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  image: string;
  content: string;
};

const posts = blogData.posts as BlogPost[];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Parse inline markdown (bold, italic, links) within a string
function parseInlineMarkdown(text: string, keyPrefix: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Combined regex for **bold**, *italic*, and [links](url)
  const inlineRegex = /\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;
  let keyIndex = 0;

  while ((match = inlineRegex.exec(text)) !== null) {
    // Add text before this match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      // **bold**
      parts.push(<strong key={`${keyPrefix}-b-${keyIndex++}`}>{match[1]}</strong>);
    } else if (match[2]) {
      // *italic*
      parts.push(<em key={`${keyPrefix}-i-${keyIndex++}`}>{match[2]}</em>);
    } else if (match[3] && match[4]) {
      // [link](url)
      parts.push(
        <Link
          key={`${keyPrefix}-l-${keyIndex++}`}
          href={match[4]}
          className="text-primary underline hover:no-underline"
        >
          {match[3]}
        </Link>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

// Simple markdown-like rendering for content
function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="text-2xl font-bold mt-8 mb-4">
          {parseInlineMarkdown(line.slice(3), `h2-${key}`)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="text-xl font-semibold mt-6 mb-3">
          {parseInlineMarkdown(line.slice(4), `h3-${key}`)}
        </h3>
      );
    } else if (line.startsWith("- ")) {
      elements.push(
        <li key={key++} className="mb-2">
          {parseInlineMarkdown(line.slice(2), `li-${key}`)}
        </li>
      );
    } else if (line.trim() === "---") {
      elements.push(<hr key={key++} className="my-8 border-border" />);
    } else if (line.trim() === "") {
      elements.push(<br key={key++} />);
    } else {
      elements.push(
        <p key={key++} className="mb-4 text-muted-foreground leading-relaxed">
          {parseInlineMarkdown(line, `p-${key}`)}
        </p>
      );
    }
  }

  return elements;
}

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: [post.image],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Get related posts (same category, excluding current)
  const relatedPosts = posts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 2);

  return (
    <main>
      <NavigationMenuMain />

      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px]">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
        />
        {/* Top gradient for navigation readability */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
        {/* Bottom gradient for content */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <Section className="-mt-32 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 bg-background p-2 rounded-md"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Post header */}
          <Badge variant="secondary" className="mb-4 p-2">
            {post.category}
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {post.title}
          </h1>
          <p className="text-muted-foreground mb-8">
            {formatDate(post.date)} · {post.author}
          </p>

          {/* Content */}
          <article className="prose prose-lg max-w-none">
            {renderContent(post.content)}
          </article>

          {/* CTA */}
          <div className="mt-12 p-8 bg-secondary/50 rounded-lg text-center">
            <h3 className="text-xl font-bold mb-2">Ready for Your Own Light Post?</h3>
            <p className="text-muted-foreground mb-4">
              Let's discuss your project and create something beautiful for your property.
            </p>
            <Button asChild>
              <Link href="/contact">Get a Quote</Link>
            </Button>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-bold mb-6">Related Articles</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.slug}
                    href={`/blog/${relatedPost.slug}`}
                    className="group"
                  >
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold group-hover:text-primary transition-colors">
                          {relatedPost.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(relatedPost.date)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>
    </main>
  );
}
