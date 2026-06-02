"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Item } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Badge, ItemStatusBadge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageLoader, EmptyState } from "@/components/ui/spinner";
import { ClaimModal } from "./claim-modal";
import { Search } from "lucide-react";

export default function BrowseFoundPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [claimedIds, setClaimedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [claimItem, setClaimItem] = useState<Item | null>(null);

  async function load(q?: string) {
    setLoading(true);
    try {
      const [itemsRes, claimsRes] = await Promise.all([
        api.items.list({ status: "found", search: q }),
        api.claims.list(),
      ]);
      setItems(itemsRes.results);
      // Track which items the current user has already claimed.
      setClaimedIds(new Set(claimsRes.results.map((c) => c.item)));
    } catch {
      toast.error("Failed to load items");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    load(search);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline-lg text-headline-lg font-semibold text-on-surface">
          Browse found items
        </h1>
        <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
          Search for your lost item among found submissions.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-outline" />
          <Input
            placeholder="Search by name, color, or location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11"
          />
        </div>
        <Button type="submit" variant="outline">Search</Button>
      </form>

      {loading ? (
        <PageLoader />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<span className="material-symbols-outlined text-5xl">search_off</span>}
          title="No found items"
          description="No found items match your search. Try different keywords."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const claimed = claimedIds.has(item.id);
            return (
            <div
              key={item.id}
              className="flex flex-col rounded-lg bg-surface-container-lowest ring-1 ring-outline-variant/40 shadow-sm hover:ring-secondary/40 transition-all overflow-hidden"
            >
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-36 object-cover"
                />
              )}
              <div className="p-5 flex flex-col flex-1">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <h3 className="font-headline-md text-headline-md font-semibold text-on-surface line-clamp-1">
                    {item.name}
                  </h3>
                  {claimed ? (
                    <Badge tone="emerald">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      Claimed by you
                    </Badge>
                  ) : (
                    <ItemStatusBadge status={item.status} />
                  )}
                </div>

                <p className="mb-4 font-body-md text-body-md text-on-surface-variant line-clamp-2 flex-1">
                  {item.description}
                </p>

                <div className="space-y-1 mb-4">
                  <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-base">palette</span>
                    {item.color}
                  </div>
                  <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-base">location_on</span>
                    {item.location}
                  </div>
                  <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-base">calendar_today</span>
                    Found {formatDate(item.date)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    variant={claimed ? "outline" : "default"}
                    disabled={claimed}
                    onClick={() => setClaimItem(item)}
                  >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {claimed ? "check" : "verified"}
                    </span>
                    {claimed ? "Claimed" : "Claim"}
                  </Button>
                  <Link href={`/dashboard/items/${item.id}`}>
                    <Button size="sm" variant="outline">
                      <span className="material-symbols-outlined text-base">open_in_new</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}

      {claimItem && (
        <ClaimModal
          item={claimItem}
          onClose={() => setClaimItem(null)}
          onSuccess={() => { setClaimItem(null); load(); }}
        />
      )}
    </div>
  );
}
