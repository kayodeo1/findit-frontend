"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea, Select } from "@/components/ui/input";

const COLORS = [
  "Black", "White", "Red", "Blue", "Green", "Yellow", "Orange",
  "Purple", "Pink", "Brown", "Grey", "Gold", "Silver", "Other",
];

export default function ReportLostPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ name: "", description: "", color: "", location: "", date: "" });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  function clearImage() {
    setImage(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("color", form.color);
      fd.append("location", form.location);
      fd.append("date", form.date);
      fd.append("status", "lost");
      if (image) fd.append("image", image);
      await api.items.create(fd);
      toast.success("Lost item reported successfully");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to report item");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8">
        <h1 className="font-headline-lg text-headline-lg font-semibold text-on-surface">
          Report a lost item
        </h1>
        <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
          Describe your item clearly so finders can identify it.
        </p>
      </div>

      <div className="rounded-lg bg-surface-container-lowest p-6 ring-1 ring-outline-variant/40 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Item name">
            <Input
              placeholder="e.g. Black leather wallet"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
            />
          </Field>

          <Field label="Description">
            <Textarea
              placeholder="Describe the item in detail — brand, contents, markings, etc."
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              required
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Primary color">
              <Select value={form.color} onChange={(e) => set("color", e.target.value)} required>
                <option value="">Select color</option>
                {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>

            <Field label="Date lost">
              <Input
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                required
              />
            </Field>
          </div>

          <Field label="Location lost">
            <Input
              placeholder="e.g. Bodija Market, Ibadan"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              required
            />
          </Field>

          {/* Image upload */}
          <Field label="Photo (optional)">
            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-h-48 object-cover rounded-xl ring-1 ring-outline-variant/40"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-surface-container shadow-md hover:bg-error/10 transition-colors"
                >
                  <span className="material-symbols-outlined text-base text-error">close</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-outline-variant/60 p-6 text-center hover:border-secondary/60 hover:bg-secondary-container/10 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-3xl text-outline">add_photo_alternate</span>
                <span className="font-label-md text-label-md text-on-surface-variant">
                  Click to add a photo
                </span>
                <span className="font-label-sm text-label-sm text-outline">JPG, PNG up to 5 MB</span>
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
          </Field>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Submitting…" : "Report lost item"}
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
