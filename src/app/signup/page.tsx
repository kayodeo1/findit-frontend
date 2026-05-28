"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { AuthVisual } from "@/components/layout/auth-visual";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type AccountType = "owner" | "finder";

const TYPES: { value: AccountType; label: string; icon: string; blurb: string }[] = [
  { value: "owner", label: "Owner", icon: "person_search", blurb: "Report lost & claim found" },
  { value: "finder", label: "Finder", icon: "location_on", blurb: "Submit items you found" },
];

export default function SignupPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [accountType, setAccountType] = useState<AccountType>("owner");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { token, user } = await api.auth.register({
        email,
        password,
        full_name: fullName,
        role: accountType,
      });
      setAuth(token, user);
      toast.success("Account created");
      router.replace("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen w-full overflow-hidden bg-background">
      <AuthVisual
        quote="Whether you lost it or found it — FindIt connects the dots."
        author="FindIt"
      />

      <section className="relative flex w-full items-center justify-center px-margin-mobile py-10 md:w-1/2 md:px-margin-desktop">
        <div className="flex w-full max-w-[440px] flex-col">
          <div className="mb-8">
            <h1 className="mb-2 font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">
              Create account
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              How will you be using FindIt?
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3">
              {TYPES.map((t) => {
                const active = accountType === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setAccountType(t.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all cursor-pointer",
                      active
                        ? "border-secondary bg-secondary-container/50 text-on-secondary-container"
                        : "border-outline-variant/60 text-on-surface-variant hover:bg-surface-container-low",
                    )}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {t.icon}
                    </span>
                    <div>
                      <p className="font-label-md text-label-md font-semibold">{t.label}</p>
                      <p className="font-label-sm text-label-sm opacity-70">{t.blurb}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <Field label="Full name">
              <Input
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </Field>

            <Field label="Email address">
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>

            <Field label="Password">
              <Input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </Field>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </form>

          <p className="mt-8 text-center font-body-md text-body-md text-on-surface-variant">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-secondary hover:underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
