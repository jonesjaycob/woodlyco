"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/lib/actions/orders";
import { createOrderFromQuote } from "@/lib/actions/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OrderDetail } from "@/lib/types/database";

const ORDER_STATUSES = [
  "confirmed",
  "materials",
  "building",
  "finishing",
  "ready",
  "shipped",
  "delivered",
  "completed",
] as const;

export function OrderStatusUpdater({ order }: { order: OrderDetail }) {
  const [status, setStatus] = useState(order.status);
  const [statusNote, setStatusNote] = useState(order.status_note ?? "");
  const [estimatedCompletion, setEstimatedCompletion] = useState(
    order.estimated_completion ? order.estimated_completion.split("T")[0] : ""
  );
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number ?? "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleUpdate() {
    setLoading(true);
    await updateOrderStatus(order.id, status, statusNote, {
      estimated_completion: estimatedCompletion || undefined,
      tracking_number: trackingNumber || undefined,
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ORDER_STATUSES.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Status Note</Label>
          <Textarea
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            placeholder="Add a note about this status update..."
            rows={2}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Estimated Completion</Label>
            <Input
              type="date"
              value={estimatedCompletion}
              onChange={(e) => setEstimatedCompletion(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Tracking Number</Label>
            <Input
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
            />
          </div>
        </div>

        <Button onClick={handleUpdate} disabled={loading}>
          {loading ? "Updating..." : "Update Order"}
        </Button>
      </CardContent>
    </Card>
  );
}

export function CreateOrderButton({ quoteId }: { quoteId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCreate() {
    setLoading(true);
    const result = await createOrderFromQuote(quoteId);
    if ("data" in result) {
      router.push(`/admin/orders/${result.data.id}`);
    }
    setLoading(false);
  }

  return (
    <Button onClick={handleCreate} disabled={loading}>
      {loading ? "Creating..." : "Create Order from Quote"}
    </Button>
  );
}
