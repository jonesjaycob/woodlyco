"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon, TrashIcon } from "lucide-react";

type LineItem = {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export default function NewQuotePage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerId: "",
    title: "",
    description: "",
    notes: "",
    validUntil: "",
  });
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: "", quantity: 1, unitPrice: 0, total: 0 },
  ]);

  useEffect(() => {
    fetch("/api/customers")
      .then((res) => res.json())
      .then(setCustomers);
  }, []);

  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0; // No tax for now, can be configured
  const total = subtotal + tax;

  function updateLineItem(index: number, field: keyof LineItem, value: any) {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    if (field === "quantity" || field === "unitPrice") {
      updated[index].total = updated[index].quantity * updated[index].unitPrice;
    }
    setLineItems(updated);
  }

  function addLineItem() {
    setLineItems([
      ...lineItems,
      { description: "", quantity: 1, unitPrice: 0, total: 0 },
    ]);
  }

  function removeLineItem(index: number) {
    setLineItems(lineItems.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.customerId) {
      alert("Please select a customer");
      return;
    }
    if (lineItems.length === 0 || !lineItems[0].description) {
      alert("Please add at least one line item");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          subtotal,
          tax,
          total,
          lineItems: lineItems.filter((item) => item.description),
        }),
      });

      if (res.ok) {
        const quote = await res.json();
        router.push(`/admin/quotes/${quote.id}`);
      } else {
        alert("Error creating quote");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating quote");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">New Quote</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Selection */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Customer</h2>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="customerId">Select Customer *</Label>
              <select
                id="customerId"
                className="w-full mt-1 p-2 border rounded-md bg-background"
                value={form.customerId}
                onChange={(e) =>
                  setForm({ ...form, customerId: e.target.value })
                }
                required
              >
                <option value="">Choose a customer...</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} {customer.email && `(${customer.email})`}
                  </option>
                ))}
              </select>
            </div>
            {customers.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No customers yet.{" "}
                <a href="/admin/customers/new" className="text-primary underline">
                  Create a customer first
                </a>
              </p>
            )}
          </div>
        </Card>

        {/* Quote Details */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Quote Details</h2>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g., Solar Light Post Installation"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Project details..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="validUntil">Valid Until</Label>
              <Input
                id="validUntil"
                type="date"
                value={form.validUntil}
                onChange={(e) =>
                  setForm({ ...form, validUntil: e.target.value })
                }
              />
            </div>
          </div>
        </Card>

        {/* Line Items */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Line Items</h2>
            <Button type="button" variant="outline" size="sm" onClick={addLineItem}>
              <PlusIcon className="w-4 h-4 mr-1" />
              Add Item
            </Button>
          </div>

          <div className="space-y-4">
            {lineItems.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-3 items-end p-3 bg-muted/50 rounded-lg"
              >
                <div className="col-span-5">
                  <Label>Description</Label>
                  <Input
                    placeholder="Item description"
                    value={item.description}
                    onChange={(e) =>
                      updateLineItem(index, "description", e.target.value)
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label>Qty</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateLineItem(index, "quantity", parseInt(e.target.value) || 1)
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label>Unit Price</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) =>
                      updateLineItem(index, "unitPrice", parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label>Total</Label>
                  <Input value={`$${item.total.toFixed(2)}`} disabled />
                </div>
                <div className="col-span-1">
                  {lineItems.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLineItem(index)}
                    >
                      <TrashIcon className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-6 flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Notes */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Notes</h2>
          <Textarea
            placeholder="Additional notes for the quote..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Quote"}
          </Button>
        </div>
      </form>
    </div>
  );
}
