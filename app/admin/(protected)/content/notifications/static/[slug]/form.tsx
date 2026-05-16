"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Check } from "lucide-react";
import type { Notification } from "@/lib/content";
import type { StaticNotificationFormData } from "./actions";

interface Props {
  notification: Notification;
  onSave: (data: StaticNotificationFormData) => Promise<{ success: boolean; error?: string }>;
}

export function StaticNotificationForm({ notification, onSave }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState(notification.title);
  const [summary, setSummary] = useState(notification.summary);
  const [body, setBody] = useState(notification.body);
  const [purpose, setPurpose] = useState(notification.purpose);
  const [validFrom, setValidFrom] = useState(notification.validFrom);
  const [validTo, setValidTo] = useState(notification.validTo);
  const [contactEmail, setContactEmail] = useState(notification.contactEmail ?? "");
  const [externalUrl, setExternalUrl] = useState(notification.externalUrl ?? "");
  const [downloads, setDownloads] = useState<Array<{ title: string; path: string; format: string }>>(
    notification.downloads ?? []
  );

  function addDownload() {
    setDownloads((prev) => [...prev, { title: "", path: "", format: "PDF" }]);
  }

  function removeDownload(i: number) {
    setDownloads((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateDownload(i: number, field: "title" | "path" | "format", value: string) {
    setDownloads((prev) => prev.map((d, idx) => idx === i ? { ...d, [field]: value } : d));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSaved(false);
    startTransition(async () => {
      const result = await onSave({
        title, summary, body, purpose, validFrom, validTo,
        contactEmail, externalUrl,
        downloads: downloads.filter((d) => d.title.trim() && d.path.trim()),
      });
      if (result.success) { setSaved(true); router.refresh(); }
      else setError(result.error ?? "Something went wrong.");
    });
  }

  const inputCls = "w-full text-sm rounded-lg px-3 py-2 outline-none";
  const inputStyle = { border: "1px solid #d4e6c4", color: "#1c2e06" };
  const labelCls = "block text-xs font-semibold mb-1.5";
  const labelStyle = { color: "#5a6644" };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="text-sm px-4 py-3 rounded-xl" style={{ backgroundColor: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" }}>
          {error}
        </div>
      )}
      {saved && (
        <div className="text-sm px-4 py-3 rounded-xl" style={{ backgroundColor: "#f0f7e6", color: "#3a5214", border: "1px solid #b8d4a0" }}>
          Saved — changes are live on the website.
        </div>
      )}

      {/* Title */}
      <div>
        <label className={labelCls} style={labelStyle}>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required className={inputCls} style={inputStyle} />
      </div>

      {/* Summary */}
      <div>
        <label className={labelCls} style={labelStyle}>Summary <span className="font-normal" style={{ color: "#aab89e" }}>(shown in admin list and meta description)</span></label>
        <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} className={`${inputCls} resize-y`} style={inputStyle} />
      </div>

      {/* Body */}
      <div>
        <label className={labelCls} style={labelStyle}>Body <span className="font-normal" style={{ color: "#aab89e" }}>(public page content)</span></label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} className={`${inputCls} resize-y font-mono text-xs`} style={inputStyle} />
      </div>

      {/* Purpose + dates */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className={labelCls} style={labelStyle}>Purpose / Category</label>
          <input value={purpose} onChange={(e) => setPurpose(e.target.value)} className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className={labelCls} style={labelStyle}>Valid from</label>
          <input type="date" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className={labelCls} style={labelStyle}>Valid to (deadline)</label>
          <input type="date" value={validTo} onChange={(e) => setValidTo(e.target.value)} className={inputCls} style={inputStyle} />
        </div>
      </div>

      {/* Contact + External URL */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls} style={labelStyle}>Contact email</label>
          <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className={labelCls} style={labelStyle}>External URL <span className="font-normal" style={{ color: "#aab89e" }}>(leave blank to remove)</span></label>
          <input type="url" value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} placeholder="https://…" className={inputCls} style={inputStyle} />
        </div>
      </div>

      {/* Downloads */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className={labelCls} style={{ ...labelStyle, marginBottom: 0 }}>Downloads / PDFs</label>
          <button
            type="button"
            onClick={addDownload}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: "#f0f7e6", color: "#3a5214" }}
          >
            <Plus className="w-3.5 h-3.5" /> Add file
          </button>
        </div>

        {downloads.length === 0 ? (
          <p className="text-xs py-3 text-center rounded-lg" style={{ color: "#aab89e", border: "1px dashed #d4e6c4" }}>
            No downloads — click &ldquo;Add file&rdquo; to attach a PDF or document.
          </p>
        ) : (
          <div className="space-y-2">
            {downloads.map((d, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div className="flex-1 grid grid-cols-5 gap-2">
                  <input
                    value={d.title}
                    onChange={(e) => updateDownload(i, "title", e.target.value)}
                    placeholder="Label (e.g. Application Form)"
                    className={`${inputCls} col-span-2`}
                    style={inputStyle}
                  />
                  <input
                    value={d.path}
                    onChange={(e) => updateDownload(i, "path", e.target.value)}
                    placeholder="/pdfs/filename.pdf"
                    className={`${inputCls} col-span-2`}
                    style={inputStyle}
                  />
                  <select
                    value={d.format}
                    onChange={(e) => updateDownload(i, "format", e.target.value)}
                    className={inputCls}
                    style={inputStyle}
                  >
                    <option>PDF</option>
                    <option>DOCX</option>
                    <option>XLSX</option>
                    <option>ZIP</option>
                    <option>Other</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => removeDownload(i)}
                  className="mt-0.5 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  style={{ color: "#b91c1c" }}
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs mt-2" style={{ color: "#aab89e" }}>
          Path should be relative to public/ (e.g. /pdfs/form.pdf). Files must already exist in the repo.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending || saved}
          className="text-sm font-semibold px-6 py-2.5 rounded-xl text-white disabled:opacity-60"
          style={{ backgroundColor: "#3a5214" }}
        >
          {pending ? "Saving…" : saved ? <><Check className="w-4 h-4 inline mr-1" />Saved</> : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/content/notifications")}
          className="text-sm font-medium px-4 py-2.5 rounded-xl"
          style={{ color: "#7a8e6a" }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
