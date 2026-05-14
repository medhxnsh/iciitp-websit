"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { ListEditor } from "./list-editor";
import type { ProgramFormData } from "@/app/admin/(protected)/content/programs/actions";

import type { ProgramImage } from "@/lib/cms/programs";

const LAYOUT_OPTIONS = [
  { value: "banner",   label: "Banner",   desc: "First image as a full-width hero strip" },
  { value: "grid",     label: "Grid",     desc: "All images in a 2–3 column photo grid" },
  { value: "carousel", label: "Carousel", desc: "Horizontal scroll strip of all images"  },
] as const;

function MultiImageUpload({
  slug, images, onAdd, onRemove,
}: {
  slug: string;
  images: ProgramImage[];
  onAdd: (img: ProgramImage) => void;
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
        fd.append("path", `programs/${slug}-img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (json.url) {
          onAdd({ url: json.url, alt: "" });
        } else {
          failed++;
          console.error("[upload] no url in response:", json);
        }
      } catch (err) {
        failed++;
        console.error("[upload] error:", err);
      }
      setUploadState((prev) => prev ? { ...prev, done: prev.done + 1 } : null);
    }
    setUploadState(null);
    if (failed > 0) setUploadError(`${failed} of ${files.length} image(s) failed to upload. Check console for details.`);
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
            <span className="absolute bottom-1 left-1.5 text-[10px] bg-black/50 text-white px-1.5 py-0.5 rounded">
              {i + 1}
            </span>
          </div>
        ))}

        {/* Add slot */}
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
      {uploadError && (
        <p className="text-xs mb-2" style={{ color: "#b91c1c" }}>{uploadError}</p>
      )}
      <p className="text-xs" style={{ color: "#7a8e6a" }}>
        Select one or more images at once. Hover a thumbnail and click × to remove.
      </p>
    </div>
  );
}

interface Props {
  slug: string;
  initial: ProgramFormData;
  onSave: (slug: string, data: ProgramFormData) => Promise<{ success: boolean; error?: string }>;
}

const STATUSES = ["Open", "Closed", "Coming Soon"];

export function ProgramForm({ slug, initial, onSave }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const [images, setImages] = useState<ProgramImage[]>(initial.images ?? []);
  const [imageLayout, setImageLayout] = useState<"banner" | "grid" | "carousel">(initial.imageLayout ?? "banner");
  const [title, setTitle] = useState(initial.title ?? "");
  const [tagline, setTagline] = useState(initial.tagline ?? "");
  const [about, setAbout] = useState(initial.about ?? "");
  const [status, setStatus] = useState(initial.status ?? "");
  const [statusNote, setStatusNote] = useState(initial.statusNote ?? "");
  const [applyUrl, setApplyUrl] = useState(initial.applyUrl ?? "");
  const [contactEmail, setContactEmail] = useState(initial.contactEmail ?? "");
  const [grant, setGrant] = useState(initial.grant ?? "");
  const [schemeOutlay, setSchemeOutlay] = useState(initial.schemeOutlay ?? "");
  const [stipend, setStipend] = useState(initial.stipend ?? "");
  const [duration, setDuration] = useState(initial.duration ?? "");
  const [eligibility, setEligibility] = useState<string[]>(initial.eligibility ?? []);
  const [notEligible, setNotEligible] = useState<string[]>(initial.notEligible ?? []);
  const [objectives, setObjectives] = useState<string[]>(initial.objectives ?? []);
  const [targetAudience, setTargetAudience] = useState<string[]>(initial.targetAudience ?? []);
  const [expectedOutcomes, setExpectedOutcomes] = useState<string[]>(initial.expectedOutcomes ?? []);
  const [support, setSupport] = useState<string[]>(initial.support ?? []);
  const [preferences, setPreferences] = useState<string[]>(initial.preferences ?? []);
  const [notes, setNotes] = useState<string[]>(initial.notes ?? []);
  const [disclaimer, setDisclaimer] = useState<string[]>(initial.disclaimer ?? []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);
    const data: ProgramFormData = {
      images,
      imageLayout,
      title, tagline, about, status, statusNote,
      applyUrl, contactEmail,
      grant, schemeOutlay, stipend, duration,
      eligibility, notEligible, objectives, targetAudience,
      expectedOutcomes, support, preferences, notes, disclaimer,
    };
    startTransition(async () => {
      const result = await onSave(slug, data);
      if (result.success) {
        setSaved(true);
        router.refresh();
      } else {
        setError(result.error ?? "Something went wrong.");
      }
    });
  }

  const inputCls = "w-full text-sm rounded-lg px-3 py-2 outline-none";
  const inputStyle = { border: "1px solid #d4e6c4", color: "#1c2e06" };
  const sectionHead = "text-sm font-black uppercase tracking-wider mb-4";
  const sectionHeadStyle = { color: "#3a5214" };
  const labelCls = "block text-xs font-semibold mb-1.5";
  const labelStyle = { color: "#5a6644" };
  const listLabel = "block text-xs font-semibold mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-10 max-w-3xl">
      {error && (
        <div className="text-sm px-4 py-3 rounded-xl" style={{ backgroundColor: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" }}>
          {error}
        </div>
      )}
      {saved && (
        <div className="text-sm px-4 py-3 rounded-xl" style={{ backgroundColor: "#f0f7e6", color: "#3a5214", border: "1px solid #b8d4a0" }}>
          Changes saved and live on the website.
        </div>
      )}

      {/* Images */}
      <section>
        <h2 className={sectionHead} style={sectionHeadStyle}>Images</h2>

        {/* Layout picker */}
        <div className="mb-5">
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
      </section>

      {/* Status & Apply */}
      <section>
        <h2 className={sectionHead} style={sectionHeadStyle}>Status &amp; Apply</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls} style={labelStyle}>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls} style={inputStyle}>
              <option value="">— use default —</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Status note</label>
            <input value={statusNote} onChange={(e) => setStatusNote(e.target.value)} placeholder="e.g. Applications close June 30" className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Apply URL</label>
            <input type="url" value={applyUrl} onChange={(e) => setApplyUrl(e.target.value)} placeholder="https://forms.gle/…" className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Contact email</label>
            <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="incubation@iitp.ac.in" className={inputCls} style={inputStyle} />
          </div>
        </div>
      </section>

      {/* Content */}
      <section>
        <h2 className={sectionHead} style={sectionHeadStyle}>Content</h2>
        <div className="space-y-4">
          <div>
            <label className={labelCls} style={labelStyle}>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Tagline</label>
            <input value={tagline} onChange={(e) => setTagline(e.target.value)} className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>About</label>
            <textarea value={about} onChange={(e) => setAbout(e.target.value)} rows={5} className={`${inputCls} resize-y`} style={inputStyle} />
          </div>
        </div>
      </section>

      {/* Quick facts */}
      <section>
        <h2 className={sectionHead} style={sectionHeadStyle}>Quick Facts (sidebar)</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: "Grant amount", val: grant, set: setGrant, ph: "e.g. Up to ₹10 Lakh" },
            { label: "Scheme outlay", val: schemeOutlay, set: setSchemeOutlay, ph: "e.g. ₹49.95 Cr" },
            { label: "Stipend", val: stipend, set: setStipend, ph: "e.g. ₹30,000/month" },
            { label: "Duration", val: duration, set: setDuration, ph: "e.g. 2 years" },
          ].map(({ label, val, set, ph }) => (
            <div key={label}>
              <label className={labelCls} style={labelStyle}>{label}</label>
              <input value={val} onChange={(e) => set(e.target.value)} placeholder={ph} className={inputCls} style={inputStyle} />
            </div>
          ))}
        </div>
      </section>

      {/* List sections */}
      {([
        { label: "Eligibility criteria", val: eligibility, set: setEligibility, ph: "Add eligibility criterion…" },
        { label: "Not eligible if…", val: notEligible, set: setNotEligible, ph: "Add exclusion…" },
        { label: "Objectives", val: objectives, set: setObjectives, ph: "Add objective…" },
        { label: "Who should apply (Target audience)", val: targetAudience, set: setTargetAudience, ph: "Add target audience item…" },
        { label: "What we offer (Support)", val: support, set: setSupport, ph: "Add benefit…" },
        { label: "Expected outcomes", val: expectedOutcomes, set: setExpectedOutcomes, ph: "Add outcome…" },
        { label: "Application preferences", val: preferences, set: setPreferences, ph: "Add preference…" },
        { label: "Important notes", val: notes, set: setNotes, ph: "Add note…" },
        { label: "Disclaimer", val: disclaimer, set: setDisclaimer, ph: "Add disclaimer item…" },
      ] as const).map(({ label, val, set, ph }) => (
        <section key={label}>
          <h2 className={sectionHead} style={sectionHeadStyle}>{label}</h2>
          <ListEditor values={[...val]} onChange={(v) => (set as (v: string[]) => void)(v)} placeholder={ph} />
        </section>
      ))}

      {/* Save */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="text-sm font-semibold px-6 py-2.5 rounded-xl text-white disabled:opacity-60 transition-opacity"
          style={{ backgroundColor: "#3a5214" }}
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/content/programs")}
          className="text-sm font-medium px-4 py-2.5 rounded-xl"
          style={{ color: "#7a8e6a" }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
