import type { Metadata } from "next";
import { QuoteRequestForm } from "@/components/portal/quote-request-form";

export const metadata: Metadata = {
  title: "New Quote Request",
};

export default function NewQuotePage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">New Quote Request</h1>
      <QuoteRequestForm />
    </div>
  );
}
