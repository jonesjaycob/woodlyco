import type { Metadata } from "next";
import Link from "next/link";
import { NavigationMenuMain } from "@/components/navbar";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InventoryCard } from "@/components/inventory-card";
import { getInventory } from "@/lib/actions/inventory";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse available wooden light posts ready to ship. Handcrafted timber frame light posts in stock now.",
};

export default async function ShopPage() {
  const inventory = await getInventory();

  const availableItems = inventory.filter((item) => item.status === "available");
  const soldItems = inventory.filter((item) => item.status === "sold");

  return (
    <main>
      <NavigationMenuMain />

      <PageHeader
        title="Shop"
        subtitle="Ready to Ship"
        description="These light posts are built and ready for delivery. Each one is unique — when they're gone, they're gone."
      />

      {/* Available Items */}
      <Section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Available Now</h2>
          <Badge variant="secondary" className="text-sm">
            {availableItems.length} in stock
          </Badge>
        </div>

        {availableItems.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableItems.map((item) => (
              <InventoryCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              All current inventory has been sold. Check back soon or order a
              custom post.
            </p>
            <Button asChild>
              <Link href="/portal/quotes/new">Request Custom Order</Link>
            </Button>
          </Card>
        )}
      </Section>

      {/* Recently Sold */}
      {soldItems.length > 0 && (
        <Section dark>
          <h2 className="text-2xl font-bold mb-4">Recently Sold</h2>
          <p className="text-muted-foreground mb-8">
            These posts found their homes. Interested in something similar?
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {soldItems.map((item) => (
              <InventoryCard key={item.id} item={item} sold />
            ))}
          </div>
        </Section>
      )}

      {/* Custom Order CTA */}
      <Section className="text-center">
        <h2 className="text-2xl font-bold mb-4">Don't See What You're Looking For?</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-6">
          Every light post we build is a custom piece. Tell us your vision —
          wood species, dimensions, power source — and we'll make it happen.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button asChild>
            <Link href="/portal/quotes/new">Request Custom Order</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/gallery">View Past Work</Link>
          </Button>
        </div>
      </Section>
    </main>
  );
}
