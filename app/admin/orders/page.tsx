import type { Metadata } from "next";
import { getAllOrders } from "@/lib/actions/orders";
import { OrderTable } from "@/components/admin/order-table";

export const metadata: Metadata = {
  title: "All Orders",
};

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <OrderTable orders={orders} />
    </div>
  );
}
