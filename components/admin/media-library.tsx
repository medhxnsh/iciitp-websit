"use client";

import { useState, useEffect, useCallback } from "react";
import { Upload, Copy, Trash2, Image, FileText, File, FolderOpen, RefreshCw } from "lucide-react";
import type { MediaItem } from "@/app/api/admin/media/route";

type Filter = "all" | "images" | "pdfs" | "other";

function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
  const [uploading, setUploading] = useState(false);
  const [deletingPath, setDeletingPath] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
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

  const filtered = items.filter((item) => {
    if (filter === "images") return item.contentType.startsWith("image/");
    if (filter === "pdfs") return item.contentType === "application/pdf";
    if (filter === "other") return !item.contentType.startsWith("image/") && item.contentType !== "application/pdf";
    return true;
  });

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

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: "#d4e6c4" }}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className="px-3 py-1.5 text-xs font-semibold transition-colors"
              style={filter === f.key
                ? { backgroundColor: "#3a5214", color: "#fff" }
                : { backgroundColor: "#fff", color: "#5a6644" }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={load}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: "#f0f7e6", color: "#3a5214" }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <label
            className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer text-white"
            style={{ backgroundColor: "#3a5214" }}
          >
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
          <p className="text-sm font-medium" style={{ color: "#7a8e6a" }}>No files yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div
              key={item.path}
              className="rounded-xl border bg-white flex flex-col overflow-hidden"
              style={{ borderColor: "#e8f0e0" }}
            >
              {/* Thumbnail or icon */}
              <div className="relative flex items-center justify-center bg-[#f8fbf4]" style={{ aspectRatio: "4/3" }}>
                {item.contentType.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.publicUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div style={{ color: "#7a8e6a" }}>
                    <FileIcon contentType={item.contentType} />
                  </div>
                )}
                {item.source === "static" && (
                  <span className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "#f0f7e6", color: "#3a5214" }}>
                    Static
                  </span>
                )}
              </div>

              {/* Meta */}
              <div className="p-3 flex-1 flex flex-col gap-1.5">
                <p className="text-xs font-semibold leading-tight truncate" style={{ color: "#1c2e06" }} title={item.name}>
                  {item.name}
                </p>
                {item.size > 0 && (
                  <p className="text-[10px]" style={{ color: "#aab89e" }}>{fmtSize(item.size)}</p>
                )}
                {item.usedIn.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {item.usedIn.slice(0, 2).map((u) => (
                      <span key={u} className="text-[9px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: "#f0f7e6", color: "#3a5214" }}>
                        {u}
                      </span>
                    ))}
                    {item.usedIn.length > 2 && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: "#f0f7e6", color: "#3a5214" }}>
                        +{item.usedIn.length - 2}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium w-fit" style={{ backgroundColor: "#f1f5f9", color: "#64748b" }}>
                    Unused
                  </span>
                )}

                {/* Actions */}
                <div className="flex gap-1.5 mt-auto pt-2">
                  <button
                    type="button"
                    onClick={() => copyUrl(item.publicUrl)}
                    title="Copy URL"
                    className="flex-1 flex items-center justify-center gap-1 text-[10px] font-semibold py-1.5 rounded-lg transition-colors"
                    style={{ backgroundColor: "#f0f7e6", color: copiedUrl === item.publicUrl ? "#16a34a" : "#3a5214" }}
                  >
                    <Copy className="w-3 h-3" />
                    {copiedUrl === item.publicUrl ? "Copied!" : "Copy URL"}
                  </button>
                  {item.source === "firebase" && (
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      disabled={deletingPath === item.path}
                      title="Delete"
                      className="flex items-center justify-center w-7 rounded-lg transition-colors"
                      style={{ backgroundColor: "#fef2f2", color: "#b91c1c" }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs mt-6" style={{ color: "#aab89e" }}>
        {filtered.length} file{filtered.length !== 1 ? "s" : ""} · Static files (from public/images) cannot be deleted here.
      </p>
    </div>
  );
}
