import { notFound } from "next/navigation";
import { getGalleryItemById } from "@/lib/actions/gallery";
import { GalleryForm } from "@/components/admin/gallery-form";

export default async function EditGalleryItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getGalleryItemById(id);

  if (!item) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Gallery Item</h1>
      <GalleryForm item={item} />
    </div>
  );
}
