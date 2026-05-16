import { requireAuth } from "@/lib/auth";
import { getAdminEvents, getAllEventOverlays, resolveStatus } from "@/lib/cms/events";
import { getAllEvents } from "@/lib/content";
import { fmtDate } from "@/lib/format";
import { Calendar, Plus } from "lucide-react";
import Link from "next/link";
import { DeleteEventButton } from "./_delete-button";

export const metadata = { title: "Events — IC IITP Admin" };
export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  Upcoming:  { bg: "#eff6ff", text: "#1d4ed8" },
  Ongoing:   { bg: "#f0f7e6", text: "#3a5214" },
  Active:    { bg: "#f0f7e6", text: "#3a5214" },
  Closed:    { bg: "#f1f5f9", text: "#475569" },
  Recurring: { bg: "#fef9c3", text: "#854d0e" },
};


export default async function EventsListPage() {
  await requireAuth();
  const [cmsEvents, staticEvents, overlays] = await Promise.all([
    getAdminEvents(),
    Promise.resolve(getAllEvents("en")),
    getAllEventOverlays(),
  ]);

  const overlayMap = new Map(overlays.map((o) => [o.slug, o]));

  return (
    <main className="p-8 max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <Calendar className="w-6 h-6" style={{ color: "#3a5214" }} />
        <h1 className="text-2xl font-black" style={{ color: "#1c2e06" }}>Events</h1>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: "#f0f7e6", color: "#3a5214" }}>
          {staticEvents.length + cmsEvents.length} total
        </span>
        <Link
          href="/admin/content/events/new"
          className="ml-auto flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl text-white"
          style={{ backgroundColor: "#3a5214" }}
        >
          <Plus className="w-4 h-4" />
          New event
        </Link>
      </div>

      {/* Static events (from content files) */}
      <section className="mb-10">
        <h2 className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "#7a8e6a" }}>
          Static Events — click Edit to override content
        </h2>
        <div className="rounded-2xl bg-white overflow-hidden" style={{ border: "1px solid #e8f0e0" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#f8fbf4", borderBottom: "1px solid #e8f0e0" }}>
                <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Event</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Category</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Status</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Override</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "#f0f7e6" }}>
              {staticEvents.map((ev) => {
                const overlay = overlayMap.get(ev.slug);
                const displayStatus = overlay?.status ?? (ev.status as string);
                const style = STATUS_STYLES[displayStatus] ?? STATUS_STYLES.Closed;
                return (
                  <tr key={ev.slug} className="group">
                    <td className="px-5 py-4">
                      <p className="font-semibold leading-snug" style={{ color: "#1c2e06" }}>
                        {overlay?.title ?? ev.title}
                      </p>
                      <p className="text-xs mt-0.5 font-mono" style={{ color: "#aab89e" }}>{ev.slug}</p>
                    </td>
                    <td className="px-4 py-4 text-xs" style={{ color: "#5a6644" }}>{ev.category}</td>
                    <td className="px-4 py-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide" style={{ backgroundColor: style.bg, color: style.text }}>
                        {displayStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={
                        overlay
                          ? { backgroundColor: "#f0f7e6", color: "#3a5214" }
                          : { backgroundColor: "#f1f5f9", color: "#64748b" }
                      }>
                        {overlay ? "Overridden" : "Default"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <Link
                          href={`/events/${ev.slug}`}
                          target="_blank"
                          className="text-xs font-medium px-3 py-1.5 rounded-lg"
                          style={{ backgroundColor: "#f8fbf4", color: "#7a8e6a" }}
                        >
                          View ↗
                        </Link>
                        <Link
                          href={`/admin/content/events/static/${ev.slug}`}
                          className="text-xs font-medium px-3 py-1.5 rounded-lg"
                          style={{ backgroundColor: "#f0f7e6", color: "#3a5214" }}
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* CMS events (created from scratch in admin) */}
      <section>
        <h2 className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "#7a8e6a" }}>
          CMS Events — fully managed in admin
        </h2>
        {cmsEvents.length === 0 ? (
          <div className="text-center py-12 rounded-2xl" style={{ border: "1.5px dashed #d4e6c4" }}>
            <p className="text-sm font-medium" style={{ color: "#7a8e6a" }}>No CMS events yet.</p>
            <p className="text-xs mt-1 mb-4" style={{ color: "#aab89e" }}>Use &ldquo;+ New event&rdquo; to create one from scratch.</p>
          </div>
        ) : (
          <div className="rounded-2xl bg-white overflow-hidden" style={{ border: "1px solid #e8f0e0" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#f8fbf4", borderBottom: "1px solid #e8f0e0" }}>
                  <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Event</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Visibility</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Created</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "#f0f7e6" }}>
                {cmsEvents.map((ev) => {
                  const resolved = resolveStatus(ev);
                  const style = STATUS_STYLES[resolved] ?? STATUS_STYLES.Closed;
                  return (
                    <tr key={ev.id} className="group">
                      <td className="px-5 py-4">
                        <p className="font-semibold leading-snug" style={{ color: "#1c2e06" }}>{ev.title}</p>
                        <p className="text-xs mt-0.5 font-mono" style={{ color: "#aab89e" }}>{ev.slug}</p>
                      </td>
                      <td className="px-4 py-4 text-xs" style={{ color: "#5a6644" }}>{ev.category}</td>
                      <td className="px-4 py-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide" style={{ backgroundColor: style.bg, color: style.text }}>
                          {resolved}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={
                          ev.published
                            ? { backgroundColor: "#f0f7e6", color: "#3a5214" }
                            : { backgroundColor: "#f1f5f9", color: "#64748b" }
                        }>
                          {ev.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs" style={{ color: "#7a8e6a" }}>{fmtDate(ev.createdAt)}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <Link
                            href={`/admin/content/events/${ev.id}`}
                            className="text-xs font-medium px-3 py-1.5 rounded-lg"
                            style={{ backgroundColor: "#f0f7e6", color: "#3a5214" }}
                          >
                            Edit
                          </Link>
                          <DeleteEventButton id={ev.id} title={ev.title} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
