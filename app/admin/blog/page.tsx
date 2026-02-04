import Link from "next/link";
import { getAllPosts } from "@/lib/actions/blog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusIcon } from "lucide-react";
import { BlogTable } from "./blog-table";

export default async function AdminBlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Button asChild>
          <Link href="/admin/blog/new">
            <PlusIcon className="h-4 w-4 mr-2" />
            New Post
          </Link>
        </Button>
      </div>

      <BlogTable posts={posts} />
    </div>
  );
}
