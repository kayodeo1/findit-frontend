"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthVisual } from "@/components/layout/auth-visual";
import { Slogan } from "@/components/layout/brand";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

type Stage = "form" | "submitting" | "sent";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState<Stage>("form");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStage("submitting");
    // Simulated: pretend to send a reset link.
    await new Promise((r) => setTimeout(r, 1200));
    setStage("sent");
  }

  return (
    <main className="flex min-h-screen w-full overflow-hidden bg-background">
      <AuthVisual
        quote="Whether you lost it or found it — connect here."
        author="L&F"
      />

      <section className="relative flex w-full items-center justify-center px-margin-mobile md:w-1/2 md:px-margin-desktop">
        {stage === "sent" ? (
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
              If an account exists for{" "}
              <span className="font-semibold text-on-surface">{email}</span>, we&apos;ve sent a
              link to reset your password.
            </p>
            <Link href="/login" className="w-full">
              <Button size="lg" className="w-full">Back to sign in</Button>
            </Link>
            <Slogan className="mt-2" />
          </div>
        ) : (
          <div className="flex w-full max-w-[440px] flex-col">
            <div className="mb-8">
              <h1 className="mb-2 font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">
                Forgot password?
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Enter your email and we&apos;ll send you a link to reset it.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <Field label="Email address">
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>

              <Button type="submit" size="lg" className="w-full" disabled={stage === "submitting"}>
                {stage === "submitting" ? (
                  <>
                    <Spinner className="size-5 text-white" />
                    Sending…
                  </>
                ) : (
                  <>
                    Submit
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </>
                )}
              </Button>
            </form>

            <p className="mt-8 text-center font-body-md text-body-md text-on-surface-variant">
              Remembered it?{" "}
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
