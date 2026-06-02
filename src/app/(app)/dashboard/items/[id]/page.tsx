"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Item } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { ItemStatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/spinner";
import { useAuth } from "@/lib/auth-context";
import { ClaimModal } from "@/app/(app)/dashboard/found/claim-modal";

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { profile } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [showClaim, setShowClaim] = useState(false);

  useEffect(() => {
    api.items.get(Number(id))
      .then(setItem)
      .catch(() => toast.error("Failed to load item"))
      .finally(() => setLoading(false));
  }, [id]);

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
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex size-9 items-center justify-center rounded-full hover:bg-surface-container-low transition-colors"
        >
          <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
        </button>
        <div>
          <h1 className="font-headline-lg text-headline-lg font-semibold text-on-surface leading-tight">
            {item.name}
          </h1>
          <div className="mt-1 flex items-center gap-2">
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

      {/* Details card */}
      <div className="rounded-lg bg-surface-container-lowest ring-1 ring-outline-variant/40 shadow-sm divide-y divide-outline-variant/30">
        {[
          { icon: "description", label: "Description", value: item.description },
          { icon: "palette", label: "Color", value: item.color },
          { icon: "devices", label: "Model", value: item.model || "—" },
          { icon: "tag", label: "Serial no", value: item.serial_no || "—" },
          { icon: "location_on", label: "Location", value: item.location },
          { icon: "calendar_today", label: "Date", value: formatDate(item.date) },
          { icon: "person", label: "Reported by", value: `${item.reported_by_name} (${item.reported_by_role})` },
          { icon: "schedule", label: "Submitted", value: formatDate(item.created_at) },
        ].map(({ icon, label, value }) => (
          <div key={label} className="flex items-start gap-4 px-5 py-4">
            <span className="material-symbols-outlined text-secondary mt-0.5 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-label-sm text-label-sm text-on-surface-variant">{label}</p>
              <p className="mt-0.5 font-body-md text-body-md text-on-surface break-words">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      {profile?.role === "owner" && item.status === "found" && (
        <Button className="w-full" onClick={() => setShowClaim(true)}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          Claim this item
        </Button>
      )}

      {showClaim && (
        <ClaimModal
          item={item}
          onClose={() => setShowClaim(false)}
          onSuccess={() => { setShowClaim(false); router.push("/dashboard/claims"); }}
        />
      )}
    </div>
  );
}
