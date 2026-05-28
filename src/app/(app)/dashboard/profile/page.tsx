"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";

export default function ProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [form, setForm] = useState({ first_name: "", last_name: "", phone: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        first_name: profile.first_name ?? "",
        last_name: profile.last_name ?? "",
        phone: profile.phone ?? "",
      });
    }
  }, [profile]);

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.users.updateMe(form);
      await refreshProfile();
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="font-headline-lg text-headline-lg font-semibold text-on-surface">Profile</h1>
        <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
          Manage your account information.
        </p>
      </div>

      {/* Account info (read-only) */}
      <div className="rounded-lg bg-surface-container-lowest p-5 ring-1 ring-outline-variant/40 shadow-sm space-y-3">
        <h2 className="font-label-lg text-label-lg font-semibold text-on-surface">Account</h2>
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>email</span>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Email</p>
            <p className="font-body-md text-body-md text-on-surface">{profile?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>badge</span>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Role</p>
            <p className="font-body-md text-body-md text-on-surface capitalize">{profile?.role}</p>
          </div>
        </div>
      </div>

      {/* Editable info */}
      <div className="rounded-lg bg-surface-container-lowest p-6 ring-1 ring-outline-variant/40 shadow-sm">
        <h2 className="mb-5 font-label-lg text-label-lg font-semibold text-on-surface">Personal details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name">
              <Input
                value={form.first_name}
                onChange={(e) => set("first_name", e.target.value)}
                placeholder="First name"
              />
            </Field>
            <Field label="Last name">
              <Input
                value={form.last_name}
                onChange={(e) => set("last_name", e.target.value)}
                placeholder="Last name"
              />
            </Field>
          </div>

          <Field label="Phone number">
            <Input
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+234 800 000 0000"
            />
          </Field>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}
