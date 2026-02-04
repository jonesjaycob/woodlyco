import { notFound } from "next/navigation";
import Link from "next/link";
import { getInventoryById } from "@/lib/actions/inventory";
import { InventoryForm } from "@/components/admin/inventory-form";
import { ArrowLeftIcon } from "lucide-react";

export default async function EditInventoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getInventoryById(id);
  if (!item) notFound();

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/inventory"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Inventory
      </Link>
      <InventoryForm item={item} />
    </div>
  );
}
