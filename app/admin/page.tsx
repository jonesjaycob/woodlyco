"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileTextIcon, UsersIcon, PlusIcon } from "lucide-react";

type Stats = {
  totalQuotes: number;
  totalCustomers: number;
  draftQuotes: number;
  sentQuotes: number;
  acceptedQuotes: number;
  recentQuotes: any[];
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [quotesRes, customersRes] = await Promise.all([
          fetch("/api/quotes"),
          fetch("/api/customers"),
        ]);
        const quotes = await quotesRes.json();
        const customers = await customersRes.json();

        setStats({
          totalQuotes: quotes.length,
          totalCustomers: customers.length,
          draftQuotes: quotes.filter((q: any) => q.status === "DRAFT").length,
          sentQuotes: quotes.filter((q: any) => q.status === "SENT").length,
          acceptedQuotes: quotes.filter((q: any) => q.status === "ACCEPTED").length,
          recentQuotes: quotes.slice(0, 5),
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <div className="animate-pulse">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/admin/quotes/new">
          <Button className="gap-2">
            <PlusIcon className="w-4 h-4" />
            New Quote
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FileTextIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.totalQuotes || 0}</p>
              <p className="text-sm text-muted-foreground">Total Quotes</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <UsersIcon className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.totalCustomers || 0}</p>
              <p className="text-sm text-muted-foreground">Customers</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <FileTextIcon className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.draftQuotes || 0}</p>
              <p className="text-sm text-muted-foreground">Drafts</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <FileTextIcon className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.acceptedQuotes || 0}</p>
              <p className="text-sm text-muted-foreground">Accepted</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Quotes */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Quotes</h2>
          <Link href="/admin/quotes">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>
        {stats?.recentQuotes && stats.recentQuotes.length > 0 ? (
          <div className="space-y-3">
            {stats.recentQuotes.map((quote: any) => (
              <Link
                key={quote.id}
                href={`/admin/quotes/${quote.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <div>
                  <p className="font-medium">{quote.quoteNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {quote.customer?.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    ${parseFloat(quote.total).toFixed(2)}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      quote.status === "ACCEPTED"
                        ? "bg-green-100 text-green-700"
                        : quote.status === "SENT"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {quote.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No quotes yet.{" "}
            <Link href="/admin/quotes/new" className="text-primary underline">
              Create your first quote
            </Link>
          </p>
        )}
      </Card>
    </div>
  );
}
