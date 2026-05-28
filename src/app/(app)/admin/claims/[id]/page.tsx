"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Claim, StatusHistory } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { ClaimStatusBadge, ItemStatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Textarea, Input } from "@/components/ui/input";
import { PageLoader } from "@/components/ui/spinner";

export default function ClaimReviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [history, setHistory] = useState<StatusHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [releaseDate, setReleaseDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [claimData, historyData] = await Promise.all([
          api.claims.get(Number(id)),
          api.claims.history(Number(id)),
        ]);
        setClaim(claimData);
        setHistory(historyData.results);
      } catch {
        toast.error("Failed to load claim");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleReview() {
    if (!action) return;
    if (action === "reject" && !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    setSubmitting(true);
    try {
      await api.claims.review(Number(id), {
        action,
        rejection_reason: action === "reject" ? rejectionReason : undefined,
        release_date: action === "approve" ? releaseDate : undefined,
        notes: action === "approve" ? notes : undefined,
      });
      toast.success(action === "approve" ? "Claim approved — item marked as claimed" : "Claim rejected");
      router.push("/admin/claims");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to process claim");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <PageLoader />;
  if (!claim) return <p className="text-on-surface-variant">Claim not found.</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back
        </button>
      </div>

      <div>
        <h1 className="font-headline-lg text-headline-lg font-semibold text-on-surface">
          Review claim #{claim.id}
        </h1>
        <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
          Submitted {formatDate(claim.created_at)}
        </p>
      </div>

      {/* Claim details */}
      <div className="rounded-lg bg-surface-container-lowest p-6 ring-1 ring-outline-variant/40 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md font-semibold text-on-surface">
            Item details
          </h2>
          <ItemStatusBadge status={claim.item_status} />
        </div>
        <div className="rounded-xl bg-surface-container-low p-4 space-y-2">
          <p className="font-headline-md text-headline-md font-semibold text-on-surface">
            {claim.item_name}
          </p>
        </div>

        <div>
          <h2 className="font-headline-md text-headline-md font-semibold text-on-surface mb-2">
            Claimant
          </h2>
          <p className="font-body-md text-body-md text-on-surface">
            <span className="font-semibold">{claim.owner_name}</span>
          </p>
        </div>

        <div>
          <h2 className="font-headline-md text-headline-md font-semibold text-on-surface mb-2">
            Proof of ownership
          </h2>
          <div className="rounded-xl bg-surface-container-low p-4">
            <p className="font-body-md text-body-md text-on-surface">{claim.proof}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-label-md text-label-md text-on-surface-variant">Claim status:</span>
          <ClaimStatusBadge status={claim.status} />
        </div>
      </div>

      {/* Review action */}
      {claim.status === "pending" && (
        <div className="rounded-lg bg-surface-container-lowest p-6 ring-1 ring-outline-variant/40 shadow-sm">
          <h2 className="font-headline-md text-headline-md font-semibold text-on-surface mb-4">
            Make a decision
          </h2>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <button
              onClick={() => setAction("approve")}
              className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all cursor-pointer ${
                action === "approve"
                  ? "border-secondary bg-secondary-container/50 text-on-secondary-container"
                  : "border-outline-variant/60 text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: action === "approve" ? "'FILL' 1" : "'FILL' 0" }}
              >
                check_circle
              </span>
              <span className="font-label-md text-label-md font-semibold">Approve</span>
              <span className="font-label-sm text-label-sm opacity-70">Release to owner</span>
            </button>

            <button
              onClick={() => setAction("reject")}
              className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all cursor-pointer ${
                action === "reject"
                  ? "border-error bg-error-container/30 text-on-error-container"
                  : "border-outline-variant/60 text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: action === "reject" ? "'FILL' 1" : "'FILL' 0" }}
              >
                cancel
              </span>
              <span className="font-label-md text-label-md font-semibold">Reject</span>
              <span className="font-label-sm text-label-sm opacity-70">Deny the claim</span>
            </button>
          </div>

          {action === "approve" && (
            <div className="space-y-4 mb-5">
              <Field label="Release date">
                <Input
                  type="date"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  required
                />
              </Field>
              <Field label="Notes (optional)">
                <Textarea
                  placeholder="Any notes about the release…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Field>
            </div>
          )}

          {action === "reject" && (
            <div className="mb-5">
              <Field label="Rejection reason">
                <Textarea
                  placeholder="Explain why the claim is being rejected…"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  required
                />
              </Field>
            </div>
          )}

          {action && (
            <Button
              onClick={handleReview}
              disabled={submitting}
              variant={action === "reject" ? "destructive" : "default"}
              className="w-full"
              size="lg"
            >
              {submitting
                ? "Processing…"
                : action === "approve"
                ? "Approve claim"
                : "Reject claim"}
            </Button>
          )}
        </div>
      )}

      {/* Status history */}
      {history.length > 0 && (
        <div className="rounded-lg bg-surface-container-lowest p-6 ring-1 ring-outline-variant/40 shadow-sm">
          <h2 className="font-headline-md text-headline-md font-semibold text-on-surface mb-4">
            Status history
          </h2>
          <div className="space-y-3">
            {history.map((h) => (
              <div key={h.id} className="flex items-start gap-3">
                <div className="mt-0.5 size-2 rounded-full bg-secondary shrink-0" />
                <div>
                  <p className="font-body-md text-body-md text-on-surface">
                    <span className="font-semibold capitalize">{h.old_status}</span>
                    {" → "}
                    <span className="font-semibold capitalize">{h.new_status}</span>
                  </p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    by {h.changed_by_name} · {formatDate(h.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
