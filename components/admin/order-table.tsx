"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import type { OrderWithClient } from "@/lib/types/database";

export function OrderTable({ orders }: { orders: OrderWithClient[] }) {
  const router = useRouter();

  const columns = [
    {
      header: "Client",
      cell: (row: OrderWithClient) => row.profiles?.full_name || row.profiles?.email || "—",
    },
    {
      header: "Total",
      cell: (row: OrderWithClient) =>
        `$${(row.total / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      header: "Status",
      cell: (row: OrderWithClient) => <StatusBadge status={row.status} type="order" />,
    },
    {
      header: "Est. Completion",
      cell: (row: OrderWithClient) =>
        row.estimated_completion
          ? new Date(row.estimated_completion).toLocaleDateString()
          : "—",
    },
    {
      header: "Created",
      cell: (row: OrderWithClient) => new Date(row.created_at).toLocaleDateString(),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={orders}
      onRowClick={(row) => router.push(`/admin/orders/${row.id}`)}
    />
  );
}
