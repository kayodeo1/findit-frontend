"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import type { Claim, Item } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ItemStatusBadge, ClaimStatusBadge } from "@/components/ui/badge";
import { PageLoader } from "@/components/ui/spinner";

function StatCard({
  icon,
  label,
  value,
  color = "text-secondary",
  bg = "bg-secondary-container/40",
}: {
  icon: string;
  label: string;
  value: number | string;
  color?: string;
  bg?: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-lg bg-surface-container-lowest p-5 ring-1 ring-outline-variant/40 shadow-sm">
      <div className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${bg}`}>
        <span
          className={`material-symbols-outlined ${color}`}
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
      </div>
      <div>
        <p className="font-display-lg-mobile text-display-lg-mobile font-bold text-on-surface leading-none">
          {value}
        </p>
        <p className="mt-1 font-label-md text-label-md text-on-surface-variant">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { profile } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [itemsRes, claimsRes] = await Promise.all([
          api.items.list(),
          api.claims.list(),
        ]);
        setItems(itemsRes.results);
        setClaims(claimsRes.results);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <PageLoader />;

  const role = profile?.role;

  const lostCount = items.filter((i) => i.status === "lost").length;
  const foundCount = items.filter((i) => i.status === "found").length;
  const claimedCount = items.filter((i) => i.status === "claimed").length;
  const pendingClaims = claims.filter((c) => c.status === "pending").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline-lg text-headline-lg font-semibold text-on-surface">
          {role === "admin" ? "Admin Dashboard" : `Welcome back, ${profile?.first_name || "there"}`}
        </h1>
        <p className="mt-1 font-body-md text-body-md text-on-surface-variant capitalize">
          {role} · Lost &amp; Found System
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="report" label="Lost Items" value={lostCount} color="text-red-600" bg="bg-red-50" />
        <StatCard icon="search" label="Found Items" value={foundCount} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard icon="verified" label="Claimed" value={claimedCount} color="text-secondary" bg="bg-secondary-container/40" />
        <StatCard icon="assignment" label="Pending Claims" value={pendingClaims} color="text-amber-600" bg="bg-amber-50" />
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-4 font-headline-md text-headline-md font-semibold text-on-surface">
          Quick actions
        </h2>
        <div className="flex flex-wrap gap-3">
          {role === "owner" && (
            <>
              <Link href="/dashboard/lost/new">
                <Button>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>report</span>
                  Report Lost Item
                </Button>
              </Link>
              <Link href="/dashboard/found">
                <Button variant="outline">
                  <span className="material-symbols-outlined">search</span>
                  Browse Found Items
                </Button>
              </Link>
              <Link href="/dashboard/claims">
                <Button variant="outline">
                  <span className="material-symbols-outlined">assignment</span>
                  My Claims
                </Button>
              </Link>
            </>
          )}
          {role === "finder" && (
            <Link href="/dashboard/found/new">
              <Button>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add_location_alt</span>
                Submit Found Item
              </Button>
            </Link>
          )}
          {role === "admin" && (
            <>
              <Link href="/admin/claims">
                <Button>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>fact_check</span>
                  Review Claims
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="outline">
                  <span className="material-symbols-outlined">admin_panel_settings</span>
                  All Items
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Recent items */}
      {items.length > 0 && (
        <div>
          <h2 className="mb-4 font-headline-md text-headline-md font-semibold text-on-surface">
            Recent items
          </h2>
          <div className="overflow-hidden rounded-lg bg-surface-container-lowest ring-1 ring-outline-variant/40 shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-surface-container">
                <tr>
                  <th className="px-4 py-3 font-label-md text-label-md text-on-surface-variant">Item</th>
                  <th className="px-4 py-3 font-label-md text-label-md text-on-surface-variant hidden sm:table-cell">Location</th>
                  <th className="px-4 py-3 font-label-md text-label-md text-on-surface-variant hidden md:table-cell">Date</th>
                  <th className="px-4 py-3 font-label-md text-label-md text-on-surface-variant">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {items.slice(0, 5).map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-surface-container-low transition-colors cursor-pointer"
                    onClick={() =>
                      router.push(
                        profile?.role === "admin"
                          ? `/admin/items/${item.id}`
                          : `/dashboard/items/${item.id}`,
                      )
                    }
                  >
                    <td className="px-4 py-3">
                      <p className="font-body-md text-body-md font-semibold text-on-surface">{item.name}</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">{item.color}</p>
                    </td>
                    <td className="px-4 py-3 font-body-md text-body-md text-on-surface-variant hidden sm:table-cell">
                      {item.location}
                    </td>
                    <td className="px-4 py-3 font-body-md text-body-md text-on-surface-variant hidden md:table-cell">
                      {formatDate(item.date)}
                    </td>
                    <td className="px-4 py-3">
                      <ItemStatusBadge status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent claims */}
      {claims.length > 0 && (
        <div>
          <h2 className="mb-4 font-headline-md text-headline-md font-semibold text-on-surface">
            Recent claims
          </h2>
          <div className="overflow-hidden rounded-lg bg-surface-container-lowest ring-1 ring-outline-variant/40 shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-surface-container">
                <tr>
                  <th className="px-4 py-3 font-label-md text-label-md text-on-surface-variant">Item</th>
                  <th className="px-4 py-3 font-label-md text-label-md text-on-surface-variant hidden sm:table-cell">Claimant</th>
                  <th className="px-4 py-3 font-label-md text-label-md text-on-surface-variant hidden md:table-cell">Date</th>
                  <th className="px-4 py-3 font-label-md text-label-md text-on-surface-variant">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {claims.slice(0, 5).map((claim) => (
                  <tr key={claim.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-4 py-3 font-body-md text-body-md font-semibold text-on-surface">
                      {claim.item_name}
                    </td>
                    <td className="px-4 py-3 font-body-md text-body-md text-on-surface-variant hidden sm:table-cell">
                      {claim.owner_name}
                    </td>
                    <td className="px-4 py-3 font-body-md text-body-md text-on-surface-variant hidden md:table-cell">
                      {formatDate(claim.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <ClaimStatusBadge status={claim.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
