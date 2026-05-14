"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import type { CmsNotificationDoc } from "@/lib/cms/notifications";
import { TYPE_PATHS, type NotificationType } from "@/lib/cms/notification-constants";
import type { NotificationFormData } from "@/app/admin/(protected)/content/notifications/actions";

const TYPES: { value: NotificationType; label: string }[] = [
  { value: "careers",  label: "Careers" },
  { value: "tender",   label: "NIQ / Tender" },
  { value: "proposal", label: "Call for Proposals" },
];

function tsToDate(ts: unknown): string {
  if (!ts) return "";
  if (typeof ts === "object" && ts !== null && "toDate" in ts)
    return (ts as { toDate: () => Date }).toDate().toISOString().slice(0, 10);
  if (typeof ts === "object" && ts !== null && "_seconds" in ts)
    return new Date((ts as { _seconds: number })._seconds * 1000).toISOString().slice(0, 10);
  return "";
}

interface Props {
  notification?: CmsNotificationDoc;
  onSave: (data: NotificationFormData) => Promise<{ success: boolean; error?: string }>;
}

export function NotificationForm({ notification, onSave }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [attachUploading, setAttachUploading] = useState(false);

  const [type, setType] = useState<NotificationType>(notification?.type ?? "careers");
  const [title, setTitle] = useState(notification?.title ?? "");
  const [body, setBody] = useState(notification?.body ?? "");
  const [deadline, setDeadline] = useState(tsToDate(notification?.deadline));
  const [validFrom, setValidFrom] = useState(tsToDate(notification?.validFrom));
  const [contactEmail, setContactEmail] = useState(notification?.contactEmail ?? "");
  const [externalUrl, setExternalUrl] = useState(notification?.externalUrl ?? "");
  const [attachmentUrl, setAttachmentUrl] = useState(notification?.attachmentUrl ?? "");
  const [published, setPublished] = useState(notification?.published ?? false);

  async function uploadAttachment(file: File) {
    setAttachUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("path", `notifications/${type}/${Date.now()}-${file.name}`);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const { url } = await res.json();
      if (url) setAttachmentUrl(url);
    } finally {
      setAttachUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!title.trim()) { setError("Title is required."); return; }
    if (!body.trim()) { setError("Body is required."); return; }
    const data: NotificationFormData = {
      type, title: title.trim(), body: body.trim(),
      deadline: deadline || null,
      validFrom: validFrom || null,
      contactEmail: contactEmail.trim(),
      externalUrl: externalUrl.trim(),
      attachmentUrl: attachmentUrl.trim(),
      published,
    };
    startTransition(async () => {
      const result = await onSave(data);
      if (result.success) {
        router.push("/admin/content/notifications");
        router.refresh();
      } else {
        setError(result.error ?? "Something went wrong.");
      }
    });
  }

  const inputCls = "w-full text-sm rounded-lg px-3 py-2 outline-none";
  const inputStyle = { border: "1px solid #d4e6c4", color: "#1c2e06" };
  const labelCls = "block text-xs font-semibold mb-1.5";
  const labelStyle = { color: "#5a6644" };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {error && (
        <div className="text-sm px-4 py-3 rounded-xl" style={{ backgroundColor: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" }}>
          {error}
        </div>
      )}

      <section>
        <h2 className="text-sm font-black uppercase tracking-wider mb-4" style={{ color: "#3a5214" }}>
          Notification details
        </h2>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls} style={labelStyle}>
                Type <span style={{ color: "#b91c1c" }}>*</span>
              </label>
              <select value={type} onChange={(e) => setType(e.target.value as NotificationType)} className={inputCls} style={inputStyle}>
                {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: "#3a5214" }}
                />
                <span className="text-sm" style={{ color: "#1c2e06" }}>Published (live on website)</span>
              </label>
            </div>
          </div>

          <div>
            <label className={labelCls} style={labelStyle}>
              Title <span style={{ color: "#b91c1c" }}>*</span>
            </label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Walk-in Interview for Project Scientist" className={inputCls} style={inputStyle} />
          </div>

          <div>
            <label className={labelCls} style={labelStyle}>
              Body <span style={{ color: "#b91c1c" }}>*</span>
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              placeholder="Full notification text. Paste or type the complete notice here."
              className={`${inputCls} resize-y`}
              style={inputStyle}
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-black uppercase tracking-wider mb-4" style={{ color: "#3a5214" }}>
          Dates &amp; contact
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls} style={labelStyle}>Valid from</label>
            <input type="date" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Deadline / Valid to</label>
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Contact email</label>
            <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="hr@iitp.ac.in" className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>External portal URL</label>
            <input type="url" value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} placeholder="https://..." className={inputCls} style={inputStyle} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-black uppercase tracking-wider mb-4" style={{ color: "#3a5214" }}>
          Attachment (PDF)
        </h2>
        <div className="flex gap-3 flex-wrap items-start">
          <label
            className="flex items-center gap-2 cursor-pointer text-sm font-medium px-4 py-2 rounded-lg shrink-0"
            style={{ backgroundColor: "#f0f7e6", color: "#3a5214" }}
          >
            <Upload className="w-3.5 h-3.5" />
            {attachUploading ? "Uploading…" : attachmentUrl ? "Replace file" : "Upload PDF"}
            <input type="file" accept=".pdf,.doc,.docx" className="sr-only" disabled={attachUploading}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAttachment(f); }} />
          </label>
          <input
            value={attachmentUrl}
            onChange={(e) => setAttachmentUrl(e.target.value)}
            placeholder="or paste file URL"
            className={`flex-1 min-w-48 text-xs font-mono rounded-lg px-3 py-2 outline-none`}
            style={inputStyle}
          />
        </div>
        <p className="text-xs mt-2" style={{ color: "#7a8e6a" }}>
          Appears on: <code className="text-xs px-1 rounded" style={{ backgroundColor: "#f0f7e6" }}>/en/notifications/{TYPE_PATHS[type]}</code>
        </p>
        {attachmentUrl && (
          <p className="text-xs mt-1" style={{ color: "#7a8e6a" }}>
            File URL: <a href={attachmentUrl} target="_blank" rel="noopener noreferrer" className="underline">{attachmentUrl}</a>
          </p>
        )}
      </section>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending || attachUploading}
          className="text-sm font-semibold px-6 py-2.5 rounded-xl text-white disabled:opacity-60"
          style={{ backgroundColor: "#3a5214" }}
        >
          {pending ? "Saving…" : notification ? "Save changes" : "Create notification"}
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
