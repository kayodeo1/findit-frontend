"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { CITIES, COLORS, ITEM_TYPES, PLACE_TYPES } from "@/lib/options";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea, Select } from "@/components/ui/input";

/**
 * One shared form for reporting both lost and found items — no more
 * duplicated lost/found pages. `status` decides the copy and the
 * submitted status.
 */
export function ReportItemForm({ status }: { status: "lost" | "found" }) {
  const router = useRouter();
  const isLost = status === "lost";

  const [itemType, setItemType] = useState("");
  const [customName, setCustomName] = useState("");
  const [form, setForm] = useState({
    model: "",
    serial_no: "",
    color: "",
    description: "",
    date: "",
    placeType: "",
    city: "",
    landmark: "",
  });
  const [loading, setLoading] = useState(false);

  const itemPhoto = usePhoto();
  const ownerPhoto = usePhoto();

  function set(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function resolvedName() {
    return itemType === "Other" ? customName.trim() : itemType;
  }

  function resolvedLocation() {
    // Combine the landmark, place type and city into a single readable string.
    return [form.landmark.trim(), form.placeType, form.city.trim()]
      .filter(Boolean)
      .join(", ");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = resolvedName();
    if (!name) {
      toast.error("Please choose or enter the item.");
      return;
    }
    const location = resolvedLocation();
    if (!location) {
      toast.error(`Please tell us where it was ${status}.`);
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("description", form.description);
      fd.append("color", form.color);
      fd.append("model", form.model);
      fd.append("serial_no", form.serial_no);
      fd.append("location", location);
      fd.append("date", form.date);
      fd.append("status", status);
      if (itemPhoto.file) fd.append("image", itemPhoto.file);
      if (ownerPhoto.file) fd.append("owner_photo", ownerPhoto.file);
      await api.items.create(fd);
      toast.success(
        isLost
          ? "Lost item reported successfully"
          : "Found item submitted — admin has been notified",
      );
      router.push("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit item");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8">
        <h1 className="font-headline-lg text-headline-lg font-semibold text-on-surface">
          {isLost ? "Report a lost item" : "Submit a found item"}
        </h1>
        <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
          {isLost
            ? "Describe your item clearly so finders can identify it."
            : "Describe the item you found clearly so the owner can identify it."}
        </p>
      </div>

      <div className="rounded-lg bg-surface-container-lowest p-6 ring-1 ring-outline-variant/40 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Item — dropdown of common items, with "Other" fallback */}
          <Field label="Item">
            <Select value={itemType} onChange={(e) => setItemType(e.target.value)} required>
              <option value="">Select item…</option>
              {ITEM_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Select>
          </Field>

          {itemType === "Other" && (
            <Field label="Item name">
              <Input
                placeholder="Type the item name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                required
              />
            </Field>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Model">
              <Input
                placeholder="e.g. iPhone 13, HP Pavilion"
                value={form.model}
                onChange={(e) => set("model", e.target.value)}
              />
            </Field>
            <Field label="Serial no (optional)">
              <Input
                placeholder="Serial / IMEI if known"
                value={form.serial_no}
                onChange={(e) => set("serial_no", e.target.value)}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Color">
              <Select value={form.color} onChange={(e) => set("color", e.target.value)} required>
                <option value="">Select color</option>
                {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label={isLost ? "Date lost" : "Date found"}>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                required
              />
            </Field>
          </div>

          <Field label="Description">
            <Textarea
              placeholder="Describe the item in detail — brand, contents, markings, condition, etc."
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              required
            />
          </Field>

          {/* Location — place-type dropdown + city autocomplete + landmark */}
          <div>
            <p className="mb-2 ml-1 font-label-md text-label-md text-on-surface">
              {isLost ? "Where was it lost?" : "Where was it found?"}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Place type">
                <Select value={form.placeType} onChange={(e) => set("placeType", e.target.value)}>
                  <option value="">Select place…</option>
                  {PLACE_TYPES.map((p) => <option key={p} value={p}>{p}</option>)}
                </Select>
              </Field>
              <Field label="City">
                {/* datalist gives "suggest while typing" — e.g. "Ib" → Ibadan */}
                <Input
                  list="city-options"
                  placeholder="Start typing… e.g. Ib"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  required
                />
                <datalist id="city-options">
                  {CITIES.map((c) => <option key={c} value={c} />)}
                </datalist>
              </Field>
            </div>
            <Field label="Specific spot / landmark (optional)" className="mt-4">
              <Input
                placeholder="e.g. Bodija Market, near the second gate"
                value={form.landmark}
                onChange={(e) => set("landmark", e.target.value)}
              />
            </Field>
          </div>

          {/* Item photo */}
          <PhotoField
            label="Photo of the item (optional)"
            photo={itemPhoto}
            hint="A clear photo helps with matching."
          />

          {/* Owner photo — useful for verification on lost reports */}
          <PhotoField
            label="Photo of the owner (optional)"
            photo={ownerPhoto}
            hint="Helps confirm identity when reuniting the item."
          />

          {!isLost && (
            <div className="rounded-xl bg-secondary-container/30 p-4">
              <div className="flex items-start gap-3">
                <span
                  className="material-symbols-outlined text-secondary mt-0.5"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  info
                </span>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  After submission, the admin will be notified and the item will be visible to
                  owners searching for their lost belongings.
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Submitting…" : isLost ? "Report lost item" : "Submit found item"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---- photo input helper -------------------------------------------------

interface Photo {
  file: File | null;
  preview: string | null;
  ref: React.RefObject<HTMLInputElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clear: () => void;
}

function usePhoto(): Photo {
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  }
  function clear() {
    setFile(null);
    setPreview(null);
    if (ref.current) ref.current.value = "";
  }
  return { file, preview, ref, onChange, clear };
}

function PhotoField({ label, photo, hint }: { label: string; photo: Photo; hint: string }) {
  return (
    <Field label={label}>
      {photo.preview ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.preview}
            alt="Preview"
            className="w-full max-h-48 object-cover rounded-xl ring-1 ring-outline-variant/40"
          />
          <button
            type="button"
            onClick={photo.clear}
            className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-surface-container shadow-md hover:bg-error/10 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-error">close</span>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => photo.ref.current?.click()}
          className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-outline-variant/60 p-6 text-center hover:border-secondary/60 hover:bg-secondary-container/10 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-3xl text-outline">add_photo_alternate</span>
          <span className="font-label-md text-label-md text-on-surface-variant">Click to add a photo</span>
          <span className="font-label-sm text-label-sm text-outline">{hint}</span>
        </button>
      )}
      <input
        ref={photo.ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={photo.onChange}
      />
    </Field>
  );
}
