import type { Metadata } from "next";
import Link from "next/link";
import { getAllInventory } from "@/lib/actions/inventory";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PlusIcon, BoxIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Inventory",
};

export default async function AdminInventoryPage() {
  const items = await getAllInventory();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Inventory</h1>
        <Button asChild>
          <Link href="/admin/inventory/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Item
          </Link>
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={BoxIcon}
          title="No inventory items"
          description="Add your first light post to the inventory."
          actionLabel="Add Item"
          actionHref="/admin/inventory/new"
        />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Link key={item.id} href={`/admin/inventory/${item.id}`}>
              <Card className="hover:bg-accent/50 transition-colors">
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    {item.images[0] && (
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.wood} &middot; ${(item.price / 100).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={item.status} type="inventory" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
