import { Logo } from "./brand";

export function AuthVisual({ quote, author }: { quote: string; author: string }) {
  return (
    <section className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-primary p-margin-desktop md:flex">
      <div className="pattern-overlay absolute inset-0 opacity-100" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(at 0% 100%, rgba(0,108,73,0.55) 0px, transparent 55%), radial-gradient(at 100% 0%, rgba(111,251,190,0.18) 0px, transparent 50%)",
        }}
      />
      <div className="relative z-10">
        <Logo href="/" size="md" tone="light" withTagline />
      </div>

      <div className="glass-card relative z-10 mb-4 max-w-lg rounded-lg p-10">
        <span
          className="material-symbols-outlined mb-4 text-4xl text-secondary-fixed"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          format_quote
        </span>
        <p className="mb-4 font-headline-md text-headline-md leading-tight text-white">{quote}</p>
        <div className="flex items-center gap-3">
          <div className="h-px w-8 bg-white/40" />
          <span className="font-label-md text-label-md uppercase tracking-widest text-white/70">
            {author}
          </span>
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-3 opacity-70">
        <span className="font-label-sm text-label-sm uppercase tracking-wide text-white/80">
          Lost &amp; Found System
        </span>
        <span className="size-2 rounded-full bg-secondary-fixed emerald-pulse" />
      </div>
    </section>
  );
}
