"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  LayoutDashboardIcon,
  FileTextIcon,
  UsersIcon,
  LogOutIcon,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/admin/quotes", label: "Quotes", icon: FileTextIcon },
  { href: "/admin/customers", label: "Customers", icon: UsersIcon },
];

function LoginForm({ onLogin }: { onLogin: (password: string) => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    onLogin(password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-2">Woodly Admin</h1>
        <p className="text-muted-foreground mb-6">Enter password to continue</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const auth = localStorage.getItem("woodly-admin-auth");
    setIsAuthenticated(auth === "true");
  }, []);

  const handleLogin = async (password: string) => {
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      localStorage.setItem("woodly-admin-auth", "true");
      setIsAuthenticated(true);
    } else {
      alert("Invalid password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("woodly-admin-auth");
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-muted/50">
      {/* Top Nav */}
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="font-bold text-lg">
              Woodly Admin
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              View Site
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOutIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
