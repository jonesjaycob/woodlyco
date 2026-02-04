import type { Metadata } from "next";
import Link from "next/link";
import { NavigationMenuMain } from "@/components/navbar";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of service for Woodly Company. Guidelines for using our website and purchasing our products.",
};

export default function TermsPage() {
  return (
    <main>
      <NavigationMenuMain />

      <PageHeader
        title="Terms of Service"
        subtitle="Our Agreement"
        description="Please read these terms carefully before using our website or services."
      />

      <Section className="prose prose-invert max-w-3xl mx-auto">
        <p className="text-muted-foreground text-sm mb-8">
          Last updated: February 2, 2026
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">Agreement to Terms</h2>
        <p className="text-muted-foreground mb-4">
          By accessing or using the Woodly Company website and services, you agree
          to be bound by these Terms of Service. If you do not agree to these
          terms, please do not use our website or services.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">Products and Orders</h2>
        <p className="text-muted-foreground mb-4">
          All light posts are custom-made to order. By placing an order, you agree
          to the following:
        </p>
        <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
          <li>
            <strong>Custom Nature</strong> — Each light post is handcrafted and may
            have slight variations in wood grain, color, and character. These
            variations are natural and not considered defects.
          </li>
          <li>
            <strong>Lead Times</strong> — Production times vary based on current
            orders and customization requests. We will provide an estimated
            completion date when you place your order.
          </li>
          <li>
            <strong>Deposits</strong> — A deposit may be required to begin work on
            your order. Deposit amounts and payment terms will be communicated
            during the ordering process.
          </li>
          <li>
            <strong>Pricing</strong> — Prices are subject to change. The price
            quoted at the time of your order confirmation will be honored.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">Payment</h2>
        <p className="text-muted-foreground mb-4">
          We accept payment through Stripe. By providing payment information, you
          represent that you are authorized to use the payment method. All prices
          are in US dollars unless otherwise noted.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">Cancellations and Refunds</h2>
        <p className="text-muted-foreground mb-4">
          Due to the custom nature of our products:
        </p>
        <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
          <li>
            Orders may be cancelled before production begins for a full refund of
            any deposit paid.
          </li>
          <li>
            Once production has started, cancellations may be subject to a
            restocking fee to cover materials and labor already invested.
          </li>
          <li>
            Completed custom orders are generally non-refundable unless there is a
            defect in workmanship.
          </li>
        </ul>
        <p className="text-muted-foreground mb-4">
          Please{" "}
          <Link href="/contact" className="text-foreground underline hover:no-underline">
            contact us
          </Link>{" "}
          if you have any concerns about your order.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">Delivery</h2>
        <p className="text-muted-foreground mb-4">
          We offer local delivery in the Alabama region and workshop pickup in
          Pell City. For delivery details, please see our{" "}
          <Link href="/shipping" className="text-foreground underline hover:no-underline">
            Delivery page
          </Link>
          . Risk of loss and title pass to you upon delivery or pickup.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">Warranty</h2>
        <p className="text-muted-foreground mb-4">
          We stand behind our craftsmanship. Our light posts come with a warranty
          against defects in materials and workmanship under normal use. This
          warranty does not cover:
        </p>
        <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
          <li>Normal wear and weathering of natural wood</li>
          <li>Damage from improper installation or misuse</li>
          <li>Damage from extreme weather events or accidents</li>
          <li>Electrical components beyond manufacturer warranties</li>
        </ul>
        <p className="text-muted-foreground mb-4">
          For warranty claims, please contact us with photos and a description of
          the issue.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">Intellectual Property</h2>
        <p className="text-muted-foreground mb-4">
          All content on this website, including text, images, logos, and designs,
          is the property of Woodly Company and is protected by copyright and
          trademark laws. You may not reproduce, distribute, or create derivative
          works without our written permission.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">Limitation of Liability</h2>
        <p className="text-muted-foreground mb-4">
          To the fullest extent permitted by law, Woodly Company shall not be
          liable for any indirect, incidental, special, or consequential damages
          arising from your use of our website or products. Our total liability
          shall not exceed the amount you paid for your order.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">Governing Law</h2>
        <p className="text-muted-foreground mb-4">
          These terms shall be governed by the laws of the State of Alabama,
          without regard to conflict of law principles.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">Changes to Terms</h2>
        <p className="text-muted-foreground mb-4">
          We may update these terms from time to time. Continued use of our website
          after changes are posted constitutes acceptance of the updated terms.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">Contact Us</h2>
        <p className="text-muted-foreground mb-4">
          If you have questions about these terms, please{" "}
          <Link href="/contact" className="text-foreground underline hover:no-underline">
            contact us
          </Link>
          .
        </p>
      </Section>
    </main>
  );
}
