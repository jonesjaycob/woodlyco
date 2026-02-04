import Link from "next/link";
import type { Metadata } from "next";
import { NavigationMenuMain } from "@/components/navbar";
import { PageHeader } from "@/components/ui/page-header";
import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TruckIcon, MapPinIcon, PackageIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Delivery",
  description:
    "Delivery information for Woodly custom wooden light posts.",
};

export default function ShippingPage() {
  return (
    <main>
      <NavigationMenuMain />

      <PageHeader
        title="Delivery"
        subtitle="Getting Your Light Post Home"
        description="Our light posts are large — we handle delivery with care."
      />

      <Section>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <TruckIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Local Delivery</h3>
            <p className="text-muted-foreground text-sm">
              We deliver directly to customers in the Alabama region. Your post
              arrives ready for installation.
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <MapPinIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Workshop Pickup</h3>
            <p className="text-muted-foreground text-sm">
              Prefer to pick up? You're welcome to collect your light post from
              our workshop in Pell City, Alabama.
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <PackageIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Long Distance</h3>
            <p className="text-muted-foreground text-sm">
              Outside our delivery area? Contact us to discuss freight options
              or pickup arrangements.
            </p>
          </Card>
        </div>
      </Section>

      <Section dark>
        <SectionHeader
          title="Why We Deliver"
          marking="left"
          markingStroke="currentColor"
        />
        <div className="max-w-2xl">
          <p className="text-muted-foreground mb-4">
            At 11 feet tall and built from solid timber, our light posts are
            substantial pieces. We use our own trailer to deliver locally
            because we want to ensure your post arrives in perfect condition.
          </p>
          <p className="text-muted-foreground">
            Delivery cost depends on your location. We'll provide a complete
            quote including delivery when you contact us about your project.
          </p>
        </div>
      </Section>

      {/* CTA */}
      <Section className="text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Order?</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-6">
          Tell us where you're located and we'll work out the best way to get
          your light post to you.
        </p>
        <Button asChild>
          <Link href="/contact">Get a Quote</Link>
        </Button>
      </Section>
    </main>
  );
}
