import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo, Slogan } from "@/components/layout/brand";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-mesh">
      {/* Header — logo on the left */}
      <header className="flex items-center justify-between px-margin-mobile py-5 md:px-margin-desktop">
        <Logo size="md" withTagline />
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
      <section className="flex flex-col items-center px-margin-mobile py-16 text-center md:px-margin-desktop md:py-24">
        {/* Big title + smaller tagline */}
        <h1 className="mb-3 max-w-3xl font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">
          Lost &amp; Found System
        </h1>
        <p className="mb-8 max-w-xl font-body-md text-body-md text-on-surface-variant">
          Reunite people with lost belongings
        </p>

        {/* Central search visual */}
        <div className="relative mb-8 flex size-40 items-center justify-center md:size-48">
          <span className="absolute inset-0 rounded-full bg-secondary-container/40 emerald-pulse" />
          <span className="absolute inset-4 rounded-full bg-secondary-container/60" />
          <span
            className="material-symbols-outlined relative text-[80px] text-secondary md:text-[96px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            travel_explore
          </span>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
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

        <Slogan />
      </section>

      {/* Features (small font) */}
      <section className="px-margin-mobile pb-24 md:px-margin-desktop">
        <div className="mx-auto max-w-container-max">
          <h2 className="mb-10 text-center font-label-md text-label-md font-semibold uppercase tracking-widest text-on-surface-variant">
            Features
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
      <footer className="flex flex-col items-center gap-2 px-margin-mobile py-8 text-center md:px-margin-desktop">
        <Slogan />
        <p className="font-label-sm text-label-sm text-on-surface-variant">
          L&amp;F — Lost &amp; Found System &copy; 2025
        </p>
      </footer>
    </main>
  );
}
