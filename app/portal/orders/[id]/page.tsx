import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrderById } from "@/lib/actions/orders";
import { getMessages } from "@/lib/actions/messages";
import { createClient } from "@/lib/supabase/server";
import { OrderTimeline } from "@/components/portal/order-timeline";
import { MessageThread } from "@/components/portal/message-thread";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ArrowLeftIcon } from "lucide-react";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const order = await getOrderById(id);
  if (!order) notFound();

  const messages = await getMessages("order", id);

  return (
    <div className="max-w-3xl">
      <Link
        href="/portal/orders"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Orders
      </Link>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Order Details</CardTitle>
              <StatusBadge status={order.status} type="order" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">
                  ${(order.total / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>
              {order.estimated_completion && (
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Completion</p>
                  <p className="font-medium">
                    {new Date(order.estimated_completion).toLocaleDateString()}
                  </p>
                </div>
              )}
              {order.tracking_number && (
                <div>
                  <p className="text-sm text-muted-foreground">Tracking Number</p>
                  <p className="font-medium">{order.tracking_number}</p>
                </div>
              )}
              {order.delivery_address && (
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Delivery Address</p>
                  <p className="font-medium">{order.delivery_address}</p>
                </div>
              )}
            </div>
            {order.status_note && (
              <div>
                <p className="text-sm text-muted-foreground">Status Note</p>
                <p className="text-sm mt-1">{order.status_note}</p>
              </div>
            )}
            {order.quotes && (
              <div className="grid gap-4 md:grid-cols-2 pt-2 border-t">
                {order.quotes.wood_type && (
                  <div>
                    <p className="text-sm text-muted-foreground">Wood Type</p>
                    <p className="font-medium">{order.quotes.wood_type}</p>
                  </div>
                )}
                {order.quotes.power_source && (
                  <div>
                    <p className="text-sm text-muted-foreground">Power Source</p>
                    <p className="font-medium capitalize">{order.quotes.power_source}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderTimeline currentStatus={order.status} />
          </CardContent>
        </Card>

        <MessageThread
          messages={messages}
          type="order"
          refId={id}
          currentUserId={user!.id}
        />
      </div>
    </div>
  );
}
