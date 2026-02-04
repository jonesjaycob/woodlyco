import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ArrowLeftIcon } from "lucide-react";
import type { Profile, Quote, Order } from "@/lib/types/database";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  const profile = profileData as Profile | null;
  if (!profile) notFound();

  const { data: quotesData } = await supabase
    .from("quotes")
    .select("*")
    .eq("client_id", id)
    .order("created_at", { ascending: false });

  const quotes = (quotesData ?? []) as Quote[];

  const { data: ordersData } = await supabase
    .from("orders")
    .select("*")
    .eq("client_id", id)
    .order("created_at", { ascending: false });

  const orders = (ordersData ?? []) as Order[];

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/clients"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Clients
      </Link>

      <h1 className="text-2xl font-bold mb-6">{profile.full_name || profile.email}</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{profile.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{profile.phone || "—"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">
                {[
                  profile.address_line1,
                  profile.address_line2,
                  profile.address_city,
                  profile.address_state,
                  profile.address_zip,
                ]
                  .filter(Boolean)
                  .join(", ") || "—"}
              </p>
            </div>
            {profile.property_type && (
              <div>
                <p className="text-sm text-muted-foreground">Property Type</p>
                <p className="font-medium">{profile.property_type}</p>
              </div>
            )}
            {profile.property_notes && (
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Property Notes</p>
                <p className="text-sm">{profile.property_notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quotes ({quotes?.length ?? 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {quotes && quotes.length > 0 ? (
              <div className="space-y-2">
                {quotes.map((quote) => (
                  <Link
                    key={quote.id}
                    href={`/admin/quotes/${quote.id}`}
                    className="flex items-center justify-between p-3 rounded-md hover:bg-accent/50"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {quote.wood_type || "Custom"} Light Post
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(quote.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <StatusBadge status={quote.status} type="quote" />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No quotes yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders ({orders?.length ?? 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {orders && orders.length > 0 ? (
              <div className="space-y-2">
                {orders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between p-3 rounded-md hover:bg-accent/50"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        Order — ${(order.total / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <StatusBadge status={order.status} type="order" />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
