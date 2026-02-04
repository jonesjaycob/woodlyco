"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { reopenQuote } from "@/lib/actions/quotes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  quoteId: string;
  status: string;
};

export function QuoteClosedNotice({ quoteId, status }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const label = status === "rejected" ? "declined" : "expired";

  async function handleReopen() {
    if (
      !confirm(
        "Re-open this quote? It will be re-submitted for review and pricing may be updated."
      )
    )
      return;

    setLoading(true);
    setError(null);
    const result = await reopenQuote(quoteId);
    if (result.error) {
      setError(result.error);
    } else {
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <Card>
      <CardContent className="py-6">
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        <p className="text-sm text-muted-foreground mb-3">
          This quote has been {label}. Messaging is closed for this quote.
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          If you&apos;d like to revisit this request, you can re-open it for
          review. Pricing and details may be adjusted.
        </p>
        <Button onClick={handleReopen} variant="outline" disabled={loading}>
          {loading ? "Re-opening..." : "Re-open Quote"}
        </Button>
      </CardContent>
    </Card>
  );
}
