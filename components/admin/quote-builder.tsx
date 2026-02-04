"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  addLineItem,
  removeLineItem,
  updateQuoteStatus,
  sendQuote,
} from "@/lib/actions/quotes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { QuoteDetail } from "@/lib/types/database";
import { PlusIcon, TrashIcon, SendIcon } from "lucide-react";

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

export function QuoteBuilder({ quote }: { quote: QuoteDetail }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const lineItems = (quote.quote_line_items ?? []).sort((a, b) => a.sort_order - b.sort_order);
  const total = lineItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

  async function handleAddItem(formData: FormData) {
    setLoading(true);
    await addLineItem(quote.id, {
      description: formData.get("description") as string,
      quantity: parseInt(formData.get("quantity") as string) || 1,
      unit_price: Math.round(parseFloat(formData.get("unit_price") as string) * 100),
      sort_order: lineItems.length,
    });
    setLoading(false);
    router.refresh();
  }

  async function handleRemoveItem(itemId: string) {
    setLoading(true);
    await removeLineItem(itemId, quote.id);
    setLoading(false);
    router.refresh();
  }

  async function handleStatusChange(status: string) {
    setLoading(true);
    await updateQuoteStatus(quote.id, status as QuoteDetail["status"]);
    setLoading(false);
    router.refresh();
  }

  async function handleSendQuote() {
    setLoading(true);
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);
    await sendQuote(quote.id, total, validUntil.toISOString());
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Quote Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Quote Request</CardTitle>
            <StatusBadge status={quote.status} type="quote" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Client</p>
              <p className="font-medium">{quote.profiles?.full_name || quote.profiles?.email}</p>
            </div>
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
              <p className="text-sm text-muted-foreground">Client Notes</p>
              <p className="text-sm mt-1">{quote.custom_notes}</p>
            </div>
          )}

          {/* Status Actions */}
          <div className="flex gap-2 pt-2">
            {quote.status === "submitted" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange("reviewing")}
                disabled={loading}
              >
                Mark as Reviewing
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card>
        <CardHeader>
          <CardTitle>Line Items</CardTitle>
        </CardHeader>
        <CardContent>
          {lineItems.length > 0 && (
            <div className="space-y-2 mb-4">
              {lineItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-2 p-2 rounded-md border">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} x {formatCents(item.unit_price)}
                    </p>
                  </div>
                  <p className="text-sm font-medium">
                    {formatCents(item.unit_price * item.quantity)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={loading}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatCents(total)}</span>
              </div>
            </div>
          )}

          {/* Add Line Item Form */}
          <form action={handleAddItem} className="grid gap-3 md:grid-cols-4 items-end border-t pt-4">
            <div className="md:col-span-2 space-y-1">
              <Label htmlFor="description" className="text-xs">
                Description
              </Label>
              <Input id="description" name="description" placeholder="Light post, delivery, etc." required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="quantity" className="text-xs">
                Qty
              </Label>
              <Input id="quantity" name="quantity" type="number" min="1" defaultValue="1" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="unit_price" className="text-xs">
                Unit Price ($)
              </Label>
              <div className="flex gap-2">
                <Input id="unit_price" name="unit_price" type="number" step="0.01" min="0" placeholder="0.00" required />
                <Button type="submit" size="icon" disabled={loading}>
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Send Quote */}
      {(quote.status === "reviewing" || quote.status === "submitted") && lineItems.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Ready to send this quote?</p>
                <p className="text-sm text-muted-foreground">
                  Total: {formatCents(total)} &middot; Valid for 30 days
                </p>
              </div>
              <Button onClick={handleSendQuote} disabled={loading}>
                <SendIcon className="mr-2 h-4 w-4" />
                Send Quote to Client
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
