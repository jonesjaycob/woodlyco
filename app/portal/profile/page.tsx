import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/actions/profile";
import { ProfileForm } from "@/components/portal/profile-form";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <ProfileForm profile={profile} />
    </div>
  );
}
