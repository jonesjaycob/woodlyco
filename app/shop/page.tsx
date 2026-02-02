import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { NavigationMenuMain } from "@/components/navbar";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SunIcon, BatteryIcon, ZapIcon } from "lucide-react";
import inventoryData from "@/data/inventory.json";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse available wooden light posts ready to ship. Handcrafted timber frame light posts in stock now.",
};

type InventoryItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  power: "solar" | "battery" | "electric";
  status: "available" | "sold";
  image: string;
  dimensions: string;
  wood: string;
};

const inventory: InventoryItem[] = inventoryData.items;

const powerIcons = {
  solar: SunIcon,
  battery: BatteryIcon,
  electric: ZapIcon,
};

const powerLabels = {
  solar: "Solar Powered",
  battery: "Battery Operated",
  electric: "Electric Wired",
};

export default function ShopPage() {
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
              <Link href="/contact">Request Custom Order</Link>
            </Button>
          </Card>
        )}
      </Section>

      {/* Recently Sold */}
      {soldItems.length > 0 && (
        <Section dark>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Recently Sold</h2>
          <p className="text-gray-600 mb-8">
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
            <Link href="/contact">Request Custom Order</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/gallery">View Past Work</Link>
          </Button>
        </div>
      </Section>
    </main>
  );
}

function InventoryCard({
  item,
  sold = false,
}: {
  item: (typeof inventory)[0];
  sold?: boolean;
}) {
  const PowerIcon = powerIcons[item.power as keyof typeof powerIcons];

  return (
    <Card className={`overflow-hidden ${sold ? "opacity-75" : ""}`}>
      <div className="relative aspect-square bg-muted">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className={`object-cover ${sold ? "grayscale" : ""}`}
        />
        {sold && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Sold
            </Badge>
          </div>
        )}
        {!sold && (
          <Badge className="absolute top-3 right-3 bg-green-600">
            Available
          </Badge>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg">{item.name}</h3>
          {!sold && (
            <span className="text-xl font-bold">
              ${item.price.toLocaleString()}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="font-medium">Wood:</span> {item.wood}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="font-medium">Size:</span> {item.dimensions}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <PowerIcon className="w-4 h-4" />
            {powerLabels[item.power as keyof typeof powerLabels]}
          </div>
        </div>
        {!sold && (
          <Button asChild className="w-full mt-4">
            <Link href={`/contact?item=${item.id}`}>Inquire About This Post</Link>
          </Button>
        )}
      </div>
    </Card>
  );
}
