import type { Metadata } from "next";
import { getAdminConversations } from "@/lib/actions/messages";
import { AdminConversationList } from "@/components/admin/conversation-list";

export const metadata: Metadata = {
  title: "Messages",
};

export default async function AdminMessagesPage() {
  const conversations = await getAdminConversations();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      <AdminConversationList conversations={conversations} />
    </div>
  );
}
