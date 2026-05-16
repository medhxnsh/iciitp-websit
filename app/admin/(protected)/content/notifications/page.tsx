import { requireAuth } from "@/lib/auth";
import { getAllAdminNotifications as getCmsNotifs } from "@/lib/cms/notifications";
import { getAllNotifications, isNotificationActive } from "@/lib/content";
import { fmtDate } from "@/lib/format";
import { Bell, Plus, ExternalLink, FileDown } from "lucide-react";
import Link from "next/link";
import { DeleteNotificationButton } from "./_delete-button";

export const metadata = { title: "Notifications — IC IITP Admin" };
export const dynamic = "force-dynamic";


export default async function NotificationsListPage() {
  await requireAuth();
  const [notifications, staticNotifs] = await Promise.all([
    getCmsNotifs(),
    Promise.resolve(getAllNotifications("en")),
  ]);

  const publishedCount = notifications.filter((n) => n.published).length;

  return (
    <main className="p-8 max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <Bell className="w-6 h-6" style={{ color: "#3a5214" }} />
        <h1 className="text-2xl font-black" style={{ color: "#1c2e06" }}>Notifications</h1>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: "#f0f7e6", color: "#3a5214" }}>
          {publishedCount} published
        </span>
        <Link
          href="/admin/content/notifications/new"
          className="ml-auto flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl text-white"
          style={{ backgroundColor: "#3a5214" }}
        >
          <Plus className="w-4 h-4" /> New notification
        </Link>
      </div>

      {/* ── Static notification pages ── */}
      <section className="mb-10">
        <h2 className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "#7a8e6a" }}>
          Static Notification Pages — click Edit to update content
        </h2>
        <div className="rounded-2xl bg-white overflow-hidden" style={{ border: "1px solid #e8f0e0" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#f8fbf4", borderBottom: "1px solid #e8f0e0" }}>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Page</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Attachments</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "#f0f7e6" }}>
              {staticNotifs.map((n) => {
                const active = isNotificationActive(n);
                const dlCount = n.downloads?.length ?? 0;
                const hasExternal = !!n.externalUrl;
                return (
                  <tr key={n.slug}>
                    <td className="px-5 py-4">
                      <p className="font-semibold" style={{ color: "#1c2e06" }}>{n.title}</p>
                      <p className="text-xs font-mono mt-0.5" style={{ color: "#aab89e" }}>/notifications/{n.slug}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide" style={{ backgroundColor: "#f0f7e6", color: "#3a5214" }}>
                        {n.purpose}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                        style={active
                          ? { backgroundColor: "#f0f7e6", color: "#3a5214" }
                          : { backgroundColor: "#f1f5f9", color: "#64748b" }}
                      >
                        {active ? "Active" : "Expired"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {dlCount > 0 && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#eff6ff", color: "#1d4ed8" }}>
                            <FileDown className="w-3 h-3" aria-hidden="true" />
                            {dlCount} PDF{dlCount > 1 ? "s" : ""}
                          </span>
                        )}
                        {hasExternal && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#fef9c3", color: "#854d0e" }}>
                            <ExternalLink className="w-3 h-3" aria-hidden="true" />
                            External link
                          </span>
                        )}
                        {dlCount === 0 && !hasExternal && (
                          <span className="text-[10px]" style={{ color: "#aab89e" }}>—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <a
                          href={`/notifications/${n.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg"
                          style={{ backgroundColor: "#f8fbf4", color: "#7a8e6a" }}
                        >
                          View <ExternalLink className="w-3 h-3" aria-hidden="true" />
                        </a>
                        <Link
                          href={`/admin/content/notifications/static/${n.slug}`}
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

      {/* ── CMS notifications ── */}
      <section>
        <h2 className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "#7a8e6a" }}>
          CMS Notifications — individual entries you manage here
        </h2>

        {notifications.length === 0 ? (
          <div className="text-center py-12 rounded-2xl" style={{ border: "1.5px dashed #d4e6c4" }}>
            <Bell className="w-10 h-10 mx-auto mb-3" style={{ color: "#b8d4a0" }} />
            <p className="text-sm font-medium mb-4" style={{ color: "#7a8e6a" }}>No CMS notifications yet.</p>
            <Link
              href="/admin/content/notifications/new"
              className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl text-white"
              style={{ backgroundColor: "#3a5214" }}
            >
              <Plus className="w-4 h-4" /> New notification
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl bg-white overflow-hidden" style={{ border: "1px solid #e8f0e0" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#f8fbf4", borderBottom: "1px solid #e8f0e0" }}>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Title</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Deadline</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Visibility</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "#f0f7e6" }}>
                {notifications.map((n) => {
                  const cat = n.category || n.type || "";
                  return (
                    <tr key={n.id}>
                      <td className="px-5 py-4">
                        <p className="font-semibold leading-snug" style={{ color: "#1c2e06" }}>{n.title}</p>
                        <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "#aab89e" }}>{n.body.slice(0, 60)}…</p>
                      </td>
                      <td className="px-4 py-4">
                        {cat ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide" style={{ backgroundColor: "#f0f7e6", color: "#3a5214" }}>
                            {cat}
                          </span>
                        ) : (
                          <span className="text-[10px]" style={{ color: "#aab89e" }}>—</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-xs" style={{ color: "#7a8e6a" }}>{fmtDate(n.deadline)}</td>
                      <td className="px-4 py-4">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={n.published ? { backgroundColor: "#f0f7e6", color: "#3a5214" } : { backgroundColor: "#f1f5f9", color: "#64748b" }}>
                          {n.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <Link href={`/admin/content/notifications/${n.id}`}
                            className="text-xs font-medium px-3 py-1.5 rounded-lg"
                            style={{ backgroundColor: "#f0f7e6", color: "#3a5214" }}>
                            Edit
                          </Link>
                          <DeleteNotificationButton id={n.id} title={n.title} />
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
