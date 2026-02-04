import { notFound } from "next/navigation";
import Link from "next/link";
import { getQuoteById } from "@/lib/actions/quotes";
import { getMessages } from "@/lib/actions/messages";
import { createClient } from "@/lib/supabase/server";
import { QuoteDetailCard } from "@/components/portal/quote-detail-card";
import { MessageThread } from "@/components/portal/message-thread";
import { ArrowLeftIcon } from "lucide-react";

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

  const messages = await getMessages("quote", id);

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
