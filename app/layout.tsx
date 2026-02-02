import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Woodly Company | Handcrafted Wooden Light Posts",
    template: "%s | Woodly Company",
  },
  description:
    "Custom handcrafted wooden light posts built with traditional timber frame methods. Solar, battery, or electric options for driveways, gardens, and yards.",
  keywords: [
    "wooden light posts",
    "timber frame",
    "custom light posts",
    "outdoor lighting",
    "handcrafted",
    "solar light posts",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
