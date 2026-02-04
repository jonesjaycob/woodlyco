"use client";

import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FileTextIcon, PackageIcon } from "lucide-react";
import type { Conversation } from "@/lib/actions/messages";

type Props = {
  conversations: Conversation[];
};

export function AdminConversationList({ conversations }: Props) {
  const router = useRouter();

  if (conversations.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          No conversations yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((convo) => {
        const href =
          convo.type === "quote"
            ? `/admin/quotes/${convo.id}`
            : `/admin/orders/${convo.id}`;

        return (
          <Card
            key={`${convo.type}-${convo.id}`}
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => router.push(href)}
          >
            <CardContent className="flex items-center gap-4 py-4">
              {/* Icon */}
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                {convo.type === "quote" ? (
                  <FileTextIcon className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <PackageIcon className="h-5 w-5 text-muted-foreground" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-medium text-sm truncate">
                    {convo.clientName}
                  </span>
                  <Badge variant="outline" className="text-xs capitalize flex-shrink-0">
                    {convo.type}
                  </Badge>
                  <StatusBadge
                    status={convo.status}
                    type={convo.type === "quote" ? "quote" : "order"}
                  />
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {convo.lastMessage}
                </p>
              </div>

              {/* Meta */}
              <div className="flex-shrink-0 text-right">
                <p className="text-xs text-muted-foreground">
                  {formatRelativeTime(convo.lastMessageAt)}
                </p>
                {convo.unreadCount > 0 && (
                  <Badge className="mt-1 h-5 min-w-[20px] justify-center">
                    {convo.unreadCount}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
