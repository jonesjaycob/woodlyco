"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2Icon } from "lucide-react";

export function ContactForm() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "standard",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
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
          : "Failed to send message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (submitted) {
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">✓</span>
        </div>
        <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
        <p className="text-muted-foreground mb-6">
          Thanks for reaching out. We&apos;ll get back to you within 1-2 business
          days.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setSubmitted(false);
            setFormState({
              name: "",
              email: "",
              phone: "",
              projectType: "standard",
              message: "",
            });
          }}
        >
          Send Another Message
        </Button>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formState.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-input bg-background"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formState.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-input bg-background"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formState.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-input bg-background"
          />
        </div>
        <div>
          <label
            htmlFor="projectType"
            className="block text-sm font-medium mb-2"
          >
            Project Type
          </label>
          <select
            id="projectType"
            name="projectType"
            value={formState.projectType}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-input bg-background"
          >
            <option value="standard">Standard Light Post</option>
            <option value="custom">Custom Design</option>
            <option value="multiple">Multiple Posts</option>
            <option value="other">Other / Question</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          Tell Us About Your Project *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={formState.message}
          onChange={handleChange}
          placeholder="Describe your space, vision, timeline, or any questions you have..."
          className="w-full px-4 py-2 rounded-md border border-input bg-background resize-none"
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  );
}
