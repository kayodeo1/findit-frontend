"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

interface NavItem {
  href: string;
  icon: string;
  label: string;
  roles?: string[];
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/dashboard/lost/new", icon: "report", label: "Report Lost", roles: ["owner"] },
  { href: "/dashboard/found", icon: "search", label: "Browse Found", roles: ["owner"] },
  { href: "/dashboard/found/new", icon: "add_location_alt", label: "Report Found", roles: ["finder"] },
  { href: "/dashboard/claims", icon: "assignment", label: "My Claims", roles: ["owner"] },
  { href: "/admin", icon: "admin_panel_settings", label: "Admin Panel", roles: ["admin"] },
  { href: "/admin/claims", icon: "fact_check", label: "Review Claims", roles: ["admin"] },
  { href: "/dashboard/profile", icon: "manage_accounts", label: "Profile" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || (profile && item.roles.includes(profile.role)),
  );

  return (
    <aside className="flex h-screen w-64 flex-col bg-surface-container-low border-r border-outline-variant/40">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-outline-variant/40">
        <span
          className="material-symbols-outlined text-secondary"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          find_in_page
        </span>
        <span className="font-headline-md text-headline-md font-bold text-on-surface">FindIt</span>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {visibleItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 font-label-md text-label-md transition-all",
                active
                  ? "bg-secondary-container text-on-secondary-container font-semibold"
                  : "text-on-surface-variant hover:bg-surface-variant/50",
              )}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {profile && (
        <div className="p-4 border-t border-outline-variant/40">
          <div className="mb-3 px-2">
            <p className="font-label-md text-label-md font-semibold text-on-surface truncate">
              {profile.full_name || profile.email}
            </p>
            <p className="font-label-sm text-label-sm text-on-surface-variant capitalize">
              {profile.role}
            </p>
          </div>
          <button
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 font-label-md text-label-md text-on-surface-variant hover:bg-surface-variant/50 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Sign out
          </button>
        </div>
      )}
    </aside>
  );
}
