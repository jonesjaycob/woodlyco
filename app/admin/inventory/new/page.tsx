import type { Metadata } from "next";
import Link from "next/link";
import { InventoryForm } from "@/components/admin/inventory-form";
import { ArrowLeftIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Add Inventory Item",
};

export default function NewInventoryPage() {
  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/inventory"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Inventory
      </Link>
      <InventoryForm />
    </div>
  );
}
