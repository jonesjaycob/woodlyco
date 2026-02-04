"use client";

import Link from "next/link";
import LightPost1 from "@/components/ui/light-post-1";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Light post with flickering glow */}
      <div className="relative w-48 h-80 mb-8">
        {/* Glow gradient — flickers on and off */}
        <div
          className="absolute -top-20 -left-16 w-80 h-80 rounded-full pointer-events-none animate-flicker"
          style={{
            background:
              "radial-gradient(#fefce8 0%, #fde68a 10%, #fbbf24 20%, transparent 50%)",
          }}
        />
        <div className="relative z-10 h-full flex items-end justify-center">
          <LightPost1 width={140} height={320} stroke="currentColor" />
        </div>
      </div>

      {/* Copy */}
      <h1 className="text-6xl font-bold mb-2">404</h1>
      <p className="text-xl text-muted-foreground mb-1">
        This page is having a hard time lighting up.
      </p>
      <p className="text-sm text-muted-foreground mb-8">
        Looks like the post you're looking for doesn't exist.
      </p>

      <div className="flex gap-4">
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>

      {/* Flicker keyframes */}
      <style>{`
        @keyframes flicker {
          0%, 100% { opacity: 0.05; }
          4% { opacity: 0.35; }
          6% { opacity: 0.08; }
          8% { opacity: 0.4; }
          12% { opacity: 0.05; }
          20% { opacity: 0.45; }
          22% { opacity: 0.1; }
          40% { opacity: 0.5; }
          42% { opacity: 0.08; }
          44% { opacity: 0.45; }
          60% { opacity: 0.5; }
          62% { opacity: 0.1; }
          64% { opacity: 0.55; }
          70% { opacity: 0.05; }
          72% { opacity: 0.4; }
          74% { opacity: 0.08; }
          80% { opacity: 0.5; }
          90% { opacity: 0.45; }
          92% { opacity: 0.08; }
        }
        .animate-flicker {
          animation: flicker 4s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
