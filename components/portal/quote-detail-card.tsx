"use client";

import { useState } from "react";
import { acceptQuote, rejectQuote } from "@/lib/actions/quotes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import type { QuoteDetail } from "@/lib/types/database";

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

export function QuoteDetailCard({ quote }: { quote: QuoteDetail }) {
  const [loading, setLoading] = useState(false);

  const canRespond = quote.status === "quoted";

  async function handleAccept() {
    setLoading(true);
    await acceptQuote(quote.id);
    setLoading(false);
  }

  async function handleReject() {
    setLoading(true);
    await rejectQuote(quote.id);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Quote Details</CardTitle>
            <StatusBadge status={quote.status} type="quote" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {quote.wood_type && (
              <div>
                <p className="text-sm text-muted-foreground">Wood Type</p>
                <p className="font-medium">{quote.wood_type}</p>
              </div>
            )}
            {quote.power_source && (
              <div>
                <p className="text-sm text-muted-foreground">Power Source</p>
                <p className="font-medium capitalize">{quote.power_source}</p>
              </div>
            )}
            {quote.dimensions && (
              <div>
                <p className="text-sm text-muted-foreground">Dimensions</p>
                <p className="font-medium">{quote.dimensions}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Quantity</p>
              <p className="font-medium">{quote.quantity}</p>
            </div>
          </div>
          {quote.custom_notes && (
            <div>
              <p className="text-sm text-muted-foreground">Your Notes</p>
              <p className="text-sm mt-1">{quote.custom_notes}</p>
            </div>
          )}
          {quote.admin_notes && (
            <div>
              <p className="text-sm text-muted-foreground">Admin Notes</p>
              <p className="text-sm mt-1">{quote.admin_notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Line Items */}
      {quote.quote_line_items && quote.quote_line_items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Quote Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {quote.quote_line_items
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.description}{" "}
                      {item.quantity > 1 && (
                        <span className="text-muted-foreground">x{item.quantity}</span>
                      )}
                    </span>
                    <span className="font-medium">
                      {formatCents(item.unit_price * item.quantity)}
                    </span>
                  </div>
                ))}
              <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>{quote.quoted_total ? formatCents(quote.quoted_total) : "—"}</span>
              </div>
            </div>
            {quote.valid_until && (
              <p className="text-xs text-muted-foreground mt-3">
                Quote valid until {new Date(quote.valid_until).toLocaleDateString()}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Accept / Reject */}
      {canRespond && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-4">
              Ready to proceed? Accept this quote to start your order, or reject to decline.
            </p>
            <div className="flex gap-3">
              <Button onClick={handleAccept} disabled={loading}>
                {loading ? "Processing..." : "Accept Quote"}
              </Button>
              <Button variant="outline" onClick={handleReject} disabled={loading}>
                Decline
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
