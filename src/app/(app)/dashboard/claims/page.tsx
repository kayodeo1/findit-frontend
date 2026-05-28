"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Claim } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { ClaimStatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageLoader, EmptyState } from "@/components/ui/spinner";

export default function MyClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.claims
      .list()
      .then((res) => setClaims(res.results))
      .catch(() => toast.error("Failed to load claims"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline-lg text-headline-lg font-semibold text-on-surface">My claims</h1>
        <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
          Track the status of your item claims.
        </p>
      </div>

      {loading ? (
        <PageLoader />
      ) : claims.length === 0 ? (
        <EmptyState
          icon={<span className="material-symbols-outlined text-5xl">assignment</span>}
          title="No claims yet"
          description="Browse found items and submit a claim if you spot yours."
          action={
            <Link href="/dashboard/found">
              <Button>Browse found items</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => (
            <div
              key={claim.id}
              className="rounded-lg bg-surface-container-lowest p-5 ring-1 ring-outline-variant/40 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">
                    {claim.item_name}
                  </h3>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                    Claim #{claim.id} · Submitted {formatDate(claim.created_at)}
                  </p>
                </div>
                <ClaimStatusBadge status={claim.status} />
              </div>

              <div className="rounded-xl bg-surface-container-low p-3 mb-4">
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">
                  Your proof of ownership:
                </p>
                <p className="font-body-md text-body-md text-on-surface">{claim.proof}</p>
              </div>

              {claim.status === "rejected" && claim.rejection_reason && (
                <div className="rounded-xl bg-error-container/30 p-3">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-on-error-container text-base mt-0.5">
                      cancel
                    </span>
                    <div>
                      <p className="font-label-sm text-label-sm font-semibold text-on-error-container mb-0.5">
                        Rejection reason
                      </p>
                      <p className="font-body-md text-body-md text-on-error-container">
                        {claim.rejection_reason}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {claim.status === "approved" && (
                <div className="rounded-xl bg-secondary-container/30 p-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-secondary text-base"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                    <p className="font-label-md text-label-md text-on-secondary-container font-semibold">
                      Claim approved — contact admin to collect your item.
                    </p>
                  </div>
                </div>
              )}

              {claim.status === "pending" && (
                <div className="rounded-xl bg-amber-50 p-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-600 text-base">
                      schedule
                    </span>
                    <p className="font-label-md text-label-md text-amber-800">
                      Awaiting admin review
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
