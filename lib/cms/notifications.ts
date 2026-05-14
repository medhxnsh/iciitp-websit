import { getDb } from "@/lib/firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

const COL = "cms-notifications";

export type { NotificationType } from "./notification-constants";
export { TYPE_PATHS } from "./notification-constants";

import type { NotificationType } from "./notification-constants";

export const TYPE_LABELS: Record<NotificationType, string> = {
  careers:  "Careers",
  tender:   "NIQ / Tender",
  proposal: "Call for Proposals",
};

export interface CmsNotification {
  title: string;
  body: string;
  type: NotificationType;
  deadline: Timestamp | null;
  validFrom: Timestamp | null;
  contactEmail: string;
  externalUrl: string;
  attachmentUrl: string;
  published: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CmsNotificationDoc = CmsNotification & { id: string };

export async function getNotificationsByType(
  type: NotificationType
): Promise<CmsNotificationDoc[]> {
  const snap = await getDb()
    .collection(COL)
    .where("type", "==", type)
    .where("published", "==", true)
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as CmsNotification) }));
}

export async function getAllAdminNotifications(): Promise<CmsNotificationDoc[]> {
  const snap = await getDb().collection(COL).orderBy("createdAt", "desc").get();
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as CmsNotification) }));
}

export async function getNotificationById(id: string): Promise<CmsNotificationDoc | null> {
  const doc = await getDb().collection(COL).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...(doc.data() as CmsNotification) };
}

export interface NotificationInput {
  title: string;
  body: string;
  type: NotificationType;
  deadline: Timestamp | null;
  validFrom: Timestamp | null;
  contactEmail: string;
  externalUrl: string;
  attachmentUrl: string;
  published: boolean;
}

export async function createNotification(data: NotificationInput): Promise<string> {
  const ref = await getDb().collection(COL).add({
    ...data,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function updateNotification(
  id: string,
  data: Partial<NotificationInput>
): Promise<void> {
  await getDb().collection(COL).doc(id).update({
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export async function deleteNotification(id: string): Promise<void> {
  await getDb().collection(COL).doc(id).delete();
}
