import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ClientTable } from "@/components/admin/client-table";
import type { Profile } from "@/lib/types/database";

export const metadata: Metadata = {
  title: "Clients",
};

export default async function ClientsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "client")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Clients</h1>
      <ClientTable clients={(data as Profile[]) ?? []} />
    </div>
  );
}
