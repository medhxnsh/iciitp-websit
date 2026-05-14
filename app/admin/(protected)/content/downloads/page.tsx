import { requireAuth } from "@/lib/auth";
import { getAllAdminDownloads } from "@/lib/cms/downloads";
import { Timestamp } from "firebase-admin/firestore";
import { Download, Plus, ExternalLink } from "lucide-react";
import Link from "next/link";
import { DeleteDownloadButton } from "./_delete-button";

export const metadata = { title: "Downloads — IC IITP Admin" };
export const dynamic = "force-dynamic";

function fmtDate(ts: unknown): string {
  if (!ts) return "—";
  if (ts instanceof Timestamp) return ts.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  if (typeof ts === "object" && ts !== null && "_seconds" in ts)
    return new Date((ts as { _seconds: number })._seconds * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  return "—";
}

export default async function DownloadsAdminPage() {
  await requireAuth();
  const downloads = await getAllAdminDownloads();

  return (
    <main className="p-8 max-w-5xl">
      <div className="flex items-center gap-3 mb-6">
        <Download className="w-6 h-6" style={{ color: "#3a5214" }} />
        <h1 className="text-2xl font-black" style={{ color: "#1c2e06" }}>Downloads</h1>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: "#f0f7e6", color: "#3a5214" }}>
          {downloads.length} files
        </span>
        <Link
          href="/admin/content/downloads/new"
          className="ml-auto flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl text-white"
          style={{ backgroundColor: "#3a5214" }}
        >
          <Plus className="w-4 h-4" /> Add file
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-6 px-4 py-3 rounded-xl" style={{ backgroundColor: "#f0f7e6", border: "1px solid #d4e6c4" }}>
        <ExternalLink className="w-4 h-4 shrink-0" style={{ color: "#3a5214" }} aria-hidden="true" />
        <p className="text-sm" style={{ color: "#3a5214" }}>
          Published files appear live at{" "}
          <a
            href="/en/downloads"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline underline-offset-2"
          >
            iciitp.com/downloads
          </a>
          {" "}— under the category you select. Draft files are hidden from visitors.
        </p>
      </div>

      {downloads.length === 0 && (
        <div className="text-center py-16 rounded-2xl" style={{ border: "1.5px dashed #d4e6c4" }}>
          <Download className="w-10 h-10 mx-auto mb-3" style={{ color: "#b8d4a0" }} />
          <p className="text-sm font-medium mb-4" style={{ color: "#7a8e6a" }}>No CMS downloads yet.</p>
          <Link
            href="/admin/content/downloads/new"
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl text-white"
            style={{ backgroundColor: "#3a5214" }}
          >
            <Plus className="w-4 h-4" /> Add file
          </Link>
        </div>
      )}

      {downloads.length > 0 && (
        <div className="rounded-2xl bg-white overflow-hidden" style={{ border: "1px solid #e8f0e0" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#f8fbf4", borderBottom: "1px solid #e8f0e0" }}>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Title</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Added</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Visibility</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "#f0f7e6" }}>
              {downloads.map((d) => (
                <tr key={d.id}>
                  <td className="px-5 py-4">
                    <p className="font-semibold" style={{ color: "#1c2e06" }}>{d.title}</p>
                    <p className="text-xs mt-0.5 font-mono truncate max-w-xs" style={{ color: "#aab89e" }}>{d.fileUrl}</p>
                  </td>
                  <td className="px-4 py-4 text-xs" style={{ color: "#5a6644" }}>{d.category}</td>
                  <td className="px-4 py-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#f0f7e6", color: "#3a5214" }}>
                      {d.fileType}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs" style={{ color: "#7a8e6a" }}>{fmtDate(d.createdAt)}</td>
                  <td className="px-4 py-4">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={d.published ? { backgroundColor: "#f0f7e6", color: "#3a5214" } : { backgroundColor: "#f1f5f9", color: "#64748b" }}>
                      {d.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/admin/content/downloads/${d.id}`}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg"
                        style={{ backgroundColor: "#f0f7e6", color: "#3a5214" }}>
                        Edit
                      </Link>
                      <DeleteDownloadButton id={d.id} title={d.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
