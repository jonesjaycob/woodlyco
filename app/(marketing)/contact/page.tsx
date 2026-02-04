import type { Metadata } from "next";
import Link from "next/link";
import { NavigationMenuMain } from "@/components/navbar";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContactForm } from "@/components/contact-form";
import { MailIcon, PhoneIcon, MapPinIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Woodly Company. Request a quote for your custom wooden light post or ask us any questions.",
};

const contactMethods = [
  {
    icon: MailIcon,
    label: "Email",
    value: "hello@woodlyco.com",
    href: "mailto:hello@woodlyco.com",
  },
  {
    icon: PhoneIcon,
    label: "Phone",
    value: "(775) 848-8609",
    href: "tel:+17758488609",
  },
  {
    icon: MapPinIcon,
    label: "Workshop",
    value: "Pell City, Alabama",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <main>
      <NavigationMenuMain />

      <PageHeader
        title="Get in Touch"
        subtitle="Contact"
        description="Ready to start your project? Have questions? We'd love to hear from you."
      />

      <Section>
        <Card className="p-6 mb-12 bg-primary/5 border-primary/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Looking for a custom quote?</h3>
              <p className="text-sm text-muted-foreground">
                <Link href="/register" className="text-primary hover:underline">Create an account</Link> to submit a detailed request and track it in real-time.
              </p>
            </div>
            <Button asChild>
              <Link href="/portal/quotes/new">Get a Quote</Link>
            </Button>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Let's Talk</h2>
            <p className="text-muted-foreground mb-8">
              Whether you have a clear vision or just a spark of an idea, we're
              here to help. Reach out and let's discuss how we can create
              something beautiful for your space.
            </p>

            <div className="space-y-6 mb-8">
              {contactMethods.map((method) => (
                <div key={method.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <method.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {method.label}
                    </p>
                    {method.href ? (
                      <a
                        href={method.href}
                        className="font-medium hover:underline"
                      >
                        {method.value}
                      </a>
                    ) : (
                      <p className="font-medium">{method.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Card className="p-6 bg-muted/50">
              <h3 className="font-semibold mb-2">Response Time</h3>
              <p className="text-sm text-muted-foreground">
                We typically respond within 1-2 business days. For urgent
                inquiries, give us a call.
              </p>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </Section>

      {/* FAQ Teaser */}
      <Section dark className="text-center">
        <h2 className="text-2xl font-bold mb-4">Have Questions?</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-6">
          Check out our frequently asked questions about ordering, customization,
          shipping, and installation.
        </p>
        <Button variant="secondary" asChild>
          <Link href="/faq">View FAQ</Link>
        </Button>
      </Section>
    </main>
  );
}
