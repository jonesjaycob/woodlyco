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
  UsersIcon,
  FileTextIcon,
  PackageIcon,
  BoxIcon,
  NewspaperIcon,
  ImageIcon,
  MessageSquareIcon,
} from "lucide-react";

const navItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboardIcon },
  { title: "Clients", href: "/admin/clients", icon: UsersIcon },
  { title: "Quotes", href: "/admin/quotes", icon: FileTextIcon },
  { title: "Orders", href: "/admin/orders", icon: PackageIcon },
  { title: "Messages", href: "/admin/messages", icon: MessageSquareIcon },
  { title: "Inventory", href: "/admin/inventory", icon: BoxIcon },
  { title: "Blog", href: "/admin/blog", icon: NewspaperIcon },
  { title: "Gallery", href: "/admin/gallery", icon: ImageIcon },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/">
          <Logo />
        </Link>
        <span className="text-xs font-medium text-muted-foreground mt-1">
          Admin
        </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.href === "/admin"
                        ? pathname === "/admin"
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
