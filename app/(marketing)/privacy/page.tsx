import type { Metadata } from "next";
import Link from "next/link";
import { NavigationMenuMain } from "@/components/navbar";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for Woodly Company. Learn how we handle your information.",
};

export default function PrivacyPage() {
  return (
    <main>
      <NavigationMenuMain />

      <PageHeader
        title="Privacy Policy"
        subtitle="Your Privacy Matters"
        description="How we collect, use, and protect your information."
      />

      <Section className="prose prose-invert max-w-3xl mx-auto">
        <p className="text-muted-foreground text-sm mb-8">
          Last updated: February 2, 2026
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">Introduction</h2>
        <p className="text-muted-foreground mb-4">
          Woodly Company ("we," "our," or "us") respects your privacy and is
          committed to protecting your personal information. This policy explains
          how we collect, use, and safeguard information when you visit our
          website or purchase our products.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">Information We Collect</h2>
        <p className="text-muted-foreground mb-4">
          We collect information you provide directly to us, including:
        </p>
        <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
          <li>Name and contact information (email, phone number, address)</li>
          <li>Project details and customization preferences</li>
          <li>Payment information for orders</li>
          <li>Communications you send to us</li>
        </ul>
        <p className="text-muted-foreground mb-4">
          We may also automatically collect certain information when you visit our
          website, such as your IP address, browser type, and pages viewed.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
        <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
        <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
          <li>Process and fulfill your orders</li>
          <li>Communicate with you about your projects</li>
          <li>Respond to your inquiries and provide customer support</li>
          <li>Send updates about your order status and delivery</li>
          <li>Improve our website and services</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">Information Sharing</h2>
        <p className="text-muted-foreground mb-4">
          We do not sell your personal information. We may share your information
          with:
        </p>
        <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
          <li>
            <strong>Stripe</strong> — to securely process payments. Stripe's privacy
            policy is available at{" "}
            <a
              href="https://stripe.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline hover:no-underline"
            >
              stripe.com/privacy
            </a>
          </li>
          <li>Delivery services to ship your order</li>
          <li>Service providers who assist our operations</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">Analytics</h2>
        <p className="text-muted-foreground mb-4">
          We use Google Analytics to understand how visitors interact with our
          website. Google Analytics collects information such as how often you
          visit, what pages you view, and what other sites you visited before
          coming here. We use this information to improve our website. Google's
          privacy policy is available at{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline hover:no-underline"
          >
            policies.google.com/privacy
          </a>
          . You can opt out of Google Analytics by installing the{" "}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline hover:no-underline"
          >
            Google Analytics Opt-out Browser Add-on
          </a>
          .
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">Cookies</h2>
        <p className="text-muted-foreground mb-4">
          Our website uses cookies and similar technologies to improve your
          browsing experience, analyze site traffic, and understand where our
          visitors come from. These include cookies set by Google Analytics. You
          can control cookie settings through your browser preferences.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">Data Security</h2>
        <p className="text-muted-foreground mb-4">
          We implement reasonable security measures to protect your personal
          information. However, no method of transmission over the internet is
          completely secure, and we cannot guarantee absolute security.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">Your Rights</h2>
        <p className="text-muted-foreground mb-4">
          You may request access to, correction of, or deletion of your personal
          information by contacting us. We will respond to your request within a
          reasonable timeframe.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">Changes to This Policy</h2>
        <p className="text-muted-foreground mb-4">
          We may update this privacy policy from time to time. We will notify you
          of any material changes by posting the new policy on this page with an
          updated revision date.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">Contact Us</h2>
        <p className="text-muted-foreground mb-4">
          If you have questions about this privacy policy or our practices, please{" "}
          <Link href="/contact" className="text-foreground underline hover:no-underline">
            contact us
          </Link>
          .
        </p>
      </Section>
    </main>
  );
}
