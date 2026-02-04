"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPost, updatePost, deletePost } from "@/lib/actions/blog";
import { ImageUpload } from "@/components/admin/image-upload";
import { AiWriter } from "@/components/admin/ai-writer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BlogPost } from "@/lib/types/database";

type BlogFormProps = {
  post?: BlogPost;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function BlogForm({ post }: BlogFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState(post?.image ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [published, setPublished] = useState(post?.published ?? false);
  const [title, setTitle] = useState(post?.title ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [author, setAuthor] = useState(post?.author ?? "Woodly Team");
  const [category, setCategory] = useState(post?.category ?? "");
  const router = useRouter();
  const isEditing = !!post;

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
    if (!isEditing) {
      setSlug(slugify(e.target.value));
    }
  }

  function handleAiApply(fields: Record<string, string>, imageUrl?: string) {
    if (fields.title) {
      setTitle(fields.title);
      if (!isEditing) setSlug(fields.slug || slugify(fields.title));
    }
    if (fields.slug && isEditing) setSlug(fields.slug);
    if (fields.excerpt) setExcerpt(fields.excerpt);
    if (fields.content) setContent(fields.content);
    if (fields.author) setAuthor(fields.author);
    if (fields.category) setCategory(fields.category);
    if (imageUrl) setImage(imageUrl);
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    // Inject client-managed fields
    formData.set("title", title);
    formData.set("image", image);
    formData.set("slug", slug);
    formData.set("published", published.toString());
    formData.set("excerpt", excerpt);
    formData.set("content", content);
    formData.set("author", author);
    formData.set("category", category);

    const result = isEditing
      ? await updatePost(post.id, formData)
      : await createPost(formData);

    if ("error" in result && result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/admin/blog");
    }
  }

  async function handleDelete() {
    if (!post || !confirm("Are you sure you want to delete this post?")) return;
    setLoading(true);
    await deletePost(post.id);
    router.push("/admin/blog");
  }

  return (
    <form action={handleSubmit}>
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{isEditing ? "Edit Post" : "New Post"}</CardTitle>
                <AiWriter mode="blog" onApply={handleAiApply} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={title}
                  onChange={handleTitleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  name="slug_display"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  placeholder="Brief summary for blog listing"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content (Markdown)</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={20}
                  required
                  className="font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={published ? "published" : "draft"}
                  onValueChange={(v) => setPublished(v === "published")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  defaultValue={post?.date ?? new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  name="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Craftsmanship"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  name="sort_order"
                  type="number"
                  defaultValue={post?.sort_order ?? 0}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload value={image} onChange={setImage} />
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Saving..." : isEditing ? "Save Changes" : "Create Post"}
            </Button>
            {isEditing && (
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
