import { notFound } from "next/navigation";
import Link from "next/link";
import { getQuoteById } from "@/lib/actions/quotes";
import { getMessages } from "@/lib/actions/messages";
import { createClient } from "@/lib/supabase/server";
import { QuoteBuilder } from "@/components/admin/quote-builder";
import { CreateOrderButton } from "@/components/admin/order-status-updater";
import { MessageThread } from "@/components/portal/message-thread";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeftIcon } from "lucide-react";

export default async function AdminQuoteDetailPage({
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

  const messages = await getMessages("quote", id);

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/quotes"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Quotes
      </Link>

      <div className="space-y-6">
        <QuoteBuilder quote={quote} />
        {quote.status === "accepted" && (
          <Card>
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="font-medium">Quote Accepted</p>
                <p className="text-sm text-muted-foreground">
                  Convert this quote into an active order.
                </p>
              </div>
              <CreateOrderButton quoteId={quote.id} />
            </CardContent>
          </Card>
        )}
        <MessageThread
          messages={messages}
          type="quote"
          refId={id}
          currentUserId={user!.id}
        />
      </div>
    </div>
  );
}
