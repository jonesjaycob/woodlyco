"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MailIcon,
  ShoppingBagIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";

type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  projectType: string;
  message: string;
  createdAt: string;
};

type Inquiry = {
  id: string;
  productId: string;
  productName: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  createdAt: string;
};

const projectTypeLabels: Record<string, string> = {
  standard: "Standard Light Post",
  custom: "Custom Design",
  multiple: "Multiple Posts",
  other: "Other / Question",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function MessagesPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"contacts" | "inquiries">(
    "contacts"
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const [contactsRes, inquiriesRes] = await Promise.all([
          fetch("/api/contact"),
          fetch("/api/inquiries"),
        ]);
        if (contactsRes.ok) setContacts(await contactsRes.json());
        if (inquiriesRes.ok) setInquiries(await inquiriesRes.json());
      } catch {
        // Silently handle - empty arrays shown
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
  }, []);

  const totalMessages = contacts.length + inquiries.length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-9 w-40 bg-muted animate-pulse rounded" />
        <div className="flex gap-2">
          <div className="h-10 w-40 bg-muted animate-pulse rounded" />
          <div className="h-10 w-40 bg-muted animate-pulse rounded" />
        </div>
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="space-y-2">
              <div className="h-5 w-48 bg-muted animate-pulse rounded" />
              <div className="h-4 w-64 bg-muted animate-pulse rounded" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">
            {totalMessages} total message{totalMessages !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === "contacts" ? "default" : "outline"}
          onClick={() => setActiveTab("contacts")}
          className="gap-2"
        >
          <MailIcon className="w-4 h-4" />
          Contact Forms
          {contacts.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {contacts.length}
            </Badge>
          )}
        </Button>
        <Button
          variant={activeTab === "inquiries" ? "default" : "outline"}
          onClick={() => setActiveTab("inquiries")}
          className="gap-2"
        >
          <ShoppingBagIcon className="w-4 h-4" />
          Product Inquiries
          {inquiries.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {inquiries.length}
            </Badge>
          )}
        </Button>
      </div>

      {/* Contact Submissions */}
      {activeTab === "contacts" && (
        <div className="space-y-3">
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <Card key={contact.id} className="overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedId(
                      expandedId === contact.id ? null : contact.id
                    )
                  }
                  className="w-full text-left p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate">{contact.name}</p>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {projectTypeLabels[contact.projectType] ||
                            contact.projectType}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {contact.email}
                        {contact.phone && ` · ${contact.phone}`}
                      </p>
                      {expandedId !== contact.id && (
                        <p className="text-sm text-muted-foreground mt-1 truncate">
                          {contact.message}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4 shrink-0">
                      <span className="text-xs text-muted-foreground">
                        {timeAgo(contact.createdAt)}
                      </span>
                      {expandedId === contact.id ? (
                        <ChevronUpIcon className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </button>
                {expandedId === contact.id && (
                  <div className="px-4 pb-4 border-t pt-3">
                    <p className="text-sm whitespace-pre-wrap">
                      {contact.message}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <a href={`mailto:${contact.email}`}>
                        <Button size="sm" className="gap-2">
                          <MailIcon className="w-3 h-3" />
                          Reply via Email
                        </Button>
                      </a>
                    </div>
                  </div>
                )}
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center">
              <MailIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No contact form submissions yet
              </p>
            </Card>
          )}
        </div>
      )}

      {/* Product Inquiries */}
      {activeTab === "inquiries" && (
        <div className="space-y-3">
          {inquiries.length > 0 ? (
            inquiries.map((inquiry) => (
              <Card key={inquiry.id} className="overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedId(
                      expandedId === inquiry.id ? null : inquiry.id
                    )
                  }
                  className="w-full text-left p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate">{inquiry.name}</p>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {inquiry.productName}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {inquiry.email}
                        {inquiry.phone && ` · ${inquiry.phone}`}
                      </p>
                      {expandedId !== inquiry.id && inquiry.message && (
                        <p className="text-sm text-muted-foreground mt-1 truncate">
                          {inquiry.message}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4 shrink-0">
                      <span className="text-xs text-muted-foreground">
                        {timeAgo(inquiry.createdAt)}
                      </span>
                      {expandedId === inquiry.id ? (
                        <ChevronUpIcon className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </button>
                {expandedId === inquiry.id && (
                  <div className="px-4 pb-4 border-t pt-3">
                    {inquiry.message ? (
                      <p className="text-sm whitespace-pre-wrap mb-4">
                        {inquiry.message}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic mb-4">
                        No message provided
                      </p>
                    )}
                    <div className="flex gap-2">
                      <a href={`mailto:${inquiry.email}`}>
                        <Button size="sm" className="gap-2">
                          <MailIcon className="w-3 h-3" />
                          Reply via Email
                        </Button>
                      </a>
                    </div>
                  </div>
                )}
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center">
              <ShoppingBagIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No product inquiries yet
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
