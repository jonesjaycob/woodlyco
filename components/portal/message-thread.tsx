"use client";

import { useEffect, useRef, useState } from "react";
import { sendMessage, markAsRead } from "@/lib/actions/messages";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MessageWithSender } from "@/lib/types/database";
import { SendIcon } from "lucide-react";

type MessageThreadProps = {
  messages: MessageWithSender[];
  type: "quote" | "order";
  refId: string;
  currentUserId: string;
};

export function MessageThread({ messages, type, refId, currentUserId }: MessageThreadProps) {
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const unreadIds = messages
      .filter((m) => !m.is_read && m.sender_id && m.sender_id !== currentUserId)
      .map((m) => m.id);
    if (unreadIds.length > 0) {
      markAsRead(unreadIds);
    }
  }, [messages, currentUserId]);

  async function handleSend(formData: FormData) {
    setSending(true);
    formData.set("type", type);
    formData.set("ref_id", refId);
    await sendMessage(formData);
    setSending(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Messages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
          {messages.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No messages yet. Start the conversation below.
            </p>
          )}
          {messages.map((msg) => {
            const isSystem = !msg.sender_id;
            const isOwn = msg.sender_id === currentUserId;

            if (isSystem) {
              return (
                <div key={msg.id} className="flex justify-center">
                  <div className="text-xs text-muted-foreground bg-muted/50 rounded-full px-3 py-1">
                    {msg.body}
                    <span className="opacity-50 ml-2">
                      {new Date(msg.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    isOwn
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-xs font-medium mb-1 opacity-70">
                    {msg.profiles?.full_name || msg.profiles?.email || "User"}
                  </p>
                  <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
                  <p className="text-xs mt-1 opacity-50">
                    {new Date(msg.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <form action={handleSend} className="flex gap-2">
          <Textarea
            name="body"
            placeholder="Type a message..."
            rows={2}
            className="flex-1 resize-none"
            required
          />
          <Button type="submit" size="icon" disabled={sending} className="self-end">
            <SendIcon className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
