"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Item } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { ItemStatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { PageLoader } from "@/components/ui/spinner";

export default function AdminItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    api.items.get(Number(id))
      .then(setItem)
      .catch(() => toast.error("Failed to load item"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleStatusChange(newStatus: string) {
    if (!item) return;
    setStatusUpdating(true);
    try {
      const updated = await api.items.update(item.id, { status: newStatus as Item["status"] });
      setItem(updated);
      toast.success("Status updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setStatusUpdating(false);
    }
  }

  async function handleDelete() {
    if (!item) return;
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await api.items.remove(item.id);
      toast.success("Item deleted");
      router.push("/admin");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete item");
      setDeleting(false);
    }
  }

  if (loading) return <PageLoader />;
  if (!item) return (
    <div className="mx-auto max-w-2xl text-center py-16">
      <span className="material-symbols-outlined text-5xl text-outline">inventory_2</span>
      <p className="mt-4 font-body-lg text-body-lg text-on-surface-variant">Item not found.</p>
      <Button variant="outline" className="mt-6" onClick={() => router.back()}>Go back</Button>
    </div>
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button
          onClick={() => router.back()}
          className="mt-1 flex size-9 items-center justify-center rounded-full hover:bg-surface-container-low transition-colors shrink-0"
        >
          <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-headline-lg text-headline-lg font-semibold text-on-surface leading-tight">
            {item.name}
          </h1>
          <div className="mt-1">
            <ItemStatusBadge status={item.status} />
          </div>
        </div>
      </div>

      {/* Image */}
      {item.image_url && (
        <div className="overflow-hidden rounded-2xl ring-1 ring-outline-variant/40 shadow-sm">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full max-h-80 object-cover"
          />
        </div>
      )}

      {/* Admin controls */}
      <div className="rounded-lg bg-surface-container-lowest p-5 ring-1 ring-outline-variant/40 shadow-sm space-y-4">
        <h2 className="font-label-lg text-label-lg font-semibold text-on-surface">Admin controls</h2>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <span className="font-label-md text-label-md text-on-surface-variant shrink-0">Change status:</span>
            <Select
              value={item.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={statusUpdating}
              className="w-36"
            >
              <option value="lost">Lost</option>
              <option value="found">Found</option>
              <option value="claimed">Claimed</option>
            </Select>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
            className="text-error hover:bg-error/10 border-error/40"
          >
            <span className="material-symbols-outlined text-base">delete</span>
            {deleting ? "Deleting…" : "Delete item"}
          </Button>
        </div>
      </div>

      {/* Details card */}
      <div className="rounded-lg bg-surface-container-lowest ring-1 ring-outline-variant/40 shadow-sm divide-y divide-outline-variant/30">
        {[
          { icon: "description", label: "Description", value: item.description },
          { icon: "palette", label: "Color", value: item.color },
          { icon: "location_on", label: "Location", value: item.location },
          { icon: "calendar_today", label: "Date", value: formatDate(item.date) },
          { icon: "person", label: "Reported by", value: `${item.reported_by_name}` },
          { icon: "badge", label: "Reporter role", value: item.reported_by_role },
          { icon: "schedule", label: "Submitted", value: formatDate(item.created_at) },
          { icon: "update", label: "Last updated", value: formatDate(item.updated_at) },
        ].map(({ icon, label, value }) => (
          <div key={label} className="flex items-start gap-4 px-5 py-4">
            <span className="material-symbols-outlined text-secondary mt-0.5 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-label-sm text-label-sm text-on-surface-variant">{label}</p>
              <p className="mt-0.5 font-body-md text-body-md text-on-surface break-words capitalize-first">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
