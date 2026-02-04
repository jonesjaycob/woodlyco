"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createQuoteRequest } from "@/lib/actions/quotes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function QuoteRequestForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await createQuoteRequest(formData);
    if ("error" in result) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push(`/portal/quotes/${result.data.id}`);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request a Quote</CardTitle>
        <CardDescription>
          Tell us what you're looking for and we'll put together a custom quote.
        </CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="wood_type">Preferred Wood Type</Label>
              <Input
                id="wood_type"
                name="wood_type"
                placeholder="e.g., White Oak, Pine, Cedar"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="power_source">Power Source</Label>
              <Select name="power_source">
                <SelectTrigger>
                  <SelectValue placeholder="Select power source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solar">Solar Powered</SelectItem>
                  <SelectItem value="battery">Battery Operated</SelectItem>
                  <SelectItem value="electric">Electric Wired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dimensions">Desired Dimensions</Label>
              <Input
                id="dimensions"
                name="dimensions"
                placeholder={'e.g., 11" x 11" x 11\''}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                defaultValue="1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom_notes">Additional Details</Label>
            <Textarea
              id="custom_notes"
              name="custom_notes"
              placeholder="Describe your vision, installation location, special requests..."
              rows={4}
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Quote Request"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
