"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import type { Profile } from "@/lib/types/database";

export function ClientTable({ clients }: { clients: Profile[] }) {
  const router = useRouter();

  const columns = [
    {
      header: "Name",
      cell: (row: Profile) => row.full_name || "—",
    },
    {
      header: "Email",
      accessorKey: "email" as const,
    },
    {
      header: "Phone",
      cell: (row: Profile) => row.phone || "—",
    },
    {
      header: "Location",
      cell: (row: Profile) =>
        row.address_city && row.address_state
          ? `${row.address_city}, ${row.address_state}`
          : "—",
    },
    {
      header: "Joined",
      cell: (row: Profile) => new Date(row.created_at).toLocaleDateString(),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={clients}
      onRowClick={(row) => router.push(`/admin/clients/${row.id}`)}
    />
  );
}
