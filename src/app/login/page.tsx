"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth, TOKEN_KEY } from "@/lib/auth-context";
import { AuthVisual } from "@/components/layout/auth-visual";
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
      toast.success("Welcome back");
      router.replace("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  }

  return (
    <main className="flex h-screen w-full overflow-hidden bg-background">
      <AuthVisual
        quote="Every lost item has an owner waiting — let's bring them together."
        author="FindIt System"
      />

      <section className="relative flex w-full items-center justify-center px-margin-mobile md:w-1/2 md:px-margin-desktop">
        <div className="flex w-full max-w-[440px] flex-col">
          <div className="mb-10">
            <h1 className="mb-2 font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">
              Welcome back
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Sign in to report or track lost and found items.
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
            </Field>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
              {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
            </Button>
          </form>

          <p className="mt-10 text-center font-body-md text-body-md text-on-surface-variant">
            New here?{" "}
            <Link href="/signup" className="font-bold text-secondary hover:underline underline-offset-4">
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
