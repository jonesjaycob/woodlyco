"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InquiryModal } from "@/components/inquiry-modal";
import { SunIcon, BatteryIcon, ZapIcon } from "lucide-react";

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

export function InventoryCard({
  item,
  sold = false,
}: {
  item: InventoryItem;
  sold?: boolean;
}) {
  const PowerIcon = powerIcons[item.power];
  const imageCount = item.images.length;

  return (
    <Card className={`overflow-hidden ${sold ? "opacity-75" : ""}`}>
      <Link href={`/shop/${item.id}`}>
        <div className="relative aspect-square bg-muted group">
          <Image
            src={item.images[0]}
            alt={item.name}
            fill
            className={`object-cover transition-transform group-hover:scale-105 ${sold ? "grayscale" : ""}`}
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
          {imageCount > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
              +{imageCount - 1} more
            </div>
          )}
        </div>
      </Link>
      <div className="p-5">
        <Link href={`/shop/${item.id}`}>
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg hover:underline">{item.name}</h3>
            {!sold && (
              <span className="text-xl font-bold">
                ${item.price.toLocaleString()}
              </span>
            )}
          </div>
        </Link>
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
            {powerLabels[item.power]}
          </div>
        </div>
        {!sold && (
          <InquiryModal productId={item.id} productName={item.name}>
            <Button className="w-full mt-4">Inquire Now</Button>
          </InquiryModal>
        )}
      </div>
    </Card>
  );
}
