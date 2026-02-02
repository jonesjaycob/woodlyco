"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InquiryModal } from "@/components/inquiry-modal";

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
          <Link href="/contact">Request a Custom Order</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <InquiryModal productId={productId} productName={productName}>
        <Button size="lg" className="w-full">
          Inquire About This Post
        </Button>
      </InquiryModal>
      <p className="text-sm text-muted-foreground text-center">
        We'll reach out within 1-2 business days to discuss delivery options.
      </p>
    </div>
  );
}
