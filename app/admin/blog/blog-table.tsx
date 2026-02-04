"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLinkIcon } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/types/database";

export function BlogTable({ posts }: { posts: BlogPost[] }) {
  const router = useRouter();

  const columns = [
    {
      header: "Title",
      cell: (post: BlogPost) => (
        <div>
          <p className="font-medium">{post.title}</p>
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            onClick={(e) => e.stopPropagation()}
            target="_blank"
          >
            /blog/{post.slug}
            <ExternalLinkIcon className="size-3" />
          </Link>
        </div>
      ),
    },
    {
      header: "Category",
      cell: (post: BlogPost) => post.category || "—",
    },
    {
      header: "Date",
      cell: (post: BlogPost) => new Date(post.date).toLocaleDateString(),
    },
    {
      header: "Status",
      cell: (post: BlogPost) =>
        post.published ? (
          <Badge className="bg-green-600">Published</Badge>
        ) : (
          <Badge variant="secondary">Draft</Badge>
        ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={posts}
      onRowClick={(post) => router.push(`/admin/blog/${post.id}`)}
    />
  );
}
