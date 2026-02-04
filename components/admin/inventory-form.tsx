"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createInventoryItem, updateInventoryItem, deleteInventoryItem } from "@/lib/actions/inventory";
import { MultiImageUpload } from "@/components/admin/multi-image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { InventoryItem } from "@/lib/types/database";

type InventoryFormProps = {
  item?: InventoryItem;
};

export function InventoryForm({ item }: InventoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>(item?.images ?? []);
  const router = useRouter();
  const isEditing = !!item;

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    // Inject images as comma-separated string (existing action expects this)
    formData.set("images", images.join(", "));

    const result = isEditing
      ? await updateInventoryItem(item.id, formData)
      : await createInventoryItem(formData);

    if ("error" in result && result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/admin/inventory");
    }
  }

  async function handleDelete() {
    if (!item || !confirm("Are you sure you want to delete this item?")) return;
    setLoading(true);
    await deleteInventoryItem(item.id);
    router.push("/admin/inventory");
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
          <CardTitle>{isEditing ? "Edit Item" : "New Item"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={item?.name ?? ""} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" defaultValue={item?.slug ?? ""} required placeholder="e.g., lp-004" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={item?.description ?? ""} rows={3} />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={item ? (item.price / 100).toFixed(2) : ""}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="power">Power Source</Label>
              <Select name="power" defaultValue={item?.power ?? "solar"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solar">Solar</SelectItem>
                  <SelectItem value="battery">Battery</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={item?.status ?? "draft"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="wood">Wood Species</Label>
              <Input id="wood" name="wood" defaultValue={item?.wood ?? ""} placeholder="e.g., White Oak" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dimensions">Dimensions</Label>
              <Input id="dimensions" name="dimensions" defaultValue={item?.dimensions ?? ""} placeholder={'e.g., 11" x 11" x 11\''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input id="sort_order" name="sort_order" type="number" defaultValue={item?.sort_order ?? 0} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Images</Label>
            <MultiImageUpload value={images} onChange={setImages} />
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
