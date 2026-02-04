import { Suspense } from "react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { NavigationMenuMain } from "@/components/navbar";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { LeadCaptureForm } from "@/components/lead-capture-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Get a Quote",
  description:
    "Request a quote for your custom wooden light post. Enter your details to get started.",
};

export default async function GetAQuotePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/portal/quotes/new");
  }

  return (
    <main>
      <NavigationMenuMain />

      <PageHeader
        title="Get a Quote"
        subtitle="Start Your Project"
        description="Tell us a bit about yourself and we'll help you get started with a custom light post quote."
      />

      <Section>
        <Suspense>
          <LeadCaptureForm />
        </Suspense>
      </Section>
    </main>
  );
}
