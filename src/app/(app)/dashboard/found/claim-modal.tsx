"use client";

import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Item } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Field, Textarea } from "@/components/ui/input";

export function ClaimModal({
  item,
  onClose,
  onSuccess,
}: {
  item: Item;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [proof, setProof] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.claims.create({ item: item.id, proof });
      toast.success("Claim submitted — awaiting admin review");
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit claim");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-surface-container-lowest p-6 shadow-xl ring-1 ring-outline-variant/40">
        <div className="mb-5">
          <h2 className="font-headline-md text-headline-md font-semibold text-on-surface">
            Claim: {item.name}
          </h2>
          <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
            Describe your proof of ownership. Admin will review and approve.
          </p>
        </div>

        <div className="mb-5 rounded-xl bg-surface-container-low p-4 space-y-1">
          <p className="font-label-md text-label-md text-on-surface-variant">
            <span className="font-semibold text-on-surface">Color:</span> {item.color}
          </p>
          <p className="font-label-md text-label-md text-on-surface-variant">
            <span className="font-semibold text-on-surface">Location found:</span> {item.location}
          </p>
          <p className="font-label-md text-label-md text-on-surface-variant line-clamp-2">
            <span className="font-semibold text-on-surface">Description:</span> {item.description}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Proof of ownership">
            <Textarea
              placeholder="Describe specific details that prove this item is yours — serial number, contents, unique markings, purchase receipt details, etc."
              value={proof}
              onChange={(e) => setProof(e.target.value)}
              required
              className="min-h-[120px]"
            />
          </Field>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Submitting…" : "Submit claim"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
