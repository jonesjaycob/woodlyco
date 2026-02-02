import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { LocalBusinessJsonLd, ProductJsonLd } from "@/components/structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://woodlyco.com"),
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
    "driveway light posts",
    "garden lighting",
    "Pell City Alabama",
  ],
  authors: [{ name: "Woodly Company" }],
  creator: "Woodly Company",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://woodlyco.com",
    siteName: "Woodly Company",
    title: "Woodly Company | Handcrafted Wooden Light Posts",
    description:
      "Custom handcrafted wooden light posts built with traditional timber frame methods. Solar, battery, or electric options.",
    images: [
      {
        url: "/IMG_5638.jpg",
        width: 1200,
        height: 630,
        alt: "Handcrafted wooden light post by Woodly Company",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Woodly Company | Handcrafted Wooden Light Posts",
    description:
      "Custom handcrafted wooden light posts built with traditional timber frame methods.",
    images: ["/IMG_5638.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <LocalBusinessJsonLd />
        <ProductJsonLd />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
