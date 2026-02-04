import { notFound } from "next/navigation";
import { getPostById } from "@/lib/actions/blog";
import { BlogForm } from "@/components/admin/blog-form";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Post</h1>
      <BlogForm post={post} />
    </div>
  );
}
