"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { NavigationMenuMain } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import LightPost1 from "@/components/ui/light-post-1";
import Marking from "@/components/ui/marking";
import { CheckIcon, SunIcon, BatteryIcon, ZapIcon } from "lucide-react";

const features = [
  {
    title: "Traditional Joinery",
    description:
      "Authentic timber frame construction using mortise and tenon joints — no nails, no screws, just craftsmanship.",
  },
  {
    title: "Premium Materials",
    description:
      "High-character timber milled to 11″×11″ dimensions, finished with UV-resistant protective coating.",
  },
  {
    title: "Built to Last",
    description:
      "Engineered to withstand the elements for decades. Our posts are investments, not replacements.",
  },
];

const powerOptions = [
  {
    icon: SunIcon,
    title: "Solar Powered",
    description: "Eco-friendly, zero electricity costs, automatic dusk-to-dawn operation.",
  },
  {
    icon: BatteryIcon,
    title: "Battery Operated",
    description: "Flexible placement anywhere on your property, easy maintenance.",
  },
  {
    icon: ZapIcon,
    title: "Electric Wired",
    description: "Consistent brightness, integrate with existing landscape lighting.",
  },
];

export default function Home() {
  const { scrollY } = useScroll();
  const videoWidth = useTransform(scrollY, [0, 500], ["100%", "1%"]);

  return (
    <main>
      {/* Hero Section */}
      <div className="relative h-screen">
        <NavigationMenuMain />
        
        <motion.div
          className="relative mx-auto overflow-clip"
          style={{ width: videoWidth, height: videoWidth }}
        >
          <video
            src="/IMG_5555.mov"
            autoPlay
            loop
            muted
            playsInline
            className="absolute bottom-0 left-0 w-full p-2 h-full object-cover opacity-15"
          />
          <div
            className="
              absolute right-70 overflow-clip opacity-10
              top-85 h-95 w-95 p-10
              bg-[radial-gradient(#fefce8_0%,#fde68a_10%,#fbbf24_20%,transparent_50%)]
            "
          />
          <div className="absolute right-0 overflow-clip h-full p-10">
            <LightPost1 stroke="#666666" />
          </div>
        </motion.div>

        <div className="absolute bottom-0 h-2/3 w-full">
          <div className="container mx-auto h-full flex flex-col md:flex-row items-end py-24 px-4 md:px-12 gap-10">
            <div className="w-full md:w-1/2">
              <h1 className="uppercase text-4xl md:text-7xl relative">
                <span className="absolute -top-10 -left-10">
                  <Marking orientation="left" stroke="white" />
                </span>
                Custom Wooden Light Posts
                <br />
                <span className="text-sm">Handcrafted by Woodly Co.</span>
              </h1>
            </div>
            <div className="w-full md:w-1/2 flex flex-col gap-5">
              <p>
                At Woodly Co., we transform your vision into premium custom
                wooden light posts, ideal for brightening your driveway, garden,
                or yard. Choose from solar-powered, battery-operated, or
                electric options for eco-friendly outdoor lighting. With
                traditional woodworking techniques, we mill high-quality timber
                to create stunning, long-lasting wooden lamp posts that boost
                your home's curb appeal and add timeless charm.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <Link href="/gallery">View Gallery</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">Get a Quote</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Craftsmanship Section */}
      <Section>
        <div className="relative rounded-2xl overflow-hidden">
          <Image
            width={1500}
            height={1500}
            src="/IMG_5638.jpg"
            alt="Handcrafted wooden light post tools"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          <div className="relative z-10 flex flex-col gap-8 p-8 md:p-16 text-center">
            <h2 className="uppercase text-4xl md:text-6xl relative mx-auto">
              <span className="absolute -top-10 right-0 md:right-10">
                <Marking orientation="right" stroke="white" />
              </span>
              Handcrafted Timber Frame
            </h2>
            <p className="max-w-2xl mx-auto">
              Our handcrafted wooden light posts are made from oversized,
              high-character timber that stands the test of time. Each post
              features a durable protective coating that repels water and
              resists UV damage for years of reliable outdoor performance.
              Available in a range of sizes to fit your driveway, garden, or
              yard perfectly.
            </p>
            <div>
              <Button size="lg" asChild>
                <Link href="/about#process">Learn Our Process</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Features Section */}
      <Section dark>
        <SectionHeader
          title="Why Woodly?"
          description="Every light post we create is a testament to traditional craftsmanship and modern durability."
          align="center"
          marking="left"
          markingStroke="black"
        />
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="p-6 bg-gray-50">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center mb-4">
                <CheckIcon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Power Options Section */}
      <Section>
        <SectionHeader
          title="Choose Your Power"
          subtitle="Flexibility for any installation"
          description="Whether you want sustainable solar, versatile battery, or reliable electric — we've got you covered."
          align="center"
          marking="right"
          markingStroke="white"
        />
        <div className="grid md:grid-cols-3 gap-8">
          {powerOptions.map((option) => (
            <div key={option.title} className="text-center">
              <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center mx-auto mb-4">
                <option.icon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
              <p className="text-muted-foreground text-sm">
                {option.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Gallery Preview */}
      <Section dark>
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2">
            <Image
              src="/IMG_5639.jpg"
              alt="Woodly light post craftsmanship"
              width={600}
              height={800}
              className="rounded-2xl object-cover w-full"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="uppercase text-3xl md:text-5xl mb-6">
              See Our Work
            </h2>
            <p className="text-gray-600 mb-6">
              Each Woodly light post is unique — shaped by the character of the
              timber and the vision of our clients. Browse our gallery to see
              completed installations and find inspiration for your project.
            </p>
            <Button size="lg" variant="outline" className="text-black border-black hover:bg-black hover:text-white" asChild>
              <Link href="/gallery">View Full Gallery</Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="text-center">
        <h2 className="uppercase text-3xl md:text-5xl mb-6">
          Ready to Light Up Your Property?
        </h2>
        <p className="max-w-xl mx-auto text-muted-foreground mb-8">
          Every project starts with a conversation. Tell us about your space,
          and we'll craft a light post that's uniquely yours.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/contact">Start Your Project</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/about">Learn About Us</Link>
          </Button>
        </div>
      </Section>
    </main>
  );
}
