"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGalleryItem, updateGalleryItem, deleteGalleryItem } from "@/lib/actions/gallery";
import { ImageUpload } from "@/components/admin/image-upload";
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
import type { GalleryItem } from "@/lib/types/database";

type GalleryFormProps = {
  item?: GalleryItem;
};

export function GalleryForm({ item }: GalleryFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState(item?.image ?? "");
  const [published, setPublished] = useState(item?.published ?? true);
  const router = useRouter();
  const isEditing = !!item;

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    formData.set("image", image);
    formData.set("published", published.toString());

    if (!image) {
      setError("Image is required");
      setLoading(false);
      return;
    }

    const result = isEditing
      ? await updateGalleryItem(item.id, formData)
      : await createGalleryItem(formData);

    if ("error" in result && result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/admin/gallery");
    }
  }

  async function handleDelete() {
    if (!item || !confirm("Are you sure you want to delete this item?")) return;
    setLoading(true);
    await deleteGalleryItem(item.id);
    router.push("/admin/gallery");
  }

  return (
    <form action={handleSubmit}>
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Gallery Item" : "New Gallery Item"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={item?.title ?? ""} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input
                id="sort_order"
                name="sort_order"
                type="number"
                defaultValue={item?.sort_order ?? 0}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={item?.description ?? ""}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={published ? "published" : "draft"}
              onValueChange={(v) => setPublished(v === "published")}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Image</Label>
            <ImageUpload value={image} onChange={setImage} />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEditing ? "Save Changes" : "Create Item"}
            </Button>
            {isEditing && (
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
                Delete
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
