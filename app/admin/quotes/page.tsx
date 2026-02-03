"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, DownloadIcon, TrashIcon } from "lucide-react";

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  SENT: "bg-blue-100 text-blue-700",
  ACCEPTED: "bg-green-100 text-green-700",
  DECLINED: "bg-red-100 text-red-700",
  EXPIRED: "bg-yellow-100 text-yellow-700",
};

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotes();
  }, []);

  async function fetchQuotes() {
    try {
      const res = await fetch("/api/quotes");
      const data = await res.json();
      setQuotes(data);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this quote?")) return;
    try {
      await fetch(`/api/quotes/${id}`, { method: "DELETE" });
      setQuotes(quotes.filter((q) => q.id !== id));
    } catch (error) {
      console.error("Error deleting quote:", error);
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading quotes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quotes</h1>
        <Link href="/admin/quotes/new">
          <Button className="gap-2">
            <PlusIcon className="w-4 h-4" />
            New Quote
          </Button>
        </Link>
      </div>

      {quotes.length > 0 ? (
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-medium">Quote #</th>
                <th className="text-left p-4 font-medium">Customer</th>
                <th className="text-left p-4 font-medium">Title</th>
                <th className="text-left p-4 font-medium">Total</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Date</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote) => (
                <tr key={quote.id} className="border-t hover:bg-muted/50">
                  <td className="p-4">
                    <Link
                      href={`/admin/quotes/${quote.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {quote.quoteNumber}
                    </Link>
                  </td>
                  <td className="p-4">{quote.customer?.name}</td>
                  <td className="p-4 text-muted-foreground">
                    {quote.title || "-"}
                  </td>
                  <td className="p-4 font-medium">
                    ${parseFloat(quote.total).toFixed(2)}
                  </td>
                  <td className="p-4">
                    <Badge className={statusColors[quote.status]}>
                      {quote.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(quote.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/api/quotes/${quote.id}/pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="sm">
                          <DownloadIcon className="w-4 h-4" />
                        </Button>
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(quote.id)}
                      >
                        <TrashIcon className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No quotes yet</p>
          <Link href="/admin/quotes/new">
            <Button>Create Your First Quote</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
