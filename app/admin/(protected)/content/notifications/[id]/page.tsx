import { requireAuth } from "@/lib/auth";
import { getNotificationById, type CmsNotificationDoc } from "@/lib/cms/notifications";
import { NotificationForm } from "@/components/admin/notification-form";
import { updateNotificationAction } from "../actions";
import { notFound } from "next/navigation";
import { Bell } from "lucide-react";
import Link from "next/link";
import { Timestamp } from "firebase-admin/firestore";
import type { NotificationFormData } from "../actions";

function serializeTimestamp(ts: unknown): { _seconds: number; _nanoseconds: number } | null {
  if (!ts) return null;
  if (ts instanceof Timestamp) return { _seconds: ts.seconds, _nanoseconds: ts.nanoseconds };
  return ts as { _seconds: number; _nanoseconds: number };
}

function serializeNotification(n: CmsNotificationDoc) {
  return {
    ...n,
    deadline: serializeTimestamp(n.deadline),
    validFrom: serializeTimestamp(n.validFrom),
    createdAt: serializeTimestamp(n.createdAt),
    updatedAt: serializeTimestamp(n.updatedAt),
  };
}

export const metadata = { title: "Edit Notification — IC IITP Admin" };
export const dynamic = "force-dynamic";

interface Props { params: Promise<{ id: string }> }

export default async function EditNotificationPage({ params }: Props) {
  await requireAuth();
  const { id } = await params;
  const notification = await getNotificationById(id);
  if (!notification) notFound();

  async function save(data: NotificationFormData) {
    "use server";
    return updateNotificationAction(id, data);
  }

  return (
    <main className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/content/notifications" className="text-sm" style={{ color: "#7a8e6a" }}>
          ← Notifications
        </Link>
        <span style={{ color: "#d4e6c4" }}>/</span>
        <Bell className="w-5 h-5" style={{ color: "#3a5214" }} />
        <h1 className="text-xl font-black truncate" style={{ color: "#1c2e06" }}>{notification.title}</h1>
      </div>
      <NotificationForm notification={serializeNotification(notification)} onSave={save} />
    </main>
  );
}
