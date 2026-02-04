import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PortalSidebar } from "@/components/portal/portal-sidebar";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <PortalSidebar />
      <main className="flex-1 min-h-screen">
        <div className="flex items-center gap-2 p-4 border-b">
          <SidebarTrigger />
        </div>
        <div className="p-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}
