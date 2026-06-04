"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { AuthVisual } from "@/components/layout/auth-visual";
import { Slogan } from "@/components/layout/brand";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { CITIES } from "@/lib/options";

type Stage = "form" | "submitting" | "done";

// Smaller text boxes than the default field styling.
const SM = "py-2.5 rounded-xl";

const EMPTY = {
  first_name: "",
  middle_name: "",
  last_name: "",
  house_no: "",
  street: "",
  area: "",
  lga: "",
  city: "",
  phone: "",
  email: "",
  password: "",
};

export default function SignupPage() {
  const [form, setForm] = useState({ ...EMPTY });
  const [stage, setStage] = useState<Stage>("form");

  function set(field: keyof typeof EMPTY, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStage("submitting");
    try {
      // Role is chosen at sign-in, not here — register with the default ("owner").
      await api.auth.register({ role: "owner", ...form });
      // Simulate the "just a moment" wait, then ask the user to verify by email.
      // We deliberately do NOT log the user in — they must verify first.
      await new Promise((r) => setTimeout(r, 1400));
      setStage("done");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
      setStage("form");
    }
  }

  return (
    <main className="flex min-h-screen w-full overflow-hidden bg-background">
      <AuthVisual
        quote="Whether you lost it or found it — connect here."
        author="L&F"
      />

      <section className="relative flex w-full items-center justify-center px-margin-mobile py-10 md:w-1/2 md:px-margin-desktop">
        {stage === "submitting" ? (
          <WaitingScreen />
        ) : stage === "done" ? (
          <VerifyEmailScreen email={form.email} />
        ) : (
          <div className="flex w-full max-w-[460px] flex-col">
            <div className="mb-6">
              <h1 className="mb-1 font-display-lg-mobile text-display-lg-mobile text-on-surface">
                Create account
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Fill in the form below to get started.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Name */}
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="First name">
                  <Input className={SM} value={form.first_name} onChange={(e) => set("first_name", e.target.value)} placeholder="First" required />
                </Field>
                <Field label="Middle name">
                  <Input className={SM} value={form.middle_name} onChange={(e) => set("middle_name", e.target.value)} placeholder="Middle" />
                </Field>
                <Field label="Last name">
                  <Input className={SM} value={form.last_name} onChange={(e) => set("last_name", e.target.value)} placeholder="Last" required />
                </Field>
              </div>

              {/* Address */}
              <div>
                <p className="mb-2 ml-1 font-label-md text-label-md text-on-surface">Address</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="House no">
                    <Input className={SM} value={form.house_no} onChange={(e) => set("house_no", e.target.value)} placeholder="e.g. 12" />
                  </Field>
                  <Field label="Street">
                    <Input className={SM} value={form.street} onChange={(e) => set("street", e.target.value)} placeholder="Street name" />
                  </Field>
                  <Field label="Area">
                    <Input className={SM} value={form.area} onChange={(e) => set("area", e.target.value)} placeholder="Area / district" />
                  </Field>
                  <Field label="LG">
                    <Input className={SM} value={form.lga} onChange={(e) => set("lga", e.target.value)} placeholder="Local government" />
                  </Field>
                  <Field label="City" className="sm:col-span-2">
                    <Input
                      className={SM}
                      list="city-suggestions"
                      value={form.city}
                      onChange={(e) => set("city", e.target.value)}
                      placeholder="Start typing… e.g. Ib → Ibadan"
                      autoComplete="off"
                    />
                    <datalist id="city-suggestions">
                      {CITIES.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </Field>
                </div>
              </div>

              {/* Contact */}
              <Field label="Mobile no">
                <Input className={SM} type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+234 800 000 0000" />
              </Field>

              <Field label="Email">
                <Input className={SM} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="name@example.com" required />
              </Field>

              <Field label="Password">
                <Input className={SM} type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="At least 6 characters" minLength={6} required />
              </Field>

              {/* Submit — modest size, not full-bleed-huge */}
              <div className="pt-1">
                <Button type="submit" size="sm" className="px-8">
                  Submit
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Button>
              </div>
            </form>

            <p className="mt-6 text-center font-body-md text-body-md text-on-surface-variant">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-secondary hover:underline underline-offset-4">
                Sign in
              </Link>
            </p>
            <div className="mt-4 text-center">
              <Slogan />
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function WaitingScreen() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="relative flex size-24 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-secondary-container/40 emerald-pulse" />
        <Spinner className="size-10" />
      </div>
      <h2 className="font-headline-lg text-headline-lg font-semibold text-on-surface">
        Just a moment…
      </h2>
      <p className="max-w-xs font-body-md text-body-md text-on-surface-variant">
        Setting up your account and getting things ready for you.
      </p>
    </div>
  );
}

function VerifyEmailScreen({ email }: { email: string }) {
  return (
    <div className="flex max-w-sm flex-col items-center gap-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-secondary-container/60">
        <span
          className="material-symbols-outlined text-3xl text-secondary"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          mark_email_unread
        </span>
      </div>
      <h2 className="font-headline-lg text-headline-lg font-semibold text-on-surface">
        Check your mail
      </h2>
      <p className="font-body-md text-body-md text-on-surface-variant">
        We&apos;ve sent a verification link to{" "}
        <span className="font-semibold text-on-surface">{email || "your email"}</span>. Please
        confirm your email before signing in.
      </p>
      <Link href="/login" className="w-full">
        <Button size="lg" className="w-full">
          Go to sign in
        </Button>
      </Link>
      <Slogan className="mt-2" />
    </div>
  );
}
