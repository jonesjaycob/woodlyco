import type { Metadata } from "next";
import Link from "next/link";
import { getClientOrders } from "@/lib/actions/orders";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { PackageIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "My Orders",
};

export default async function OrdersPage() {
  const orders = await getClientOrders();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <EmptyState
          icon={PackageIcon}
          title="No orders yet"
          description="Once a quote is accepted and converted to an order, it will appear here."
        />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link key={order.id} href={`/portal/orders/${order.id}`}>
              <Card className="hover:bg-accent/50 transition-colors">
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium">
                      Order &middot; $
                      {(order.total / 100).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                      {order.estimated_completion && (
                        <span>
                          {" "}
                          &middot; Est.{" "}
                          {new Date(order.estimated_completion).toLocaleDateString()}
                        </span>
                      )}
                    </p>
                  </div>
                  <StatusBadge status={order.status} type="order" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
