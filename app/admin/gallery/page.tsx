import Link from "next/link";
import Image from "next/image";
import { getAllGalleryItems } from "@/lib/actions/gallery";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";

export default async function AdminGalleryPage() {
  const items = await getAllGalleryItems();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gallery</h1>
        <Button asChild>
          <Link href="/admin/gallery/new">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Item
          </Link>
        </Button>
      </div>

      {items.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          No gallery items yet. Add your first one.
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <Link key={item.id} href={`/admin/gallery/${item.id}`}>
              <Card className="overflow-hidden group cursor-pointer pt-0">
                <div className="relative aspect-square">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                    unoptimized={item.image.startsWith("/")}
                  />
                  {!item.published && (
                    <Badge variant="secondary" className="absolute top-2 left-2">
                      Draft
                    </Badge>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-medium text-sm truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">Order: {item.sort_order}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
