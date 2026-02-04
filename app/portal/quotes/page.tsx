import type { Metadata } from "next";
import Link from "next/link";
import { getClientQuotes } from "@/lib/actions/quotes";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { PlusIcon, FileTextIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "My Quotes",
};

export default async function QuotesPage() {
  const quotes = await getClientQuotes();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Quotes</h1>
        <Button asChild>
          <Link href="/portal/quotes/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            New Quote
          </Link>
        </Button>
      </div>

      {quotes.length === 0 ? (
        <EmptyState
          icon={FileTextIcon}
          title="No quotes yet"
          description="Submit a quote request to get started on your custom light post."
          actionLabel="Request a Quote"
          actionHref="/portal/quotes/new"
        />
      ) : (
        <div className="space-y-3">
          {quotes.map((quote) => (
            <Link key={quote.id} href={`/portal/quotes/${quote.id}`}>
              <Card className="hover:bg-accent/50 transition-colors">
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium">
                      {quote.wood_type || "Custom"} Light Post
                      {quote.quantity > 1 ? ` (x${quote.quantity})` : ""}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(quote.created_at).toLocaleDateString()}
                      {quote.quoted_total && (
                        <span>
                          {" "}
                          &middot; $
                          {(quote.quoted_total / 100).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      )}
                    </p>
                  </div>
                  <StatusBadge status={quote.status} type="quote" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
