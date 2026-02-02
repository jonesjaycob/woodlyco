import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { NavigationMenuMain } from "@/components/navbar";
import { PageHeader } from "@/components/ui/page-header";
import { Section, SectionHeader } from "@/components/ui/section";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse our collection of handcrafted wooden light posts. See completed projects and find inspiration.",
};

// Placeholder gallery items - replace with real data later
const galleryItems = [
  {
    id: 1,
    title: "Classic Driveway Post",
    description: "11″×11″×11′ pine post with solar lantern",
    image: "/IMG_5638.jpg",
  },
  {
    id: 2,
    title: "Garden Pathway Light",
    description: "Traditional mortise and tenon joinery",
    image: "/IMG_5639.jpg",
  },
  {
    id: 3,
    title: "Estate Entrance",
    description: "Custom matched pair for grand driveways",
    image: null,
  },
  {
    id: 4,
    title: "Rustic Farmhouse",
    description: "Natural character pine with dark stain",
    image: null,
  },
  {
    id: 5,
    title: "Modern Minimalist",
    description: "Clean lines with hidden LED lighting",
    image: null,
  },
  {
    id: 6,
    title: "Battery Powered",
    description: "Flexible placement, no wiring required",
    image: null,
  },
];

const pricingTiers = [
  {
    name: "Standard",
    size: '11"×11"×11\'',
    price: "Starting at $4,200",
    features: [
      "Premium pine construction",
      "Traditional mortise & tenon joinery",
      "UV-resistant stain finish",
      "Choice of power option",
      "6-8 week lead time",
    ],
  },
  {
    name: "Custom",
    size: "Your specifications",
    price: "Quote required",
    features: [
      "Any dimension available",
      "Wood species selection",
      "Custom finish colors",
      "Matched sets available",
      "Design consultation included",
    ],
    featured: true,
  },
];

export default function GalleryPage() {
  return (
    <main>
      <NavigationMenuMain />

      <PageHeader
        title="Our Work"
        subtitle="Gallery"
        description="Every light post tells a story. Browse completed projects and find inspiration for yours."
      />

      {/* Gallery Grid */}
      <Section id="gallery">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden group cursor-pointer"
            >
              {item.image ? (
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ) : (
                <PlaceholderImage
                  aspectRatio="video"
                  label="Photo coming soon"
                />
              )}
              <div className="p-4">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Pricing Section */}
      <Section dark id="pricing">
        <SectionHeader
          title="Pricing"
          description="Transparent pricing for quality craftsmanship. Every post is made to order."
          align="center"
          marking="left"
          markingStroke="black"
        />
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingTiers.map((tier) => (
            <Card
              key={tier.name}
              className={`p-8 ${
                tier.featured
                  ? "border-2 border-black bg-white"
                  : "bg-gray-50"
              }`}
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>
                <p className="text-gray-600">{tier.size}</p>
              </div>
              <p className="text-3xl font-bold mb-6 text-gray-900">{tier.price}</p>
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${
                  tier.featured
                    ? "bg-black text-white hover:bg-gray-800"
                    : "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                }`}
                variant={tier.featured ? "default" : "outline"}
                asChild
              >
                <Link href="/contact">
                  {tier.featured ? "Request Quote" : "Get Started"}
                </Link>
              </Button>
            </Card>
          ))}
        </div>
      </Section>

      {/* Custom Section */}
      <Section id="custom">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Have Something Unique in Mind?
          </h2>
          <p className="text-muted-foreground mb-8">
            We love custom projects. Whether it's an unusual dimension, a
            specific wood species, or a completely original design — let's talk
            about bringing your vision to life.
          </p>
          <Button size="lg" asChild>
            <Link href="/contact">Start a Conversation</Link>
          </Button>
        </div>
      </Section>
    </main>
  );
}
