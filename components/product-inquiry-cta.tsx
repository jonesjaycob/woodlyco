import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ProductInquiryCtaProps {
  productId: string;
  productName: string;
  isSold: boolean;
}

export function ProductInquiryCta({
  productId,
  productName,
  isSold,
}: ProductInquiryCtaProps) {
  if (isSold) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          This post has found its home. Interested in something similar?
        </p>
        <Button asChild variant="outline" size="lg" className="w-full">
          <Link href="/get-a-quote">Request a Custom Order</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button size="lg" className="w-full" asChild>
        <Link href="/get-a-quote">Inquire About This Post</Link>
      </Button>
      <p className="text-sm text-muted-foreground text-center">
        Create an account to submit a detailed quote request and track it in real-time.
      </p>
    </div>
  );
}
