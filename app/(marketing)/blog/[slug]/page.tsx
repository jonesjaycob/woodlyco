import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { NavigationMenuMain } from "@/components/navbar";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { getPublishedPosts, getPostBySlug } from "@/lib/actions/blog";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: post.image ? [post.image] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.image ? [post.image] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Get related posts (same category, excluding current)
  const allPosts = await getPublishedPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 2);

  return (
    <main>
      <NavigationMenuMain />

      {/* Hero */}
      {post.image && (
        <div className="relative h-[50vh] min-h-[400px]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            unoptimized={post.image.startsWith("/")}
          />
          {/* Top gradient for navigation readability */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
          {/* Bottom gradient for content */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
      )}

      <Section className={post.image ? "-mt-32 relative z-10" : ""}>
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
          {post.category && (
            <Badge variant="secondary" className="mb-4 p-2">
              {post.category}
            </Badge>
          )}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {post.title}
          </h1>
          <p className="text-muted-foreground mb-8">
            {formatDate(post.date)} · {post.author}
          </p>

          {/* Content */}
          <article className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-primary prose-hr:border-border">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ href, children }) => (
                  <Link
                    href={href ?? "#"}
                    className="text-primary underline hover:no-underline"
                  >
                    {children}
                  </Link>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
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
                      {relatedPost.image && (
                        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                          <Image
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            fill
                            className="object-cover"
                            unoptimized={relatedPost.image.startsWith("/")}
                          />
                        </div>
                      )}
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
