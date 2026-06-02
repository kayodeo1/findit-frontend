"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth, TOKEN_KEY } from "@/lib/auth-context";
import { AuthVisual } from "@/components/layout/auth-visual";
import { Slogan } from "@/components/layout/brand";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Clear any stale token so it isn't sent as a Bearer header on the login request
    localStorage.removeItem(TOKEN_KEY);
    try {
      const { token, user } = await api.auth.login({ email, password });
      setAuth(token, user);
      toast.success(`Hi, ${user.first_name || "there"} 👋`);
      router.replace("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  }

  return (
    <main className="flex h-screen w-full overflow-hidden bg-background">
      <AuthVisual
        quote="Whether you lost it or found it — connect here."
        author="L&F"
      />

      <section className="relative flex w-full items-center justify-center px-margin-mobile md:w-1/2 md:px-margin-desktop">
        <div className="flex w-full max-w-[440px] flex-col">
          <div className="mb-8">
            <h1 className="mb-2 font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">
              Welcome back
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Sign in to report or track lost and found items.
            </p>
          </div>

          {/* New users must verify by email first */}
          <div className="mb-6 flex items-start gap-3 rounded-xl bg-secondary-container/30 px-4 py-3">
            <span
              className="material-symbols-outlined text-[20px] text-secondary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              mark_email_read
            </span>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Just created an account? Check your mail and verify it before signing in.
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

            <Field>
              <label className="font-label-md text-label-md text-on-surface ml-1 block">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-outline hover:text-secondary cursor-pointer"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="font-label-sm text-label-sm font-semibold text-secondary hover:underline underline-offset-4"
                >
                  Forgot password?
                </Link>
              </div>
            </Field>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
              {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
            </Button>
          </form>

          <p className="mt-8 text-center font-body-md text-body-md text-on-surface-variant">
            New here?{" "}
            <Link href="/signup" className="font-bold text-secondary hover:underline underline-offset-4">
              Create an account
            </Link>
          </p>
          <div className="mt-4 text-center">
            <Slogan />
          </div>
        </div>
      </section>
    </main>
  );
}
