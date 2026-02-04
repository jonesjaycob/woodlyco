"use client";

import { useState } from "react";
import { updateProfile } from "@/lib/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Profile } from "@/lib/types/database";

export function ProfileForm({ profile }: { profile: Profile }) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    setMessage(null);
    const result = await updateProfile(formData);
    if (result?.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "Profile updated successfully." });
    }
    setSaving(false);
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`text-sm p-3 rounded-md ${
            message.type === "success"
              ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {message.text}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your contact details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input id="full_name" name="full_name" defaultValue={profile.full_name ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" defaultValue={profile.phone ?? ""} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={profile.email} disabled />
            <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
          <CardDescription>Your property address for delivery.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address_line1">Address Line 1</Label>
            <Input id="address_line1" name="address_line1" defaultValue={profile.address_line1 ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address_line2">Address Line 2</Label>
            <Input id="address_line2" name="address_line2" defaultValue={profile.address_line2 ?? ""} />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="address_city">City</Label>
              <Input id="address_city" name="address_city" defaultValue={profile.address_city ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address_state">State</Label>
              <Input id="address_state" name="address_state" defaultValue={profile.address_state ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address_zip">ZIP Code</Label>
              <Input id="address_zip" name="address_zip" defaultValue={profile.address_zip ?? ""} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
          <CardDescription>Help us understand your space.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="property_type">Property Type</Label>
            <Input
              id="property_type"
              name="property_type"
              placeholder="e.g., Residential, Farm, Estate"
              defaultValue={profile.property_type ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="property_notes">Property Notes</Label>
            <Textarea
              id="property_notes"
              name="property_notes"
              placeholder="Any details about your property that might help us..."
              defaultValue={profile.property_notes ?? ""}
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
