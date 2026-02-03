import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { NavigationMenuMain } from "@/components/navbar";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import blogData from "@/content/blog/posts.json";

// Revalidate every 60 seconds - picks up new posts without full rebuild
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tips, guides, and insights about wooden light posts, outdoor lighting, timber frame construction, and landscape design.",
};

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

export default function BlogPage() {
  // Sort posts by date, newest first
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const featuredPost = sortedPosts[0];
  const otherPosts = sortedPosts.slice(1);

  return (
    <main>
      <NavigationMenuMain />

      <PageHeader
        title="Blog"
        subtitle="Insights & Guides"
        description="Tips on outdoor lighting, timber frame craftsmanship, and making the most of your wooden light post."
      />

      {/* Featured Post */}
      {featuredPost && (
        <Section>
          <Link href={`/blog/${featuredPost.slug}`} className="group">
            <Card className="overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative aspect-video md:aspect-auto">
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <Badge variant="secondary" className="w-fit mb-4">
                    {featuredPost.category}
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {featuredPost.excerpt}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(featuredPost.date)} · {featuredPost.author}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        </Section>
      )}

      {/* Other Posts */}
      {otherPosts.length > 0 && (
        <Section>
          <h2 className="text-2xl font-bold mb-8">More Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <Card className="overflow-hidden h-full">
                  <div className="relative aspect-video">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <Badge variant="secondary" className="mb-3">
                      {post.category}
                    </Badge>
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(post.date)}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* No posts fallback */}
      {posts.length === 0 && (
        <Section className="text-center">
          <p className="text-muted-foreground">
            No blog posts yet. Check back soon!
          </p>
        </Section>
      )}
    </main>
  );
}
