import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { StatsCards } from "@/components/admin/stats-cards";
import {
  UsersIcon,
  FileTextIcon,
  PackageIcon,
  DollarSignIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: clientsCount },
    { count: quotesCount },
    { count: ordersCount },
    { count: activeQuotesCount },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "client"),
    supabase.from("quotes").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase
      .from("quotes")
      .select("*", { count: "exact", head: true })
      .in("status", ["submitted", "reviewing"]),
  ]);

  const stats = [
    {
      title: "Total Clients",
      value: clientsCount ?? 0,
      description: "Registered accounts",
      icon: UsersIcon,
    },
    {
      title: "Total Quotes",
      value: quotesCount ?? 0,
      description: "All time",
      icon: FileTextIcon,
    },
    {
      title: "Pending Review",
      value: activeQuotesCount ?? 0,
      description: "Quotes needing attention",
      icon: DollarSignIcon,
    },
    {
      title: "Active Orders",
      value: ordersCount ?? 0,
      description: "In progress",
      icon: PackageIcon,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <StatsCards stats={stats} />
    </div>
  );
}
