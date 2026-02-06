"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon, Loader2Icon } from "lucide-react";

interface InquiryModalProps {
  productId: string;
  productName: string;
  children: React.ReactNode;
}

export function InquiryModal({ productId, productName, children }: InquiryModalProps) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, productName, ...formState }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send inquiry. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setTimeout(() => {
        setSubmitted(false);
        setError(null);
        setFormState({ name: "", email: "", phone: "", message: "" });
      }, 200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {submitted ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="w-8 h-8" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-center">Message Sent!</DialogTitle>
              <DialogDescription className="text-center">
                Thanks for your interest in the {productName}. We&apos;ll get back to
                you within 1-2 business days.
              </DialogDescription>
            </DialogHeader>
            <Button onClick={() => setOpen(false)} className="mt-6">
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Inquire About This Post</DialogTitle>
              <DialogDescription>
                Interested in the <strong>{productName}</strong>? Fill out the form
                below and we&apos;ll reach out to discuss details and delivery.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {error && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="inquiry-name" className="block text-sm font-medium mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  id="inquiry-name"
                  name="name"
                  required
                  value={formState.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="inquiry-email" className="block text-sm font-medium mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="inquiry-email"
                  name="email"
                  required
                  value={formState.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="inquiry-phone" className="block text-sm font-medium mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  id="inquiry-phone"
                  name="phone"
                  value={formState.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  placeholder="(555) 555-5555"
                />
              </div>
              <div>
                <label htmlFor="inquiry-message" className="block text-sm font-medium mb-1">
                  Message
                </label>
                <textarea
                  id="inquiry-message"
                  name="message"
                  rows={3}
                  value={formState.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
                  placeholder="Any questions about this post? Let us know your location for delivery estimates."
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Inquiry"
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
