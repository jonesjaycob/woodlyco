import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileTextIcon, PackageIcon, PlusIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Portal Dashboard",
};

export default async function PortalDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { count: quotesCount } = await supabase
    .from("quotes")
    .select("*", { count: "exact", head: true })
    .eq("client_id", user!.id);

  const { count: ordersCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("client_id", user!.id);

  const { count: unreadCount } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false)
    .neq("sender_id", user!.id);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/portal/quotes/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            New Quote Request
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/portal/quotes">
          <Card className="hover:bg-accent/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Quotes</CardTitle>
              <FileTextIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quotesCount ?? 0}</div>
              <p className="text-xs text-muted-foreground">Total quote requests</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/portal/orders">
          <Card className="hover:bg-accent/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <PackageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ordersCount ?? 0}</div>
              <p className="text-xs text-muted-foreground">Active orders</p>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount ?? 0}</div>
            <p className="text-xs text-muted-foreground">New messages</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
