"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { CustomFieldBuilder } from "./custom-field-builder";
import type { EventCategory, EventStatus, CustomField } from "@/lib/cms/events";
import type { EventFormData } from "@/app/admin/(protected)/content/events/actions";

const CATEGORIES: EventCategory[] = ["Training", "Competition", "Conference", "Workshop", "Other"];
const STATUSES: EventStatus[] = ["Upcoming", "Ongoing", "Closed", "Recurring"];

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

interface Props {
  event?: EventFormData;
  onSave: (data: EventFormData) => Promise<{ success: boolean; error?: string }>;
}

export function EventForm({ event, onSave }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [coverUploading, setCoverUploading] = useState(false);

  const [slug, setSlug] = useState(event?.slug ?? "");
  const [title, setTitle] = useState(event?.title ?? "");
  const [tagline, setTagline] = useState(event?.tagline ?? "");
  const [description, setDescription] = useState(event?.description ?? "");
  const [category, setCategory] = useState<EventCategory>(event?.category ?? "Training");
  const [status, setStatus] = useState<EventStatus>(event?.status ?? "Upcoming");
  const [autoClose, setAutoClose] = useState(event?.autoClose ?? false);
  const [closingDate, setClosingDate] = useState(event?.closingDate ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(event?.coverImageUrl ?? "");
  const [applyUrl, setApplyUrl] = useState(event?.applyUrl ?? "");
  const [contact, setContact] = useState(event?.contact ?? "");
  const [published, setPublished] = useState(event?.published ?? false);
  const [customFields, setCustomFields] = useState<CustomField[]>(event?.customFields ?? []);

  function handleTitleChange(v: string) {
    setTitle(v);
    if (!event) setSlug(slugify(v));
  }

  async function uploadCover(file: File) {
    setCoverUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("path", `events/covers/${slug || "draft"}-${Date.now()}`);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const { url } = await res.json();
      if (url) setCoverImageUrl(url);
    } finally {
      setCoverUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!title.trim()) { setError("Title is required."); return; }
    if (!slug.trim()) { setError("Slug is required."); return; }
    const data: EventFormData = {
      slug: slug.trim(),
      title: title.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      category,
      status,
      autoClose,
      closingDate: closingDate || null,
      coverImageUrl: coverImageUrl.trim(),
      applyUrl: applyUrl.trim(),
      contact: contact.trim(),
      published,
      customFields,
    };
    startTransition(async () => {
      const result = await onSave(data);
      if (result.success) {
        router.push("/admin/content/events");
        router.refresh();
      } else {
        setError(result.error ?? "Something went wrong.");
      }
    });
  }

  const inputCls = "w-full text-sm rounded-lg px-3 py-2 outline-none";
  const inputStyle = { border: "1px solid #d4e6c4", color: "#1c2e06" };
  const labelCls = "block text-xs font-semibold mb-1";
  const labelStyle = { color: "#5a6644" };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {error && (
        <div className="text-sm px-4 py-3 rounded-xl" style={{ backgroundColor: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" }}>
          {error}
        </div>
      )}

      {/* Basic info */}
      <section>
        <h2 className="text-sm font-black uppercase tracking-wider mb-4" style={{ color: "#3a5214" }}>
          Basic Information
        </h2>
        <div className="space-y-4">
          <div>
            <label className={labelCls} style={labelStyle}>
              Title <span style={{ color: "#b91c1c" }}>*</span>
            </label>
            <input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="MedTech Innovation School 2026"
              className={inputCls}
              style={inputStyle}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls} style={labelStyle}>
                Slug (URL) <span style={{ color: "#b91c1c" }}>*</span>
              </label>
              <div className="flex items-center gap-1">
                <span className="text-xs" style={{ color: "#aab89e" }}>/events/</span>
                <input
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  placeholder="medtech-school-2026"
                  className={`flex-1 ${inputCls}`}
                  style={inputStyle}
                />
              </div>
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>Contact</label>
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="contact@iitp.ac.in"
                className={inputCls}
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label className={labelCls} style={labelStyle}>Tagline</label>
            <input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Short one-line description shown in event cards"
              className={inputCls}
              style={inputStyle}
            />
          </div>

          <div>
            <label className={labelCls} style={labelStyle}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Full event description shown on the event page"
              className={`${inputCls} resize-y`}
              style={inputStyle}
            />
          </div>
        </div>
      </section>

      {/* Status & settings */}
      <section>
        <h2 className="text-sm font-black uppercase tracking-wider mb-4" style={{ color: "#3a5214" }}>
          Status &amp; Settings
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls} style={labelStyle}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as EventCategory)}
              className={inputCls}
              style={inputStyle}
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as EventStatus)}
              className={inputCls}
              style={inputStyle}
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Apply / Register URL</label>
            <input
              type="url"
              value={applyUrl}
              onChange={(e) => setApplyUrl(e.target.value)}
              placeholder="https://forms.gle/..."
              className={inputCls}
              style={inputStyle}
            />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Closing date</label>
            <input
              type="date"
              value={closingDate}
              onChange={(e) => setClosingDate(e.target.value)}
              className={inputCls}
              style={inputStyle}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-6">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={autoClose}
              onChange={(e) => setAutoClose(e.target.checked)}
              className="w-4 h-4 rounded"
              style={{ accentColor: "#3a5214" }}
            />
            <span className="text-sm" style={{ color: "#1c2e06" }}>
              Auto-close when closing date passes
            </span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-4 h-4 rounded"
              style={{ accentColor: "#3a5214" }}
            />
            <span className="text-sm" style={{ color: "#1c2e06" }}>
              Published (visible on website)
            </span>
          </label>
        </div>
      </section>

      {/* Cover image */}
      <section>
        <h2 className="text-sm font-black uppercase tracking-wider mb-4" style={{ color: "#3a5214" }}>
          Cover Image
        </h2>
        {coverImageUrl && (
          <img
            src={coverImageUrl}
            alt="Cover preview"
            className="w-full max-h-56 object-cover rounded-xl mb-3"
          />
        )}
        <div className="flex gap-3 flex-wrap items-start">
          <label
            className="flex items-center gap-2 cursor-pointer text-sm font-medium px-4 py-2 rounded-lg"
            style={{ backgroundColor: "#f0f7e6", color: "#3a5214" }}
          >
            <Upload className="w-3.5 h-3.5" />
            {coverUploading ? "Uploading…" : coverImageUrl ? "Replace image" : "Upload image"}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={coverUploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadCover(file);
              }}
            />
          </label>
          <div className="flex-1 min-w-48">
            <input
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              placeholder="or paste image URL"
              className={`${inputCls} text-xs font-mono`}
              style={inputStyle}
            />
          </div>
        </div>
        <p className="text-xs mt-2" style={{ color: "#7a8e6a" }}>
          Appears at the top of the event detail page and as a thumbnail in the events listing.
        </p>
      </section>

      {/* Custom fields */}
      <section>
        <h2 className="text-sm font-black uppercase tracking-wider mb-1" style={{ color: "#3a5214" }}>
          Custom Sections
        </h2>
        <p className="text-xs mb-4" style={{ color: "#7a8e6a" }}>
          Add any extra content sections — schedule, prizes, eligibility, brochures, etc.
        </p>
        <CustomFieldBuilder
          fields={customFields}
          onChange={setCustomFields}
          eventSlug={slug}
        />
      </section>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending || coverUploading}
          className="text-sm font-semibold px-6 py-2.5 rounded-xl text-white disabled:opacity-60 transition-opacity"
          style={{ backgroundColor: "#3a5214" }}
        >
          {pending ? "Saving…" : event ? "Save changes" : "Create event"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/content/events")}
          className="text-sm font-medium px-4 py-2.5 rounded-xl"
          style={{ color: "#7a8e6a" }}
        >
          Cancel
        </button>
        {event && (
          <span className="ml-auto text-xs" style={{ color: "#aab89e" }}>
            {published ? "Live on website" : "Draft — not visible"}
          </span>
        )}
      </div>
    </form>
  );
}
