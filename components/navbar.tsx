"use client";

import * as React from "react";
import Link from "next/link";
import { MenuIcon, XIcon } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Logo } from "./ui/logo";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./auth/user-menu";
import { useAuth } from "@/hooks/use-auth";

const products = [
  {
    title: "Standard Light Post",
    href: "/gallery#standard",
    description: "Our classic 11″×11″×11′ timber frame light post.",
  },
  {
    title: "Custom Designs",
    href: "/gallery#custom",
    description: "Tailored dimensions and styles for your space.",
  },
  {
    title: "Lighting Options",
    href: "/gallery#lighting",
    description: "Solar, battery, or electric — choose your power source.",
  },
];

const company = [
  {
    title: "About Us",
    href: "/about",
    description: "Our story and commitment to craftsmanship.",
  },
  {
    title: "Our Process",
    href: "/about#process",
    description: "Traditional timber frame joinery methods.",
  },
  {
    title: "Contact",
    href: "/contact",
    description: "Get in touch for quotes and questions.",
  },
];

export function NavigationMenuMain() {
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { user, profile } = useAuth();

  return (
    <nav className="absolute top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          <NavigationMenu viewport={isMobile}>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-2 p-4">
                    {products.map((item) => (
                      <NavItem key={item.href} {...item} />
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Company</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-2 p-4">
                    {company.map((item) => (
                      <NavItem key={item.href} {...item} />
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/shop">Shop</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/gallery">Gallery</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/blog">Blog</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <ThemeToggle />
          <Button asChild>
            <Link href="/get-a-quote">Get a Quote</Link>
          </Button>
          {user ? (
            <UserMenu />
          ) : (
            <Button variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>

        {/* Mobile Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <XIcon /> : <MenuIcon />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
            <MobileSection title="Products" items={products} />
            <MobileSection title="Company" items={company} />
            <Link
              href="/shop"
              className="font-medium py-2"
              onClick={() => setMobileOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/gallery"
              className="font-medium py-2"
              onClick={() => setMobileOpen(false)}
            >
              Gallery
            </Link>
            <Link
              href="/blog"
              className="font-medium py-2"
              onClick={() => setMobileOpen(false)}
            >
              Blog
            </Link>
            <Button className="w-full" asChild>
              <Link href="/get-a-quote">Get a Quote</Link>
            </Button>
            <div className="flex items-center justify-between mt-4">
              <ThemeToggle />
              {user ? (
                <div className="flex items-center gap-3">
                  <Button variant="outline" asChild>
                    <Link href={profile?.role === "admin" ? "/admin" : "/portal"}>
                      Dashboard
                    </Link>
                  </Button>
                  <UserMenu />
                </div>
              ) : (
                <Button variant="outline" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavItem({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link href={href} className="block p-3 rounded-md hover:bg-accent">
          <div className="text-sm font-medium">{title}</div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

function MobileSection({
  title,
  items,
}: {
  title: string;
  items: { title: string; href: string; description: string }[];
}) {
  return (
    <div>
      <h4 className="font-semibold text-muted-foreground text-sm mb-2">
        {title}
      </h4>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="py-1">
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
