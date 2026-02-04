import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { NavigationMenuMain } from "@/components/navbar";
import { PageHeader } from "@/components/ui/page-header";
import { Section, SectionHeader } from "@/components/ui/section";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Woodly Company — our story, our craft, and our commitment to traditional timber frame methods.",
};

const processSteps = [
  {
    step: "01",
    title: "Consultation",
    description:
      "We start with a conversation about your vision, space, and requirements. Every project is unique.",
  },
  {
    step: "02",
    title: "Design",
    description:
      "Our craftsmen create detailed plans, selecting the perfect timber and determining dimensions.",
  },
  {
    step: "03",
    title: "Milling",
    description:
      "We mill high-character timber to exact specifications, ensuring structural integrity and beauty.",
  },
  {
    step: "04",
    title: "Joinery",
    description:
      "Traditional mortise and tenon joints are hand-cut — no nails, no screws, just craftsmanship.",
  },
  {
    step: "05",
    title: "Finishing",
    description:
      "Multiple coats of UV-resistant, water-repellent finish protect your post for decades.",
  },
  {
    step: "06",
    title: "Delivery",
    description:
      "We carefully deliver your light post, ready for installation in your outdoor space.",
  },
];

const values = [
  {
    title: "Craftsmanship",
    description:
      "We believe in doing things the right way, even when it takes longer. Quality over shortcuts.",
  },
  {
    title: "Sustainability",
    description:
      "Responsibly sourced timber and finishes that last decades — better for you and the planet.",
  },
  {
    title: "Honesty",
    description:
      "Transparent pricing, realistic timelines, and clear communication throughout your project.",
  },
];

export default function AboutPage() {
  return (
    <main>
      <NavigationMenuMain />

      <PageHeader
        title="About Woodly"
        subtitle="Our Story"
        description="What started with one tree too special for firewood became a mission to bring handcrafted beauty to every driveway."
      />

      {/* Story Section */}
      <Section>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold mb-6">
              It Started with a Tree
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                One day, I had to cut down a large tree in my yard — it was
                growing too close to the house. But I couldn't bring myself to
                turn this old tree into firewood. It deserved better than that.
              </p>
              <p>
                So I decided to mill it out by hand with my chainsaw. The wood
                had so much character — years of growth rings, natural grain
                patterns, a story in every inch. I thought: why not create
                something amazing out of this?
              </p>
              <p>
                As I worked, neighbors would stop by wondering what I was
                building. When I finally got that first post up, it turned out
                more beautiful than I imagined. That's when it hit me — I wanted
                others to experience this same feeling.
              </p>
              <p>
                I searched everywhere and couldn't find anything like it. So I
                designed my own in CAD and started building them. That's how
                Woodly Company was born — from one tree that was too special to
                become firewood.
              </p>
            </div>
          </div>
          <Image
            src="/IMG_3700.jpeg"
            alt="Woodly light post craftsmanship"
            width={800}
            height={800}
            className="rounded-2xl object-cover w-full"
          />
        </div>
      </Section>

      {/* Values Section */}
      <Section dark>
        <SectionHeader
          title="What We Stand For"
          align="center"
          marking="left"
          markingStroke="currentColor"
        />
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value) => (
            <div key={value.title} className="text-center">
              <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Process Section */}
      <Section id="process">
        <SectionHeader
          title="Our Process"
          subtitle="From tree to light post"
          description="Every Woodly light post goes through a careful six-step process to ensure quality and longevity."
          marking="right"
          markingStroke="currentColor"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {processSteps.map((step) => (
            <div key={step.step} className="relative">
              <span className="text-6xl font-bold text-muted absolute -top-4 -left-2">
                {step.step}
              </span>
              <div className="pt-8 pl-4">
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section dark className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Work With Us?
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-8">
          We'd love to hear about your project. Reach out and let's create
          something beautiful together.
        </p>
        <Button size="lg" asChild>
          <Link href="/portal/quotes/new">Get in Touch</Link>
        </Button>
      </Section>
    </main>
  );
}
