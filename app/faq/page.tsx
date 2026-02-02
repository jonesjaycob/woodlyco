import Link from "next/link";
import type { Metadata } from "next";
import { NavigationMenuMain } from "@/components/navbar";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Woodly custom wooden light posts.",
};

const faqs = [
  {
    question: "What size are your light posts?",
    answer:
      "Our standard light posts are approximately 11\"×11\"×11' (11 inches square by 11 feet tall). Custom dimensions are available — just let us know what you need.",
  },
  {
    question: "What construction method do you use?",
    answer:
      "We use traditional timber frame joinery — specifically mortise and tenon joints. This means no nails or screws in the structural joints, just precision-cut wood interlocking the way timber frames have been built for centuries.",
  },
  {
    question: "What lighting options are available?",
    answer:
      "We offer three power options: solar-powered (eco-friendly, no wiring needed), battery-operated (flexible placement), and electric wired (for consistent brightness and integration with existing landscape lighting).",
  },
  {
    question: "How much do your light posts cost?",
    answer:
      "Standard light posts start at $4,200. Custom designs, different sizes, or special wood selections may affect pricing. Contact us for a personalized quote.",
  },
  {
    question: "How long does it take to build?",
    answer:
      "Typical lead time is 6-8 weeks from order confirmation. Custom or complex designs may take longer. We'll give you a specific timeline when you place your order.",
  },
  {
    question: "Do you deliver?",
    answer:
      "Yes, we offer local delivery in the Alabama region. For customers outside our delivery area, we can discuss shipping options or pickup arrangements.",
  },
  {
    question: "How do I maintain my light post?",
    answer:
      "Your post arrives fully stained and sealed. We recommend applying a fresh coat of exterior wood stain once per year to maintain protection and appearance. See our Care Guide for detailed instructions.",
  },
  {
    question: "What type of wood do you use?",
    answer:
      "We use high-quality, high-character timber selected for durability and beauty. Specific wood species can be discussed during your consultation based on your preferences and budget.",
  },
  {
    question: "Can I customize the design?",
    answer:
      "Absolutely. Every post is made to order, so we can adjust dimensions, wood selection, finish color, and lighting style to match your vision. Just tell us what you're looking for.",
  },
  {
    question: "How long will my light post last?",
    answer:
      "With proper annual maintenance, a Woodly light post is built to last decades. The traditional joinery methods we use have been proven over centuries of timber frame construction.",
  },
];

export default function FAQPage() {
  return (
    <main>
      <NavigationMenuMain />

      <PageHeader
        title="FAQ"
        subtitle="Common Questions"
        description="Everything you need to know about Woodly light posts."
      />

      <Section>
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-border pb-6">
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="text-center">
        <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-6">
          We're happy to answer anything we didn't cover here. Reach out and
          let's talk about your project.
        </p>
        <Button asChild>
          <Link href="/contact">Contact Us</Link>
        </Button>
      </Section>
    </main>
  );
}
