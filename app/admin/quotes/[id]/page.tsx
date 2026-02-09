"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeftIcon,
  DownloadIcon,
  EditIcon,
  SaveIcon,
  XIcon,
} from "lucide-react";

type LineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: string;
  total: string;
  sortOrder: number;
};

type Quote = {
  id: string;
  quoteNumber: string;
  status: string;
  title: string | null;
  description: string | null;
  subtotal: string;
  tax: string;
  total: string;
  validUntil: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
  } | null;
  lineItems: LineItem[];
};

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  SENT: "bg-blue-100 text-blue-700",
  ACCEPTED: "bg-green-100 text-green-700",
  DECLINED: "bg-red-100 text-red-700",
  EXPIRED: "bg-yellow-100 text-yellow-700",
};

const statusOptions = ["DRAFT", "SENT", "ACCEPTED", "DECLINED", "EXPIRED"];

export default function QuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    status: "",
    title: "",
    description: "",
    notes: "",
  });

  useEffect(() => {
    fetchQuote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function fetchQuote() {
    try {
      const res = await fetch(`/api/quotes/${params.id}`);
      if (!res.ok) {
        if (res.status === 404) {
          setError("Quote not found");
        } else {
          throw new Error("Failed to fetch");
        }
        return;
      }
      const data = await res.json();
      setQuote(data);
      setEditForm({
        status: data.status,
        title: data.title || "",
        description: data.description || "",
        notes: data.notes || "",
      });
    } catch {
      setError("Failed to load quote");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!quote) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/quotes/${quote.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Failed to update");
      const updated = await res.json();
      setQuote(updated);
      setEditing(false);
    } catch {
      setError("Failed to update quote");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!quote) return;
    if (!confirm("Are you sure you want to delete this quote?")) return;
    try {
      await fetch(`/api/quotes/${quote.id}`, { method: "DELETE" });
      router.push("/admin/quotes");
    } catch {
      setError("Failed to delete quote");
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-6 w-24 bg-muted animate-pulse rounded" />
        <div className="h-10 w-64 bg-muted animate-pulse rounded" />
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="h-4 w-20 bg-muted animate-pulse rounded mb-2" />
              <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            </Card>
          ))}
        </div>
        <Card className="p-6">
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-5 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (error && !quote) {
    return (
      <div className="max-w-4xl mx-auto">
        <Link
          href="/admin/quotes"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Quotes
        </Link>
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">{error}</p>
          <Link href="/admin/quotes">
            <Button>Back to Quotes</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (!quote) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/admin/quotes"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Quotes
      </Link>

      {error && (
        <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{quote.quoteNumber}</h1>
          {quote.title && (
            <p className="text-lg text-muted-foreground mt-1">{quote.title}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`/api/quotes/${quote.id}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="gap-2">
              <DownloadIcon className="w-4 h-4" />
              PDF
            </Button>
          </a>
          {editing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(false)}
                className="gap-2"
              >
                <XIcon className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving}
                className="gap-2"
              >
                <SaveIcon className="w-4 h-4" />
                {saving ? "Saving..." : "Save"}
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing(true)}
              className="gap-2"
            >
              <EditIcon className="w-4 h-4" />
              Edit
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Status and Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Status</p>
          {editing ? (
            <select
              value={editForm.status}
              onChange={(e) =>
                setEditForm({ ...editForm, status: e.target.value })
              }
              className="w-full p-1 border rounded-md bg-background text-sm"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          ) : (
            <Badge className={statusColors[quote.status]}>{quote.status}</Badge>
          )}
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Total</p>
          <p className="text-xl font-bold">
            ${parseFloat(quote.total).toFixed(2)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Created</p>
          <p className="font-medium">
            {new Date(quote.createdAt).toLocaleDateString()}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Valid Until</p>
          <p className="font-medium">
            {quote.validUntil
              ? new Date(quote.validUntil).toLocaleDateString()
              : "No expiry"}
          </p>
        </Card>
      </div>

      {/* Customer Info */}
      {quote.customer && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-3">Customer</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Name:</span>{" "}
              <span className="font-medium">{quote.customer.name}</span>
            </div>
            {quote.customer.email && (
              <div>
                <span className="text-muted-foreground">Email:</span>{" "}
                <a
                  href={`mailto:${quote.customer.email}`}
                  className="font-medium text-primary hover:underline"
                >
                  {quote.customer.email}
                </a>
              </div>
            )}
            {quote.customer.phone && (
              <div>
                <span className="text-muted-foreground">Phone:</span>{" "}
                <span className="font-medium">{quote.customer.phone}</span>
              </div>
            )}
            {quote.customer.city && quote.customer.state && (
              <div>
                <span className="text-muted-foreground">Location:</span>{" "}
                <span className="font-medium">
                  {quote.customer.city}, {quote.customer.state}{" "}
                  {quote.customer.zip}
                </span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Description */}
      {editing ? (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-3">Details</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
              />
            </div>
          </div>
        </Card>
      ) : (
        quote.description && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground">{quote.description}</p>
          </Card>
        )
      )}

      {/* Line Items */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Line Items</h2>
        {quote.lineItems.length > 0 ? (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Description</th>
                  <th className="text-right py-2 font-medium">Qty</th>
                  <th className="text-right py-2 font-medium">Unit Price</th>
                  <th className="text-right py-2 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {quote.lineItems.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="py-3">{item.description}</td>
                    <td className="py-3 text-right">{item.quantity}</td>
                    <td className="py-3 text-right">
                      ${parseFloat(item.unitPrice).toFixed(2)}
                    </td>
                    <td className="py-3 text-right font-medium">
                      ${parseFloat(item.total).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex justify-end">
              <div className="w-64 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>${parseFloat(quote.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax:</span>
                  <span>${parseFloat(quote.tax).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>${parseFloat(quote.total).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground">No line items</p>
        )}
      </Card>

      {/* Notes */}
      {editing ? (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-3">Notes</h2>
          <Textarea
            value={editForm.notes}
            onChange={(e) =>
              setEditForm({ ...editForm, notes: e.target.value })
            }
            placeholder="Internal notes..."
          />
        </Card>
      ) : (
        quote.notes && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-2">Notes</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {quote.notes}
            </p>
          </Card>
        )
      )}
    </div>
  );
}
