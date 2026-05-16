import { requireAuth } from "@/lib/auth";
import { getAllPrograms } from "@/lib/content";
import { getAllCmsPrograms } from "@/lib/cms/programs";
import { fmtDate } from "@/lib/format";
import { BookOpen, Plus } from "lucide-react";
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


export default async function ProgramsListPage() {
  await requireAuth();
  const staticPrograms = getAllPrograms("en");
  const cmsPrograms = await getAllCmsPrograms();
  const cmsMap = new Map(cmsPrograms.map((p) => [p.slug, p]));
  const staticSlugSet = new Set(staticPrograms.map((p) => p.slug));

  const cmsOnlyPrograms = cmsPrograms.filter((p) => !staticSlugSet.has(p.slug));

  return (
    <main className="p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-6 h-6" style={{ color: "#3a5214" }} />
        <h1 className="text-2xl font-black" style={{ color: "#1c2e06" }}>Programs</h1>
        <Link
          href="/admin/content/programs/new"
          className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg text-white"
          style={{ backgroundColor: "#3a5214" }}
        >
          <Plus className="w-4 h-4" aria-hidden="true" /> New Program
        </Link>
      </div>

      {/* Static programs */}
      <section className="mb-10">
        <h2 className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "#5a7c20" }}>
          Static programme pages — click edit to update content
        </h2>
        <div className="rounded-2xl bg-white overflow-hidden" style={{ border: "1px solid #e8f0e0" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#f8fbf4", borderBottom: "1px solid #e8f0e0" }}>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Programme</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Last saved</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "#f0f7e6" }}>
              {staticPrograms.map((prog) => {
                const cms = cmsMap.get(prog.slug);
                const status = cms?.status ?? prog.status ?? "—";
                return (
                  <tr key={prog.slug}>
                    <td className="px-5 py-4">
                      <p className="font-semibold" style={{ color: "#1c2e06" }}>{SLUG_LABELS[prog.slug] ?? prog.title}</p>
                      <p className="text-xs font-mono mt-0.5" style={{ color: "#aab89e" }}>{prog.slug}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                        style={status === "Open"
                          ? { backgroundColor: "#f0f7e6", color: "#3a5214" }
                          : { backgroundColor: "#f1f5f9", color: "#475569" }}
                      >
                        {status}
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
                      {cms?.updatedAt ? fmtDate(cms.updatedAt) : "—"}
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
      </section>

      {/* CMS-only programs */}
      <section>
        <h2 className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "#5a7c20" }}>
          CMS programs — individual entries you manage here
        </h2>

        {cmsOnlyPrograms.length === 0 ? (
          <div
            className="rounded-2xl flex flex-col items-center justify-center py-16 gap-4"
            style={{ border: "2px dashed #d4e6c4", backgroundColor: "rgba(240,247,230,0.3)" }}
          >
            <BookOpen className="w-10 h-10" style={{ color: "#b8d498" }} />
            <p className="text-sm font-medium" style={{ color: "#7a8e6a" }}>No CMS programmes yet.</p>
            <Link
              href="/admin/content/programs/new"
              className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl text-white"
              style={{ backgroundColor: "#3a5214" }}
            >
              <Plus className="w-4 h-4" /> New program
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl bg-white overflow-hidden" style={{ border: "1px solid #e8f0e0" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#f8fbf4", borderBottom: "1px solid #e8f0e0" }}>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Programme</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Last saved</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "#f0f7e6" }}>
                {cmsOnlyPrograms.map((prog) => (
                  <tr key={prog.slug}>
                    <td className="px-5 py-4">
                      <p className="font-semibold" style={{ color: "#1c2e06" }}>{prog.title || prog.slug}</p>
                      <p className="text-xs font-mono mt-0.5" style={{ color: "#aab89e" }}>{prog.slug}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                        style={prog.status === "Open"
                          ? { backgroundColor: "#f0f7e6", color: "#3a5214" }
                          : { backgroundColor: "#f1f5f9", color: "#475569" }}
                      >
                        {prog.status || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs" style={{ color: "#7a8e6a" }}>
                      {prog.updatedAt ? fmtDate(prog.updatedAt) : "—"}
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
                ))}
              </tbody>
            </table>
            <div className="px-5 py-3 border-t flex justify-end" style={{ borderColor: "#f0f7e6" }}>
              <Link
                href="/admin/content/programs/new"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
                style={{ backgroundColor: "#3a5214" }}
              >
                <Plus className="w-3.5 h-3.5" /> New program
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
