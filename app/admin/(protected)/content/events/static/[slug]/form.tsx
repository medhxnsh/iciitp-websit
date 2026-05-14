"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { EventOverlayDoc, EventStatus } from "@/lib/cms/events";
import type { EventOverlayFormData } from "../../actions";

const STATUSES: EventStatus[] = ["Upcoming", "Ongoing", "Closed", "Recurring"];

interface Props {
  base: { title: string; tagline: string; description: string; status: string; contact?: string | { email?: string } };
  overlay: EventOverlayDoc | null;
  onSave: (data: EventOverlayFormData) => Promise<{ success: boolean; error?: string }>;
}

export function StaticEventOverlayForm({ base, overlay, onSave }: Props) {
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
  const [coverImageUrl, setCoverImageUrl] = useState(overlay?.coverImageUrl ?? "");

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
        coverImageUrl: coverImageUrl.trim() || undefined,
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
        <div>
          <label className={labelCls} style={labelStyle}>Cover image URL</label>
          <input type="url" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} placeholder="https://…" className={inputCls} style={inputStyle} />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={pending} className="text-sm font-semibold px-6 py-2.5 rounded-xl text-white disabled:opacity-60" style={{ backgroundColor: "#3a5214" }}>
          {pending ? "Saving…" : "Save overrides"}
        </button>
        <button type="button" onClick={() => router.push("/admin/content/events")} className="text-sm font-medium px-4 py-2.5 rounded-xl" style={{ color: "#7a8e6a" }}>
          Cancel
        </button>
      </div>
    </form>
  );
}
