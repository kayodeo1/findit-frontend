import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-mesh">
      {/* Header */}
      <header className="flex items-center justify-between px-margin-mobile py-5 md:px-margin-desktop">
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-secondary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            find_in_page
          </span>
          <span className="font-headline-md text-headline-md font-bold text-on-surface">FindIt</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="outline" size="sm">Sign in</Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Get started</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center px-margin-mobile py-24 text-center md:px-margin-desktop">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary-container px-4 py-2">
          <span className="size-2 rounded-full bg-secondary emerald-pulse" />
          <span className="font-label-sm text-label-sm text-on-secondary-container font-semibold">
            Lost &amp; Found System
          </span>
        </div>

        <h1 className="mb-6 max-w-3xl font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">
          Reunite people with their lost belongings
        </h1>
        <p className="mb-10 max-w-xl font-body-lg text-body-lg text-on-surface-variant">
          Report lost items, submit found items, and track claims — all in one streamlined platform
          with admin oversight.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/signup">
            <Button size="lg">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person_add</span>
              Create account
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">Sign in</Button>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="px-margin-mobile pb-24 md:px-margin-desktop">
        <div className="mx-auto max-w-container-max">
          <h2 className="mb-12 text-center font-headline-lg text-headline-lg font-semibold text-on-surface">
            How it works
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: "report",
                title: "Report",
                desc: "Lost something? Report it with a description, color, and location. Found something? Submit it so the owner can claim it.",
                color: "text-secondary",
                bg: "bg-secondary-container/40",
              },
              {
                icon: "manage_search",
                title: "Match",
                desc: "The system automatically checks for potential matches between lost and found items. Browse found items to spot yours.",
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                icon: "verified",
                title: "Claim",
                desc: "Submit proof of ownership for a found item. Admin reviews and approves the claim, reuniting you with your belongings.",
                color: "text-amber-600",
                bg: "bg-amber-50",
              },
            ].map((step) => (
              <div
                key={step.title}
                className="flex flex-col gap-4 rounded-lg bg-surface-container-lowest p-6 ring-1 ring-outline-variant/40 shadow-sm"
              >
                <div className={`flex size-12 items-center justify-center rounded-2xl ${step.bg}`}>
                  <span
                    className={`material-symbols-outlined ${step.color}`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {step.icon}
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">
                  {step.title}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="bg-surface-container px-margin-mobile py-20 md:px-margin-desktop">
        <div className="mx-auto max-w-container-max">
          <h2 className="mb-10 text-center font-headline-lg text-headline-lg font-semibold text-on-surface">
            Choose your role
          </h2>
          <div className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto">
            {[
              {
                icon: "person_search",
                role: "Owner",
                desc: "Lost an item? Report it and claim found items that belong to you.",
              },
              {
                icon: "location_on",
                role: "Finder",
                desc: "Found an item? Submit it so the rightful owner can find and claim it.",
              },
            ].map((r) => (
              <div
                key={r.role}
                className="flex items-start gap-4 rounded-lg bg-surface-container-lowest p-6 ring-1 ring-outline-variant/40"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary-container/40">
                  <span
                    className="material-symbols-outlined text-secondary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {r.icon}
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-1">
                    {r.role}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-margin-mobile py-8 text-center md:px-margin-desktop">
        <p className="font-label-sm text-label-sm text-on-surface-variant">
          FindIt Lost &amp; Found System &copy; 2025
        </p>
      </footer>
    </main>
  );
}
