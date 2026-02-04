import Link from "next/link";
import type { Metadata } from "next";
import { NavigationMenuMain } from "@/components/navbar";
import { PageHeader } from "@/components/ui/page-header";
import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CalendarIcon, DropletIcon, SunIcon, AlertTriangleIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Care Guide",
  description:
    "How to maintain your Woodly light post for decades of beauty and performance.",
};

const careSteps = [
  {
    icon: CalendarIcon,
    title: "Annual Staining",
    description:
      "Apply a fresh coat of exterior wood stain once per year to maintain protection and appearance. We recommend staining in early fall before winter weather sets in.",
  },
  {
    icon: DropletIcon,
    title: "Clean Gently",
    description:
      "Remove dirt and debris with a soft brush and mild soap solution. Avoid pressure washers, which can damage the wood grain and finish.",
  },
  {
    icon: SunIcon,
    title: "Inspect Regularly",
    description:
      "Check your post seasonally for any signs of wear, cracks, or finish degradation. Early attention prevents bigger issues.",
  },
  {
    icon: AlertTriangleIcon,
    title: "Address Issues Promptly",
    description:
      "If you notice any damage, cracking, or significant wear, contact us. Most issues are easily repaired if caught early.",
  },
];

const stainTips = [
  "Choose a high-quality exterior wood stain with UV protection",
  "Apply on a dry day when temperatures are between 50-85°F",
  "Clean the post thoroughly before applying new stain",
  "Use a brush for best penetration into the wood grain",
  "Apply thin, even coats — two thin coats beat one thick coat",
  "Allow proper drying time between coats (check stain instructions)",
];

export default function CarePage() {
  return (
    <main>
      <NavigationMenuMain />

      <PageHeader
        title="Care Guide"
        subtitle="Protect Your Investment"
        description="Your Woodly light post is built to last decades. A little annual maintenance keeps it looking beautiful."
      />

      {/* Main Care Steps */}
      <Section>
        <div className="grid md:grid-cols-2 gap-8">
          {careSteps.map((step) => (
            <Card key={step.title} className="p-6">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <step.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Staining Guide */}
      <Section dark>
        <SectionHeader
          title="Staining Tips"
          description="Get the best results with your annual stain application."
          marking="left"
          markingStroke="currentColor"
        />
        <div className="grid md:grid-cols-2 gap-4">
          {stainTips.map((tip, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm flex-shrink-0">
                {index + 1}
              </span>
              <p className="text-muted-foreground">{tip}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* What We Provide */}
      <Section>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            What's Included
          </h2>
          <p className="text-muted-foreground mb-6">
            Every Woodly light post is delivered fully stained and sealed with a
            professional-grade exterior finish. You're protected from day one —
            just maintain with annual staining to keep that protection going.
          </p>
          <p className="text-muted-foreground mb-8">
            Questions about care or need a touch-up? We're here to help.
          </p>
          <Button asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </Section>
    </main>
  );
}
