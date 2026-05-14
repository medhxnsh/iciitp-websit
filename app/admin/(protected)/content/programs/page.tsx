import { requireAuth } from "@/lib/auth";
import { getAllPrograms } from "@/lib/content";
import { getAllCmsPrograms } from "@/lib/cms/programs";
import { Timestamp } from "firebase-admin/firestore";
import { BookOpen } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Programs — IC IITP Admin" };
export const dynamic = "force-dynamic";

const SLUG_LABELS: Record<string, string> = {
  "icitp-incubation": "ICITP Incubation",
  "nidhi-prayas": "NIDHI Prayas",
  "nidhi-eir": "NIDHI EIR",
  "sisf": "SISF",
  "bionest": "BioNEST",
  "genesis": "GENESIS",
};

function fmtDate(ts: unknown): string {
  if (!ts) return "";
  if (ts instanceof Timestamp) return ts.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  if (typeof ts === "object" && ts !== null && "_seconds" in ts) {
    return new Date((ts as { _seconds: number })._seconds * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }
  return "";
}

export default async function ProgramsListPage() {
  await requireAuth();
  const staticPrograms = getAllPrograms("en");
  const cmsPrograms = await getAllCmsPrograms();
  const cmsMap = new Map(cmsPrograms.map((p) => [p.slug, p]));

  return (
    <main className="p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <BookOpen className="w-6 h-6" style={{ color: "#3a5214" }} />
        <h1 className="text-2xl font-black" style={{ color: "#1c2e06" }}>Programs</h1>
      </div>

      <p className="text-sm mb-6" style={{ color: "#7a8e6a" }}>
        Edit programme content. Changes go live immediately without redeployment.
        Fields left blank fall back to the default content.
      </p>

      <div className="rounded-2xl bg-white overflow-hidden" style={{ border: "1px solid #e8f0e0" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "#f8fbf4", borderBottom: "1px solid #e8f0e0" }}>
              <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Programme</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#7a8e6a" }}>CMS state</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Last saved</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "#f0f7e6" }}>
            {staticPrograms.map((prog) => {
              const cms = cmsMap.get(prog.slug);
              const effectiveStatus = cms?.status ?? prog.status ?? "—";
              return (
                <tr key={prog.slug}>
                  <td className="px-5 py-4">
                    <p className="font-semibold" style={{ color: "#1c2e06" }}>
                      {SLUG_LABELS[prog.slug] ?? prog.title}
                    </p>
                    <p className="text-xs font-mono mt-0.5" style={{ color: "#aab89e" }}>{prog.slug}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                      style={effectiveStatus === "Open"
                        ? { backgroundColor: "#f0f7e6", color: "#3a5214" }
                        : { backgroundColor: "#f1f5f9", color: "#475569" }}
                    >
                      {effectiveStatus}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={cms
                        ? { backgroundColor: "#eff6ff", color: "#1d4ed8" }
                        : { backgroundColor: "#f1f5f9", color: "#94a3b8" }}
                    >
                      {cms ? "Customised" : "Default"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs" style={{ color: "#7a8e6a" }}>
                    {cms ? fmtDate(cms.updatedAt) : "—"}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link
                      href={`/admin/content/programs/${prog.slug}`}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg"
                      style={{ backgroundColor: "#f0f7e6", color: "#3a5214" }}
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
