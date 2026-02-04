"use client";

import { useRouter } from "next/navigation";
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
          <p className="text-xs text-muted-foreground">/blog/{post.slug}</p>
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
