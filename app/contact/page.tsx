"use client";

import { useState } from "react";
import Link from "next/link";
import { NavigationMenuMain } from "@/components/navbar";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MailIcon, PhoneIcon, MapPinIcon } from "lucide-react";

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
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "standard",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    setSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <main>
      <NavigationMenuMain />

      <PageHeader
        title="Get in Touch"
        subtitle="Contact"
        description="Ready to start your project? Have questions? We'd love to hear from you."
      />

      <Section>
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
            {submitted ? (
              <Card className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✓</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                <p className="text-muted-foreground mb-6">
                  Thanks for reaching out. We'll get back to you soon.
                </p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </Card>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-2"
                    >
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formState.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-md border border-input bg-background"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-2"
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formState.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-md border border-input bg-background"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium mb-2"
                    >
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formState.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-md border border-input bg-background"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="projectType"
                      className="block text-sm font-medium mb-2"
                    >
                      Project Type
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      value={formState.projectType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-md border border-input bg-background"
                    >
                      <option value="standard">Standard Light Post</option>
                      <option value="custom">Custom Design</option>
                      <option value="multiple">Multiple Posts</option>
                      <option value="other">Other / Question</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2"
                  >
                    Tell Us About Your Project *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formState.message}
                    onChange={handleChange}
                    placeholder="Describe your space, vision, timeline, or any questions you have..."
                    className="w-full px-4 py-2 rounded-md border border-input bg-background resize-none"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </Section>

      {/* FAQ Teaser */}
      <Section dark className="text-center">
        <h2 className="text-2xl font-bold mb-4">Have Questions?</h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-6">
          Check out our frequently asked questions about ordering, customization,
          shipping, and installation.
        </p>
        <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white" asChild>
          <Link href="/faq">View FAQ</Link>
        </Button>
      </Section>
    </main>
  );
}
