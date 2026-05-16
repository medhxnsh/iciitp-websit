"use client";
/**
 * Firebase Storage browser for the admin dashboard.
 * Lists, uploads, copies URL, and deletes files via /api/admin/media and /api/admin/upload.
 */
import { useState, useEffect, useCallback } from "react";
import { Upload, Copy, Trash2, Image, FileText, File, FolderOpen, RefreshCw, CloudUpload, X, Check } from "lucide-react";
import type { MediaItem } from "@/app/api/admin/media/route";

type Filter = "all" | "images" | "pdfs" | "other";

function fmtSize(bytes: number): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const FOLDER_LABELS: Record<string, string> = {
  "staff-photos": "Staff Photos",
  "startup-logos": "Startup Logos",
  "images": "Site Images",
  "logos": "Logos",
  "root": "Root",
  "media": "Uploaded Media",
  "notifications": "Notifications",
  "events": "Events",
  "programs": "Programs",
};

function folderLabel(folder: string) {
  return FOLDER_LABELS[folder] ?? folder.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
}

function FileIcon({ contentType }: { contentType: string }) {
  if (contentType.startsWith("image/")) return <Image className="w-5 h-5" />;
  if (contentType === "application/pdf") return <FileText className="w-5 h-5" />;
  return <File className="w-5 h-5" />;
}

export function MediaLibrary() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [folderFilter, setFolderFilter] = useState<string>("all");
  const [uploading, setUploading] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [migrateResult, setMigrateResult] = useState<{ succeeded: number; failed: number } | null>(null);
  const [deletingPath, setDeletingPath] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/media");
      if (!res.ok) throw new Error("Failed to load");
      setItems(await res.json());
    } catch {
      setError("Could not load media. Firebase Storage may be unavailable.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const folders = ["all", ...Array.from(new Set(items.map((i) => i.folder))).sort()];

  const filtered = items.filter((item) => {
    const typeOk = filter === "all" ? true
      : filter === "images" ? item.contentType.startsWith("image/")
      : filter === "pdfs" ? item.contentType === "application/pdf"
      : !item.contentType.startsWith("image/") && item.contentType !== "application/pdf";
    const folderOk = folderFilter === "all" || item.folder === folderFilter;
    return typeOk && folderOk;
  });

  const grouped = filtered.reduce<Record<string, MediaItem[]>>((acc, item) => {
    (acc[item.folder] ??= []).push(item);
    return acc;
  }, {});

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("path", `media/${Date.now()}-${file.name.replace(/\s+/g, "-")}`);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!json.url) throw new Error(json.error ?? "Upload failed");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleMigrate() {
    if (!confirm("Upload all staff photos and startup logos to Firebase Storage? This may take a minute.")) return;
    setMigrating(true);
    setMigrateResult(null);
    try {
      const res = await fetch("/api/admin/media/migrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const json = await res.json();
      setMigrateResult({ succeeded: json.succeeded, failed: json.failed });
      await load();
    } catch {
      setError("Migration failed. Check server logs.");
    } finally {
      setMigrating(false);
    }
  }

  async function handleDelete(item: MediaItem) {
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    setDeletingPath(item.path);
    try {
      await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: item.path }),
      });
      setItems((prev) => prev.filter((i) => i.path !== item.path));
    } catch {
      setError("Delete failed.");
    } finally {
      setDeletingPath(null);
    }
  }

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 1800);
  }

  const FILTERS: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "images", label: "Images" },
    { key: "pdfs", label: "PDFs" },
    { key: "other", label: "Other" },
  ];

  const firebaseCount = items.filter((i) => i.source === "firebase").length;
  const staticCount = items.filter((i) => i.source === "static").length;

  return (
    <div>
      <div className="flex gap-3 mb-6 flex-wrap">
        {[
          { label: "Total", value: items.length },
          { label: "Firebase Storage", value: firebaseCount, highlight: true },
          { label: "Local static", value: staticCount },
        ].map((s) => (
          <div key={s.label} className="px-4 py-2.5 rounded-xl border text-sm"
            style={{ borderColor: "#e8f0e0", backgroundColor: s.highlight ? "#f0f7e6" : "#fff" }}>
            <span className="font-black text-lg mr-1.5" style={{ color: "#3a5214" }}>{s.value}</span>
            <span style={{ color: "#7a8e6a" }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: "#d4e6c4" }}>
          {FILTERS.map((f) => (
            <button key={f.key} type="button" onClick={() => setFilter(f.key)}
              className="px-3 py-1.5 text-xs font-semibold transition-colors"
              style={filter === f.key ? { backgroundColor: "#3a5214", color: "#fff" } : { backgroundColor: "#fff", color: "#5a6644" }}>
              {f.label}
            </button>
          ))}
        </div>

        <select value={folderFilter} onChange={(e) => setFolderFilter(e.target.value)}
          className="text-xs font-medium px-3 py-1.5 rounded-xl border outline-none cursor-pointer"
          style={{ borderColor: "#d4e6c4", color: "#3a5214", backgroundColor: "#fff" }}>
          {folders.map((f) => (
            <option key={f} value={f}>{f === "all" ? "All folders" : folderLabel(f)}</option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-2 flex-wrap">
          {migrateResult && (
            <span className="text-xs px-3 py-1.5 rounded-lg font-medium"
              style={{ backgroundColor: migrateResult.failed ? "#fef2f2" : "#f0f7e6", color: migrateResult.failed ? "#b91c1c" : "#3a5214" }}>
              {migrateResult.failed
                ? `⚠ ${migrateResult.succeeded} uploaded, ${migrateResult.failed} failed`
                : `✓ ${migrateResult.succeeded} files migrated to Firebase`}
            </span>
          )}
          <button type="button" onClick={load}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: "#f0f7e6", color: "#3a5214" }}>
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button type="button" onClick={handleMigrate} disabled={migrating}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50"
            style={{ borderColor: "#3a5214", color: "#3a5214", backgroundColor: "#fff" }}>
            <CloudUpload className="w-3.5 h-3.5" />
            {migrating ? "Migrating…" : "Migrate static → Firebase"}
          </button>
          <label className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer text-white" style={{ backgroundColor: "#3a5214" }}>
            <Upload className="w-3.5 h-3.5" />
            {uploading ? "Uploading…" : "Upload file"}
            <input type="file" className="sr-only" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      {error && (
        <div className="text-sm px-4 py-3 rounded-xl mb-4" style={{ backgroundColor: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-sm" style={{ color: "#7a8e6a" }}>Loading media…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ border: "1.5px dashed #d4e6c4" }}>
          <FolderOpen className="w-10 h-10 mx-auto mb-3" style={{ color: "#b8d4a0" }} />
          <p className="text-sm font-medium" style={{ color: "#7a8e6a" }}>No files found.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(grouped).map(([folder, groupItems]) => (
            <section key={folder}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: "#7a8e6a" }}>
                  {folderLabel(folder)}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: "#f0f7e6", color: "#3a5214" }}>
                  {groupItems.length}
                </span>
                <div className="flex-1 h-px" style={{ backgroundColor: "#e8f0e0" }} />
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={groupItems[0].source === "firebase"
                    ? { backgroundColor: "#dcfce7", color: "#166534" }
                    : { backgroundColor: "#f1f5f9", color: "#64748b" }}>
                  {groupItems[0].source === "firebase" ? "☁ Firebase Storage" : "Local"}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {groupItems.map((item) => (
                  <MediaCard key={item.path} item={item} copiedUrl={copiedUrl}
                    deletingPath={deletingPath} onCopy={copyUrl} onDelete={handleDelete} onPreview={setPreview} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <p className="text-xs mt-8" style={{ color: "#aab89e" }}>
        {filtered.length} file{filtered.length !== 1 ? "s" : ""} shown · Click any file to preview · Local files cannot be deleted here.
      </p>

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setPreview(null)}>
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
            style={{ border: "1px solid #dde0d4" }}>
            <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "#e8f0e0" }}>
              <div className="min-w-0">
                <p className="font-bold text-sm truncate" style={{ color: "#1c2e06" }}>{preview.name}</p>
                <p className="text-xs" style={{ color: "#7a8e6a" }}>
                  {[fmtSize(preview.size), preview.contentType, folderLabel(preview.folder)].filter(Boolean).join(" · ")}
                </p>
              </div>
              <button onClick={() => setPreview(null)} className="ml-3 p-1.5 rounded-lg hover:bg-gray-100 shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
            {preview.contentType.startsWith("image/") && (
              <div className="flex-1 overflow-hidden flex items-center justify-center p-6"
                style={{ backgroundColor: "#f8fbf4", minHeight: 260 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview.publicUrl} alt={preview.name} className="max-w-full max-h-[55vh] object-contain rounded-xl shadow" />
              </div>
            )}
            <div className="px-5 py-4 space-y-3">
              {preview.usedIn.length > 0 && (
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-xs font-semibold mr-1" style={{ color: "#7a8e6a" }}>Used in:</span>
                  {preview.usedIn.map((u) => (
                    <span key={u} className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: "#f0f7e6", color: "#3a5214" }}>{u}</span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <button type="button" onClick={() => copyUrl(preview.publicUrl)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg flex-1 justify-center"
                  style={{ backgroundColor: "#f0f7e6", color: copiedUrl === preview.publicUrl ? "#16a34a" : "#3a5214" }}>
                  {copiedUrl === preview.publicUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedUrl === preview.publicUrl ? "Copied!" : "Copy URL"}
                </button>
                {preview.source === "firebase" && (
                  <button type="button" onClick={() => { handleDelete(preview); setPreview(null); }}
                    disabled={deletingPath === preview.path}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg"
                    style={{ backgroundColor: "#fef2f2", color: "#b91c1c" }}>
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MediaCard({ item, copiedUrl, deletingPath, onCopy, onDelete, onPreview }: {
  item: MediaItem;
  copiedUrl: string | null;
  deletingPath: string | null;
  onCopy: (url: string) => void;
  onDelete: (item: MediaItem) => void;
  onPreview: (item: MediaItem) => void;
}) {
  return (
    <div className="rounded-xl border bg-white flex flex-col overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      style={{ borderColor: "#e8f0e0" }}
      onClick={() => onPreview(item)}>
      <div className="relative flex items-center justify-center" style={{ aspectRatio: "4/3", backgroundColor: "#f8fbf4" }}>
        {item.contentType.startsWith("image/") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.publicUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div style={{ color: "#7a8e6a" }}><FileIcon contentType={item.contentType} /></div>
        )}
        <span className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
          style={item.source === "firebase"
            ? { backgroundColor: "#dcfce7", color: "#166534" }
            : { backgroundColor: "#f1f5f9", color: "#64748b" }}>
          {item.source === "firebase" ? "☁" : "local"}
        </span>
        {item.usedIn.length > 0 && (
          <span className="absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
            style={{ backgroundColor: "#f0f7e6", color: "#3a5214" }}>✓</span>
        )}
      </div>
      <div className="p-2.5 flex flex-col gap-1.5" onClick={(e) => e.stopPropagation()}>
        <p className="text-[11px] font-semibold leading-tight truncate" style={{ color: "#1c2e06" }} title={item.name}>
          {item.name}
        </p>
        {item.size > 0 && <p className="text-[10px]" style={{ color: "#aab89e" }}>{fmtSize(item.size)}</p>}
        <div className="flex gap-1">
          <button type="button" onClick={() => onCopy(item.publicUrl)}
            className="flex-1 flex items-center justify-center gap-1 text-[10px] font-semibold py-1 rounded-lg transition-colors"
            style={{ backgroundColor: "#f0f7e6", color: copiedUrl === item.publicUrl ? "#16a34a" : "#3a5214" }}>
            {copiedUrl === item.publicUrl ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copiedUrl === item.publicUrl ? "Copied" : "URL"}
          </button>
          {item.source === "firebase" && (
            <button type="button" onClick={() => onDelete(item)} disabled={deletingPath === item.path}
              className="w-6 flex items-center justify-center rounded-lg"
              style={{ backgroundColor: "#fef2f2", color: "#b91c1c" }}>
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
