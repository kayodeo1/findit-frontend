"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Item } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { ItemStatusBadge } from "@/components/ui/badge";
import { Select } from "@/components/ui/input";
import { PageLoader, EmptyState } from "@/components/ui/spinner";

export default function AdminItemsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  async function load(status?: string) {
    setLoading(true);
    try {
      const res = await api.items.listAll({ status: status || undefined });
      setItems(res.results);
    } catch {
      toast.error("Failed to load items");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const lostCount = items.filter((i) => i.status === "lost").length;
  const foundCount = items.filter((i) => i.status === "found").length;
  const claimedCount = items.filter((i) => i.status === "claimed").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline-lg text-headline-lg font-semibold text-on-surface">
          All items
        </h1>
        <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
          A transparent, read-only overview of every lost, found, and claimed item. To find a
          person, use the Users page — admins search users, not items.
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Lost", count: lostCount, color: "text-red-600", bg: "bg-red-50", icon: "report" },
          { label: "Found", count: foundCount, color: "text-emerald-600", bg: "bg-emerald-50", icon: "search" },
          { label: "Claimed", count: claimedCount, color: "text-secondary", bg: "bg-secondary-container/40", icon: "verified" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-4 rounded-lg bg-surface-container-lowest p-4 ring-1 ring-outline-variant/40 shadow-sm">
            <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${s.bg}`}>
              <span className={`material-symbols-outlined ${s.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                {s.icon}
              </span>
            </div>
            <div>
              <p className="font-headline-md text-headline-md font-bold text-on-surface">{s.count}</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Status filter only — no item search for admins */}
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); load(e.target.value); }}
          className="w-40"
        >
          <option value="">All statuses</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
          <option value="claimed">Claimed</option>
        </Select>
      </div>

      {loading ? (
        <PageLoader />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<span className="material-symbols-outlined text-5xl">inventory_2</span>}
          title="No items found"
          description="No items match your current filters."
        />
      ) : (
        <div className="overflow-hidden rounded-lg bg-surface-container-lowest ring-1 ring-outline-variant/40 shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-surface-container">
              <tr>
                <th className="px-4 py-3 font-label-md text-label-md text-on-surface-variant">Item</th>
                <th className="px-4 py-3 font-label-md text-label-md text-on-surface-variant hidden sm:table-cell">Color</th>
                <th className="px-4 py-3 font-label-md text-label-md text-on-surface-variant hidden md:table-cell">Location</th>
                <th className="px-4 py-3 font-label-md text-label-md text-on-surface-variant hidden lg:table-cell">Reported by</th>
                <th className="px-4 py-3 font-label-md text-label-md text-on-surface-variant hidden md:table-cell">Date</th>
                <th className="px-4 py-3 font-label-md text-label-md text-on-surface-variant">Status</th>
                <th className="px-4 py-3 font-label-md text-label-md text-on-surface-variant"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-surface-container-low transition-colors cursor-pointer"
                  onClick={() => router.push(`/admin/items/${item.id}`)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="size-9 rounded-lg object-cover shrink-0 ring-1 ring-outline-variant/30"
                        />
                      )}
                      <div>
                        <p className="font-body-md text-body-md font-semibold text-on-surface">{item.name}</p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant line-clamp-1">{item.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-body-md text-body-md text-on-surface-variant hidden sm:table-cell">{item.color}</td>
                  <td className="px-4 py-3 font-body-md text-body-md text-on-surface-variant hidden md:table-cell">{item.location}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <p className="font-body-md text-body-md text-on-surface">{item.reported_by_name}</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant capitalize">{item.reported_by_role}</p>
                  </td>
                  <td className="px-4 py-3 font-body-md text-body-md text-on-surface-variant hidden md:table-cell">{formatDate(item.date)}</td>
                  <td className="px-4 py-3">
                    <ItemStatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="material-symbols-outlined text-outline text-base">chevron_right</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
