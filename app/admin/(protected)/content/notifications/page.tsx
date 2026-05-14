import { requireAuth } from "@/lib/auth";
import { getAllAdminNotifications, TYPE_LABELS, type NotificationType } from "@/lib/cms/notifications";
import { Timestamp } from "firebase-admin/firestore";
import { Bell, Plus } from "lucide-react";
import Link from "next/link";
import { DeleteNotificationButton } from "./_delete-button";

export const metadata = { title: "Notifications — IC IITP Admin" };
export const dynamic = "force-dynamic";

const TYPE_COLORS: Record<NotificationType, { bg: string; text: string }> = {
  careers:  { bg: "#eff6ff", text: "#1d4ed8" },
  tender:   { bg: "#fef9c3", text: "#854d0e" },
  proposal: { bg: "#fdf4ff", text: "#7e22ce" },
};

function fmtDate(ts: unknown): string {
  if (!ts) return "—";
  if (ts instanceof Timestamp) return ts.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  if (typeof ts === "object" && ts !== null && "_seconds" in ts)
    return new Date((ts as { _seconds: number })._seconds * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  return "—";
}

export default async function NotificationsListPage() {
  await requireAuth();
  const notifications = await getAllAdminNotifications();

  return (
    <main className="p-8 max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <Bell className="w-6 h-6" style={{ color: "#3a5214" }} />
        <h1 className="text-2xl font-black" style={{ color: "#1c2e06" }}>Notifications</h1>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: "#f0f7e6", color: "#3a5214" }}>
          {notifications.length} total
        </span>
        <Link
          href="/admin/content/notifications/new"
          className="ml-auto flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl text-white"
          style={{ backgroundColor: "#3a5214" }}
        >
          <Plus className="w-4 h-4" /> New notification
        </Link>
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-16 rounded-2xl" style={{ border: "1.5px dashed #d4e6c4" }}>
          <Bell className="w-10 h-10 mx-auto mb-3" style={{ color: "#b8d4a0" }} />
          <p className="text-sm font-medium mb-4" style={{ color: "#7a8e6a" }}>No notifications yet.</p>
          <Link
            href="/admin/content/notifications/new"
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl text-white"
            style={{ backgroundColor: "#3a5214" }}
          >
            <Plus className="w-4 h-4" /> New notification
          </Link>
        </div>
      )}

      {notifications.length > 0 && (
        <div className="rounded-2xl bg-white overflow-hidden" style={{ border: "1px solid #e8f0e0" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#f8fbf4", borderBottom: "1px solid #e8f0e0" }}>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Title</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Deadline</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#7a8e6a" }}>Visibility</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "#f0f7e6" }}>
              {notifications.map((n) => {
                const typeStyle = TYPE_COLORS[n.type];
                return (
                  <tr key={n.id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold leading-snug" style={{ color: "#1c2e06" }}>{n.title}</p>
                      <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "#aab89e" }}>{n.body.slice(0, 60)}…</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide" style={{ backgroundColor: typeStyle.bg, color: typeStyle.text }}>
                        {TYPE_LABELS[n.type]}
                      </span>
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
    </main>
  );
}
