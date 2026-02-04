import { notFound } from "next/navigation";
import Link from "next/link";
import { getQuoteById, getOrderIdForQuote } from "@/lib/actions/quotes";
import { getMessages } from "@/lib/actions/messages";
import { createClient } from "@/lib/supabase/server";
import { QuoteDetailCard } from "@/components/portal/quote-detail-card";
import { MessageThread } from "@/components/portal/message-thread";
import { QuoteClosedNotice } from "@/components/portal/quote-closed-notice";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const quote = await getQuoteById(id);
  if (!quote) notFound();

  const isAccepted = quote.status === "accepted";
  const isClosed = quote.status === "rejected" || quote.status === "expired";
  const showMessages = !isAccepted && !isClosed;

  const messages = showMessages ? await getMessages("quote", id) : [];
  const orderId = isAccepted ? await getOrderIdForQuote(id) : null;

  return (
    <div className="max-w-3xl">
      <Link
        href="/portal/quotes"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Quotes
      </Link>

      <div className="space-y-6">
        <QuoteDetailCard quote={quote} />

        {/* Accepted — link to order */}
        {isAccepted && orderId && (
          <Card>
            <CardContent className="py-6">
              <p className="text-sm text-muted-foreground mb-3">
                This quote has been accepted and your order is in progress.
                All messages will continue in your order.
              </p>
              <Link
                href={`/portal/orders/${orderId}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                Go to your order
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Rejected or expired — closed notice with re-open */}
        {isClosed && <QuoteClosedNotice quoteId={id} status={quote.status} />}

        {/* Active quote — show messages */}
        {showMessages && (
          <MessageThread
            messages={messages}
            type="quote"
            refId={id}
            currentUserId={user!.id}
          />
        )}
      </div>
    </div>
  );
}
