import type { Metadata } from "next";
import { getAllQuotes } from "@/lib/actions/quotes";
import { QuoteTable } from "@/components/admin/quote-table";

export const metadata: Metadata = {
  title: "All Quotes",
};

export default async function AdminQuotesPage() {
  const quotes = await getAllQuotes();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quotes</h1>
      <QuoteTable quotes={quotes} />
    </div>
  );
}
