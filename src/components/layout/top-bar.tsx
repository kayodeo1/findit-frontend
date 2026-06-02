"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { SLOGAN } from "./brand";

export function TopBar() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the ellipsis menu when clicking outside it.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function handleSignOut() {
    setMenuOpen(false);
    signOut();
    router.replace("/login");
  }

  function handleExit() {
    setMenuOpen(false);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-outline-variant/40 bg-surface/80 px-4 py-2.5 backdrop-blur-md md:px-8">
      {/* Back / previous + next */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => router.back()}
          title="Previous"
          className="flex size-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-variant/60 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </button>
        <button
          type="button"
          onClick={() => router.forward()}
          title="Next"
          className="flex size-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-variant/60 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_forward</span>
        </button>
      </div>

      <p className="hidden flex-1 truncate text-center font-label-sm text-label-sm italic text-on-surface-variant sm:block">
        {SLOGAN}
      </p>

      {/* Vertical 3-dot ellipsis menu */}
      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          title="Menu"
          className="flex size-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-variant/60 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">more_vert</span>
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-11 w-48 overflow-hidden rounded-xl bg-surface-container-lowest py-1 shadow-xl ring-1 ring-outline-variant/40">
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-variant/50 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Log out
            </button>
            <button
              type="button"
              onClick={handleExit}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-variant/50 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">exit_to_app</span>
              Exit to home
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
