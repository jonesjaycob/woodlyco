import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { NavigationMenuMain } from "@/components/navbar";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ProductGallery } from "@/components/product-gallery";
import { ProductInquiryCta } from "@/components/product-inquiry-cta";
import { SunIcon, BatteryIcon, ZapIcon, ArrowLeftIcon } from "lucide-react";
import inventoryData from "@/data/inventory.json";

type InventoryItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  power: "solar" | "battery" | "electric";
  status: "available" | "sold";
  images: string[];
  dimensions: string;
  wood: string;
};

const inventory = inventoryData.items as InventoryItem[];

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

const powerDescriptions = {
  solar: "Eco-friendly operation with automatic dusk-to-dawn lighting. No wiring required.",
  battery: "Flexible placement anywhere on your property. Easy battery replacement.",
  electric: "Consistent brightness with reliable wired power. Integrates with existing landscape lighting.",
};

export async function generateStaticParams() {
  return inventory.map((item) => ({
    id: item.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = inventory.find((i) => i.id === id);

  if (!item) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: item.name,
    description: `${item.description} ${item.wood} light post with ${powerLabels[item.power].toLowerCase()}. $${item.price.toLocaleString()}.`,
    openGraph: {
      images: item.images[0] ? [item.images[0]] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = inventory.find((i) => i.id === id);

  if (!item) {
    notFound();
  }

  const PowerIcon = powerIcons[item.power];
  const isSold = item.status === "sold";

  return (
    <main>
      <NavigationMenuMain />

      <Section className="pt-24">
        {/* Back link */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Shop
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <div className={isSold ? "opacity-75 grayscale" : ""}>
            <ProductGallery images={item.images} alt={item.name} />
          </div>

          {/* Details */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-3xl font-bold">{item.name}</h1>
              {isSold ? (
                <Badge variant="secondary" className="text-base px-3 py-1">
                  Sold
                </Badge>
              ) : (
                <Badge className="bg-green-600 text-base px-3 py-1">
                  Available
                </Badge>
              )}
            </div>

            {!isSold && (
              <p className="text-4xl font-bold mb-6">
                ${item.price.toLocaleString()}
              </p>
            )}

            <p className="text-lg text-muted-foreground mb-8">
              {item.description}
            </p>

            {/* Specs */}
            <Card className="p-6 mb-8">
              <h3 className="font-semibold mb-4">Specifications</h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Wood Species</dt>
                  <dd className="font-medium">{item.wood}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Dimensions</dt>
                  <dd className="font-medium">{item.dimensions}</dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground">Power Source</dt>
                  <dd className="font-medium flex items-center gap-2">
                    <PowerIcon className="w-4 h-4" />
                    {powerLabels[item.power]}
                  </dd>
                </div>
              </dl>
            </Card>

            {/* Power description */}
            <Card className="p-6 mb-8 bg-muted/50">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                  <PowerIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{powerLabels[item.power]}</h4>
                  <p className="text-sm text-muted-foreground">
                    {powerDescriptions[item.power]}
                  </p>
                </div>
              </div>
            </Card>

            {/* CTA */}
            <ProductInquiryCta
              productId={item.id}
              productName={item.name}
              isSold={isSold}
            />
          </div>
        </div>
      </Section>

      {/* Related / Other items */}
      <Section dark>
        <h2 className="text-2xl font-bold mb-6">More Light Posts</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {inventory
            .filter((i) => i.id !== item.id)
            .slice(0, 3)
            .map((relatedItem) => (
              <Link
                key={relatedItem.id}
                href={`/shop/${relatedItem.id}`}
                className="flex-shrink-0 w-64 group"
              >
                <Card className="overflow-hidden">
                  <div className="relative aspect-square bg-muted">
                    <Image
                      src={relatedItem.images[0]}
                      alt={relatedItem.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                    {relatedItem.status === "sold" && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="secondary">Sold</Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{relatedItem.name}</h3>
                    {relatedItem.status === "available" && (
                      <p className="text-lg font-bold">
                        ${relatedItem.price.toLocaleString()}
                      </p>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
        </div>
      </Section>
    </main>
  );
}
