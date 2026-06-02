"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";

export default function ProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [form, setForm] = useState({
    first_name: "", middle_name: "", last_name: "", phone: "",
    house_no: "", street: "", area: "", lga: "", city: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        first_name: profile.first_name ?? "",
        middle_name: profile.middle_name ?? "",
        last_name: profile.last_name ?? "",
        phone: profile.phone ?? "",
        house_no: profile.house_no ?? "",
        street: profile.street ?? "",
        area: profile.area ?? "",
        lga: profile.lga ?? "",
        city: profile.city ?? "",
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
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="First name">
              <Input value={form.first_name} onChange={(e) => set("first_name", e.target.value)} placeholder="First" />
            </Field>
            <Field label="Middle name">
              <Input value={form.middle_name} onChange={(e) => set("middle_name", e.target.value)} placeholder="Middle" />
            </Field>
            <Field label="Last name">
              <Input value={form.last_name} onChange={(e) => set("last_name", e.target.value)} placeholder="Last" />
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

          <div>
            <p className="mb-2 ml-1 font-label-md text-label-md text-on-surface">Address</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="House no">
                <Input value={form.house_no} onChange={(e) => set("house_no", e.target.value)} placeholder="e.g. 12" />
              </Field>
              <Field label="Street">
                <Input value={form.street} onChange={(e) => set("street", e.target.value)} placeholder="Street name" />
              </Field>
              <Field label="Area">
                <Input value={form.area} onChange={(e) => set("area", e.target.value)} placeholder="Area / district" />
              </Field>
              <Field label="LG">
                <Input value={form.lga} onChange={(e) => set("lga", e.target.value)} placeholder="Local government" />
              </Field>
              <Field label="City" className="sm:col-span-2">
                <Input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="City" />
              </Field>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}
