"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Claim } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { ClaimStatusBadge } from "@/components/ui/badge";
import { Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageLoader, EmptyState } from "@/components/ui/spinner";

export default function AdminClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");

  async function load(status?: string) {
    setLoading(true);
    try {
      const res = await api.claims.listAll({ status: status || undefined });
      setClaims(res.results);
    } catch {
      toast.error("Failed to load claims");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(statusFilter); }, [statusFilter]);

  const pendingCount = claims.filter((c) => c.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg font-semibold text-on-surface">
            Review claims
          </h1>
          <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
            {pendingCount > 0
              ? `${pendingCount} claim${pendingCount > 1 ? "s" : ""} awaiting review`
              : "All caught up — no pending claims"}
          </p>
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-36"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </Select>
      </div>

      {loading ? (
        <PageLoader />
      ) : claims.length === 0 ? (
        <EmptyState
          icon={<span className="material-symbols-outlined text-5xl">fact_check</span>}
          title="No claims"
          description={statusFilter ? `No ${statusFilter} claims found.` : "No claims in the system yet."}
        />
      ) : (
        <div className="space-y-3">
          {claims.map((claim) => (
            <div
              key={claim.id}
              className="flex items-start justify-between gap-4 rounded-lg bg-surface-container-lowest p-5 ring-1 ring-outline-variant/40 shadow-sm hover:ring-secondary/30 transition-all"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">
                    {claim.item_name}
                  </h3>
                  <ClaimStatusBadge status={claim.status} />
                </div>
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-2">
                  Claimed by <span className="font-semibold text-on-surface">{claim.owner_name}</span>
                  {" · "}Submitted {formatDate(claim.created_at)}
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">
                  {claim.proof}
                </p>
                {claim.status === "rejected" && claim.rejection_reason && (
                  <p className="mt-1 font-label-sm text-label-sm text-on-error-container">
                    Reason: {claim.rejection_reason}
                  </p>
                )}
              </div>
              {claim.status === "pending" && (
                <Link href={`/admin/claims/${claim.id}`} className="shrink-0">
                  <Button size="sm">
                    <span className="material-symbols-outlined text-base">rate_review</span>
                    Review
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
