"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Upload, Check } from "lucide-react";
import type { EventOverlayDoc, EventStatus, EventImage, ImageLayout } from "@/lib/cms/events";
import type { EventOverlayFormData } from "../../actions";

const STATUSES: EventStatus[] = ["Upcoming", "Ongoing", "Closed", "Recurring"];

const LAYOUT_OPTIONS = [
  { value: "banner",   label: "Banner",   desc: "First image as a full-width hero strip" },
  { value: "grid",     label: "Grid",     desc: "All images in a 2–3 column photo grid" },
  { value: "carousel", label: "Carousel", desc: "Horizontal scroll strip of all images"  },
] as const;

function MultiImageUpload({
  slug, images, onAdd, onRemove,
}: {
  slug: string;
  images: EventImage[];
  onAdd: (img: EventImage) => void;
  onRemove: (idx: number) => void;
}) {
  const [uploadState, setUploadState] = useState<{ total: number; done: number } | null>(null);
  const [uploadError, setUploadError] = useState("");

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploadError("");
    setUploadState({ total: files.length, done: 0 });
    let failed = 0;
    for (const file of files) {
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("path", `events/${slug}-img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (json.url) onAdd({ url: json.url, alt: "" });
        else failed++;
      } catch {
        failed++;
      }
      setUploadState((prev) => prev ? { ...prev, done: prev.done + 1 } : null);
    }
    setUploadState(null);
    if (failed > 0) setUploadError(`${failed} of ${files.length} image(s) failed to upload.`);
    e.target.value = "";
  }

  const uploading = uploadState !== null;

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
        {images.map((img, i) => (
          <div key={i} className="relative group rounded-lg overflow-hidden border" style={{ borderColor: "#d4e6c4", aspectRatio: "4/3" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt={img.alt ?? ""} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center shadow"
              title="Remove image"
            >
              ×
            </button>
            {i === 0 && (
              <span className="absolute bottom-1 left-1.5 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded">Cover</span>
            )}
          </div>
        ))}
        <label
          className="flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed cursor-pointer transition-colors hover:bg-[#f5f9f0]"
          style={{ borderColor: "#d4e6c4", aspectRatio: "4/3", minHeight: "100px" }}
        >
          {uploading ? (
            <>
              <span className="text-xs font-medium" style={{ color: "#3a5214" }}>
                {uploadState!.done}/{uploadState!.total} uploaded
              </span>
              <div className="w-16 h-1.5 rounded-full mt-1 overflow-hidden" style={{ backgroundColor: "#d4e6c4" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ backgroundColor: "#3a5214", width: `${(uploadState!.done / uploadState!.total) * 100}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" style={{ color: "#3a5214" }} />
              <span className="text-xs font-medium" style={{ color: "#3a5214" }}>Add images</span>
              <span className="text-[10px]" style={{ color: "#7a8e6a" }}>Select multiple</span>
            </>
          )}
          <input type="file" accept="image/*" multiple className="sr-only" onChange={handleFiles} disabled={uploading} />
        </label>
      </div>
      {uploadError && <p className="text-xs mb-2" style={{ color: "#b91c1c" }}>{uploadError}</p>}
      <p className="text-xs" style={{ color: "#7a8e6a" }}>
        First image is used as the cover / listing thumbnail. Hover a thumbnail and click × to remove.
      </p>
    </div>
  );
}

interface Props {
  slug: string;
  base: { title: string; tagline: string; description: string; status: string; contact?: string | { email?: string } };
  overlay: EventOverlayDoc | null;
  onSave: (data: EventOverlayFormData) => Promise<{ success: boolean; error?: string }>;
}

export function StaticEventOverlayForm({ slug, base, overlay, onSave }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const baseContact = typeof base.contact === "string" ? base.contact : (base.contact?.email ?? "");

  const [title, setTitle] = useState(overlay?.title ?? "");
  const [tagline, setTagline] = useState(overlay?.tagline ?? "");
  const [description, setDescription] = useState(overlay?.description ?? "");
  const [status, setStatus] = useState<EventStatus | "">(overlay?.status ?? "");
  const [applyUrl, setApplyUrl] = useState(overlay?.applyUrl ?? "");
  const [contact, setContact] = useState(overlay?.contact ?? "");
  const [images, setImages] = useState<EventImage[]>(() => {
    if (overlay?.images?.length) return overlay.images;
    if (overlay?.coverImageUrl) return [{ url: overlay.coverImageUrl, alt: "" }];
    return [];
  });
  const [imageLayout, setImageLayout] = useState<ImageLayout>(overlay?.imageLayout ?? "banner");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSaved(false);
    startTransition(async () => {
      const result = await onSave({
        title: title.trim() || undefined,
        tagline: tagline.trim() || undefined,
        description: description.trim() || undefined,
        status: status || undefined,
        applyUrl: applyUrl.trim() || undefined,
        contact: contact.trim() || undefined,
        coverImageUrl: images[0]?.url || undefined,
        images: images.length ? images : undefined,
        imageLayout: images.length ? imageLayout : undefined,
      });
      if (result.success) { setSaved(true); router.refresh(); }
      else setError(result.error ?? "Something went wrong.");
    });
  }

  const inputCls = "w-full text-sm rounded-lg px-3 py-2 outline-none";
  const inputStyle = { border: "1px solid #d4e6c4", color: "#1c2e06" };
  const labelCls = "block text-xs font-semibold mb-1.5";
  const labelStyle = { color: "#5a6644" };
  const hintStyle = { color: "#aab89e" };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-sm px-4 py-3 rounded-xl" style={{ backgroundColor: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" }}>{error}</div>}
      {saved && <div className="text-sm px-4 py-3 rounded-xl" style={{ backgroundColor: "#f0f7e6", color: "#3a5214", border: "1px solid #b8d4a0" }}>Saved — changes are live on the website.</div>}

      <div>
        <label className={labelCls} style={labelStyle}>Title override</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={base.title} className={inputCls} style={inputStyle} />
        <p className="text-xs mt-1" style={hintStyle}>Default: &ldquo;{base.title}&rdquo;</p>
      </div>

      <div>
        <label className={labelCls} style={labelStyle}>Tagline override</label>
        <input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder={base.tagline} className={inputCls} style={inputStyle} />
        <p className="text-xs mt-1" style={hintStyle}>Default: &ldquo;{base.tagline}&rdquo;</p>
      </div>

      <div>
        <label className={labelCls} style={labelStyle}>Description override</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} placeholder={base.description} className={`${inputCls} resize-y`} style={inputStyle} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls} style={labelStyle}>Status override</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as EventStatus | "")} className={inputCls} style={inputStyle}>
            <option value="">— keep original ({base.status}) —</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls} style={labelStyle}>Apply / Register URL</label>
          <input type="url" value={applyUrl} onChange={(e) => setApplyUrl(e.target.value)} placeholder="https://forms.gle/…" className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className={labelCls} style={labelStyle}>Contact email override</label>
          <input type="email" value={contact} onChange={(e) => setContact(e.target.value)} placeholder={baseContact || "iciitp@iitp.ac.in"} className={inputCls} style={inputStyle} />
        </div>
      </div>

      {/* Images */}
      <div>
        <h3 className="text-sm font-black uppercase tracking-wider mb-4" style={{ color: "#3a5214" }}>Images</h3>
        <div className="mb-4">
          <p className="text-xs font-semibold mb-2" style={{ color: "#5a6644" }}>Display layout</p>
          <div className="flex flex-wrap gap-2">
            {LAYOUT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setImageLayout(opt.value)}
                className="flex flex-col items-start px-3 py-2 rounded-lg border text-left transition-colors"
                style={
                  imageLayout === opt.value
                    ? { borderColor: "#3a5214", backgroundColor: "#f0f7e6", color: "#1c2e06" }
                    : { borderColor: "#d4e6c4", color: "#5a6644" }
                }
              >
                <span className="text-sm font-semibold">{opt.label}</span>
                <span className="text-xs mt-0.5">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>
        <MultiImageUpload
          slug={slug}
          images={images}
          onAdd={(img) => setImages((prev) => [...prev, img])}
          onRemove={(idx) => setImages((prev) => prev.filter((_, i) => i !== idx))}
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={pending || saved} className="text-sm font-semibold px-6 py-2.5 rounded-xl text-white disabled:opacity-60" style={{ backgroundColor: "#3a5214" }}>
          {pending ? "Saving…" : saved ? <><Check className="w-4 h-4 inline mr-1" />Saved</> : "Save overrides"}
        </button>
        <button type="button" onClick={() => router.push("/admin/content/events")} className="text-sm font-medium px-4 py-2.5 rounded-xl" style={{ color: "#7a8e6a" }}>
          Cancel
        </button>
      </div>
    </form>
  );
}
