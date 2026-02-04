"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import type { QuoteWithClient } from "@/lib/types/database";

export function QuoteTable({ quotes }: { quotes: QuoteWithClient[] }) {
  const router = useRouter();

  const columns = [
    {
      header: "Client",
      cell: (row: QuoteWithClient) => row.profiles?.full_name || row.profiles?.email || "—",
    },
    {
      header: "Type",
      cell: (row: QuoteWithClient) =>
        `${row.wood_type || "Custom"} · ${row.power_source || "TBD"}`,
    },
    {
      header: "Qty",
      cell: (row: QuoteWithClient) => String(row.quantity),
      className: "text-center w-16",
    },
    {
      header: "Total",
      cell: (row: QuoteWithClient) =>
        row.quoted_total
          ? `$${(row.quoted_total / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
          : "—",
    },
    {
      header: "Status",
      cell: (row: QuoteWithClient) => <StatusBadge status={row.status} type="quote" />,
    },
    {
      header: "Date",
      cell: (row: QuoteWithClient) => new Date(row.created_at).toLocaleDateString(),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={quotes}
      onRowClick={(row) => router.push(`/admin/quotes/${row.id}`)}
    />
  );
}
