"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/ui/logo";
import { UserMenu } from "@/components/auth/user-menu";
import {
  LayoutDashboardIcon,
  FileTextIcon,
  PackageIcon,
  UserIcon,
} from "lucide-react";

const navItems = [
  { title: "Dashboard", href: "/portal", icon: LayoutDashboardIcon },
  { title: "Quotes", href: "/portal/quotes", icon: FileTextIcon },
  { title: "Orders", href: "/portal/orders", icon: PackageIcon },
  { title: "Profile", href: "/portal/profile", icon: UserIcon },
];

export function PortalSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/">
          <Logo />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Portal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.href === "/portal"
                        ? pathname === "/portal"
                        : pathname.startsWith(item.href)
                    }
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
